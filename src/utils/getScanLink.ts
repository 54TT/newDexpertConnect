import { SCAN } from "./const";

export function getScanLink(chainId: string, tx: string) {
  if(!tx) return '';
  if(!chainId) return '';
  return `${SCAN[chainId]}${tx}`;
}