import { logout as logoutApi } from '../apis/logout';

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  return await logoutApi();
};
