import axios from 'axios';
async function getBalance(address: any): Promise<any> {
  const isBat = Array.isArray(address);
  // 批量
  if (isBat) {
    const response = await axios.get('https://api-sepolia.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'balancemulti',
        apikey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
        address: address.join(','),
        tag: 'latest',
      },
    });
    return response.data.result;
    // const banlaceMap = result.reduce((prev: any, next: any) => {
    //   const balance =
    //     next.balance === '0' ? '0' : (next.balance / 10 ** 18).toFixed(3);
    //   prev[next.account] = balance;
    //   return prev;
    // }, {});
    // return banlaceMap;
  } else {
    // 单条
    const response = await axios.get('https://api-sepolia.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'balancemulti',
        apikey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
        address,
        tag: 'latest',
      },
    });
    const balance = (response.data.result[0].balance / 10 ** 18).toFixed(3);
    return { [address]: balance };
  }
}
export default getBalance;
