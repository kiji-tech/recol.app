export class Payment {
  /** 金額 */
  readonly price: number = 0;
  /** 元の金額 */
  readonly originalPrice?: number;

  /** 期間 */
  readonly period: string = '';

  /** 無効化フラグ */
  readonly disabled: boolean = false;

  /** 現在のプランフラグ */
  readonly isCurrentPlan: boolean = false;

  /** StripeのプランID */
  readonly priceId: string = '';

  constructor(payment: Payment) {
    this.price = payment.price;
    this.period = payment.period;
    this.disabled = payment.disabled;
    this.isCurrentPlan = payment.isCurrentPlan;
    this.priceId = payment.priceId;
    this.originalPrice = payment.originalPrice;
  }
}
