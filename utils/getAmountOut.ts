import { BigNumber } from 'ethers';
import { config } from '../src/config/config';
import { getERC20Contract } from './contracts';
import { expandToDecimalsBN, reduceFromDecimalsBN } from './utils';
import { Decimal } from 'decimal.js';

export const getAmountOut = async (
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
    wethAddress.toLowerCase() === tokenOutAddress.toLowerCase()
  ) {
    tokenInDecimals = 18;
  } else {
    const tokenInContract = await getERC20Contract(chainId, tokenInAddress);
    tokenInDecimals = await tokenInContract.decimals();
  }
  if (
    ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
    wethAddress.toLowerCase() === tokenOutAddress.toLowerCase()
  ) {
    tokenOutDecimals = 18;
  } else {
    const tokenOutContract = await getERC20Contract(chainId, tokenOutAddress);
    tokenOutDecimals = await tokenOutContract.decimals();
  }

  let amountInBigNumber: BigNumber = BigNumber.from(0);

  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenInDecimals);

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
    const swapPath = [tokenInAddress, wethAddress, tokenOutAddress];
    amountInBigNumber = BigNumber.from(
      (
        await uniswapV2RouterContract.getAmountsIn(amountOutBigNumber, swapPath)
      )[0]
    );
  } else {
    amountInBigNumber = BigNumber.from(amountOutBigNumber.toString());
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
