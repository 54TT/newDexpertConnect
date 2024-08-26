import { BigNumber,ethers,Contract,Signer } from "ethers";
import { chainConfig } from './constants'
import orderReactorABI from '@abis/DutchOrderReactorABI.json'
import { config as allConfig } from "@/config/config";
import ERC20ABI from "@abis/ERC20ABI.json";





const executeOrder = async(
  chainId:number,
  filler:Signer,
  // filler:Wallet,
  encodedOrder:string,
  signature:string,
  outputToken:string,
  tokenAmount:BigNumber,
  value:BigNumber
):Promise<any> =>{
  const config=chainConfig[chainId]
  const provider=config.provider
  const reactorAddress = config.reactorAddress
  const permit2Address = config.permit2Address
  const zeroConfig=allConfig[chainId]
  const maxFeePerGas: BigNumber = (await provider.getFeeData()).maxFeePerGas?.add(10000) || ethers.utils.parseUnits('100', 'gwei');
  const maxPriorityFeePerGas:BigNumber=maxFeePerGas

  // 授权询问
  let outputTokenContract: Contract
  let outputPermit2Allowance: BigNumber
  let outputReactorAllowance: BigNumber

  const outputTokenToLowerCase = outputToken.toLowerCase();
  const zeroAddress=zeroConfig.zeroAddress.toLowerCase()


  if(outputTokenToLowerCase!==zeroAddress){
    outputTokenContract = new ethers.Contract(outputToken, ERC20ABI, provider).connect(filler);

    
    outputPermit2Allowance = await outputTokenContract.allowance(filler.getAddress(), permit2Address);


    outputReactorAllowance = await outputTokenContract.allowance(filler.getAddress(), reactorAddress);

    
    if (outputReactorAllowance.lt(tokenAmount)) {
      const tx= await outputTokenContract.approve(reactorAddress,tokenAmount);
      await tx.wait()
    }
    if (outputPermit2Allowance.lt(tokenAmount)) {
      const tx= await outputTokenContract.approve(permit2Address,tokenAmount);
      await tx.wait()
    }
  }



  try{
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

    // if(outputTokenToLowerCase!==zeroAddress&&uu
      const tx = await filler.sendTransaction(populatedTx);
      const receipt = await tx.wait();
      return receipt;
    
    // const tx = await filler.sendTransaction(populatedTx);
    // const receipt = await tx.wait();
    // return receipt;
  }catch(err){
    return null
  }
}



export default executeOrder;