import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LogUtil } from '@/src/libs/LogUtil';

export default function useImagePicker() {
  // === Method ===

  /**
   * URIをBase64に変換する
   * @param uri URI
   * @returns Base64文字列
   */
  const toBase64 = async (uri: string) => {
    const base64Image = uri
      ? await fetch(uri)
          .then((response) => response.blob())
          .then((blob) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          })
          .catch((e) => {
            if (e && e.message) {
              LogUtil.log(`fetch image error ${e.message}`, {
                level: 'error',
                notify: true,
              });
            }
            return null;
          })
      : null;
    return base64Image;
  };

  /**
   * イメージピッカーを表示して選択した画像のbase64を返す
   * @param options
   * @returns
   */
  const selectImageList = async (
    options?: ImagePicker.ImagePickerOptions
  ): Promise<ImagePicker.ImagePickerAsset[]> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
      allowsMultipleSelection: true,
      presentationStyle:
        Platform.OS === 'android'
          ? ImagePicker.UIImagePickerPresentationStyle.AUTOMATIC
          : undefined,
    });

    if (result.canceled) return [];
    return result.assets;
  };

  return {
    selectImageList,
    toBase64,
  };
}
