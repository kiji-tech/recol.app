import { Session } from '@supabase/supabase-js';
import { Payment } from '../types/Payment';
import { ISubscriptionPay } from './iSubscriptionPay';
import { StripeError } from '@stripe/stripe-react-native';
import Stripe from 'stripe';
import { setupCreateSubscription } from './setupCreateSubscription';
import { cancelStripeSubscription } from '../apis/cancelStripeSubscription';
import {
  confirmPlatformPayPayment,
  initPaymentSheet,
  PlatformPay,
  PlatformPayError,
} from '@stripe/stripe-react-native';
import { LogUtil } from '@/src/libs/LogUtil';

export class SubscriptionGooglePay implements ISubscriptionPay {
  static COMPLETED = true;
  // === Member ===
  static readonly payInfo = {
    testEnv: process.env.EXPO_PUBLIC_APP_ENV === 'development',
    merchantName: 'Re:CoL プレミアムプラン',
    merchantCountryCode: 'JP',
    currencyCode: 'JPY',
    billingAddressConfig: {
      format: PlatformPay.BillingAddressFormat.Full,
      isPhoneNumberRequired: true,
      isRequired: true,
    },
  };

  /** Subscription Payのインスタンス */
  readonly subscription: Stripe.Subscription | null = null;

  /** 支払い情報 */
  readonly payment: Payment | null = null;

  // === Method ===
  constructor(subscriptionGooglePay: SubscriptionGooglePay | null) {
    this.subscription = subscriptionGooglePay?.subscription || null;
    this.payment = subscriptionGooglePay?.payment || null;
  }

  /** Subscriptionの作成 */
  public async generateSubscription(session: Session): Promise<ISubscriptionPay> {
    if (!this.payment) {
      throw new Error('Payment or session is not set');
    }

    const newSubscription = await setupCreateSubscription(this.payment, session);
    return new SubscriptionGooglePay({
      subscription: newSubscription,
      payment: this.payment,
    } as SubscriptionGooglePay);
  }

  /** 支払いシートのセットアップ */
  public async confirmPayment(session: Session): Promise<boolean> {
    if (!this.payment || !this.subscription) {
      throw new Error('Payment or subscription is not set');
    }

    const clientSecret =
      typeof this.subscription.latest_invoice === 'string'
        ? undefined
        : this.subscription.latest_invoice?.confirmation_secret?.client_secret;

    if (!clientSecret) {
      throw new Error('Client secret is not available');
    }

    await initPaymentSheet({
      merchantDisplayName: `Re:CoL プレミアムプラン ${this.payment.period}`,
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
    });

    const { error } = await confirmPlatformPayPayment(clientSecret, {
      googlePay: SubscriptionGooglePay.payInfo,
    });

    if (error) {
      LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
      if (this.subscription.id) {
        await cancelStripeSubscription(this.subscription.id, session);
      }
    }
    return this.checkPaymentError(error);
  }

  private checkPaymentError(error: StripeError<PlatformPayError> | undefined): boolean {
    if (!error) return SubscriptionGooglePay.COMPLETED;
    if (error.code === PlatformPayError.Canceled) return !SubscriptionGooglePay.COMPLETED;
    throw new Error('支払いに失敗しました');
  }
}
