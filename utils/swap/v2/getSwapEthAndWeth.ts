import { config } from '@/config/config';
import { RoutePlanner } from '../../planner';
import { ethToWeth, wethToEth } from './swapEthAndWeth';
import Decimal from 'decimal.js';
import { expandToDecimalsBN } from '@/../utils/utils';

export const getSwapEthAndWeth = async (
  chainId: string,
  [tokenInAddress, tokenInDecimals]: [string, number],
  [tokenOutAddress, tokenOutDecimals]: [string, number],
  amountIn: Decimal,
  amountOut: Decimal,
  recipient: string,
  permit: any,
  signature: string
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();

  const amountInBigNumber = expandToDecimalsBN(amountIn, tokenInDecimals);
  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenOutDecimals);

  if (
    tokenInAddress.toLowerCase() === ethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() === wethAddress.toLowerCase()
  ) {
    await ethToWeth(planner, amountInBigNumber, recipient);
  } else if (
    tokenInAddress.toLowerCase() === wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()
  ) {
    await wethToEth(
      chainId,
      planner,
      tokenInAddress,
      amountInBigNumber,
      amountOutBigNumber,
      recipient,
      permit,
      signature
    );
  }
  return planner;
};
