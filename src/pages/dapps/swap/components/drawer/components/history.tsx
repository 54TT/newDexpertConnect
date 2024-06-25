// import { ethers } from 'ethers';
import {  useEffect } from 'react';
// import { CountContext } from '@/Layout.tsx';
export default function history() {
  // const { provider }: any = useContext(CountContext);
  const getAddress = async () => {
    //   获取address
    // const signer = await web3Provider.getSigner();
    // const signerAddress = await signer.getAddress();
    // console.log(signerAddress);
    
    // const daiContract = new ethers.Contract(
    //   '0x3956A4C059EE801Ff866f775958D542f78B01052',
    //   UniversalRouterAbi,
    //   provider
    // );
    // console.log(daiContract);
    //   转账次数
    // const txCount = await provider.getTransactionCount(
    //   '0x3956A4C059EE801Ff866f775958D542f78B01052'
    // );
    //   最新区块
    // const txCountaa = await provider.getBlockNumber();
    // console.log(txCountaa);
    // console.log(txCount);
    // //  获取  topic  ERC20Abi
    // const filterFrom = daiContract.filters.Transfer('0x3956A4C059EE801Ff866f775958D542f78B01052')
    // console.log(filterFrom);
    // //  获取  topic  UniversalRouterAbi
    // const tts = await daiContract.filters.OwnershipTransferred(
    //   '0x3956A4C059EE801Ff866f775958D542f78B01052'
    // );
    // if (tts?.topics) {
    //   console.log(tts?.topics);
    //   //  获取历史记录
    //   const ogsFrom = await daiContract.queryFilter(tts);
    //   console.log(ogsFrom);
    //   let filter = {
    //     address: '0xf44F6b6dbfF8E145646F5A042ff3346dEF8fEE19',
    //     fromBlock: 6176542,
    //     toBlock: txCountaa,
        // topics: tts?.topics,
      // };
      //  获取历史记录
    //   const txCountsdsad = await provider.getLogs(filter);
    //   console.log(txCountsdsad);
    // }
    // const txCounsad = await provider.getTransaction(
    //   '0x3956A4C059EE801Ff866f775958D542f78B01052'
    // );
    // console.log(txCounsad);
    // console.log(txCountsdsad);
  };

  useEffect(() => {
    getAddress();
  }, []);

  return <div></div>;
}
