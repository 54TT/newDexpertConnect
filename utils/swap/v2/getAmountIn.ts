import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { getERC20Contract } from '../../contracts';
import { expandToDecimalsBN, reduceFromDecimalsBN } from '../../utils';
import { Decimal } from 'decimal.js';
import { getPairAddress } from './getPairAddress';
import { zeroAddress } from 'viem';

export const getAmountIn = async (
  chainId: string,
  provider: any,
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
  const uniswapV2FactoryAddress = chainConfig.uniswapV2FactoryAddress

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

  let tokenInDecimals;
  let tokenOutDecimals;
  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
    wethAddress.toLowerCase() === tokenInAddress.toLowerCase()
  ) {
    tokenInDecimals = 18;
  } else {
    const tokenInContract = await getERC20Contract(provider, tokenInAddress);
    tokenInDecimals = await tokenInContract.decimals();
  }
  if (
    ethAddress.toLowerCase() === tokenOutAddress.toLowerCase() ||
    wethAddress.toLowerCase() === tokenOutAddress.toLowerCase()
  ) {
    tokenOutDecimals = 18;
  } else {
    const tokenOutContract = await getERC20Contract(provider, tokenOutAddress);
    tokenOutDecimals = await tokenOutContract.decimals();
  }

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
      provider,
      uniswapV2FactoryAddress,
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
