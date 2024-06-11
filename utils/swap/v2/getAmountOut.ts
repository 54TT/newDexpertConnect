import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { expandToDecimalsBN, reduceFromDecimalsBN } from '../../utils';
import { Decimal } from 'decimal.js';
import { getPairAddress } from './getPairAddress';
import { zeroAddress } from 'viem';
import { getDecimals } from '@utils/getDecimals';

export const getAmountOut = async (
  chainId: string,
  universalRouterContract: any,
  uniswapV2RouterContract: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: Decimal,
  slippage: Decimal,
  payType: number
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;

  let fee = new Decimal(0);
  if (payType == 0) {
    console.log(universalRouterContract);

    const fastTradeFeeBps = await universalRouterContract.fastTradeFeeBps();

    const feeBaseBps = await universalRouterContract.feeBaseBps();

    fee = new Decimal(fastTradeFeeBps / feeBaseBps);
  }

  const { tokenInDecimals, tokenOutDecimals } = await getDecimals({
    tokenInAddress,
    tokenOutAddress,
    chainId,
  });

  let amountOutBigNumber: BigNumber = BigNumber.from(0);

  const amountInBigNumber = expandToDecimalsBN(amountIn, tokenInDecimals);
  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const swapPath = [wethAddress, tokenOutAddress];
    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      amountInBigNumber,
      swapPath
    );
    console.log('amountsOut:', amountsOut);
    amountOutBigNumber = BigNumber.from(amountsOut[amountsOut.length - 1]);
  } else if (
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()
  ) {
    const swapPath = [tokenInAddress, wethAddress];
    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      amountInBigNumber,
      swapPath
    );
    amountOutBigNumber = BigNumber.from(amountsOut[amountsOut.length - 1]);
  } else if (
    ethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    let swapPath = [''];
    const pairAddress = await getPairAddress(
      chainId,
      tokenInAddress,
      tokenOutAddress
    );
    if (pairAddress.toLowerCase() === zeroAddress.toLowerCase()) {
      swapPath = [tokenInAddress, wethAddress, tokenOutAddress];
    } else {
      swapPath = [tokenInAddress, tokenOutAddress];
    }

    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      amountInBigNumber,
      swapPath
    );
    amountOutBigNumber = BigNumber.from(amountsOut[amountsOut.length - 1]);
  } else {
    amountOutBigNumber = BigNumber.from(amountInBigNumber.toString());
  }

  let amount = reduceFromDecimalsBN(amountOutBigNumber, tokenOutDecimals);

  if (fee.greaterThan(0)) {
    amount = amount.sub(amount.mul(fee));
  }
  if (slippage.greaterThan(0)) {
    amount = amount.sub(amount.mul(slippage));
  }
  return amount;
};
