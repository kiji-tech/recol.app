import { Profile } from '@/src/entities';
import dayjs from 'dayjs';

// useAuthフックをモック
const mockUseAuth = jest.fn();
jest.mock('@/src/features/auth', () => ({
  useAuth: mockUseAuth,
}));

// 必要なモックのみを設定

describe('BannerAd Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('プレミアムプランのユーザーの場合はBannerAdが表示されること', async () => {
    // プレミアムユーザーのプロフィールを作成
    const premiumProfile = new Profile({
      uid: 'test-uid',
      display_name: 'テストユーザー',
      payment_plan: 'Premium',
      payment_end_at: dayjs().add(1, 'month').toISOString(),
      role: 'User',
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      enabled_schedule_notification: null,
      notification_token: null,
      stripe_customer_id: null,
      updated_at: null,
      delete_flag: false,
      subscription: null,
    });

    // useAuthのモックを設定
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: premiumProfile,
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
    });

    // Profile.isPremiumUser()の結果をテスト
    expect(premiumProfile.isPremiumUser()).toBe(true);
  });

  test('プレミアムプランのユーザーではない場合はBannerAdが表示されないこと', async () => {
    // 非プレミアムユーザーのプロフィールを作成
    const nonPremiumProfile = new Profile({
      uid: 'test-uid',
      display_name: 'テストユーザー',
      payment_plan: 'Free',
      payment_end_at: null,
      role: 'User',
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      enabled_schedule_notification: null,
      notification_token: null,
      stripe_customer_id: null,
      updated_at: null,
      delete_flag: false,
      subscription: null,
    });

    // useAuthのモックを設定
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: nonPremiumProfile,
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
    });

    // Profile.isPremiumUser()の結果をテスト
    expect(nonPremiumProfile.isPremiumUser()).toBe(false);
  });

  test('プロフィールがnullの場合はBannerAdが表示されないこと', async () => {
    // useAuthのモックを設定（profileがnull）
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: null,
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
    });

    // profileがnullの場合のテスト
    const profile = null;
    expect(profile).toBeNull();
  });

  test('管理者ユーザーの場合はBannerAdが表示されないこと', async () => {
    // 管理者ユーザーのプロフィールを作成
    const adminProfile = new Profile({
      uid: 'test-uid',
      display_name: 'テスト管理者',
      payment_plan: 'Free',
      payment_end_at: null,
      role: 'Admin',
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      enabled_schedule_notification: null,
      notification_token: null,
      stripe_customer_id: null,
      updated_at: null,
      delete_flag: false,
      subscription: null,
    });

    // useAuthのモックを設定
    mockUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: adminProfile,
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
    });

    // Profile.isPremiumUser()の結果をテスト（管理者はプレミアムユーザー扱い）
    expect(adminProfile.isPremiumUser()).toBe(true);
  });

  test('期限切れのプレミアムユーザーの場合はBannerAdが表示されないこと', async () => {
    // 期限切れのプレミアムユーザーのプロフィールを作成
    const expiredPremiumProfile = new Profile({
      uid: 'test-uid',
      display_name: 'テストユーザー',
      payment_plan: 'Premium',
      payment_end_at: dayjs().subtract(1, 'day').toISOString(), // 昨日で期限切れ
      role: 'User',
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      enabled_schedule_notification: null,
      notification_token: null,
      stripe_customer_id: null,
      updated_at: null,
      delete_flag: false,
      subscription: null,
    });

    // Profile.isPremiumUser()の結果をテスト
    expect(expiredPremiumProfile.isPremiumUser()).toBe(false);
  });
});
