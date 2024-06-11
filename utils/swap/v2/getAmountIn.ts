import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { getERC20Contract } from '../../contracts';
import { expandToDecimalsBN, reduceFromDecimalsBN } from '../../utils';
import { Decimal } from 'decimal.js';
import { getPairAddress } from './getPairAddress';
import { zeroAddress } from 'viem';
import { getDecimals } from '@utils/getDecimals';

export const getAmountIn = async (
  chainId: string,
  universalRouterContract: any,
  uniswapV2RouterContract: any,
  tokenInAddress: string,
  tokenOutAddress: string,
  amountOut: Decimal,
  slippage: Decimal,
  payType: number
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;

  console.log({
    chainId,
    universalRouterContract,
    uniswapV2RouterContract,
    tokenInAddress,
    tokenOutAddress,
    amountOut: amountOut.toString(),
    slippage,
    payType,
  });

  let fee = new Decimal(0);
  if (payType == 0) {
    const fastTradeFeeBps = await universalRouterContract.fastTradeFeeBps();
    const feeBaseBps = await universalRouterContract.feeBaseBps();

    fee = new Decimal(fastTradeFeeBps / feeBaseBps);
  }

  const { tokenInDecimals, tokenOutDecimals } = await getDecimals({
    tokenInAddress,
    tokenOutAddress,
    chainId,
  });

  let amountInBigNumber: BigNumber = BigNumber.from(0);

  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenOutDecimals);

  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const swapPath = [wethAddress, tokenOutAddress];
    amountInBigNumber = BigNumber.from(
      (
        await uniswapV2RouterContract.getAmountsIn(amountOutBigNumber, swapPath)
      )[0]
    );
  } else if (
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()
  ) {
    const swapPath = [tokenInAddress, wethAddress];
    amountInBigNumber = BigNumber.from(
      (
        await uniswapV2RouterContract.getAmountsIn(amountOutBigNumber, swapPath)
      )[0]
    );
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

    amountInBigNumber = BigNumber.from(
      (
        await uniswapV2RouterContract.getAmountsIn(amountOutBigNumber, swapPath)
      )[0]
    );
  } else {
    amountInBigNumber = BigNumber.from(amountOutBigNumber.toString());
  }

  let amount = reduceFromDecimalsBN(amountInBigNumber, tokenInDecimals);

  if (fee.greaterThan(0)) {
    amount = amount.add(amount.mul(fee));
  }
  if (slippage.greaterThan(0)) {
    amount = amount.add(amount.mul(slippage));
  }
  return amount;
};
