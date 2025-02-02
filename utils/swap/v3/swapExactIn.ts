import { BigNumber } from 'ethers';
import { RoutePlanner, CommandType } from '../../planner';
import { config } from '../../../src/config/config';
import { encodePathExactInput } from '../../utils';

export const erc20ToErc20 = async (
  _,
  planner: RoutePlanner,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  recipient: string,
  level: number,
  swapType: number,
  uniswapV3Fee: number,
  permit: any,
  signature: string
) => {
  const permit2PermitParams = [permit, signature];
  planner.addCommand(CommandType.PERMIT2_PERMIT, permit2PermitParams, false);
  let swapPath = [tokenIn, tokenOut];

  const path = encodePathExactInput(swapPath, [uniswapV3Fee]);

  const payerIsUser = true;
  const swapParams = [
    recipient,
    amountIn,
    amountOutMin,
    path,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V3_SWAP_EXACT_IN, swapParams, false);

  const sweepParam = [tokenIn, recipient, 0];
  planner.addCommand(CommandType.SWEEP, sweepParam, false);
};

export const erc20ToETH = async (
  chainId: string,
  planner: RoutePlanner,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  recipient: string,
  level: number,
  swapType: number,
  uniswapV3Fee: number,
  permit: any,
  signature: string
) => {
  const chainConfig = config[chainId];
  const universalRouterAddress = chainConfig.universalRouterAddress;

  const permit2PermitParams = [permit, signature];
  planner.addCommand(CommandType.PERMIT2_PERMIT, permit2PermitParams, false);

  let swapPath = [tokenIn, tokenOut];
  const path = encodePathExactInput(swapPath, [uniswapV3Fee]);
  const payerIsUser = true;
  const swapParams = [
    universalRouterAddress,
    amountIn,
    amountOutMin,
    path,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V3_SWAP_EXACT_IN, swapParams, false);

  const unWrapEthParams = [recipient, 0];
  planner.addCommand(CommandType.UNWRAP_WETH, unWrapEthParams, false);

  const sweepParams = [tokenIn, recipient, 0];
  planner.addCommand(CommandType.SWEEP, sweepParams, false);
};

export const ethToErc20 = async (
  chainId: string,
  planner: RoutePlanner,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  recipient: string,
  level: number,
  swapType: number,
  uniswapV3Fee: number
) => {
  const chainConfig = config[chainId];
  const wethAddress = chainConfig.wethAddress;
  const universalRouterAddress = chainConfig.universalRouterAddress;
  const wrapEthParams = [universalRouterAddress, amountIn, 0, swapType];
  planner.addCommand(CommandType.WRAP_ETH, wrapEthParams, false);

  let swapPath = [tokenIn, tokenOut];
  const path = encodePathExactInput(swapPath, [uniswapV3Fee]);
  const payerIsUser = false;
  const swapParams = [
    recipient,
    amountIn,
    amountOutMin,
    path,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V3_SWAP_EXACT_IN, swapParams, false);

  const sweepParams = [wethAddress, recipient, 0];
  planner.addCommand(CommandType.SWEEP, sweepParams, false);
};
