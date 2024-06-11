import { BigNumber } from 'ethers';
import { config } from '../../../src/config/config';
import { expandToDecimalsBN , reduceFromDecimalsBN} from '../../utils'
import { getERC20Contract, getUniswapV3OracleLibraryContract, getUniswapV3FactoryContract } from '../../contracts';
import { Decimal } from 'decimal.js'
import { getPools } from './getPools';

export const getV3AmountIn = async (
    chainId: string,
    provider: any,
    universalRouterContract: any,
    tokenInAddress: string,
    tokenOutAddress: string,
    amountIn: Decimal,
    slippage: Decimal,
    payType: number
) => {
    const chainConfig = config[chainId];
    const ethAddress = chainConfig.ethAddress;
    const wethAddress = chainConfig.wethAddress;
    const quoterAddress = chainConfig.quoterAddress;
    const uniswapV3OracleLibraryAddress = chainConfig.uniswapV3OracleLibraryAddress
    const uniswapV3FactoryAddress = chainConfig.uniswapV3FactoryAddress
    const uniswapV3FeeAmounts = chainConfig.uniswapV3FeeAmounts

    const uniswapV3OracleLibraryContract = await getUniswapV3OracleLibraryContract(provider, uniswapV3OracleLibraryAddress);
    const quoterContract = ""

    let fee = new Decimal(0);
    if (payType == 0) {
        console.log(universalRouterContract);

        const fastTradeFeeBps = await universalRouterContract.fastTradeFeeBps();

        const feeBaseBps = await universalRouterContract.feeBaseBps();

        fee = new Decimal(fastTradeFeeBps / feeBaseBps);
    }

    const tokenInContract = await getERC20Contract(provider, tokenInAddress)
    const tokenInDecimals = await tokenInContract.decimals();

    const tokenOutContract = await getERC20Contract(provider, tokenOutAddress)
    const tokenOutDecimals = await tokenOutContract.decimals();

    let quoteAmountBigNumber: BigNumber = BigNumber.from(0);
    let uniswapV3FeeAmount = BigNumber.from(0);
    let poolAddress = ""

    const amountInBigNumber = expandToDecimalsBN(amountIn, tokenInDecimals);
    if (
        ethAddress.toLowerCase() === tokenInAddress.toLowerCase() &&
        wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
    ) {
        const pools = await getPools(provider, uniswapV3FactoryAddress, uniswapV3FeeAmounts, wethAddress, tokenOutAddress)
        if(pools.length > 0){
            for (const pool of pools) {
                const consult = await uniswapV3OracleLibraryContract.consult(pool.address, 300)
                const quoteAmount = await uniswapV3OracleLibraryContract.getQuoteAtTick(consult.arithmeticMeanTick, amountIn, wethAddress, tokenOutAddress)
                if(quoteAmountBigNumber.isZero()){
                    quoteAmountBigNumber = BigNumber.from(quoteAmount)
                    uniswapV3FeeAmount = BigNumber.from(pool.fee)
                    poolAddress = pool.address
                }else{
                    if(quoteAmount.gt(quoteAmountBigNumber)){
                        quoteAmountBigNumber = BigNumber.from(quoteAmount)
                        uniswapV3FeeAmount = BigNumber.from(pool.fee)
                        poolAddress = pool.address
                    }
                }
            };
        }else{
            return {
                quoteAmount: new Decimal(0),
                poolAddress: "",
                fee: 0
            }
        }     
    } else if (
        tokenInAddress.toLowerCase() !== wethAddress.toLowerCase() &&
        tokenOutAddress.toLowerCase() === ethAddress.toLowerCase()
    ) {
        const pools = await getPools(provider, uniswapV3FactoryAddress, uniswapV3FeeAmounts, tokenInAddress, wethAddress)
        if(pools.length > 0){
            for (const pool of pools) {
                const consult = await uniswapV3OracleLibraryContract.consult(pool.address, 300)
                const quoteAmount = await uniswapV3OracleLibraryContract.getQuoteAtTick(consult.arithmeticMeanTick, amountIn, tokenInAddress, wethAddress)
                if(quoteAmountBigNumber.isZero()){
                    quoteAmountBigNumber = BigNumber.from(quoteAmount)
                    uniswapV3FeeAmount = BigNumber.from(pool.fee)
                    poolAddress = pool.address
                }else{
                    if(quoteAmount.gt(quoteAmountBigNumber)){
                        quoteAmountBigNumber = BigNumber.from(quoteAmount)
                        uniswapV3FeeAmount = BigNumber.from(pool.fee)
                        poolAddress = pool.address
                    }
                }
            };
        }else{
            return {
                quoteAmount: new Decimal(0),
                poolAddress: "",
                fee: 0
            }
        }
    } else if (
        ethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
        ethAddress.toLowerCase() !== tokenOutAddress.toLowerCase() &&
        wethAddress.toLowerCase() !== tokenInAddress.toLowerCase() &&
        wethAddress.toLowerCase() !== tokenOutAddress.toLowerCase()
    ) {
        const pools = await getPools(provider, uniswapV3FactoryAddress, uniswapV3FeeAmounts, tokenInAddress, tokenOutAddress)
        if(pools.length > 0){
            for (const pool of pools) {
                const consult = await uniswapV3OracleLibraryContract.consult(pool.address, 300)
                const quoteAmount = await uniswapV3OracleLibraryContract.getQuoteAtTick(consult.arithmeticMeanTick, amountIn, tokenInAddress, tokenOutAddress)
                if(quoteAmountBigNumber.isZero()){
                    quoteAmountBigNumber = BigNumber.from(quoteAmount)
                    uniswapV3FeeAmount = BigNumber.from(pool.fee)
                    poolAddress = pool.address
                }else{
                    if(quoteAmount.gt(quoteAmountBigNumber)){
                        quoteAmountBigNumber = BigNumber.from(quoteAmount)
                        uniswapV3FeeAmount = BigNumber.from(pool.fee)
                        poolAddress = pool.address
                    }
                }
            }
        }else{
            return {
                quoteAmount: new Decimal(0),
                poolAddress: "",
                fee: 0
            }
        }
        
    } else {
        quoteAmountBigNumber = BigNumber.from(amountInBigNumber.toString());
    }

    let amount = reduceFromDecimalsBN(quoteAmountBigNumber, tokenOutDecimals)

    if (fee.greaterThan(0)) {
        amount = amount.add(amount.mul(fee));
    }
    if (slippage.greaterThan(0)) {
        amount = amount.add(amount.mul(slippage));
    }
    return {
        quoteAmount: amount,
        poolAddress: poolAddress,
        fee: uniswapV3FeeAmount
    }
};


