import axios from 'axios';
import { DutchOrderBuilder } from '@uniswap/uniswapx-sdk';
import { BigNumber, ethers, Wallet } from 'ethers';
import { createOrder } from './config/client'
import { Order } from './config/types/order'
import {chainConfig} from './constants'
import Permit2ABI from './abi/Permit2ABI.json';
async function buildOrder(
  chainId: number,
  recipient: string,
  inputAmount: BigNumber,
  outputAmount: BigNumber,
  deadlineSeconds: number,
  inputToken: string,
  outputToken: string,
  orderCreator: Wallet
) {
  const config = chainConfig[chainId]
  const reactorAddress = config.reactorAddress
  const permit2Address = config.permit2Address
  const nonce = generateRandomNonce();
  const deadline = Math.round(new Date().getTime() / 1000) + deadlineSeconds;
  const decayStartTime = Math.round(new Date().getTime() / 1000);
  const order = new DutchOrderBuilder(chainId, reactorAddress, permit2Address)
    .deadline(deadline)
    .decayEndTime(deadline)
    .decayStartTime(decayStartTime)
    .swapper(orderCreator.address)
    .nonce(BigNumber.from(nonce))
    .input({
      token: inputToken,
      startAmount: inputAmount.sub(BigNumber.from(1)),
      endAmount: inputAmount,
    })
    .output({
      token: outputToken,
      startAmount: outputAmount,
      endAmount: outputAmount,
      recipient: recipient,
    })
    .build();

  const { domain, types, values } = order.permitData();
  const signature = await orderCreator._signTypedData(domain, types, values);
  const encodedOrder = order.serialize();

  return {
    order,
    payload: { encodedOrder: encodedOrder, signature: signature, chainId },
    nonce,
  };
}

async function submitOrder(order: Order) {
  try {
    const flag = createOrder(order)
    return flag;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

function bitmapPositions(nonce: BigNumber) {
  const wordPos = nonce.shr(8);
  const bitPos = nonce.and(BigNumber.from(0xFF)); // Equivalent to extracting the last 8 bits
  return { wordPos, bitPos };
}

function generateRandomNonce() {
  // TODO: store the prefix bits in an env/config file that is not open-sourced.
  return ethers.BigNumber.from('0x046832')
    .shl(224) // 28 bytes
    .or(ethers.BigNumber.from(ethers.utils.randomBytes(28)))
    .shl(8)
    .toString();
}

async function nonceAnalyze(chainId: number, nonce: string, orderCreator: string) {
  const config = chainConfig[chainId]
  const permit2Address = config.permit2Address
  const provider = config.provider
  const permit2Contract = new ethers.Contract(permit2Address, Permit2ABI, provider);
  const { wordPos, bitPos }: any = bitmapPositions(BigNumber.from(nonce));
  const mask = 1 << bitPos;
  const nonceBitmap = await permit2Contract.nonceBitmap(orderCreator, wordPos);
  return {nonceBitmap, wordPos, bitPos, mask}
}

async function cancelOrder(chainId: number, nonce: string, orderCreator: string){
  const config = chainConfig[chainId]
  const provider = config.provider
  const permit2Address = config.permit2Address
  const permit2Contract = new ethers.Contract(permit2Address, Permit2ABI, provider);
  const { wordPos, bitPos }: any = bitmapPositions(BigNumber.from(nonce));
  const mask = 1 << bitPos;
  await permit2Contract.connect(orderCreator).invalidateUnorderedNonces(wordPos, mask);
}

export {
  buildOrder,
  submitOrder,
  bitmapPositions,
  generateRandomNonce,
  nonceAnalyze,
  cancelOrder
};
