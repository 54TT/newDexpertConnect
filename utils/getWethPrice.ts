import Decimal from 'decimal.js';
import {config} from '../src/config/config'
import {getERC20Contract, getUniswapV2Contract} from './contracts'

export const getWethPrice = async (
    chainId: string,
) => {
    const chainConfig = config[chainId];
    const ethAddress = chainConfig.ethAddress;
    const wethAddress = chainConfig.wethAddress;
    const wethDecimal = chainConfig.wethDecimal;
    const usdtDecimal = chainConfig.usdtDecimal;
    const wethUsdtPairAddress = chainConfig.wethUsdtPairAddress;

    const wethUsdtPairContract = await getUniswapV2Contract(chainId, wethUsdtPairAddress)

    const wethUsdtPairToken0 = await wethUsdtPairContract.token0();

    const wethUsdtReserves = await wethUsdtPairContract.getReserves()

    let wethPrice = new Decimal(0)

    if (wethUsdtPairToken0.toLowerCase() === wethAddress.toLowerCase()) {
        wethPrice = new Decimal(wethUsdtReserves.reserve1).div(10 ** usdtDecimal).div(new Decimal(wethUsdtReserves.reserve0).div(10 ** wethDecimal))
    } else {
        wethPrice = new Decimal(wethUsdtReserves.reserve0).div(10 ** wethDecimal).div(new Decimal(wethUsdtReserves.reserve1).div(10 ** usdtDecimal))
    }
    return wethPrice
}

