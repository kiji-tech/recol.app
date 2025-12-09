import { AuthContextType } from '@/src/features/auth/types/Auth';
import { Subscription } from '@/src/features/payment';
import { Profile } from '@/src/features/profile';

/**
 * テスト用のuseAuthモックユーティリティ
 */
export class MockAuthFactory {
  /**
   * 基本的なuseAuthのモックレスポンスを作成
   * @param profile プロフィール（nullの場合はログアウト状態）
   */
  static createMockAuth(profile: Profile | null = null): AuthContextType {
    return {
      user: null,
      session: null,
      profile: profile
        ? ({ ...profile, subscription: null } as Profile & { subscription: Subscription[] | null })
        : (null as unknown as Profile & { subscription: Subscription[] | null }),
      loading: false,
      initialized: true,
      getProfile: jest.fn(),
      setProfile: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
      resetPassword: jest.fn(),
      updateUserPassword: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
    };
  }

  /**
   * ローディング状態のuseAuthモックを作成
   * @param profile プロフィール
   */
  static createLoadingAuth(profile: Profile | null = null): AuthContextType {
    return {
      ...this.createMockAuth(profile),
      loading: true,
    };
  }

  /**
   * 未初期化状態のuseAuthモックを作成
   * @param profile プロフィール
   */
  static createUninitializedAuth(profile: Profile | null = null): AuthContextType {
    return {
      ...this.createMockAuth(profile),
      initialized: false,
    };
  }
}
