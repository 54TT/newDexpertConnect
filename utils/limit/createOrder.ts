import { ethers,BigNumber,Wallet,Contract } from "ethers"
import { DutchOrderBuilder } from "@uniswap/uniswapx-sdk";
import {OffChainUniswapXOrderValidator} from "./OffChainUniswapXOrderValidator";
import ERC20ABI from "./ERC20ABI.json";
import {BigNumber as NewBigNumber} from 'bignumber.js';

type OrderValidationResponse = {
  valid: boolean
  errorString?: string
}

export interface Order {
  orderHash: string;
  chainId: number;
  offerer: string;
  filler: string;
  orderStatus: string;
  nonce: string;
  createdAt?: Date;
  updatedAt?: Date;
  fillerAt: number;
  orderType: string;
  side: string;
  input: string;
  outputs: string;
  signature: string;
  reactor: string;
  encodedOrder: string;
  deadline: number;
  inputToken: string;
  inputTokenName: string;
  inputTokenSymbol: string;
  inputTokenDecimals: number;
  outputToken: string;
  outputTokenName: string;
  outputTokenSymbol: string;
  outputTokenDecimals: number;
  orderPrice: string;
}


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
// 获取nonce
function generateRandomNonce() {
  // TODO: store the prefix bits in an env/config file that is not open-sourced.
  return ethers.BigNumber.from('0x046832')
    .shl(224) // 28 bytes
    .or(ethers.BigNumber.from(ethers.utils.randomBytes(28)))
    .shl(8)
    .toString();
}
// 获得payload
async function buildOrder(
  chainId:number,
  recipient:string,
  inputAmount:BigNumber,
  outputAmount:BigNumber,
  deadlineSeconds:number,
  inputToken:string,
  outputToken:string,
  orderCreator:Wallet,
) {
  const config=chainConfig[chainId]
  const reactorAddress=config.reactorAddress
  const permist2Address=config.permit2Address
  const nonce=generateRandomNonce()

  const deadline=Math.round(new Date().getTime()/1000) + deadlineSeconds
  // 未知
  const decayStartTime = Math.round(new Date().getTime() / 1000)
  // 生成荷兰式订单，传入相关参数
  const order=new DutchOrderBuilder(chainId,reactorAddress,permist2Address).
    deadline(deadline)
    .decayEndTime(deadline)
    .decayStartTime(decayStartTime)
    .swapper(orderCreator.address)
    .nonce(BigNumber.from(nonce))
    .input({ token:inputToken,startAmount:inputAmount,endAmount:inputAmount })
    .output({token:outputToken,startAmount:outputAmount,endAmount:outputAmount,recipient:recipient})
    .build()
    console.log("---order---")
    console.log(order)
    const{ domain,types,values }=order.permitData()
    console.log("domain:",domain)
    console.log("types:",types)
    console.log("values:",values)
    const signature=await orderCreator._signTypedData(domain,types,values)
    console.log("signature:"+signature);
    const encodedOrder=order.serialize()
    return{
      order,
      payload:{encodedOrder,signature,chainId},
      nonce
  }
}

export const createOrder = async (
  chainId:number,
  orderCreator:any,
  inputToken:string,
  outputToken:string,
  recipient:string,
  inputAmount:BigNumber,
  outputAmount:BigNumber,
  deadlineSeconds:number,
)=>{
  console.log('---orderCreating---')
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
  // 授权额度
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


  // 构建荷兰式拍卖订单，并获得签名
  console.log('buildOrder')
  const { order ,payload,nonce }=await buildOrder(chainId,recipient,inputAmount,outputAmount,deadlineSeconds,inputToken,outputToken,orderCreator)
  console.log(order);
  console.log(payload);
  console.log(nonce)
  const validationProvider: OffChainUniswapXOrderValidator = new OffChainUniswapXOrderValidator();
  const validationResp: OrderValidationResponse = validationProvider.validate(order);
  if(!validationResp.valid){
    return{
      success: validationResp.valid,
      error: validationResp.errorString
    }
  }


  const orderHash=ethers.utils.solidityKeccak256(
    [
      'address', 'address', 'uint256',  'uint256',
      'address', 'uint256', 'address', 'uint256',
      'uint256', 'address',
    ],
    [
      order.info.reactor,
      order.info.swapper,
      order.info.nonce,
      order.info.deadline,
      order.info.input.token,
      order.info.input.startAmount.toString(),
      order.info.outputs[0].token,
      order.info.outputs[0].startAmount.toString(),
      order.chainId.toString(),
      order.permit2Address
    ]
  )

  const orderParams:Order={
    orderHash:orderHash,
    chainId:chainId,
    offerer:order.info.swapper,
    filler:ethers.constants.AddressZero,
    orderStatus:'open',
    nonce:nonce,
    fillerAt:0,
    orderType:'limit',
    side:'buy',
    input: JSON.stringify(order.info.input),
    outputs: JSON.stringify(order.info.outputs),
    signature:payload.signature,
    reactor: '0xB602027473497f9E26176a1cD0270036c9323C93',
    encodedOrder:payload.encodedOrder,
    deadline:order.info.deadline,
    // decayEndTime:,
    // decayStartTime:,
    inputToken:inputToken,
    inputTokenName: inputTokenName,
    inputTokenSymbol: inputTokenSymbol,
    inputTokenDecimals: inputTokenDecimals.toNumber(),
    orderPrice: new NewBigNumber(1).toString(),
    outputToken:outputToken,
    outputTokenName: outputTokenName,
    outputTokenSymbol: outputTokenSymbol,
    outputTokenDecimals: outputTokenDecimals.toNumber(),
  }

  return orderParams
  
  // return 'test'
}