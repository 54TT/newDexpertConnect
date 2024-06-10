import Decimal from 'decimal.js';
import {config} from '../src/config/config'
import {UniversalRouterAbi} from '../abis/UniversalRouterAbi'
import {UniswapV2RouterAbi} from '../abis/UniswapV2RouterAbi'
import {ERC20Abi} from '../abis/ERC20Abi'
import {UniswapV2PairAbi} from '../abis/UniswapV2PairAbi'
import {UniswapV2FactoryAbi} from '../abis/UniswapV2FactoryAbi'
import {UniswapV3FactoryAbi} from '../abis/UniswapV3FactoryAbi'
import {UniswapV3PoolAbi} from '../abis/UniswapV3PoolAbi'
import {UniswapV3OracleLibraryAbi} from '../abis/UniswapV3OracleLibraryAbi'
import { ethers } from "ethers";

export const getUniversalRouterContract = async (
    chainId: string,
) => {
    const chainConfig = config[chainId];
    const rpcUrl = chainConfig.rpcUrl
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(chainConfig.universalRouterAddress, UniversalRouterAbi, provider)
    return contract;
}

export const getUniswapV2RouterContract = async (
    chainId: string,
) => {
    const chainConfig = config[chainId];
    const rpcUrl = chainConfig.rpcUrl
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(chainConfig.uniswapV2RouterAddress, UniswapV2RouterAbi, provider)
    return contract;
}

export const getERC20Contract = async (
    chainId: string,
    tokenAddress: string,
) => {
    const chainConfig = config[chainId];
    const rpcUrl = chainConfig.rpcUrl
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(tokenAddress, ERC20Abi, provider)
    return contract;
}

export const getUniswapV2Contract = async (
    chainId: string,
    pairAddress: string,
) => {
    const chainConfig = config[chainId];
    const rpcUrl = chainConfig.rpcUrl
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(pairAddress, UniswapV2PairAbi, provider)
    return contract;
}

export const getUniswapV2FactoryContract = async (
    chainId: string,
) => {
    const chainConfig = config[chainId];
    const rpcUrl = chainConfig.rpcUrl
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(chainConfig.uniswapV2FactoryAddress, UniswapV2FactoryAbi, provider)
    return contract;
}

export const getUniswapV3FactoryContract = async (
    chainId: string,
) => {
    const chainConfig = config[chainId];
    const rpcUrl = chainConfig.rpcUrl
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(chainConfig.uniswapV3FactoryAddress, UniswapV3FactoryAbi, provider)
    return contract;
}

export const getUniswapV3OracleLibraryContract = async (
    chainId: string,
) => {
    const chainConfig = config[chainId];
    const rpcUrl = chainConfig.rpcUrl
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(chainConfig.uniswapV3OracleLibraryAddress, UniswapV3OracleLibraryAbi, provider)
    return contract;
}