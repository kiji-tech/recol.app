import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * リカバリーセッションかどうかチェック
 */
export const isRecoverySession = async (): Promise<boolean> => {
  const recoverySession = await AsyncStorage.getItem('sessionType');
  return recoverySession === 'recovery';
};
