import { BigNumber } from 'ethers';
import { config } from '@/config/config';
import { expandToDecimalsBN, reduceFromDecimalsBN } from '@/../utils/utils';
import { Decimal } from 'decimal.js';
import { getPairAddress } from './getPairAddress';
import { zeroAddress } from '@utils/constants';

export const getAmountIn = async (
  chainId: string,
  provider: any,
  uniswapV2RouterContract: any,
  [tokenInAddress, tokenInDecimals]: [string, number],
  [tokenOutAddress, tokenOutDecimals]: [string, number],
  amountOut: Decimal,
  slippage: Decimal,
  fee: Decimal
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const uniswapV2FactoryAddress = chainConfig.uniswapV2FactoryAddress;

  let amountInBigNumber: BigNumber = BigNumber.from(0);

  const amountOutBigNumber = expandToDecimalsBN(amountOut, tokenOutDecimals);

  if (
    (ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
      wethAddress.toLowerCase() === tokenInAddress.toLowerCase()) &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
    ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    // in 是 eth / weth  out 是 erc20
    const swapPath = [wethAddress, tokenOutAddress];
    amountInBigNumber = BigNumber.from(
      (
        await uniswapV2RouterContract.getAmountsIn(amountOutBigNumber, swapPath)
      )[0]
    );
  } else if (
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() &&
    (tokenOutAddress.toLowerCase() === ethAddress.toLowerCase() ||
      tokenOutAddress.toLowerCase() === wethAddress.toLowerCase())
  ) {
    // in 是erc20 out 是 weth /eth
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
    // in out 都是普通erc20 ，寻找pair
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
    // eth / weth 互转
    amountInBigNumber = BigNumber.from(amountOutBigNumber.toString());
    return reduceFromDecimalsBN(amountInBigNumber, tokenInDecimals);
  }

  let amount = reduceFromDecimalsBN(amountInBigNumber, tokenInDecimals);

  if (fee.greaterThan(0)) {
    amount = amount.add(amount.add(amount.mul(fee)).mul(fee));
  }
  if (slippage.greaterThan(0)) {
    amount = amount.add(amount.mul(slippage));
  }
  return amount;
};
