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

  public static async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  }
}
