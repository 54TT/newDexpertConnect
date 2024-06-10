import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from '../../contracts';
import { RoutePlanner, CommandType } from '../../planner';
import { ethToWeth, wethToEth } from './swapEthAndWeth';
import { getPairAddress } from './getPairAddress';
import Decimal from 'decimal.js';
import { expandToDecimalsBN} from '../../utils'

export const getSwapEthAndWeth = async (
  chainId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  amountOut: Decimal,
  recipient: string
) => {
  const str = amountIn.toString();
  debugger;
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();

  let tokenInDecimals;
  let tokenOutDecimals;
  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
    wethAddress.toLowerCase() === tokenOutAddress.toLowerCase()
  ) {
    tokenInDecimals = 18;
  } else {
    const tokenInContract = await getERC20Contract(chainId, tokenInAddress);
    tokenInDecimals = await tokenInContract.decimals();
  }
  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
    wethAddress.toLowerCase() === tokenOutAddress.toLowerCase()
  ) {
    tokenOutDecimals = 18;
  } else {
    const tokenOutContract = await getERC20Contract(chainId, tokenOutAddress);
    tokenOutDecimals = await tokenOutContract.decimals();
  }

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
