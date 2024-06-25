import { config } from '../src/config/config';
import { getUniversalRouterContract } from './contracts';
import Decimal from 'decimal.js';
export const getSwapFee = async ({ chainId, provider, payType }) => {
  let fee = new Decimal(0);

  if (payType == 0) {
    const { universalRouterAddress } = config[chainId];
    const universalRouterContract = await getUniversalRouterContract(
      provider,
      universalRouterAddress
    );
    console.log(universalRouterAddress);

    const fastTradeFeeBps = await universalRouterContract.fastTradeFeeBps();
    console.log(fastTradeFeeBps);

    const feeBaseBps = await universalRouterContract.feeBaseBps();
    console.log(feeBaseBps);
    fee = new Decimal(fastTradeFeeBps / feeBaseBps);
  }
  return fee;
};
