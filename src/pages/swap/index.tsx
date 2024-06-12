import Request from '@/components/axios.tsx';
import './index.less';
import { useContext, useState } from 'react';
import SwapComp from './components/SwapComp';
import './index.less';
import { getUniversalRouterContract } from '@utils/contracts';
import { ethers } from 'ethers';
import { config } from '@/config/config';
import PairPriceCharts from './components/PairPriceCharts';
import Decimal from 'decimal.js';
import { getSwapExactInBytes } from '@utils/swap/v2/getSwapExactInBytes';
import { ERC20Abi } from '@abis/ERC20Abi';
import { CountContext } from '@/Layout';

const mockRecipentAddress = '0x4b42fbbae2b6ed434e8598a00b1fd7efabe5bce3';
const mockChainId = '11155111';
function Swap() {
  const { getAll } = Request();
  const [amountIn, setAmountIn] = useState<number | null>(0.01);
  const [amountOut, setAomuntOut] = useState<number | null>(0.01);
  const { provider } = useContext(CountContext);
  const handleApprove = async (
    tokenInAddress: string,
    signer: ethers.Signer
  ) => {
    const chainId = localStorage.getItem('chainId');
    const { uniswapV2RouterAddress, rpcUrl } = config[chainId || '11155111'];

    const tokenInContract = new ethers.Contract(
      tokenInAddress,
      ERC20Abi,
      signer
    );
    const approveTx = await tokenInContract.approve(
      uniswapV2RouterAddress,
      BigInt(amountIn * 10 ** 18)
    );

    const recipent = await approveTx.wait();

    // 1 成功 2 失败
    return recipent.status === 1;
  };

  const getSwapBytes = async (data: any) => {
    const { amountIn, amountOut, tokenIn, tokenOut } = data;

    const { commands, inputs } = await getSwapExactInBytes(
      mockChainId,
      tokenIn,
      tokenOut,
      new Decimal(amountIn),
      new Decimal(amountOut),
      mockRecipentAddress,
      true,
      0
    );

    console.log({
      mockChainId,
      tokenIn,
      tokenOut,
      amountIn,
      amountOut,
      mockRecipentAddress,
      isFee: true,
      payType: 0,
    });

    let etherValue = BigInt(0);
    if (tokenIn === config['11155111'].ethAddress) {
      etherValue = BigInt(amountIn * 10 ** 18);
    }

    return { commands, inputs, etherValue };
  };

  const sendSwap = async ({ commands, inputs, etherValue, signer }) => {
    const universalRouterContract =
      await getUniversalRouterContract(mockChainId);

    const universalRouterWriteContract =
      await universalRouterContract.connect(signer);
    /*   const gasLimit = await universalRouterWriteContract.estimateGas[
      'execute(bytes,bytes[],uint256)'
    ](commands, inputs, BigInt(2000000000), {
      value: etherValue,
    }); */

    const tx = await universalRouterWriteContract[
      'execute(bytes,bytes[],uint256)'
    ](commands, inputs, BigInt(2000000000), {
      value: etherValue,
      gasLimit: 1030000,
    });
  };

  const handleSwap = async (data: {
    amountIn: any;
    amountOut: any;
    tokenIn: any;
    tokenOut: any;
  }) => {
    const chainId = localStorage.getItem('chainId');
    const { zeroAddress } = config[chainId || '11155111'];
    const signer = await provider.getSigner();
    const { tokenIn } = data;
    const { commands, inputs, etherValue } = await getSwapBytes(data);
    if (tokenIn !== zeroAddress) {
      const successApprove = await handleApprove(tokenIn, signer);
      if (successApprove) {
        sendSwap({ commands, inputs, etherValue, signer });
      }
    } else {
      sendSwap({ commands, inputs, etherValue, signer });
    }
  };

  return (
    <div className="dapp-sniper">
      <div className="dapp-sniper-left">
        <PairPriceCharts />
      </div>
      <div className="dapp-sniper-right">
        <SwapComp onSwap={(data) => handleSwap(data)} />
      </div>
    </div>
  );
}

export default Swap;
