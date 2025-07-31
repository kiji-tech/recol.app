import { AuthResult } from '../types/Auth';
import { signupWithEmail } from '../apis/signupWithEmail';

/**
 * メールアドレスとパスワードでサインアップ
 */
export const signup = async (email: string, password: string): Promise<AuthResult> => {
  return await signupWithEmail(email, password);
};
