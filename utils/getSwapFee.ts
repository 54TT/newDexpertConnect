import { config } from '../src/config/config';
import { getUniversalRouterContract } from './contracts';
import Decimal from 'decimal.js';
export const getSwapFee = async ({ chainId, provider, payType, swapType }) => {
  let fee = new Decimal(0);

  if (payType == 0) {
    const { universalRouterAddress } = config[chainId];
    const universalRouterContract = await getUniversalRouterContract(
      provider,
      universalRouterAddress
    );
    const level = payType == 0 ? 1 : 0;
    const fastTradeFeeBps = await universalRouterContract.feeBps(
      level,
      swapType
    );

    const feeBaseBps = await universalRouterContract.feeBaseBps();
    fee = new Decimal(fastTradeFeeBps / feeBaseBps);
  }
  return fee;
};
