import { DutchOrder, OrderType, UniswapXOrderParser } from '@uniswap/uniswapx-sdk'
import { ORDER_STATUS, UniswapXOrderEntity,OrderValidationResponse,CreateOrderResponse } from './entities'
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import ERC20ABI from "./abi/ERC20ABI.json";
import { buildOrder, submitOrder } from "./index";
import {OffChainUniswapXOrderValidator} from "./OffChainUniswapXOrderValidator";

import { Order } from './config/types/order'
import {BigNumber as NewBigNumber} from 'bignumber.js';
import { ChainIdType, chainConfig } from './constants'
import orderReactorABI from "./abi/DutchOrderReactorABI.json"
export const DUTCH_LIMIT = 'DutchLimit'
type ParsedOrder = {
  encodedOrder: string
  signature: string
  orderHash: string
  orderStatus: ORDER_STATUS
  swapper: string
  createdAt: number
  chainId: number
  filler?: string
  quoteId?: string
  orderType?: string
}

export const formatOrderEntity = (
  decodedOrder: DutchOrder,
  signature: string,
  orderType: OrderType.Dutch | OrderType.Dutch_V2 | OrderType.Limit,
  orderStatus: ORDER_STATUS,
  quoteId?: string
): UniswapXOrderEntity => {
  const { input, outputs } = decodedOrder.info
  const order: UniswapXOrderEntity = {
    type: orderType,
    encodedOrder: decodedOrder.serialize(),
    signature,
    nonce: decodedOrder.info.nonce.toString(),
    orderHash: decodedOrder.hash().toLowerCase(),
    chainId: decodedOrder.chainId,
    orderStatus: orderStatus,
    offerer: decodedOrder.info.swapper.toLowerCase(),
    input: {
      token: input.token,
      startAmount: input.startAmount.toString(),
      endAmount: input.endAmount.toString(),
    },
    outputs: outputs.map((output) => ({
      token: output.token,
      startAmount: output.startAmount.toString(),
      endAmount: output.endAmount.toString(),
      recipient: output.recipient.toLowerCase(),
    })),
    reactor: decodedOrder.info.reactor.toLowerCase(),
    decayStartTime: decodedOrder.info.decayStartTime,
    decayEndTime: decodedOrder.info.deadline,
    deadline: decodedOrder.info.deadline,
    filler: decodedOrder.info?.exclusiveFiller?.toLowerCase(),
    ...(quoteId && { quoteId: quoteId }),
  }

  return order
}

export const createOrder = async (
  chainId: number,
  orderCreator: Wallet,
  inputToken: string, 
  outputToken: string,
  recipient: string,
  inputAmount: BigNumber,
  outputAmount: BigNumber,
  deadlineSeconds: number
): Promise<CreateOrderResponse> => {
  const config = chainConfig[chainId]
  const provider = config.provider
  const permit2Address = config.permit2Address
  const reactorAddress = config.reactorAddress
  const inputTokenContract: Contract = new ethers.Contract(inputToken, ERC20ABI, provider).connect(orderCreator);
  const outputTokenContract: Contract = new ethers.Contract(outputToken, ERC20ABI, provider).connect(orderCreator);
  
  const inputTokenName = await inputTokenContract.name();
  const inputTokenSymbol = await inputTokenContract.symbol();
  const inputTokenDecimals = await inputTokenContract.decimals();

  const outputTokenName = await outputTokenContract.name();
  const outputTokenSymbol = await outputTokenContract.symbol();
  const outputTokenDecimals = await outputTokenContract.decimals();

  const inputPermit2Allowance: BigNumber = await inputTokenContract.allowance(orderCreator.address, permit2Address);
  const outputPermit2Allowance: BigNumber = await outputTokenContract.allowance(orderCreator.address, permit2Address);
  const inputReactorAllowance: BigNumber = await inputTokenContract.allowance(orderCreator.address, reactorAddress);
  const outputReactorAllowance: BigNumber = await outputTokenContract.allowance(orderCreator.address, reactorAddress);

  if (inputPermit2Allowance.lt(ethers.constants.MaxUint256.div(2))) {
      await inputTokenContract.approve(permit2Address, ethers.constants.MaxUint256);
  }
  if (outputPermit2Allowance.lt(ethers.constants.MaxUint256.div(2))) {
      await outputTokenContract.approve(permit2Address, ethers.constants.MaxUint256);
  }
  if (inputReactorAllowance.lt(ethers.constants.MaxUint256.div(2))) {
      await inputTokenContract.approve(reactorAddress, ethers.constants.MaxUint256);
  }
  if (outputReactorAllowance.lt(ethers.constants.MaxUint256.div(2))) {
      await outputTokenContract.approve(reactorAddress, ethers.constants.MaxUint256);
  }

  const { order, payload, nonce } = await buildOrder(chainId, recipient, inputAmount, outputAmount, deadlineSeconds, inputToken, outputToken, orderCreator);
  console.log("nonce:",nonce)
  const validationProvider: OffChainUniswapXOrderValidator = new OffChainUniswapXOrderValidator();
  const validationResp: OrderValidationResponse = validationProvider.validate(order);
  if(!validationResp.valid){
    return {
      success: validationResp.valid,
      error: validationResp.errorString
    }
  }
  const orderHash: string = ethers.utils.solidityKeccak256(
      [
          'address', 'address', 'uint256', 'uint256', 'address', 'bytes',
          'uint256', 'uint256', 'address', 'uint256', 'address', 'uint256',
          'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address'
      ],
      [
          order.info.reactor,
          order.info.swapper,
          order.info.nonce,
          order.info.deadline,
          order.info.additionalValidationContract,
          order.info.additionalValidationData,
          order.info.decayStartTime,
          order.info.decayEndTime,
          order.info.exclusiveFiller,
          order.info.exclusivityOverrideBps,
          order.info.input.token,
          order.info.input.startAmount.toString(),
          order.info.input.endAmount.toString(),
          order.info.outputs[0].token,
          order.info.outputs[0].startAmount.toString(),
          order.info.outputs[0].endAmount.toString(),
          order.chainId.toString(),
          order.permit2Address
      ]
  );
  
  const newOrder: Order = {
      orderHash: orderHash,
      chainId: chainId,
      offerer: order.info.swapper,
      filler: ethers.constants.AddressZero,
      orderStatus: ORDER_STATUS.OPEN,
      nonce: nonce,
      fillerAt: 0,
      orderType: 'limit',
      side: 'buy',
      input: JSON.stringify(order.info.input),
      outputs: JSON.stringify(order.info.outputs),
      signature: payload.signature,
      reactor: reactorAddress,
      encodedOrder: payload.encodedOrder,
      deadline: order.info.deadline,
      decayEndTime: order.info.decayEndTime,
      decayStartTime: order.info.decayStartTime,
      inputToken: inputToken,
      inputTokenName: inputTokenName,
      inputTokenSymbol: inputTokenSymbol,
      inputTokenDecimals: inputTokenDecimals.toNumber(),
      orderPrice: new NewBigNumber(1).toString(),
      outputToken: outputToken,
      outputTokenName: outputTokenName,
      outputTokenSymbol: outputTokenSymbol,
      outputTokenDecimals: outputTokenDecimals.toNumber(),
  }
      
  // Uncomment the following line to submit the order
  const response = await submitOrder(newOrder);
  const result: CreateOrderResponse = {
    success: response
  }
  return result
}


export const executeOrder =  async(
  chainId: number, 
  filler: Wallet, 
  encodedOrder: string, 
  signature: string, 
  value: BigNumber
): Promise<any>  => {
  const config = chainConfig[chainId]
  const provider = config.provider
  const reactorAddress = config.reactorAddress
  const maxFeePerGas: BigNumber = (await provider.getFeeData()).maxFeePerGas?.add(10000) || ethers.utils.parseUnits('100', 'gwei');
  const maxPriorityFeePerGas: BigNumber = maxFeePerGas;

  const orderReactor: Contract = new ethers.Contract(reactorAddress, orderReactorABI, provider);
  const populatedTx = await orderReactor.populateTransaction.execute(
      {
          order: encodedOrder,
          sig: signature,
      },
      {
          gasLimit: BigNumber.from(700_000),
          ...(maxFeePerGas && { maxFeePerGas }),
          maxPriorityFeePerGas,
          value,
      }
  );
  populatedTx.gasLimit = BigNumber.from(700_000);

  const tx = await filler.sendTransaction(populatedTx);
  const receipt = await tx.wait();
  return receipt;
}
