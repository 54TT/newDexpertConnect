import { BigNumber } from 'ethers';
import bn from 'bignumber.js';
import { Decimal } from 'decimal.js';
import { encodePath } from './swapRouter02Helpers';
import { zeroAddress } from './constants';
import Cookies from 'js-cookie';
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
  
  if (address === zeroAddress) return '';
  if (typeof address !== 'string') return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 5)}...${address.slice(address.length - 4, address.length)}`;
};
export function expandToDecimalsBN(n: Decimal, decimals: number): BigNumber {
  // use bn intermediately to allow decimals in intermediate calculations
  const amount = n.mul(new Decimal(10).pow(decimals)).toFixed(0);

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
const setCook = (data: any, token: string) => {
  let cook = null;
  if (data) {
    cook = btoa(
      encodeURIComponent(JSON.stringify(data)).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(_, p1) {
          return String.fromCharCode(Number('0x' + p1));
        }
      )
    );
  }
  const all = token + '++' + cook;
  Cookies.set('token', all);
};
//  获取jwt
export const tokenDecryption = (value: string) => {
  const base64Url = value?.split('.');
  const base641 = base64Url[1].replace(/-/g, '+').replace(/_/g, '/');
  const decodedToken = JSON.parse(atob(base641));
  return decodedToken;
};
//  缓存  加密
export const cookieEncryption = (data: any, tokenMore?: string) => {
  const token = Cookies.get('token');
  const par = token?.split('++');
  if (tokenMore) {
    if (par?.[1]) {
      const t = cookieDecryption('data');
      setCook({ ...t, ...data }, tokenMore);
    } else {
      setCook(data, tokenMore);
    }
  } else {
    if (par?.[1]) {
      const t = cookieDecryption('data');
      const yyyy = { ...t, ...data };
      setCook(yyyy, par[0]);
    } else {
      if(par?.[0]){
        setCook(data, par[0]);
      }
    }
  }
};
//  缓存解密   token或者数据
export const cookieDecryption = (status: string) => {
  const token = Cookies.get('token');
  if (token) {
    const par = token?.split('++');
    if (status === 'token') {
      return par[0];
    } else {
      if (par?.[1]) {
        const uuuu = decodeURIComponent(
          atob(par[1])
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        const ttt = JSON.parse(uuuu);
        return ttt;
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
};
