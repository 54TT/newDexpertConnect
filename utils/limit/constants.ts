import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'

const WEBHOOK_CONFIG_BUCKET: string = 'order-webhook-notification-config';
const PRODUCTION_WEBHOOK_CONFIG_KEY: string = 'production.json';
const BETA_WEBHOOK_CONFIG_KEY: string = 'beta.json';
const NATIVE_ADDRESS: string = '0x0000000000000000000000000000000000000000';
const ONE_HOUR_IN_SECONDS: number = 60 * 60;
const ONE_DAY_IN_SECONDS: number = 60 * 60 * 24;
const ONE_YEAR_IN_SECONDS: number = 60 * 60 * 24 * 365;

// 定义 ChainId 类型
export type ChainIdType = {
    MAINNET: number;
    OPTIMISM: number;
    ARBITRUM_ONE: number;
    POLYGON: number;
    SEPOLIA: number;
  };

// 定义 ChainId 对象
const ChainId: ChainIdType = {
    MAINNET: 1,
    OPTIMISM: 10,
    ARBITRUM_ONE: 42161,
    POLYGON: 137,
    SEPOLIA: 11155111,
  };
  
  // 如果你更新 SUPPORTED_CHAINS，请确保添加相应的 RPC_${chainId} 环境变量。
  // lib/config.py 将要求它被定义。
  const SUPPORTED_CHAINS: number[] = [
    ChainId.MAINNET,
    ChainId.POLYGON,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_ONE
  ];

// Dynamo limits batch write to 25
const DYNAMO_BATCH_WRITE_MAX: number = 25;


const chainConfig: { [key: number]: any } = {
    11155111: {
        rpc: "https://ethereum-sepolia-rpc.publicnode.com",
        provider: new ethers.providers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com"),
        // reactorAddress: "0x082936Aa56ED2314B9fe76a658c6119A5D27d9c6",
        // reactorAddress: "0xc75034befaea8c2286616eda3e4e699da6b9daa9",
        reactorAddress: "0xB602027473497f9E26176a1cD0270036c9323C93",
        permit2Address: "0x000000000022d473030f116ddee9f6b43ac78ba3"
    }
}

export enum OrderType {
  Dutch = "Dutch",
  Relay = "Relay",
  Dutch_V2 = "Dutch_V2",
  Limit = "Limit",
}

export const BPS = 10000;

export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'

export const MaxUint48 = BigNumber.from('0xffffffffffff')
export const MaxUint160 = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffff')
export const MaxUint256 = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

// alias max types for their usages
// allowance transfer types
export const MaxAllowanceTransferAmount = MaxUint160
export const MaxAllowanceExpiration = MaxUint48
export const MaxOrderedNonce = MaxUint48

// signature transfer types
export const MaxSignatureTransferAmount = MaxUint256
export const MaxUnorderedNonce = MaxUint256
export const MaxSigDeadline = MaxUint256

export const InstantExpiration: BigNumber = BigNumber.from(0)

export {
    WEBHOOK_CONFIG_BUCKET,
    PRODUCTION_WEBHOOK_CONFIG_KEY,
    BETA_WEBHOOK_CONFIG_KEY,
    NATIVE_ADDRESS,
    ONE_HOUR_IN_SECONDS,
    ONE_DAY_IN_SECONDS,
    ONE_YEAR_IN_SECONDS,
    DYNAMO_BATCH_WRITE_MAX,
    ChainId, 
    SUPPORTED_CHAINS,
    chainConfig
};
