import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from './MessageUtil.ts';
import { LogUtil } from './LogUtil.ts';

/**
 * メディアファイルをストレージにアップロードし、情報をデータベースに保存します。
 * @param supabase - Supabaseクライアントインスタンス
 * @param planId - プランID
 * @param images - Base64エンコードされた画像の配列
 * @param userId - ユーザーID
 * @returns アップロードされたファイルのパスリストとエラー情報
 */
export const uploadMediaFiles = async (
  supabase: SupabaseClient,
  filePath: string,
  images: string[],
  storageName: 'media' | 'posts'
) => {
  LogUtil.log(JSON.stringify({ uploadMediaFiles: { filePath, storageName } }), { level: 'info' });
  const newImagesData = images.map((image, index) => {
    const base64Data = image.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const fileExt = image.split(';')[0].split('/')[1];
    const fp = `${filePath}/${index}.${fileExt}`;
    return { buffer, fileExt, fp };
  });

  // ファイルを並行してアップロード
  const uploadPromises = newImagesData.map(({ buffer, fileExt, fp }) =>
    supabase.storage.from(storageName).upload(fp, buffer, {
      contentType: `image/${fileExt}`,
      upsert: false,
    })
  );
  const uploadResults = await Promise.all(uploadPromises);

  const uploadedFilePaths: string[] = [];
  for (let i = 0; i < uploadResults.length; i++) {
    if (uploadResults[i].error) {
      console.error('Upload failed:', uploadResults[i].error);
      // 失敗した場合は、それまでに成功したファイルを削除（ロールバック）
      if (uploadedFilePaths.length > 0) {
        await supabase.storage.from('medias').remove(uploadedFilePaths);
      }
      return {
        uploadedImages: [],
        error: { message: getMessage('C006', ['メディア']), code: 'C006' },
      };
    }
    uploadedFilePaths.push(newImagesData[i].fp);
  }

  return { uploadedImages: uploadedFilePaths, error: null };
};
