import { AuthResult } from '../types/Auth';
import { signInWithGoogle as signInWithGoogleApi } from '../apis/signInWithGoogle';
import { signInWithApple as signInWithAppleApi } from '../apis/signInWithApple';

/**
 * Googleサインイン
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
  return await signInWithGoogleApi();
};

/**
 * Appleサインイン
 */
export const signInWithApple = async (): Promise<AuthResult> => {
  return await signInWithAppleApi();
};
