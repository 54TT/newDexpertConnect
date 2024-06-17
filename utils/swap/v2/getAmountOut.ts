import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { expandToDecimalsBN, reduceFromDecimalsBN } from '../../utils';
import { Decimal } from 'decimal.js';
import { getPairAddress } from './getPairAddress';
import { zeroAddress } from '@utils/constants';
import { getDecimals } from '@utils/getDecimals';

export const getAmountOut = async (
  chainId: string,
  provider: any,
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
  const uniswapV2FactoryAddress = chainConfig.uniswapV2FactoryAddress;
  let fee = new Decimal(0);
  if (payType == 0) {
    const fastTradeFeeBps = await universalRouterContract.fastTradeFeeBps();
    console.log(fastTradeFeeBps);

    const feeBaseBps = await universalRouterContract.feeBaseBps();

    fee = new Decimal(fastTradeFeeBps / feeBaseBps);
  }

  const { tokenInDecimals, tokenOutDecimals } = await getDecimals({
    provider,
    tokenInAddress,
    tokenOutAddress,
    chainId,
  });

  let amountOutBigNumber: BigNumber = BigNumber.from(0);

  const amountInBigNumber = expandToDecimalsBN(amountIn, tokenInDecimals);
  if (
    (ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
      wethAddress.toLowerCase() === tokenInAddress.toLowerCase()) &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
    ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    // in 是 eth / weth  out 是 erc20
    const swapPath = [wethAddress, tokenOutAddress];
    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      amountInBigNumber,
      swapPath
    );
    console.log('amountsOut:', amountsOut);
    amountOutBigNumber = BigNumber.from(amountsOut[amountsOut.length - 1]);
  } else if (
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() &&
    (tokenOutAddress.toLowerCase() === ethAddress.toLowerCase() ||
      tokenOutAddress.toLowerCase() === wethAddress.toLowerCase())
  ) {
    // in 是erc20 out 是 weth /eth
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

    let amountsOut = await uniswapV2RouterContract.getAmountsOut(
      amountInBigNumber,
      swapPath
    );
    amountOutBigNumber = BigNumber.from(amountsOut[amountsOut.length - 1]);
  } else {
    // eth / weth 互转
    amountOutBigNumber = BigNumber.from(amountInBigNumber.toString());
    return reduceFromDecimalsBN(amountOutBigNumber, tokenOutDecimals);
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
