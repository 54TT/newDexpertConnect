import { config } from '../../../src/config/config';
import { RoutePlanner } from '../../planner';
import { ethToWeth, wethToEth } from './swapEthAndWeth';
import { getDecimals } from '@utils/getDecimals';
import Decimal from 'decimal.js';
import { expandToDecimalsBN } from '../../utils';

export const getSwapEthAndWeth = async (
  chainId: string,
  provider: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  amountOut: Decimal,
  recipient: string
) => {
  const str = amountIn.toString();

  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();

  const { tokenInDecimals, tokenOutDecimals } = await getDecimals({
    tokenInAddress,
    tokenOutAddress,
    chainId,
  });

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
      recipient
    );
  }
  return planner;
};
