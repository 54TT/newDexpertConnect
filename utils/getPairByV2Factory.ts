import { ethers } from 'ethers';
import { UniswapV2FactoryAbi } from '@abis/UniswapV2FactoryAbi';
import { zeroAddress } from './constants';
interface GetPairByV2FactoryProps {
  token0: string;
  token1: string;
  factoryAddress: string;
  signer: ethers.Signer;
}
export default async function getPairByV2Factory({
  token0,
  token1,
  factoryAddress,
  signer,
}: GetPairByV2FactoryProps) {
  const factoryContract = new ethers.Contract(
    factoryAddress,
    UniswapV2FactoryAbi,
    signer
  );
  console.log(token0, token1);
  const pair = await factoryContract.getPair(token0, token1);
  if (pair === zeroAddress) return null;
  return pair;
}
