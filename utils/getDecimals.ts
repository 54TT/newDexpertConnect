// 从合约中获取 token 的 decimals

import { config } from '../src/config/config';
import { getERC20Contract } from './contracts';

// WETH || ETH 默认返回18位
export const getDecimals = async ({
  tokenInAddress,
  tokenOutAddress,
  chainId,
}: Record<'tokenInAddress' | 'tokenOutAddress' | 'chainId', string>): Promise<
  Record<'tokenInDecimals' | 'tokenOutDecimals', number>
> => {
  let tokenInDecimals;
  let tokenOutDecimals;

  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
    wethAddress.toLowerCase() === tokenInAddress.toLowerCase()
  ) {
    tokenInDecimals = 18;
  } else {
    const tokenInContract = await getERC20Contract(chainId, tokenInAddress);
    tokenInDecimals = await tokenInContract.decimals();
  }
  if (
    ethAddress.toLowerCase() === tokenOutAddress.toLowerCase() ||
    wethAddress.toLowerCase() === tokenOutAddress.toLowerCase()
  ) {
    tokenOutDecimals = 18;
  } else {
    const tokenOutContract = await getERC20Contract(chainId, tokenOutAddress);
    tokenOutDecimals = await tokenOutContract.decimals();
  }
  return Promise.resolve({ tokenInDecimals, tokenOutDecimals });
};
