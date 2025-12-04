import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { Tables } from '../libs/database.types.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { SubscriptionUtil } from '../libs/SubscriptionUtil.ts';
import { FileObject } from 'npm:@supabase/storage-js';

const FREE_STORAGE_LIMIT_GB = 1; // 上限を1GBに設定
const PREMIUM_STORAGE_LIMIT_GB = 10; // 上限を100GBに設定

/**
 * 指定されたプランのストレージ使用量を確認し、新規ファイル追加後に上限を超えるか判定します。
 * @param supabase - Supabaseクライアントインスタンス
 * @param planId - プランID
 * @param images - Base64エンコードされた画像の配列
 * @returns 容量超過の場合はエラーメッセージを、それ以外はnullを返します。
 */
const checkStorageCapacity = async (
  supabase: SupabaseClient,
  profile: Tables<'profile'>,
  planId: string,
  images: string[]
): Promise<{ error: { message: string; code: string }; status: number } | null> => {
  // 既存ファイルの合計サイズを取得
  const { data: existingFiles, error: listError } = await supabase.storage
    .from('medias')
    .list(planId, { limit: 1000 });

  if (listError) {
    LogUtil.log(`メディア一覧取得失敗: ${JSON.stringify(listError)}`, {
      level: 'error',
      notify: true,
    });
    return { error: { message: getMessage('C005', ['メディア一覧']), code: 'C005' }, status: 500 };
  }
  const existingSize = existingFiles.reduce(
    (acc: number, file: FileObject) => acc + (file.metadata?.size || 0),
    0
  );

  // 新規アップロードファイルの合計サイズを計算
  const newImagesSize = images.reduce((acc: number, image: string) => {
    const base64Data = image.split(',')[1];
    return acc + atob(base64Data).length;
  }, 0);

  // 合計サイズが上限を超えるかチェック
  const totalSize = existingSize + newImagesSize;
  const limitBytes = SubscriptionUtil.isPremiumUser(profile)
    ? PREMIUM_STORAGE_LIMIT_GB * 1024 * 1024 * 1024
    : FREE_STORAGE_LIMIT_GB * 1024 * 1024 * 1024;

  if (totalSize > limitBytes) {
    return {
      error: { message: getMessage('M001', [`${limitBytes}GB`]), code: 'M001' },
      status: 400,
    };
  }

  return null;
};

/**
 * メディアファイルをストレージにアップロードし、情報をデータベースに保存します。
 * @param supabase - Supabaseクライアントインスタンス
 * @param planId - プランID
 * @param images - Base64エンコードされた画像の配列
 * @param userId - ユーザーID
 * @returns アップロードされたファイルのパスリストとエラー情報
 */
const uploadMediaFiles = async (
  supabase: SupabaseClient,
  planId: string,
  scheduleId: string | null,
  images: string[],
  userId: string
) => {
  const newImagesData = images.map((image) => {
    const base64Data = image.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const fileExt = image.split(';')[0].split('/')[1];
    const filePath = `${planId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    return { buffer, fileExt, filePath };
  });

  // ファイルを並行してアップロード
  const uploadPromises = newImagesData.map(({ buffer, fileExt, filePath }) =>
    supabase.storage.from('medias').upload(filePath, buffer, {
      contentType: `image/${fileExt}`,
      upsert: false,
    })
  );
  const uploadResults = await Promise.all(uploadPromises);

  const uploadedFilePaths: string[] = [];
  for (let i = 0; i < uploadResults.length; i++) {
    if (uploadResults[i].error) {
      LogUtil.log(`メディアアップロード失敗: ${JSON.stringify(uploadResults[i].error)}`, {
        level: 'error',
        notify: true,
      });
      // 失敗した場合は、それまでに成功したファイルを削除（ロールバック）
      if (uploadedFilePaths.length > 0) {
        await supabase.storage.from('medias').remove(uploadedFilePaths);
      }
      return {
        uploadedImages: [],
        error: { message: getMessage('C006', ['メディア']), code: 'C006' },
      };
    }
    uploadedFilePaths.push(newImagesData[i].filePath);
  }

  // DBに保存
  const insertData = uploadedFilePaths.map((url) => ({
    plan_id: planId,
    schedule_id: scheduleId,
    upload_user_id: userId,
    url: url,
  }));
  const { error: insertError } = await supabase.from('media').insert(insertData);

  if (insertError) {
    LogUtil.log(`メディア保存失敗: ${JSON.stringify(insertError)}`, {
      level: 'error',
      notify: true,
    });
    // DB保存失敗時もアップロードしたファイルを削除（ロールバック）
    await supabase.storage.from('medias').remove(uploadedFilePaths);
    return {
      uploadedImages: [],
      error: { message: getMessage('C006', ['メディア']), code: 'C006' },
    };
  }

  return { uploadedImages: uploadedFilePaths, error: null };
};

export const createMedia = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[POST] media', { level: 'info' }, c);

  // profile 取得
  const { data: profile, error: fetchProfileError } = await supabase
    .from('profile')
    .select('*')
    .eq('uid', user.id)
    .maybeSingle();

  if (fetchProfileError) {
    LogUtil.log(`プロフィール取得失敗: ${JSON.stringify(fetchProfileError)}`, {
      level: 'error',
      notify: true,
    });
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }
  const { planId, scheduleId, images } = await c.req.json();
  if (!planId || !images || !Array.isArray(images) || images.length === 0) {
    return c.json({ message: getMessage('C009', ['プランID､メディア']), code: 'C009' }, 400);
  }

  // 1. ストレージ容量チェック
  const capacityCheckResult = await checkStorageCapacity(supabase, profile, planId, images);
  if (capacityCheckResult) {
    return c.json(capacityCheckResult);
  }

  // 2. ファイルアップロードとDB保存
  const { uploadedImages, error } = await uploadMediaFiles(
    supabase,
    planId,
    scheduleId,
    images,
    user.id
  );
  if (error) {
    return c.json(error, 500);
  }

  return c.json({ uploadedImages });
};
