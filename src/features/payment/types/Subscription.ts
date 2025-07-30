import { Tables } from '../../../libs/database.types';

export type SubscriptionType = Tables<'subscription'>;

export class Subscription {
  // 明示的なプロパティ定義
  public canceled_at: string | null = null;
  public created_at: string = '';
  public current_period_end: string | null = null;
  public current_period_start: string | null = null;
  public customer_id: string = '';
  public end_at: string | null = null;
  public invoice_id: string = '';
  public price_id: string = '';
  public start_at: string | null = null;
  public status: string | null = null;
  public trial_end: string | null = null;
  public trial_start: string | null = null;
  public uid: string | null = null;
  public updated_at: string | null = null;
  public user_id: string | null = null;

  constructor(data: SubscriptionType) {
    // すべてのプロパティを自動的にコピー
    for (const key in data) {
      this[key as keyof Subscription] = data[key as keyof SubscriptionType] as never;
    }
  }

  /**
   * 月額プラン判定
   * @param profile
   * @returns
   */
  public isMonthly(): boolean {
    return this.price_id === `${process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN}`;
  }

  /**
   * 年額プラン判定
   * @param profile
   * @returns
   */
  public isYearly(): boolean {
    return this.price_id === `${process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN}`;
  }
}
