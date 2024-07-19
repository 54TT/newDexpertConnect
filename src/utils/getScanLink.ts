import { SCAN } from "./const";

export function getScanLink(chainId: number, tx: string) {
  if(!tx) return '';
  if(!chainId) return '';
  return `${SCAN[chainId]}${tx}`;
}