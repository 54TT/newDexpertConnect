import { Button, InputNumber } from 'antd';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import Request from '@/components/axios.tsx';
import './index.less';
import { ERC20Abi } from '../../abis/ERC20Abi';
import { Dispatch, useState } from 'react';
import { method } from 'lodash';
import { url } from 'inspector';
import InputBorderLess from '@/components/InputBorderLess';
import ProInputNumber from '@/components/ProInputNumber';

const snipBotBasUrl =
  import.meta.env.MODE === 'development'
    ? 'https://dexpert.io/sniper-bot/dev'
    : 'https://dexpert.io/sniper-bot/prod';

const mockTokenIn = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
const mockTokenOut = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';

function SniperBot() {
  const { writeContract } = useWriteContract();
  const { getAll } = Request();
  const { address } = useAccount();
  const [amountIn, setAmountIn] = useState<number | null>(2);
  const [amountOut, setAomuntOut] = useState<number | null>(2);
  const request = async (data: any) => {
    await getAll(data, { baseURL: snipBotBasUrl });
  };

  const getAomuntOut = async () => {
    console.log('123123');

    const res = await request({
      method: 'post',
      url: '/api/v1/amounts/out',
      data: {
        amountIn,
        tokenIn: mockTokenIn,
        tokenOut: mockTokenOut,
        payType: 0,
      },
    });
    console.log(res);
  };

  const handleSwap = () => {
    getSwapGas();
    getAomuntOut();
  };

  const handleApprove = () => {
    writeContract({
      address: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
      abi: ERC20Abi,
      functionName: 'approve',
      args: ['0xe6f721ce154114e4f6755e3c02c99dcba109e322', amountIn],
    });
  };

  const getSwapGas = async () => {
    const res = await request({
      method: 'post',
      url: '/api/v1/dapp/swap/gas',
      data: {
        fromAddress: address,
        amountIn,
        amountOut,
        tokenIn: mockTokenIn,
        tokenOut: mockTokenOut,
        in: 0,
        out: 1,
        tradeDeadline: 60 * 10,
        recipient: address,
      },
    });
    console.log(res);
  };

  const getSwapBytes = () => {};

  return (
    <div className="dapp-sniper">
      <div className="input-token">
        <ProInputNumber
          value={amountIn}
          onChange={(value) => setAmountIn(value)}
        />
      </div>
      <div className="input-token">
        <ProInputNumber
          value={amountIn}
          onChange={(value) => setAomuntOut(value)}
        />
      </div>
      <Button onClick={() => handleSwap()}>Swap</Button>
    </div>
  );
}

export default SniperBot;
