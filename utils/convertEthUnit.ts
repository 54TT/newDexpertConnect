import Decimal from 'decimal.js';
import { BigNumber, BigNumberish, ethers } from 'ethers';
export const ethToWei = (amount: number): Decimal => {
  return new Decimal(amount).mul(new Decimal(10).pow(18));
};

export const weiToEth = (amount: Decimal): number => {
  return Number(amount.div(new Decimal(10).pow(18)));
};

export const toEthWithDecimal = (
  amount: ethers.BigNumberish,
  decimal: number
): String => {
  return new Decimal(amount.toString())
    .div(new Decimal(10).pow(decimal))
    .toString();
};

export const toWeiWithDecimal = (
  amount: string,
  decimal: number
): BigNumberish => {
  console.log(new Decimal(amount).mul(new Decimal(10).pow(decimal)).valueOf());
  return BigNumber.from(
    new Decimal(amount).mul(new Decimal(10).pow(decimal)).toString()
  );
};
