import { BigNumber } from 'ethers';
import { config } from '../src/config/config';
import { RoutePlanner } from './planner'
import {erc20ToETH, erc20ToErc20, ethToErc20} from './swapExactOut'
import { getPairAddress, getERC20Contract } from './getPairAddress';
import { expandToDecimalsBN} from './utils'
import Decimal from 'decimal.js';

export const getSwapExactOutBytes = async (
  chainId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountInMax: Decimal,
  amountOut: Decimal,
  recipient: string,
  isFee: boolean,
  feeType: number
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
    const pairAddress = await getPairAddress(chainId,tokenOutAddress)
    await ethToErc20(chainId, planner, wethAddress, tokenOutAddress, amountInBigNumber, amountOutBigNumber, recipient, pairAddress, isFee, feeType)
  }else if(tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() && tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()){
    await erc20ToETH(chainId, planner, tokenInAddress, wethAddress, amountInBigNumber, amountOutBigNumber, recipient, isFee, feeType)
  }else{
    await erc20ToErc20(chainId, planner, tokenInAddress, tokenOutAddress, amountInBigNumber, amountOutBigNumber, recipient, isFee, feeType)
  }
  return planner;
};
