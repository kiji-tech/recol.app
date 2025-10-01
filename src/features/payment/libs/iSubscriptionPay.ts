import { Payment } from '../types/Payment';
import { Session } from '@supabase/supabase-js';
import Stripe from 'stripe';

export interface ISubscriptionPay {
  /** Subscription Payのインスタンス */
  readonly subscription: Stripe.Subscription | null;

  /** 支払い情報 */
  readonly payment: Payment | null;

  /** Subscriptionの作成 */
  generateSubscription(session: Session): Promise<ISubscriptionPay>;

  /** 支払いシートのセットアップ */
  confirmPayment(session: Session): Promise<boolean>;
}
