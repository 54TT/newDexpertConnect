import { getUniswapV3FactoryContract } from '../../contracts';

export const getPools = async (
  provider: any,
  uniswapV3FactoryAddress: string,
  uniswapV3FeeAmounts: number[],
  token0Address: string,
  token1Address: string
) => {
  const uniswapV3FactoryContract = await getUniswapV3FactoryContract(
    provider,
    uniswapV3FactoryAddress
  );

  const pools: any = new Array(0);

  for (const feeAmount of uniswapV3FeeAmounts) {
    const poolAddress = await uniswapV3FactoryContract.getPool(
      token0Address,
      token1Address,
      feeAmount
    );
    if ('0x0000000000000000000000000000000000000000' !== poolAddress) {
      pools.push({ address: poolAddress, fee: feeAmount });
    }
  }
  return pools;
};
