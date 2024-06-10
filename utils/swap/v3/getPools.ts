import {config} from '../../../src/config/config'
import {getUniswapV3FactoryContract} from '../../contracts'
import {constants} from 'ethers'

export const getPools = async (
    chainId: string,
    token0Address: string,
    token1Address: string
) => {
    const chainConfig = config[chainId];
    const uniswapV3FeeAmounts = chainConfig.uniswapV3FeeAmounts
    
    const uniswapV3FactoryContract = await getUniswapV3FactoryContract(chainId);

    const pools: any = new Array(0)
    
    for (const feeAmount of uniswapV3FeeAmounts) {
        const poolAddress = await uniswapV3FactoryContract.getPool(token0Address, token1Address, feeAmount);
        if("0x0000000000000000000000000000000000000000" !== poolAddress){
            pools.push({ address: poolAddress, fee: feeAmount })
        }
      };
    return pools;
}


