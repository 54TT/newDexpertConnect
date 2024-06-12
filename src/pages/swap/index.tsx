import Request from '@/components/axios.tsx';
import './index.less';
import { useContext, useEffect, useState } from 'react';
import SwapComp from './components/SwapComp';
import './index.less';
import { getUniversalRouterContract } from '@utils/contracts';
import { Contract, ethers } from 'ethers';
import { config } from '@/config/config';
import PairPriceCharts from './components/PairPriceCharts';
import Decimal from 'decimal.js';
import { getSwapExactInBytes } from '@utils/swap/v2/getSwapExactInBytes';
import { ERC20Abi } from '@abis/ERC20Abi';
import { CountContext } from '@/Layout';
import { getDecimals } from '@utils/getDecimals';
import { Permit2Abi } from '@abis/Permit2Abi';
import {
  PermitDetails,
  PermitSingle,
  getPermitSignature,
} from '@utils/permit2';
const mockRecipentAddress = '0x4b42fbbae2b6ed434e8598a00b1fd7efabe5bce3';
const mockChainId = '11155111';
function Swap() {
  const { provider } = useContext(CountContext);
  const handleApprove = async (
    tokenInAddress: string,
    amountIn: number,
    signer: ethers.Signer
  ) => {
    const chainId = localStorage.getItem('chainId');
    const { universalRouterAddress } = config[chainId || '11155111'];

    const tokenInContract = new ethers.Contract(
      tokenInAddress,
      ERC20Abi,
      signer
    );

    const approveTx = await tokenInContract.approve(
      universalRouterAddress,
      BigInt(amountIn * 10 ** 6)
    );

    const recipent = await approveTx.wait();

    // 1 成功 2 失败
    return recipent.status === 1;
  };

  const signPermit = async ({
    signerAddress,
    token,
    amount,
    permit2Contract,
  }) => {
    const { universalRouterAddress } = config['11155111'];
    const permitSingle: PermitSingle = {
      sigDeadline: 2000000000,
      spender: universalRouterAddress,
      details: {
        token,
        amount,
        expiration: 0,
        nonce: 0,
      },
    };

    const res = await getPermitSignature(
      11155111,
      permitSingle,
      permit2Contract,
      signerAddress
    );
    console.log(res);

    return res;
  };

  const getSwapBytes = async (data: any) => {
    const { amountIn, amountOut, tokenIn, tokenOut } = data;
    const { commands, inputs } = await getSwapExactInBytes(
      mockChainId,
      provider,
      tokenIn,
      tokenOut,
      new Decimal(amountIn),
      new Decimal(amountOut),
      mockRecipentAddress,
      true,
      0
    );

    /*     console.log('SwapExactInParam', {
      mockChainId,
      provider,
      tokenIn,
      tokenOut,
      recipient: mockRecipentAddress,
      amountIn: new Decimal(amountIn).toString(),
      amountOut: new Decimal(amountOut).toString(),
      isFee: true,
      payType: 0,
    }); */

    let etherValue = BigInt(0);
    if (tokenIn === config['11155111'].ethAddress) {
      etherValue = BigInt(amountIn * 10 ** 18);
    }
    return { commands, inputs, etherValue };
  };

  const sendSwap = async ({
    commands,
    inputs,
    etherValue,
    signer,
    universalRouterAddress,
  }) => {
    const universalRouterContract = await getUniversalRouterContract(
      provider,
      universalRouterAddress
    );

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
    const { zeroAddress, universalRouterAddress, permit2Address } =
      config[chainId || '11155111'];
    const { tokenIn, amountIn } = data;

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = await web3Provider.getSigner();
    /* const signerAddress = await signer.getAddress();
    const permit2Contract = new ethers.Contract(
      permit2Address,
      Permit2Abi,
      signer
    );
    console.log({
      signerAddress,
      token: tokenIn,
      amount: BigInt(amountIn * 10 ** 6).toString(),
      permit2Contract,
    });

    const { eip712Domain, PERMIT2_PERMIT_TYPE, permit } = await signPermit({
      signerAddress,
      token: tokenIn,
      amount: BigInt(amountIn * 10 ** 6),
      permit2Contract,
    });

    const result = await signer._signTypedData(
      eip712Domain,
      PERMIT2_PERMIT_TYPE,
      permit
    );
    console.log(result);

    return; */

    const { commands, inputs, etherValue } = await getSwapBytes(data);

    console.log('swap-code', {
      commands,
      inputs,
      etherValue,
    });

    if (tokenIn !== zeroAddress) {
      const successApprove = await handleApprove(tokenIn, amountIn, signer);
      if (successApprove) {
        sendSwap({
          commands,
          inputs,
          etherValue,
          signer,
          universalRouterAddress,
        });
      }
    } else {
      sendSwap({
        commands,
        inputs,
        etherValue,
        signer,
        universalRouterAddress,
      });
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
