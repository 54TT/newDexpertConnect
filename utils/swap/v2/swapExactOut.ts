import { BigNumber } from 'ethers';
import { RoutePlanner, CommandType } from '../../planner';
import { config } from '../../../src/config/config';
import { getPairAddress } from './getPairAddress';
import { zeroAddress } from '@utils/constants';

export const erc20ToErc20 = async (
  chainId: string,
  provider: any,
  planner: RoutePlanner,
  tokenIn: string,
  tokenOut: string,
  amountInMax: BigNumber,
  amountOut: BigNumber,
  recipient: string,
  level: number,
  swapType: number,
  permit: any,
  signature: string
) => {
  const chainConfig = config[chainId];
  const wethAddress = chainConfig.wethAddress;
  const uniswapV2FactoryAddress = chainConfig.uniswapV2FactoryAddress;

  const permit2PermitParams = [permit, signature];
  planner.addCommand(CommandType.PERMIT2_PERMIT, permit2PermitParams, false);

  let swapPath = [''];
  if (
    tokenIn.toLowerCase() !== wethAddress.toLowerCase &&
    tokenOut.toLowerCase() !== wethAddress.toLowerCase
  ) {
    const pairAddress = await getPairAddress(
      provider,
      uniswapV2FactoryAddress,
      tokenIn,
      tokenOut
    );
    if (pairAddress.toLowerCase() === zeroAddress.toLowerCase()) {
      swapPath = [tokenIn, wethAddress, tokenOut];
    } else {
      swapPath = [tokenIn, tokenOut];
    }
  } else {
    swapPath = [tokenIn, tokenOut];
  }

  const payerIsUser = true;
  const swapParams = [
    recipient,
    amountOut,
    amountInMax,
    swapPath,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, swapParams, false);

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
  permit: any,
  signature: string
) => {
  const chainConfig = config[chainId];
  const universalRouterAddress = chainConfig.universalRouterAddress;

  const permit2PermitParams = [permit, signature];
  planner.addCommand(CommandType.PERMIT2_PERMIT, permit2PermitParams, false);

  let swapPath = [tokenIn, tokenOut];
  const payerIsUser = true;
  const swapParams = [
    universalRouterAddress,
    amountOut,
    amountInMax,
    swapPath,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, swapParams, false);

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
  swapType: number
) => {
  const { wethAddress, universalRouterAddress } = config[chainId];
  const wrapEthParams = [universalRouterAddress, amountInMax, 0, swapType];
  planner.addCommand(CommandType.WRAP_ETH, wrapEthParams, false);
  let swapPath = [tokenIn, tokenOut];
  const payerIsUser = false;
  const swapParams = [
    recipient,
    amountOut,
    amountInMax,
    swapPath,
    payerIsUser,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.V2_SWAP_EXACT_OUT, swapParams, false);

  const sweepParams = [wethAddress, recipient, 0];
  planner.addCommand(CommandType.SWEEP, sweepParams, false);
};
