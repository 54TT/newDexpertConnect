import { BigNumber } from 'ethers';
import { RoutePlanner, CommandType } from '../../planner';
import { config } from '../../../src/config/config';
import { encodePathExactOutput } from '../../utils';

export const erc20ToErc20 = async (
  _: string,
  planner: RoutePlanner,
  tokenIn: string,
  tokenOut: string,
  amountInMax: BigNumber,
  amountOut: BigNumber,
  recipient: string,
  level: number,
  swapType: number,
  uniswapV3Fee: number,
  permit: any,
  signature: string
) => {
  /*     const chainConfig = config[chainId];
    const universalRouterAddress = chainConfig.universalRouterAddress;
    const wethAddress = chainConfig.wethAddress; */

  const permit2PermitParams = [permit, signature];
  planner.addCommand(CommandType.PERMIT2_PERMIT, permit2PermitParams, false);

  let swapPath = [tokenIn, tokenOut];
  const path = encodePathExactOutput(swapPath, [uniswapV3Fee]);

  const payerIsUser = false;
  const swapParams = [
    recipient,
    amountOut,
    amountInMax,
    path,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, swapParams, false);

  const sweepParam = [tokenIn, recipient, 0];
  planner.addCommand(CommandType.SWEEP, sweepParam, false);
};

export const erc20ToETH = async (
  chainId: string,
  planner: RoutePlanner,
  tokenIn: string,
  tokenOut: string,
  amountInMax: BigNumber,
  amountOut: BigNumber,
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
  const path = encodePathExactOutput(swapPath, [uniswapV3Fee]);
  const payerIsUser = false;
  const swapParams = [
    universalRouterAddress,
    amountOut,
    amountInMax,
    path,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, swapParams, false);

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
  amountInMax: BigNumber,
  amountOut: BigNumber,
  recipient: string,
  level: number,
  swapType: number,
  uniswapV3Fee: number
) => {
  console.log('ethToErc20', {
    planner,
    tokenIn,
    tokenOut,
    amountInMax: amountInMax.toString(),
    amountOut: amountOut.toString(),
    recipient,
    level,
    swapType,
    uniswapV3Fee,
  });
  const chainConfig = config[chainId];
  const wethAddress = chainConfig.wethAddress;
  const universalRouterAddress = chainConfig.universalRouterAddress;

  const wrapEthParams = [universalRouterAddress, amountInMax, level, swapType];
  planner.addCommand(CommandType.WRAP_ETH, wrapEthParams, false);

  let swapPath = [tokenIn, tokenOut];
  const path = encodePathExactOutput(swapPath, [uniswapV3Fee]);
  const payerIsUser = false;
  const swapParams = [
    recipient,
    amountOut,
    amountInMax,
    path,
    payerIsUser,
    false,
    swapType,
  ];
  planner.addCommand(CommandType.V3_SWAP_EXACT_OUT, swapParams, false);

  const sweepParams = [wethAddress, recipient, 0];
  planner.addCommand(CommandType.SWEEP, sweepParams, false);
};
