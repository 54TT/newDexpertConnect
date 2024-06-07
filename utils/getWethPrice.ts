import { BigNumber } from 'ethers';
import { config } from '../src/config/config';
import { getERC20Contract, getUniswapV2Contract } from './contracts';

export const getWethPrice = async (chainId: string) => {
  const chainConfig = config[chainId];
  const ethAddress = chainConfig.ethAddress;
  const wethAddress = chainConfig.wethAddress;
  const wethDecimal = chainConfig.wethDecimal;
  const usdtDecimal = chainConfig.usdtDecimal;
  const wethUsdtPairAddress = chainConfig.wethUsdtPairAddress;

  const wethUsdtPairContract = await getUniswapV2Contract(
    chainId,
    wethUsdtPairAddress
  );

  const wethUsdtPairToken0 = await wethUsdtPairContract.token0();

  const wethUsdtPairToken1 = await wethUsdtPairContract.token1();

  console.log("wethUsdtPairToken0:",wethUsdtPairToken0)
  const wethUsdtReserves = await wethUsdtPairContract.getReserves();

  console.log("wethUsdtReserves:",wethUsdtReserves)
  let wethPrice = BigNumber.from(0);
  if (wethUsdtPairToken0.toLowerCase() === wethAddress.toLowerCase() && wethUsdtPairToken1.toLowerCase() !== wethAddress.toLowerCase()) {
      const usdtReserves = BigNumber.from(wethUsdtReserves[1].toString())
      .div(BigNumber.from(10 ** usdtDecimal))
      const wethReserves = BigNumber.from(wethUsdtReserves[0].toString())
      .div(BigNumber.from(10 ** wethDecimal)).toString()
      wethPrice = usdtReserves.div(wethReserves);
  } else if  (wethUsdtPairToken0.toLowerCase() !== wethAddress.toLowerCase() && wethUsdtPairToken1.toLowerCase() === wethAddress.toLowerCase()) {
    const usdtReserves = BigNumber.from(wethUsdtReserves[0].toString())
    .div(BigNumber.from(10 ** usdtDecimal))
    const wethReserves = BigNumber.from(wethUsdtReserves[1].toString())
    .div(BigNumber.from(10 ** wethDecimal)).toString()
    wethPrice = usdtReserves.div(wethReserves);
  } else {
    wethPrice = BigNumber.from(0)
  }
  return wethPrice.toString();
};
