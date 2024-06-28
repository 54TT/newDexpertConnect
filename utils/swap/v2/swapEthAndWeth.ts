import { BigNumber } from 'ethers';
import { RoutePlanner, CommandType } from '../../planner';
import { config } from '@/config/config';

export const ethToWeth = async (
  planner: RoutePlanner,
  amountIn: BigNumber,
  recipient: string
) => {
  const wrapEthParams = [recipient, amountIn, false, 0];

  planner.addCommand(CommandType.WRAP_ETH, wrapEthParams, false);
};

export const wethToEth = async (
  chainId: string,
  planner: RoutePlanner,
  tokenIn: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  recipient: string,
  permit: any,
  signature: string
) => {
  const level = 0;
  const swapType = 0;
  const chainConfig = config[chainId];
  const universalRouterAddress = chainConfig.universalRouterAddress;

  const permit2PermitParams = [permit, signature];
  planner.addCommand(CommandType.PERMIT2_PERMIT, permit2PermitParams, false);

  const transferParams = [
    tokenIn,
    universalRouterAddress,
    amountIn,
    level,
    swapType,
  ];
  planner.addCommand(CommandType.PERMIT2_TRANSFER_FROM, transferParams, false);

  const unWrapEthParams = [recipient, amountOutMin];
  planner.addCommand(CommandType.UNWRAP_WETH, unWrapEthParams, false);
};
