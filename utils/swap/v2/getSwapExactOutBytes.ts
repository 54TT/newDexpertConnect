import { config } from '../../../src/config/config';
import { RoutePlanner } from '../../planner';
import { erc20ToETH, erc20ToErc20, ethToErc20 } from './swapExactOut';
import { expandToDecimalsBN } from '../../utils';
import Decimal from 'decimal.js';

export const getSwapExactOutBytes = async (
  chainId: string,
  provider: any,
  [tokenInAddress, tokenInDecimals]: [string, number],
  [tokenOutAddress, tokenOutDecimals]: [string, number],
  amountInMax: Decimal,
  amountOut: Decimal,
  recipient: string,
  level: number,
  swapType: number,
  permit: any,
  signature: any
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  /*   const uniswapV2FactoryAddress = chainConfig.uniswapV2FactoryAddress; */
  const planner = new RoutePlanner();

  const amountInBigNumber = expandToDecimalsBN(amountInMax, tokenInDecimals);
  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenOutDecimals);

  if (
    tokenInAddress.toLowerCase() === ethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== ethAddress.toLowerCase()
  ) {
    /*     const pairAddress = await getPairAddress(
      provider,
      uniswapV2FactoryAddress,
      wethAddress,
      tokenOutAddress
    ); */
    await ethToErc20(
      chainId,
      planner,
      wethAddress,
      tokenOutAddress,
      amountInBigNumber,
      amountOutBigNumber,
      recipient,
      level,
      swapType
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
      permit,
      signature
    );
  } else {
    await erc20ToErc20(
      chainId,
      provider,
      planner,
      tokenInAddress,
      tokenOutAddress,
      amountInBigNumber,
      amountOutBigNumber,
      recipient,
      level,
      swapType,
      permit,
      signature
    );
  }
  return planner;
};
