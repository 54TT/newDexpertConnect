import { useAccount, useWriteContract } from 'wagmi';
import Request from '@/components/axios.tsx';
import './index.less';
import { getSwapEthAndWeth } from '@utils/swap/v2/getSwapEthAndWeth';
import { getSwapExactInBytes } from '@utils/swap/v2/getSwapExactInBytes';
import { getSwapExactOutBytes } from '@utils/swap/v2/getSwapExactOutBytes';
import { useState } from 'react';
import SwapComp from './components/SwapComp';
import './index.less';
import Cookies from 'js-cookie';
import { getUniversalRouterContract } from '@utils/contracts';
import { ethToWei } from '@utils/convertEthUnit';
import { ethers } from 'ethers';
import { config } from '@/config/config';
import PairPriceCharts from './components/PairPriceCharts';

const mockRecipentAddress = '0x4b42fbbae2b6ed434e8598a00b1fd7efabe5bce3';
const mockChainId = '11155111';
const mockTokenIn = '0x0000000000000000000000000000000000000000';
const mockTokenOut = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
function SniperBot() {
  const { writeContract } = useWriteContract();
  const { getAll } = Request();
  const { address } = useAccount();
  const [amountIn, setAmountIn] = useState<number | null>(0.01);
  const [amountOut, setAomuntOut] = useState<number | null>(0.01);
  const getAomuntOut = async () => {
    console.log('123123');
  };

  const handleSwap = async () => {
    /*     await handleApprove(); */
    getSwapGas();
    /*     getAomuntOut(); */
    getSwapBytes();
  };

  /*   const handleApprove = async () => {
    await writeContract({
      address: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
      abi: ERC20Abi,
      functionName: 'approve',
      chainId: 11155111,
      args: [
        '0xe6f721ce154114e4f6755e3c02c99dcba109e322',
        BigInt(2 * 10 ** 18),
      ],
    });
  }; */

  /* const getSwapGas = async () => {
    const token = Cookies.get('token');

    const res = await getAll({
      method: 'post',
      url: '/api/v1/dapp/swap/gas',
      token,
      data: {
        fromAddress: address,
        amountIn: `${(amountIn as number) ** 10 * 18}`,
        amountOut: `${(amountIn as number) ** 10 * 18}`,
        tokenIn: `${mockTokenIn}`,
        tokenOut: `0x0000000000000000000000000000000000000000`,
        in: 0,
        out: 1,
        tradeDeadline: Math.floor((new Date().getTime() + 10000) / 100),
        recipient: address,
        chainId: 1,
      },
    });
  }; */

  const getSwapBytes = async (data: any) => {
    const token = Cookies.get('token');
    const { amountIn, amountOut, tokenIn, tokenOut } = data;
    /*     getSwapEthAndWeth('11155111', token); */
    /* const { res } = await getAll({
      method: 'post',
      url: '/api/v1/dapp/swap',
      token,
      data: {
        amountIn: `${BigInt((amountIn as number) * 10 ** 18)}`,
        amountOut: `${BigInt((amountOut as number) * 10 ** 18)}`,
        tokenIn: `${mockTokenIn}`,
        tokenOut: `${mockTokenOut}`,
        in: 0,
        out: 1,
        recipient: address,
        chainId: 1,
        payType: 0,
      },
    });
    console.log(res); */

    /*     const sendSwapTraction = () => {
      writeContract({
        address: '0xe6f721ce154114e4f6755e3c02c99dcba109e322',
        abi: UniversalRouterAbi,
        functionName: 'execute',
        chainId: 11155111,
        value: ethValue,
        args: [commands, inputs, BigInt(100000000000000)],
      });
    }; */
    /*   sendSwapTraction(); */
    /*     console.log([
      mockChainId,
      tokenIn,
      tokenOut,
      ethToWei(amountIn).toString(),
      ethToWei(amountOut).toString(),
      mockRecipentAddress,
    ]); */

    const { commands, inputs } = await getSwapEthAndWeth(
      mockChainId,
      tokenIn,
      tokenOut,
      amountIn,
      amountOut,
      mockRecipentAddress
    );

    let etherValue = BigInt(0);
    if (tokenIn === config['11155111'].ethAddress) {
      etherValue = BigInt(amountIn * 10 ** 18);
    }

    const universalRouterContract =
      await getUniversalRouterContract(mockChainId);
    const provider: any = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = await provider.getSigner();
    console.log(signer);
    const universalRouterWriteContract =
      await universalRouterContract.connect(signer);

    universalRouterWriteContract.estimateGas;
    console.log(commands, inputs);

    const tx = await universalRouterWriteContract[
      'execute(bytes,bytes[],uint256)'
    ](commands, inputs, BigInt(100000000000000), {
      value: etherValue,
      gasLimit: 210000,
    });
    console.log(tx);
  };

  return (
    <div className="dapp-sniper">
      <div className="dapp-sniper-left">
        <PairPriceCharts />
      </div>
      <div className="dapp-sniper-right">
        <SwapComp onSwap={(data) => getSwapBytes(data)} />
      </div>
    </div>
  );
}

export default SniperBot;
