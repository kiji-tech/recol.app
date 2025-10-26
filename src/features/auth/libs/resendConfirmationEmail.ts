import { AuthResult } from '../types/Auth';
import { resendConfirmationEmail } from '../apis/resendConfirmationEmail';

/**
 * 確認メールを再送信
 */
export const resendConfirmationEmailLib = async (email: string): Promise<AuthResult> => {
  return await resendConfirmationEmail(email);
};
