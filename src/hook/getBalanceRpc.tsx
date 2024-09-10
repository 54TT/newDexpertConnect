import { zeroAddress } from '../../utils/constants';
import Decimal from 'decimal.js';
import { client } from '../client';
import { useContext } from 'react';
import { getContract } from 'thirdweb';
import { useWalletBalance } from 'thirdweb/react';
import { useActiveAccount } from 'thirdweb/react';
import { CountContext } from '@/Layout.tsx';
import { ERC20Abi } from '@abis/ERC20Abi';
import { useReadContract } from 'thirdweb/react';
export default function getBalanceRpc() {
  const { allChain }: any = useContext(CountContext);
  //  连接的账号和监听账号
  const activeAccount = useActiveAccount();
  const { data } = useWalletBalance({
    chain: allChain,
    address: activeAccount?.address,
    client,
  });
  const getBalanceRpcEther = async (token, weth): Promise<any> => {
    // 生成合约
    const contract = getContract({
      client,
      chain: allChain,
      address: token,
      abi: ERC20Abi as any,
    });
    // 获取  decimals
    const { data: decimalsPar, isLoading: isDecimals }: any = useReadContract({
      contract,
      method: 'decimals',
      params: [],
    });
    // 获取  balanceOf
    const { data: balanceOf, isLoading: isBalanceOf }: any = useReadContract({
      contract,
      method: 'balanceOf',
      params: [activeAccount?.address],
    });
    // 需要用钱包对象查
    let decimals = 18;
    if (!token) return;
    if (token === zeroAddress) {
      return data?.displayValue;
    }
    if (
      token.toLocaleLowerCase() !== zeroAddress.toLocaleLowerCase() &&
      token.toLocaleLowerCase() !== weth.toLocaleLowerCase()
    ) {
      if (!isDecimals) {
        decimals = decimalsPar;
      }
    }
    if (!isBalanceOf) {
      if (Number(balanceOf)) {
        return new Decimal(balanceOf.toString()).div(
          new Decimal(10).pow(decimals)
        );
      } else {
        return '0';
      }
    }
  };
  return { getBalanceRpcEther };
}
