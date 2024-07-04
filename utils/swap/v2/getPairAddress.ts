import { getUniswapV2FactoryContract } from '@/../utils/contracts';
export const getPairAddress = async (
  provider: any,
  uniswapV2FactoryAddress: string,
  token0Address: string,
  token1Address: string
) => {
  const uniswapV2FactoryContract = await getUniswapV2FactoryContract(
    provider,
    uniswapV2FactoryAddress
  );

  const pairAddress = await uniswapV2FactoryContract.getPair(
    token0Address,
    token1Address
  );

  return pairAddress;
};
