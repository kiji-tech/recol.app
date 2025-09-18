export class Payment {
  /** 金額 */
  readonly price: number = 0;
  /** 元の金額 */
  readonly originalPrice?: number;

  /** 期間 */
  readonly period: 'monthly' | 'yearly' = 'monthly';

  /** StripeのプランID */
  readonly priceId: string = '';

  constructor(payment: Payment) {
    this.price = payment.price;
    this.period = payment.period;
    this.priceId = payment.priceId;
    this.originalPrice = payment.originalPrice;
  }
}

export const monthlyPayment = new Payment({
  price: 500,
  period: 'monthly',
  priceId: process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN || '',
});
export const yearlyPayment = new Payment({
  price: 5000,
  originalPrice: 6000,
  period: 'yearly',
  priceId: process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN || '',
});
