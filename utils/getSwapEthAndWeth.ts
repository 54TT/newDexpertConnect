import Decimal from 'decimal.js';
import { config } from '../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from './contracts';
import { RoutePlanner, CommandType } from './planner'
import {ethToWeth, wethToEth} from './swapEthAndWeth'
import { getPairAddress } from './getPairAddress';

export const getSwapExactOutBytes = async (
  chainId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  amountOut: Decimal,
  recipient: string,
  isFee: boolean,
  feeType: number
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const planner = new RoutePlanner();
  
  if(tokenInAddress.toLowerCase() === ethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === wethAddress.toLowerCase()){
    await ethToWeth(planner, amountIn, recipient)
  }else if(tokenInAddress.toLowerCase() === wethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()){
    await wethToEth(chainId, planner, tokenInAddress, amountIn, amountOut, recipient)
  }
  return planner
};
