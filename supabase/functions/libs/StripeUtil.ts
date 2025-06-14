import Stripe from 'stripe';
const key =
  Deno.env.get('STRIPE_SECRET_KEY') ||
  'sk_test_51KcTMRCrMIHt8njNi9dugcYmWTBQZyzSWpmeCvpyYON3rGmxYsZ1ReNneRuEy0QZ6OE3BqtGrOomv7LgRwQHM7HM00RZo929V6';

export class StripeUtil {
  public static async createCustomer(email: string): Promise<Stripe.Customer> {
    console.log({ key });
    const stripe = new Stripe(key || '');
    const customer = await stripe.customers.create({
      email,
    });
    console.log({ customer });
    return customer;
  }
}
