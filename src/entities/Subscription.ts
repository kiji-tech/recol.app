import { Tables } from '../libs/database.types';

type SubscriptionType = Tables<'subscription'>;

export class Subscription {
  // 明示的なプロパティ定義
  public canceled_at: string | null;
  public created_at: string;
  public current_period_end: string | null;
  public current_period_start: string | null;
  public customer_id: string;
  public end_at: string | null;
  public invoice_id: string;
  public price_id: string;
  public start_at: string | null;
  public status: string | null;
  public trial_end: string | null;
  public trial_start: string | null;
  public uid: string;
  public updated_at: string | null;
  public user_id: string | null;

  constructor(data: SubscriptionType) {
    // すべてのプロパティを自動的にコピー
    this.canceled_at = data.canceled_at;
    this.created_at = data.created_at;
    this.current_period_end = data.current_period_end;
    this.current_period_start = data.current_period_start;
    this.customer_id = data.customer_id;
    this.end_at = data.end_at;
    this.invoice_id = data.invoice_id;
    this.price_id = data.price_id;
    this.start_at = data.start_at;
    this.status = data.status;
    this.trial_end = data.trial_end;
    this.trial_start = data.trial_start;
    this.uid = data.uid;
    this.updated_at = data.updated_at;
    this.user_id = data.user_id;
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
