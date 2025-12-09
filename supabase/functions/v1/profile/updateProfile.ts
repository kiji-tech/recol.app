import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Tables } from '../libs/database.types.ts';
import dayjs from 'dayjs';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

/**
 * アバター画像の更新処理を行う
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param userId {string} ユーザーID
 * @param avatarUrl {string | null} アバター画像URL（Base64形式またはnull）
 * @return {Promise<string | null>} 更新後のアバターURLまたはnull
 */
const handleAvatarUpdate = async (
  supabase: SupabaseClient,
  userId: string,
  avatarUrl: string | null
) => {
  const { data: oldProfile } = await supabase
    .from('profile')
    .select('avatar_url')
    .eq('uid', userId)
    .maybeSingle();

  let finalAvatarUrl = oldProfile?.avatar_url || null;

  if (avatarUrl && avatarUrl.startsWith('data:image')) {
    const uploadResult = await uploadAvatarImage(
      supabase,
      userId,
      avatarUrl,
      oldProfile?.avatar_url
    );
    if (!uploadResult) {
      return null;
    }
    finalAvatarUrl = uploadResult;
  }

  return finalAvatarUrl;
};

/**
 * アバター画像をストレージにアップロードする
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param userId {string} ユーザーID
 * @param avatarUrl {string} Base64形式のアバター画像データ
 * @param oldAvatarUrl {string} 既存のアバター画像URL（削除対象）
 * @return {Promise<string | null>} アップロードされた画像のファイルパスまたはnull
 */
const uploadAvatarImage = async (
  supabase: SupabaseClient,
  userId: string,
  avatarUrl: string,
  oldAvatarUrl?: string
) => {
  const base64Data = avatarUrl.split(',')[1];
  const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  const fileExt = avatarUrl.split(';')[0].split('/')[1];
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  if (oldAvatarUrl) {
    const oldFilePath = oldAvatarUrl.split('/').pop();
    if (oldFilePath) {
      await supabase.storage.from('avatars').remove([oldFilePath]);
    }
  }

  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, buffer, {
    contentType: `image/${fileExt}`,
    upsert: true,
  });

  if (uploadError) {
    console.error({
      uploadError,
      filePath,
      contentType: `image/${fileExt}`,
    });
    return null;
  }

  return filePath;
};

/**
 * プロフィールデータをデータベースに更新する
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param userId {string} ユーザーID
 * @param profileData {Tables<'profile'>} 更新するプロフィールデータ
 * @return {Promise<Tables<'profile'> | null>} 更新されたプロフィールデータまたはnull
 */
const updateProfileData = async (
  supabase: SupabaseClient,
  userId: string,
  profileData: Tables<'profile'>
) => {
  const { data, error } = await supabase
    .from('profile')
    .upsert(
      {
        ...profileData,
        uid: userId, // Ensure uid from argument always overwrites profileData.uid (if present)
      },
      { onConflict: 'uid' }
    )
    .select('*')
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

/**
 * ユーザーのサブスクリプション情報を取得する
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param userId {string} ユーザーID
 * @return {Promise<Tables<'subscription'>[] | null>} サブスクリプション情報の配列またはnull
 */
const getSubscriptionData = async (supabase: SupabaseClient, userId: string) => {
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscription')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'trying', 'canceled'])
    .gte('current_period_end', dayjs().format('YYYY-MM-DD HH:mm:ss'));

  if (subscriptionError) {
    LogUtil.log(JSON.stringify(subscriptionError), { level: 'error', notify: true });
    return null;
  }

  return subscriptionData || [];
};

/**
 * プロフィール更新APIのメイン処理
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param user {User} 認証済みユーザー情報
 * @return {Promise<Response>} 更新されたプロフィール情報を含むレスポンス
 */
export const updateProfile = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[PUT] profile', { level: 'info' });
  const { display_name, avatar_url, notification_token, enabled_schedule_notification } =
    await c.req.json();

  const finalAvatarUrl = await handleAvatarUpdate(supabase, user.id, avatar_url);
  if (avatar_url && finalAvatarUrl === null) {
    return ResponseUtil.error(c, getMessage('C006', ['アバター']), 'C006', 500);
  }

  const profileData = await updateProfileData(supabase, user.id, {
    display_name,
    avatar_url: avatar_url ? finalAvatarUrl : null,
    notification_token,
    enabled_schedule_notification,
  } as Tables<'profile'>);

  if (!profileData) {
    return ResponseUtil.error(c, getMessage('C007', ['プロフィール']), 'C007', 400);
  }

  const subscriptionData = await getSubscriptionData(supabase, user.id);
  if (!subscriptionData) {
    return ResponseUtil.error(c, getMessage('C005', ['プロフィール']), 'C005', 400);
  }

  profileData.subscription = subscriptionData;
  return ResponseUtil.success(c, profileData);
};
