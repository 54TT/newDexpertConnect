import axios from 'axios';
import { config } from '@/config/config.ts';
import {ethers} from 'ethers';
async function getBalance(address: any, id: string): Promise<any> {
  let contractConfig = config[id];
  const provider=new ethers.providers.JsonRpcProvider(contractConfig.rpcUrl);
  
  const isBat = Array.isArray(address);
  // 批量
  if (isBat) {
    const balancesPromise=address.map(async (address)=>{
      const balance=await provider.getBalance(address);
      return{
        account:address,
        balance:balance.toString()
      }
    })

    const balances=await Promise.all(balancesPromise);
    // console.log(balances)
    return balances;



    // const response = await axios.get(
    //   contractConfig.verificationURL,
    //   // id === '1'
    //   //  // ? 'https://api.etherscan.io/api'
    //   //   : 'https://api-sepolia.etherscan.io/api',
    //   {
    //     params: {
    //       module: 'account',
    //       action: 'balancemulti',
    //       // apikey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    //       apikey: contractConfig.verificationApiKey,
    //       address: address.join(','),
    //       tag: 'latest',
    //     },
    //   }
    // ); 
    // console.log(response.data.result);
    
    // return response.data.result;



    // const banlaceMap = result.reduce((prev: any, next: any) => {
    //   const balance =
    //     next.balance === '0' ? '0' : (next.balance / 10 ** 18).toFixed(3);
    //   prev[next.account] = balance;
    //   return prev;
    // }, {});
    // return banlaceMap;
  } else {
    // 单条
    const response = await axios.get(      
      contractConfig.verificationURL,
      // id === '1'
      // //   ? 'https://api.etherscan.io/api'
      //   : 'https://api-sepolia.etherscan.io/api', 
        {
        params: {
        module: 'account',
        action: 'balancemulti',
        // apikey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
        apikey: contractConfig.verificationApiKey,
        address,
        tag: 'latest',
      },
    });
    const balance = (response.data.result[0].balance / 10 ** 18).toFixed(3);
    return { [address]: balance };
  }
}
export default getBalance;
