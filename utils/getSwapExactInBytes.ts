import { BigNumber } from 'ethers';
import { config } from '../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from './contracts';
import { RoutePlanner, CommandType } from './planner'
import {erc20ToETH, erc20ToErc20, ethToErc20} from './swapExactIn'
import { getPairAddress } from './getPairAddress';

export const getSwapExactInBytes = async (
  chainId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  recipient: string,
  isFee: boolean,
  feeType: number
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();
  
  if(tokenInAddress.toLowerCase() === ethAddress.toLowerCase() && tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase() &&  tokenOutAddress.toLowerCase() !== ethAddress.toLowerCase()){
    const pairAddress = await getPairAddress(chainId,tokenOutAddress)
    await ethToErc20(chainId, planner, wethAddress, tokenOutAddress, amountIn, amountOutMin, recipient, pairAddress, isFee, feeType)
  }else if(tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() && tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()){
    await erc20ToETH(chainId, planner, tokenInAddress, wethAddress, amountIn, amountOutMin, recipient, isFee, feeType)
  }else{
    await erc20ToErc20(chainId, planner, tokenInAddress, tokenOutAddress, amountIn, amountOutMin, recipient, isFee, feeType)
  }
  return planner;
};
