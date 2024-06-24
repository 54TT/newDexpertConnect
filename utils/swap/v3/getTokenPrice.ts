const BigNumber = require('bignumber.js');
const uniswapV3PoolAbi = require('../../../abis/UniswapV3PoolAbi');
const ERC20Abi = require('../../../abis/ERC20Abi');
const { ethers } = require('ethers');

export const getPrice = async (providers: any, poolAddress: string) => {
  const poolContract = new ethers.Contract(
    poolAddress,
    uniswapV3PoolAbi,
    providers
  );
  const slot0 = await poolContract.slot0();
  const sqrtPriceX96Bn = new BigNumber(slot0.sqrtPriceX96.toString());
  const denominator = new BigNumber(2).pow(192);

  const token0Address = await poolContract.token0();
  const token1Address = await poolContract.token1();

  const token0Contract = new ethers.Contract(
    token0Address,
    ERC20Abi,
    providers
  );
  const token1Contract = new ethers.Contract(
    token1Address,
    ERC20Abi,
    providers
  );

  const decimals0 = await token0Contract.decimals();
  const decimals1 = await token1Contract.decimals();

  let price = sqrtPriceX96Bn.pow(2).div(denominator);

  const decimals = Math.abs(decimals0 - decimals1);

  const factor = new BigNumber(10).pow(new BigNumber(decimals.toString()));

  price = price.times(factor);
  return price;
};
