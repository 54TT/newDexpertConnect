import {config} from '../../../src/config/config'
import {getUniswapV2FactoryContract} from '../../contracts'

export const getPairAddress = async (
    chainId: string,
    token0Address: string,
    token1Address: string,
) => {
    const chainConfig = config[chainId];
    const wethAddress = chainConfig.wethAddress;
    
    const uniswapV2FactoryContract = await getUniswapV2FactoryContract(chainId);

    const pairAddress = await uniswapV2FactoryContract.getPair(token0Address, token1Address);

    return pairAddress;
}


