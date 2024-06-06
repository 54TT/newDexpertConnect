import { Button } from 'antd';
import { useAccount, useWriteContract } from 'wagmi';
import Request from '@/components/axios.tsx';
import './index.less';
import { UniversalRouterAbi } from '@/abis/UniversalRouterAbi';
import { useState } from 'react';
import SwapInput from './components/SwapInput';
import './index.less';
import Cookies from 'js-cookie';

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

    const res = await getAll({
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

  const getSwapGas = async () => {
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
  };

  const getSwapBytes = async () => {
    const token = Cookies.get('token');

    const { data } = await getAll({
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
    const { commands, ethValue, inputs } = data;
    console.log(commands, ethValue, inputs);
    const sendSwapTraction = () => {
      writeContract({
        address: '0xe6f721ce154114e4f6755e3c02c99dcba109e322',
        abi: UniversalRouterAbi,
        functionName: 'execute',
        chainId: 11155111,
        value: ethValue,
        args: [commands, inputs, BigInt(100000000000000)],
      });
    };
    console.log('run here');

    sendSwapTraction();
  };

  /* {
    "commands": "0x0b",
    "inputs": [
        "0x0000000000000000000000004b42fbbae2b6ed434e8598a00b1fd7efabe5bce3000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    ],
    "ethValue": "10000000000000000"
} */

  return (
    <div className="dapp-sniper">
      <div className="dapp-sniper-left"></div>
      <div className="dapp-sniper-right">
        <div className="input-token send-token">
          <div className="dapp-sniper-right-label">Send</div>
          <SwapInput value={amountIn} onChange={(v) => setAmountIn(v)} />
        </div>
        <div className="input-token receive-token">
          <div className="dapp-sniper-right-label">
            <div>Receive</div>
            <div></div>
          </div>
          <SwapInput value={amountOut} onChange={(v) => setAomuntOut(v)} />
          <div className="token-info">
            <div>1 Usdt</div>
            <div>123</div>
          </div>
        </div>
        <Button className="swap-button" onClick={() => handleSwap()}>
          Swap
        </Button>
      </div>
    </div>
  );
}

export default SniperBot;
