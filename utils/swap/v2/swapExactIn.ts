import { BigNumber } from 'ethers';
import { RoutePlanner, CommandType } from '../../planner';
import { config } from '../../../src/config/config';
import { getPairAddress } from './getPairAddress';

export const erc20ToErc20 = async (
  chainId: string,
  provider: any,
  planner: RoutePlanner,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  recipient: string,
  isFee: boolean,
  feeType: number
) => {
  const chainConfig = config[chainId];
  const universalRouterAddress = chainConfig.universalRouterAddress;
  const wethAddress = chainConfig.wethAddress;
  const zeroAddress = chainConfig.zeroAddress;
  const uniswapV2FactoryAddress = chainConfig.uniswapV2FactoryAddress;

  const transferParams = [tokenIn, universalRouterAddress, amountIn];
  planner.addCommand(CommandType.TRANSFER_FROM, transferParams, false);

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

  const payerIsUser = false;
  const swapParams = [
    recipient,
    amountIn,
    amountOutMin,
    swapPath,
    payerIsUser,
    isFee,
    feeType,
  ];
  planner.addCommand(CommandType.V2_SWAP_EXACT_IN, swapParams, false);

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
  isFee: boolean,
  feeType: number
) => {
  const chainConfig = config[chainId];
  const universalRouterAddress = chainConfig.universalRouterAddress;

  const transferParams = [tokenIn, universalRouterAddress, amountIn];
  planner.addCommand(CommandType.TRANSFER_FROM, transferParams, false);

  let swapPath = [tokenIn, tokenOut];
  const payerIsUser = false;
  const swapParams = [
    universalRouterAddress,
    amountIn,
    amountOutMin,
    swapPath,
    payerIsUser,
    isFee,
    feeType,
  ];
  planner.addCommand(CommandType.V2_SWAP_EXACT_IN, swapParams, false);

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
  pairAddress: string,
  isFee: boolean,
  feeType: number
) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;

  const wrapEthParams = [pairAddress, amountIn, isFee, feeType];
  planner.addCommand(CommandType.WRAP_ETH, wrapEthParams, false);

  let swapPath = [tokenIn, tokenOut];
  const payerIsUser = true;
  const swapParams = [
    recipient,
    0,
    amountOutMin,
    swapPath,
    payerIsUser,
    false,
    feeType,
  ];
  planner.addCommand(CommandType.V2_SWAP_EXACT_IN, swapParams, false);

  const sweepParams = [ethAddress, recipient, 0];
  planner.addCommand(CommandType.SWEEP, sweepParams, false);
};
