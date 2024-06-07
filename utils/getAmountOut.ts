import { BigNumber } from 'ethers';
import { config } from '../src/config/config';
import { getERC20Contract } from './contracts';

export const getAmountOut = async (
  chainId: string,
  universalRouterContract: any,
  uniswapV2RouterContract: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountOut: bigint,
  slippage: number,
  payType: number
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;

  let fee = 0;
  if (payType == 0) {
    const fastTradeFeeBps = await universalRouterContract.fastTradeFeeBps();
    const feeBaseBps = await universalRouterContract.feeBaseBps();

    fee = fastTradeFeeBps / feeBaseBps;
  }

  let amountIn: BigNumber = BigNumber.from(0);

  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const swapPath = [wethAddress, tokenOutAddress];
    amountIn = BigNumber.from(
      (await uniswapV2RouterContract.getAmountsIn(amountOut, swapPath))[0]
    );
  } else if (
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()
  ) {
    const swapPath = [tokenInAddress, wethAddress];
    amountIn = BigNumber.from(
      (await uniswapV2RouterContract.getAmountsIn(amountOut, swapPath))[0]
    );
  } else if (
    ethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const swapPath = [tokenInAddress, wethAddress, tokenOutAddress];
    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      amountOut,
      swapPath
    );
  } else {
    amountIn = BigNumber.from(amountOut.toString());
  }

  if (fee > 0) {
    amountIn = amountIn.sub(amountIn.mul(fee));
  }
  if (slippage > 0) {
    amountIn = amountIn.sub(amountIn.mul(slippage));
  }
  return amountIn;
};
