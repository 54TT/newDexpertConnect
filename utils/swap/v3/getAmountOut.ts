import { BigNumber } from 'ethers';
import { config } from '@/config/config';
import { expandToDecimalsBN, reduceFromDecimalsBN } from '../../utils';
import { getQuoterContract } from '../../contracts';
import { Decimal } from 'decimal.js';
import { getPools } from './getPools';

export const getV3AmountOut = async (
  chainId: string,
  provider: any,
  [tokenInAddress, tokenInDecimals]: [string, number],
  [tokenOutAddress, tokenOutDecimals]: [string, number],
  amountIn: Decimal,
  slippage: Decimal,
  fee: Decimal
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const quoterAddress = chainConfig.quoterAddress;
  const uniswapV3FactoryAddress = chainConfig.uniswapV3FactoryAddress;
  const uniswapV3FeeAmounts = chainConfig.uniswapV3FeeAmounts;
  const quoterContract = await getQuoterContract(provider, quoterAddress);

  let quoteAmountOutBigNumber: BigNumber = BigNumber.from(0);
  let uniswapV3FeeAmount = BigNumber.from(0);
  let poolAddress = '';
  const amountInBigNumber = expandToDecimalsBN(amountIn, tokenInDecimals);
  if (
    (ethAddress.toLowerCase() === tokenInAddress.toLowerCase() ||
      wethAddress.toLowerCase() === tokenInAddress.toLowerCase()) &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
    ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const pools = await getPools(
      provider,
      uniswapV3FactoryAddress,
      uniswapV3FeeAmounts,
      wethAddress,
      tokenOutAddress
    );
    if (pools.length > 0) {
      for (const pool of pools) {
        const quotedAmountOut =
          await quoterContract.callStatic.quoteExactInputSingle(
            wethAddress,
            tokenOutAddress,
            pool.fee,
            amountInBigNumber,
            0
          );
        if (quoteAmountOutBigNumber.isZero()) {
          quoteAmountOutBigNumber = BigNumber.from(quotedAmountOut);
          uniswapV3FeeAmount = BigNumber.from(pool.fee);
          poolAddress = pool.address;
        } else {
          if (quotedAmountOut.gt(quoteAmountOutBigNumber)) {
            quoteAmountOutBigNumber = BigNumber.from(quotedAmountOut);
            uniswapV3FeeAmount = BigNumber.from(pool.fee);
            poolAddress = pool.address;
          }
        }
      }
    } else {
      return {
        quoteAmount: new Decimal(0),
        poolAddress: '',
        fee: 0,
      };
    }
  } else if (
    tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
    tokenInAddress.toLowerCase() !== ethAddress.toLowerCase() &&
    (tokenOutAddress.toLowerCase() === ethAddress.toLowerCase() ||
      tokenOutAddress.toLowerCase() === wethAddress.toLowerCase())
  ) {
    const pools = await getPools(
      provider,
      uniswapV3FactoryAddress,
      uniswapV3FeeAmounts,
      tokenInAddress,
      wethAddress
    );
    if (pools.length > 0) {
      for (const pool of pools) {
        // const consult = await uniswapV3OracleLibraryContract.consult(pool.address, 300)
        // const quoteAmount = await uniswapV3OracleLibraryContract.getQuoteAtTick(consult.arithmeticMeanTick, amountInBigNumber, tokenInAddress, wethAddress)
        const quotedAmountOut =
          await quoterContract.callStatic.quoteExactInputSingle(
            tokenInAddress,
            wethAddress,
            pool.fee,
            amountInBigNumber,
            0
          );
        if (quoteAmountOutBigNumber.isZero()) {
          quoteAmountOutBigNumber = BigNumber.from(quotedAmountOut);
          uniswapV3FeeAmount = BigNumber.from(pool.fee);
          poolAddress = pool.address;
        } else {
          if (quotedAmountOut.gt(quoteAmountOutBigNumber)) {
            quoteAmountOutBigNumber = BigNumber.from(quotedAmountOut);
            uniswapV3FeeAmount = BigNumber.from(pool.fee);
            poolAddress = pool.address;
          }
        }
      }
    } else {
      return {
        quoteAmount: new Decimal(0),
        poolAddress: '',
        fee: 0,
      };
    }
  } else if (
    ethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
    wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
  ) {
    const pools = await getPools(
      provider,
      uniswapV3FactoryAddress,
      uniswapV3FeeAmounts,
      tokenInAddress,
      tokenOutAddress
    );
    if (pools.length > 0) {
      for (const pool of pools) {
        const quotedAmountOut =
          await quoterContract.callStatic.quoteExactInputSingle(
            tokenInAddress,
            tokenOutAddress,
            pool.fee,
            amountInBigNumber,
            0
          );
        if (quoteAmountOutBigNumber.isZero()) {
          quoteAmountOutBigNumber = BigNumber.from(quotedAmountOut);
          uniswapV3FeeAmount = BigNumber.from(pool.fee);
          poolAddress = pool.address;
        } else {
          if (quotedAmountOut.gt(quoteAmountOutBigNumber)) {
            quoteAmountOutBigNumber = BigNumber.from(quotedAmountOut);
            uniswapV3FeeAmount = BigNumber.from(pool.fee);
            poolAddress = pool.address;
          }
        }
      }
    } else {
      return {
        quoteAmount: new Decimal(0),
        poolAddress: '',
        fee: 0,
      };
    }
  } else {
    quoteAmountOutBigNumber = BigNumber.from(amountInBigNumber.toString());
  }
  let amount = reduceFromDecimalsBN(quoteAmountOutBigNumber, tokenOutDecimals);

  if (fee.greaterThan(0)) {
    amount = amount.sub(amount.add(amount.mul(fee)).mul(fee));
  }
  if (slippage.greaterThan(0)) {
    amount = amount.sub(amount.mul(slippage));
  }

  return {
    quoteAmount: amount,
    poolAddress: poolAddress,
    fee: uniswapV3FeeAmount.toNumber(),
  };
};
