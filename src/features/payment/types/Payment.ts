export class Payment {
  readonly price: number = 0;
  readonly originalPrice?: number;
  readonly period: string = '';
  readonly disabled: boolean = false;
  readonly isCurrentPlan: boolean = false;
  readonly priceId: string = '';

  constructor(
    price: number,
    period: string,
    disabled: boolean,
    isCurrentPlan: boolean,
    priceId: string,
    originalPrice?: number,
  ) {
    this.price = price;
    this.period = period;
    this.disabled = disabled;
    this.isCurrentPlan = isCurrentPlan;
    this.priceId = priceId;
    this.originalPrice = originalPrice;
  }
}
