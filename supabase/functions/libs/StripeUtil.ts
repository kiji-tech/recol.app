import Stripe from 'stripe';
const key =
  Deno.env.get('STRIPE_SECRET_KEY') ||
  'sk_test_51KcTMRCrMIHt8njNi9dugcYmWTBQZyzSWpmeCvpyYON3rGmxYsZ1ReNneRuEy0QZ6OE3BqtGrOomv7LgRwQHM7HM00RZo929V6';

const stripe = new Stripe(key || '');

export class StripeUtil {
  public static async createCustomer(email: string): Promise<Stripe.Customer> {
    const customer = await stripe.customers.create({
      email,
    });
    console.log({ customer });
    return customer;
  }

  public static async createEphemeralKey(customerId: string): Promise<Stripe.EphemeralKey> {
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2020-08-27' }
    );
    return ephemeralKey;
  }

  public static async createPaymentIntents(customerId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 400,
      currency: 'jpy',
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  }

  /** サブスクリプションの取得 */
  public static async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }

  /** サブスクリプションの作成 */
  public static async createSubscription(
    customerId: string,
    priceId: string
  ): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.confirmation_secret'],
    });

    return subscription;
  }

  /** サブスクリプションの更新 */
  public static async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<Stripe.Subscription> {
    // 既存のサブスクリプションを取得
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // サブスクリプションを更新
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations', // 按分計算を有効にする
      billing_cycle_anchor: 'now', // 即座に新しい請求サイクルを開始
    });

    return updatedSubscription;
  }

  /** サブスクリプションのキャンセル */
  public static async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  }
}
