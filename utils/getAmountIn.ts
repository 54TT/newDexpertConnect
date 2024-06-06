import Decimal from 'decimal.js';
import { config } from '../src/config/config';
import { getERC20Contract } from './contracts';

export const getAmountIn = async (
  chainId: string,
  universalRouterContract: any,
  uniswapV2RouterContract: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  inAmount: bigint,
  slippage: number,
  payType: number
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;

  let fee = 0;
  if (payType == 0) {
    console.log(universalRouterContract);

    const fastTradeFeeBps = await universalRouterContract.fastTradeFeeBps();

    const feeBaseBps = await universalRouterContract.feeBaseBps();

    fee = fastTradeFeeBps / feeBaseBps;
  }

  let amountOut: Decimal = new Decimal(0);

  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const swapPath = [wethAddress, tokenOutAddress];
    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      inAmount,
      swapPath
    );
    amountOut = new Decimal(amountsOut[amountsOut.length - 1]);
  } else if (
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()
  ) {
    const swapPath = [tokenInAddress, wethAddress];
    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      inAmount,
      swapPath
    );
    amountOut = new Decimal(amountsOut[amountsOut.length - 1]);
  } else if (
    ethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const swapPath = [tokenInAddress, wethAddress, tokenOutAddress];
    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      inAmount,
      swapPath
    );
    amountOut = new Decimal(amountsOut[amountsOut.length - 1]);
  } else {
    amountOut = new Decimal(inAmount.toString());
  }

  if (fee > 0) {
    amountOut = amountOut.add(amountOut.mul(fee));
  }
  if (slippage > 0) {
    amountOut = amountOut.add(amountOut.mul(slippage));
  }
  return amountOut;
};
