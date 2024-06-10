import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { RoutePlanner } from '../../planner'
import {erc20ToETH, erc20ToErc20, ethToErc20} from './swapExactOut'
import { expandToDecimalsBN} from '../../utils'
import Decimal from 'decimal.js';
import { getERC20Contract } from '../../contracts';

export const getSwapExactOutBytes = async (
  chainId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountInMax: Decimal,
  amountOut: Decimal,
  recipient: string,
  isFee: boolean,
  feeType: number,
  uniswapV3Fee: number,
  poolAddress: string
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();

  const tokenInContract = await getERC20Contract(chainId, tokenInAddress)
  const tokenInDecimals = await tokenInContract.decimals();

  const tokenOutContract = await getERC20Contract(chainId, tokenOutAddress)
  const tokenOutDecimals = await tokenOutContract.decimals();

  const amountInBigNumber = expandToDecimalsBN(amountInMax, tokenInDecimals);
  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenOutDecimals);
  
  if(tokenInAddress.toLowerCase() === ethAddress.toLowerCase() && tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase() &&  tokenOutAddress.toLowerCase() !== ethAddress.toLowerCase()){
    await ethToErc20(chainId, planner, wethAddress, tokenOutAddress, amountInBigNumber, amountOutBigNumber, recipient, poolAddress, isFee, feeType, uniswapV3Fee)
  }else if(tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() && tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()){
    await erc20ToETH(chainId, planner, tokenInAddress, wethAddress, amountInBigNumber, amountOutBigNumber, recipient, isFee, feeType, uniswapV3Fee)
  }else{
    await erc20ToErc20(chainId, planner, tokenInAddress, tokenOutAddress, amountInBigNumber, amountOutBigNumber, recipient, isFee, feeType, uniswapV3Fee)
  }
  return planner;
};
