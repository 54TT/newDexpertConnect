import { BigNumber,ethers,Contract,Signer } from "ethers";
import { chainConfig } from './constants'
import orderReactorABI from './DutchOrderReactorABI.json'

const executeOrder = async(
  chainId:number,
  filler:Signer,
  // filler:Wallet,
  encodedOrder:string,
  signature:string,
  value:BigNumber
):Promise<any> =>{
  const config=chainConfig[chainId]
  const provider=config.provider
  const reactorAddress = config.reactorAddress
  const maxFeePerGas: BigNumber = (await provider.getFeeData()).maxFeePerGas?.add(10000) || ethers.utils.parseUnits('100', 'gwei');
  const maxPriorityFeePerGas:BigNumber=maxFeePerGas

  
  try{
    const orderReactor: Contract = new ethers.Contract(reactorAddress, orderReactorABI, provider);
    const populatedTx = await orderReactor.populateTransaction.execute(
    // const response = await orderReactor.connect(filler).execute(
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
  }catch(err){
    console.log(err);
    return err
  }
}



export default executeOrder;