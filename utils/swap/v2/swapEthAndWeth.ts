import { BigNumber } from 'ethers';
import { RoutePlanner, CommandType } from '../../planner';
import { config } from '../../../src/config/config';

export const ethToWeth = async (
  planner: RoutePlanner,
  amountIn: BigNumber,
  recipient: string
) => {
  const str = amountIn.toString();
  const wrapEthParams = [recipient, amountIn, false, 0];

  planner.addCommand(CommandType.WRAP_ETH, wrapEthParams, false);
};

export const wethToEth = async (
  chainId: string,
  planner: RoutePlanner,
  tokenIn: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  recipient: string
) => {
  const chainConfig = config[chainId];
  const universalRouterAddress = chainConfig.universalRouterAddress;

  const transferParams = [tokenIn, universalRouterAddress, amountIn];
  planner.addCommand(CommandType.TRANSFER_FROM, transferParams, false);

  const unWrapEthParams = [recipient, amountOutMin];
  planner.addCommand(CommandType.UNWRAP_WETH, unWrapEthParams, false);
};
