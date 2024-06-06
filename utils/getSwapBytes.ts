import Decimal from 'decimal.js';
import { config } from '../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from './contracts';

export const getSwapInBytes = async (
  chainId: string,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  amountOut: Decimal,
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  
  if(tokenInAddress.toLowerCase() === ethAddress.toLowerCase() && tokenOutAddress.toLowerCase() !== wethAddress.toLowerCase()){

  }else if(tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()){

  }else if(tokenInAddress.toLowerCase() === ethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === wethAddress.toLowerCase()){
    
  }else if(tokenInAddress.toLowerCase() === wethAddress.toLowerCase() && tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()){

  }else{

  }
};
