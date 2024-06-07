import Decimal from 'decimal.js';

export const ethToWei = (amount: number): Decimal => {
  return new Decimal(amount * 10 ** 18);
};

export const weiToEth = (amount: Decimal): number => {
  return Number(amount.div(new Decimal(10 ** 18)));
};
