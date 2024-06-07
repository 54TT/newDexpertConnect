import { BigNumber } from 'ethers'
import bn from 'bignumber.js'
import { Decimal } from 'decimal.js'

export function getQueryParams() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const queryParams: any = {};
  params.forEach(function(value, key) {
    queryParams[key] = value;
  });
  return queryParams;
}

export const formatAddress = (address: string) => {
  if (typeof address !== 'string') return '';
  if (address.length <= 10) return address
  return `${address.slice(0,5)}...${address.slice(address.length - 4, address.length)}`
}

export function expandToDecimalsBN(n: Decimal, decimals: number): BigNumber {
  // use bn intermediately to allow decimals in intermediate calculations
  return BigNumber.from(new bn(n.toString()).times(new bn(10).pow(decimals)).toFixed())
}

export function reduceFromDecimalsBN(n: BigNumber, decimals: number): Decimal {
  return new Decimal(new bn(n.toString()).div(new bn(10).pow(decimals)).toString());
}
