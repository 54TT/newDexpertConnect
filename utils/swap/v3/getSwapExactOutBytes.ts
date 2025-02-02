import { config } from '@/config/config';
import { RoutePlanner } from '../../planner';
import { erc20ToETH, erc20ToErc20, ethToErc20 } from './swapExactOut';
import { expandToDecimalsBN } from '../../utils';
import Decimal from 'decimal.js';

export const getSwapExactOutBytes = async (
  chainId: string,
  _: any,
  [tokenInAddress, tokenInDecimals]: [string, number],
  [tokenOutAddress, tokenOutDecimals]: [string, number],
  amountInMax: Decimal,
  amountOut: Decimal,
  recipient: string,
  level: number,
  swapType: number,
  uniswapV3Fee: number,
  permit: any,
  signature: string
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();

  const amountInBigNumber = expandToDecimalsBN(amountInMax, tokenInDecimals);
  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenOutDecimals);

  if (
    tokenInAddress.toLowerCase() === ethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== ethAddress.toLowerCase()
  ) {
    await ethToErc20(
      chainId,
      planner,
      wethAddress,
      tokenOutAddress,
      amountInBigNumber,
      amountOutBigNumber,
      recipient,
      level,
      swapType,
      uniswapV3Fee
    );
  } else if (
    tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() &&
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()
  ) {
    await erc20ToETH(
      chainId,
      planner,
      tokenInAddress,
      wethAddress,
      amountInBigNumber,
      amountOutBigNumber,
      recipient,
      level,
      swapType,
      uniswapV3Fee,
      permit,
      signature
    );
  } else {
    await erc20ToErc20(
      chainId,
      planner,
      tokenInAddress,
      tokenOutAddress,
      amountInBigNumber,
      amountOutBigNumber,
      recipient,
      level,
      swapType,
      uniswapV3Fee,
      permit,
      signature
    );
  }
  return planner;
};
