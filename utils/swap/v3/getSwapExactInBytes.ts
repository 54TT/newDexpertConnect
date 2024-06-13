import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from '../../contracts';
import { RoutePlanner, CommandType } from '../../planner'
import {erc20ToETH, erc20ToErc20, ethToErc20} from './swapExactIn'
import { expandToDecimalsBN} from '../../utils'
import Decimal from 'decimal.js';

export const getSwapExactInBytes = async (
  chainId: string,
  provider: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  amountOutMin: Decimal,
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

  const tokenInContract = await getERC20Contract(provider, tokenInAddress)
  const tokenInDecimals = await tokenInContract.decimals();

  const tokenOutContract = await getERC20Contract(provider, tokenOutAddress)
  const tokenOutDecimals = await tokenOutContract.decimals();

  const amountInBigNumber = expandToDecimalsBN(amountIn, tokenInDecimals);
  const amountOutBigNumber = expandToDecimalsBN(amountOutMin, tokenOutDecimals);
  
  if(tokenInAddress.toLowerCase() === ethAddress.toLowerCase() && tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase() &&  tokenOutAddress.toLowerCase() !== ethAddress.toLowerCase()){
    await ethToErc20(chainId, planner, wethAddress, tokenOutAddress, amountInBigNumber, amountOutBigNumber, recipient, poolAddress, isFee, feeType, uniswapV3Fee)
  }else if(tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() && tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()){
    await erc20ToETH(chainId, planner, tokenInAddress, wethAddress, amountInBigNumber, amountOutBigNumber, recipient, isFee, feeType, uniswapV3Fee)
  }else{
    await erc20ToErc20(chainId, planner, tokenInAddress, tokenOutAddress, amountInBigNumber, amountOutBigNumber, recipient, isFee, feeType, uniswapV3Fee)
  }
  return planner;
};
