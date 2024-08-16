import { ADDRESS } from "./const";

export function getAddressLink(chainId: string, address: string) {
  if(!address) return '';
  if(!chainId) return '';
  return `${ADDRESS[chainId]}${address}`;
}