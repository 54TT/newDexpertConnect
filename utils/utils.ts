import { BigNumber } from 'ethers';
import bn from 'bignumber.js';
import { Decimal } from 'decimal.js';
import { encodePath } from './swapRouter02Helpers';

export function getQueryParams() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const queryParams: any = {};
  params.forEach(function (value, key) {
    queryParams[key] = value;
  });
  return queryParams;
}

export const formatAddress = (address: string) => {
  if (typeof address !== 'string') return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 5)}...${address.slice(address.length - 4, address.length)}`;
};

export function expandToDecimalsBN(n: Decimal, decimals: number): BigNumber {
  // use bn intermediately to allow decimals in intermediate calculations
  const amount = n.mul(new Decimal(10).pow(decimals)).toFixed(0);
  console.log(amount);

  return BigNumber.from(amount);
}

export function reduceFromDecimalsBN(n: BigNumber, decimals: number): Decimal {
  return new Decimal(
    new bn(n.toString()).div(new bn(10).pow(decimals)).toString()
  );
}

export function encodePathExactInput(tokens: string[], feeAmounts: number[]) {
  return encodePath(tokens, feeAmounts);
}

export function encodePathExactOutput(tokens: string[], feeAmounts: number[]) {
  return encodePath(tokens.slice().reverse(), feeAmounts);
}
