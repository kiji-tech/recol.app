import { Profile, SubscriptionType } from '@/src/entities';
import { ProfileType } from '@/src/features/profile/types/Profile';
import dayjs from 'dayjs';

/**
 * テスト用のプロフィール作成ユーティリティ
 */
export class MockProfileFactory {
  /**
   * プレミアムユーザーのプロフィールを作成
   * @param overrides オーバーライドするプロパティ
   */
  static createPremiumUser(overrides: Partial<Profile> = {}): Profile {
    return new Profile({
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
      ...overrides,
    } as Profile);
  }

  /**
   * 非プレミアムユーザーのプロフィールを作成
   * @param overrides オーバーライドするプロパティ
   */
  static createFreeUser(overrides: Partial<Profile> = {}): Profile {
    return new Profile({
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
      ...overrides,
    } as Profile);
  }

  /**
   * 管理者ユーザーのプロフィールを作成
   * @param overrides オーバーライドするプロパティ
   */
  static createAdminUser(overrides: Partial<Profile> = {}): Profile {
    return new Profile({
      uid: 'test-admin-uid',
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
      ...overrides,
    } as ProfileType & { subscription: SubscriptionType[] | null });
  }

  /**
   * スーパーユーザーのプロフィールを作成
   * @param overrides オーバーライドするプロパティ
   */
  static createSuperUser(overrides: Partial<Profile> = {}): Profile {
    return new Profile({
      uid: 'test-super-uid',
      display_name: 'テストスーパーユーザー',
      payment_plan: 'Free',
      payment_end_at: null,
      role: 'SuperUser',
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      enabled_schedule_notification: null,
      notification_token: null,
      stripe_customer_id: null,
      updated_at: null,
      delete_flag: false,
      subscription: null,
      ...overrides,
    } as ProfileType & { subscription: null });
  }

  /**
   * 期限切れのプレミアムユーザーのプロフィールを作成
   * @param overrides オーバーライドするプロパティ
   */
  static createExpiredPremiumUser(overrides: Partial<Profile> = {}): Profile {
    return new Profile({
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
      ...overrides,
    } as ProfileType & { subscription: null });
  }

  /**
   * 削除フラグが立ったユーザーのプロフィールを作成
   * @param overrides オーバーライドするプロパティ
   */
  static createDeletedUser(overrides: Partial<Profile> = {}): Profile {
    return new Profile({
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
      delete_flag: true,
      subscription: null,
      ...overrides,
    } as ProfileType & { subscription: null });
  }
}
