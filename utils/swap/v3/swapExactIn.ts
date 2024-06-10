import { BigNumber } from 'ethers';
import { RoutePlanner, CommandType } from '../../planner'
import { config } from '../../../src/config/config';
import { encodePathExactInput } from '../../utils'

export const erc20ToErc20 = async (
    chainId: string,
    planner: RoutePlanner,
    tokenIn: string,
    tokenOut: string,
    amountIn: BigNumber,
    amountOutMin: BigNumber,
    recipient: string,
    isFee: boolean,
    feeType: number,
    uniswapV3Fee: number,
) => {
    const chainConfig = config[chainId];
    const universalRouterAddress = chainConfig.universalRouterAddress;

    const transferParams = [tokenIn, universalRouterAddress, amountIn]
    planner.addCommand(CommandType.TRANSFER_FROM, transferParams, false)

    let swapPath = [tokenIn, tokenOut]

    const path = encodePathExactInput(swapPath, [uniswapV3Fee])
    
    const payerIsUser = false;
    const swapParams = [recipient, amountIn, amountOutMin, path, payerIsUser, isFee, feeType]
    planner.addCommand(CommandType.V3_SWAP_EXACT_IN, swapParams, false)

    const sweepParam = [tokenIn, recipient, 0]
    planner.addCommand(CommandType.SWEEP, sweepParam, false)
}

export const erc20ToETH = async (
    chainId: string,
    planner: RoutePlanner,
    tokenIn: string,
    tokenOut: string,
    amountIn: BigNumber,
    amountOutMin: BigNumber,
    recipient: string,
    isFee: boolean,
    feeType: number,
    uniswapV3Fee: number,
) => {
    const chainConfig = config[chainId];
    const universalRouterAddress = chainConfig.universalRouterAddress;

    const transferParams = [tokenIn, universalRouterAddress, amountIn]
    planner.addCommand(CommandType.TRANSFER_FROM, transferParams, false)

    let swapPath = [tokenIn, tokenOut]
    const path = encodePathExactInput(swapPath, [uniswapV3Fee])
    const payerIsUser = false;
    const swapParams = [universalRouterAddress, amountIn, amountOutMin, path, payerIsUser, isFee, feeType]
    planner.addCommand(CommandType.V3_SWAP_EXACT_IN, swapParams, false)

    const unWrapEthParams = [recipient, 0]
    planner.addCommand(CommandType.UNWRAP_WETH, unWrapEthParams, false)

    const sweepParams = [tokenIn, recipient, 0]
    planner.addCommand(CommandType.SWEEP, sweepParams, false)
}

export const ethToErc20 = async (
    chainId: string,
    planner: RoutePlanner,
    tokenIn: string,
    tokenOut: string,
    amountIn: BigNumber,
    amountOutMin: BigNumber,
    recipient: string,
    pairAddress: string,
    isFee: boolean,
    feeType: number,
    uniswapV3Fee: number,
) => {
    const chainConfig = config[chainId];
    const ethAddress = chainConfig.ethAddress;

    const wrapEthParams = [pairAddress, amountIn, isFee, feeType]
    planner.addCommand(CommandType.WRAP_ETH, wrapEthParams, false)

    let swapPath = [tokenIn, tokenOut]
    const path = encodePathExactInput(swapPath, [uniswapV3Fee])
    const payerIsUser = true;
    const swapParams = [recipient, 0, amountOutMin, path, payerIsUser, false, feeType]
    planner.addCommand(CommandType.V2_SWAP_EXACT_IN, swapParams, false)

    const sweepParams = [ethAddress, recipient, 0]
    planner.addCommand(CommandType.SWEEP, sweepParams, false)
}

