import { AuthResult } from '../types/Auth';
import { loginWithEmail } from '../apis/loginWithEmail';
import { LogUtil } from '../../../libs/LogUtil';

/**
 * メールアドレスとパスワードでログイン
 */
export const login = async (email: string, password: string): Promise<AuthResult> => {
  // バリデーション
  if (!email || !password) {
    throw new Error('メールアドレスとパスワードを入力してください');
  }

  if (!email.includes('@')) {
    throw new Error('有効なメールアドレスを入力してください');
  }

  try {
    LogUtil.log('Login attempt', { level: 'info', additionalInfo: { email } });

    const result = await loginWithEmail(email, password);

    LogUtil.log('Login successful', { level: 'info', additionalInfo: { email } });

    return result;
  } catch (error) {
    LogUtil.log('Login failed', {
      level: 'error',
      additionalInfo: { email },
      error: error as Error,
    });

    // エラーメッセージの統一
    if (error instanceof Error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('メールアドレスの確認が完了していません');
      }
    }

    throw error;
  }
};
