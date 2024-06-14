import { config } from '../../../src/config/config';
import { RoutePlanner } from '../../planner';
import { erc20ToETH, erc20ToErc20, ethToErc20 } from './swapExactOut';
import { getPairAddress } from './getPairAddress';
import { expandToDecimalsBN } from '../../utils';
import Decimal from 'decimal.js';
import { getDecimals } from '../../getDecimals';

export const getSwapExactOutBytes = async (
  chainId: string,
  provider: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountInMax: Decimal,
  amountOut: Decimal,
  recipient: string,
  isFee: boolean,
  feeType: number,
  permit: any,
  signature: any
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const uniswapV2FactoryAddress = chainConfig.uniswapV2FactoryAddress;
  const planner = new RoutePlanner();

  const { tokenInDecimals, tokenOutDecimals } = await getDecimals({
    provider,
    tokenInAddress,
    tokenOutAddress,
    chainId,
  });
  const amountInBigNumber = expandToDecimalsBN(amountInMax, tokenInDecimals);
  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenOutDecimals);

  if (
    tokenInAddress.toLowerCase() === ethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== ethAddress.toLowerCase()
  ) {
    const pairAddress = await getPairAddress(
      provider,
      uniswapV2FactoryAddress,
      wethAddress,
      tokenOutAddress
    );
    await ethToErc20(
      chainId,
      planner,
      wethAddress,
      tokenOutAddress,
      amountInBigNumber,
      amountOutBigNumber,
      recipient,
      pairAddress,
      isFee,
      feeType
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
      isFee,
      feeType,
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
      isFee,
      feeType,
      permit,
      signature
    );
  }
  return planner;
};
