export class Payment {
  readonly price: number = 0;
  readonly originalPrice?: number;
  readonly period: string = '';
  readonly disabled: boolean = false;
  readonly isCurrentPlan: boolean = false;
  readonly onPress: () => void = () => {};

  constructor(
    price: number,
    period: string,
    disabled: boolean,
    isCurrentPlan: boolean,
    onPress: () => void,
    originalPrice?: number
  ) {
    this.price = price;
    this.period = period;
    this.disabled = disabled;
    this.isCurrentPlan = isCurrentPlan;
    this.onPress = onPress;
    this.originalPrice = originalPrice;
  }
}
