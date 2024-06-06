import Decimal from 'decimal.js';
import {config} from '../src/config/config'
import {getERC20Contract, getUniswapV2Contract} from './contracts'
import { getWethPrice } from './getWethPrice';

export const getTokenPrice = async (
    chainId: string,
    pairAddress: string,
) => {
    const chainConfig = config[chainId];
    const wethAddress = chainConfig.wethAddress;
    
    const wethPrice = await getWethPrice(chainId);

    const pairContract = await getUniswapV2Contract(chainId, pairAddress)

    const pairToken0Address = await pairContract.token0();

    const pairToken1Address = await pairContract.token1();

    const pairReserves = await pairContract.getReserves()

    const pairToken0Contract = await getERC20Contract(chainId, pairToken0Address)

    const pairToken1Contract = await getERC20Contract(chainId, pairToken1Address)

    const pairToken0Decimal = await pairToken0Contract.decimal()

    const pairToken1Decimal = await pairToken1Contract.decimal()

    const reserve0 = new Decimal(pairReserves[0]).div(new Decimal(10 ** pairToken0Decimal))
    const reserve1 = new Decimal(pairReserves[1]).div(new Decimal(10 ** pairToken1Decimal))

    let price = new Decimal(0)
    if (pairToken0Address.toLowerCase() === wethAddress.toLowerCase() && pairToken1Address.toLowerCase() !== wethAddress.toLowerCase()) {
        price = reserve0.div(reserve1)
    } else if (pairToken1Address.toLowerCase() === wethAddress.toLowerCase() && pairToken0Address.toLowerCase() !== wethAddress.toLowerCase()) {
        price = reserve1.div(reserve0)
    } else {
        price = new Decimal(0)
    }

    return price.mul(wethPrice);
}


