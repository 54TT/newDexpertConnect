import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from '../../contracts';
import { RoutePlanner, CommandType } from '../../planner';
import { ethToWeth, wethToEth } from './swapEthAndWeth';
import Decimal from 'decimal.js';
import { expandToDecimalsBN} from '../../utils'

export const getSwapEthAndWeth = async (
  chainId: string,
  provider: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  amountOut: Decimal,
  recipient: string,
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();

  const tokenInContract = await getERC20Contract(provider, tokenInAddress)
  const tokenInDecimals = await tokenInContract.decimals();

  const tokenOutContract = await getERC20Contract(provider, tokenOutAddress)
  const tokenOutDecimals = await tokenOutContract.decimals();

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
