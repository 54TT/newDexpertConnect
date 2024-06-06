import Decimal from 'decimal.js';
import {RoutePlanner, CommandType} from './planner'
import { config } from '../src/config/config';

export const erc20ToErc20 = async (
    chainId: string,
    tokenIn: string,
    tokenOut: string,
    amountIn: Decimal,
    amountOutMin: Decimal,
    recipient: string,
    isFee: boolean,
    feeType: number
  ) => {
    const chainConfig = config[chainId];
    const universalRouterAddress = chainConfig.universalRouterAddress;
    const wethAddress = chainConfig.wethAddress;
    const planner = new RoutePlanner()

    const transferParams = [tokenIn, universalRouterAddress, amountIn]
    planner.addCommand(CommandType.TRANSFER_FROM, transferParams, false)

    let swapPath = [""]
    if (tokenIn.toLowerCase() === wethAddress.toLowerCase && tokenOut.toLowerCase() === wethAddress.toLowerCase) {
        swapPath = [tokenIn, wethAddress, tokenOut]
    } else {
        swapPath = [tokenIn, tokenOut]
    }

    const payerIsUser = false;
    const swapParams = [recipient, amountIn, amountOutMin, swapPath, payerIsUser, isFee, feeType]
    planner.addCommand(CommandType.V2_SWAP_EXACT_IN, swapParams, false)

    const sweepParam = [tokenIn, recipient, 0]
    planner.addCommand(CommandType.SWEEP, sweepParam, false)

    return planner
  }