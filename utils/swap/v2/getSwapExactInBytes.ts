import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from '../../contracts';
import { RoutePlanner, CommandType } from '../../planner'
import {erc20ToETH, erc20ToErc20, ethToErc20} from './swapExactIn'
import { getPairAddress } from './getPairAddress';
import { expandToDecimalsBN} from '../../utils'
import Decimal from 'decimal.js';

export const getSwapExactInBytes = async (
  chainId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  amountOutMin: Decimal,
  recipient: string,
  isFee: boolean,
  feeType: number
) => {
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
  const amountOutBigNumber = expandToDecimalsBN(amountOutMin, tokenOutDecimals);

  if (
    tokenInAddress.toLowerCase() === ethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() !== ethAddress.toLowerCase()
  ) {
    const pairAddress = await getPairAddress(chainId, tokenOutAddress);
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
      feeType
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
      isFee,
      feeType
    );
  }
  return planner;
};
