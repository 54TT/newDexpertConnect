import Decimal from 'decimal.js';
import {config} from '../src/config/config'
import {UniversalRouterAbi} from '../abis/UniversalRouterAbi'
import { ethers } from "ethers";

export const getUniversalRouterContract = (
    chainId: string,
    rpcUrl: string,
) => {
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const chainConfig = config[chainId];
    const contract = new ethers.Contract(chainConfig.universalRouterAddress, UniversalRouterAbi, provider)
    return contract;
}