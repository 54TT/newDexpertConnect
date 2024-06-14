import { UniversalRouterAbi } from '../abis/UniversalRouterAbi';
import { UniswapV2RouterAbi } from '../abis/UniswapV2RouterAbi';
import { ERC20Abi } from '../abis/ERC20Abi';
import { UniswapV2PairAbi } from '../abis/UniswapV2PairAbi';
import { UniswapV2FactoryAbi } from '../abis/UniswapV2FactoryAbi';
import { UniswapV3FactoryAbi } from '../abis/UniswapV3FactoryAbi';
import { UniswapV3OracleLibraryAbi } from '../abis/UniswapV3OracleLibraryAbi';
import { ethers } from 'ethers';
import { QuoterAbi } from '../abis/QuoterAbi';

export const getUniversalRouterContract = async (
  provider: any,
  address: string
) => {
  const contract = new ethers.Contract(address, UniversalRouterAbi, provider);
  return contract;
};

export const getUniswapV2RouterContract = async (
  provider: any,
  address: string
) => {
  const contract = new ethers.Contract(address, UniswapV2RouterAbi, provider);
  return contract;
};

export const getERC20Contract = async (provider: any, address: string) => {
  const contract = new ethers.Contract(address, ERC20Abi, provider);
  return contract;
};

export const getUniswapV2Contract = async (provider: any, address: string) => {
  const contract = new ethers.Contract(address, UniswapV2PairAbi, provider);
  return contract;
};

export const getUniswapV2FactoryContract = async (
  provider: any,
  address: string
) => {
  const contract = new ethers.Contract(address, UniswapV2FactoryAbi, provider);
  return contract;
};

export const getUniswapV3FactoryContract = async (
  provider: any,
  address: string
) => {
  const contract = new ethers.Contract(address, UniswapV3FactoryAbi, provider);
  return contract;
};

export const getUniswapV3OracleLibraryContract = async (
  provider: any,
  address: string
) => {
  const contract = new ethers.Contract(
    address,
    UniswapV3OracleLibraryAbi,
    provider
  );
  return contract;
};
export const getQuoterContract = async (provider: any, address: string) => {
  const contract = new ethers.Contract(address, QuoterAbi, provider);
  return contract;
};
