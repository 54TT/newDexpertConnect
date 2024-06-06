import Decimal from 'decimal.js';
import {config} from '../src/config/config'

export const getAmountsIn = (
    chainId: string,
    universalRouterContract: any,
    inAddress: string, 
    outAddress: string,
    outAmount: Decimal, 
    slippage: Decimal, 
    payType: number
) => {
    const chainConfig = config[chainId];
    
    let feeValue = 0;

    if(payType == 0){
    }
}