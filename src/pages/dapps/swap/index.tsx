import Request from '@/components/axios.tsx';
import './index.less';
import { useContext } from 'react';
import SwapComp from './components/SwapComp';
import './index.less';
import { getUniversalRouterContract } from '@utils/contracts';
import { BigNumber, ethers } from 'ethers';
import { config } from '@/config/config';
import PairPriceCharts from './components/PairPriceCharts';
import Decimal from 'decimal.js';
import { getSwapExactInBytes } from '@utils/swap/v2/getSwapExactInBytes';
import { ERC20Abi } from '@abis/ERC20Abi';
import { CountContext } from '@/Layout';
import { Permit2Abi } from '@abis/Permit2Abi';
import { PermitSingle, getPermitSignature } from '@utils/permit2';

const mockChainId = '11155111';
function Swap() {
  const { provider } = useContext(CountContext);
  // 处理approve
  const handleApprove = async (
    tokenContract: ethers.Contract,
    amountIn: number,
    decimals: number
  ) => {
    const chainId = localStorage.getItem('chainId');
    const { permit2Address } = config[chainId || '11155111'];
    const approveTx = await tokenContract.approve(
      permit2Address,
      BigInt(amountIn * 10 ** decimals)
    );
    console.log(approveTx, 'approve--tx');

    const recipent = await approveTx.wait();
    // 1 成功 2 失败
    return recipent.status === 1;
  };

  // 查询对 permit2 的approve额度， 未授权为 0
  const queryAllowance = async (
    tokenContract: ethers.Contract,
    owner: string,
    spender: string
  ) => {
    return await tokenContract.allowance(owner, spender);
  };

  // 获取签名
  const signPermit = async ({
    signerAddress,
    token,
    amount,
    permit2Contract,
    signer,
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

    const { eip712Domain, PERMIT2_PERMIT_TYPE, permit } =
      await getPermitSignature(
        11155111,
        permitSingle,
        permit2Contract,
        signerAddress
      );

    const signature = await signer._signTypedData(
      eip712Domain,
      PERMIT2_PERMIT_TYPE,
      permit
    );

    return { signature, permit };
  };

  // 获取交易字节码
  const getSwapBytes = async (data: any) => {
    const {
      amountIn,
      amountOut,
      tokenIn,
      tokenOut,
      permit,
      signature,
      recipientAddress,
    } = data;
    const { commands, inputs } = await getSwapExactInBytes(
      mockChainId,
      provider,
      tokenIn,
      tokenOut,
      new Decimal(amountIn),
      new Decimal(amountOut),
      recipientAddress,
      true,
      0,
      permit,
      signature
    );
    console.log('swap-code', {
      commands,
      inputs,
    });

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

  // 发送交易
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
    console.log('swap-tx', tx);
  };

  // 触发交易流程
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
    const signerAddress = await signer.getAddress();
    const permit2Contract = new ethers.Contract(
      permit2Address,
      Permit2Abi,
      signer
    );

    const tokenInContract = new ethers.Contract(tokenIn, ERC20Abi, signer);
    /*     console.log('swap-code', {
      commands,
      inputs,
      etherValue,
    }); */

    if (tokenIn !== zeroAddress) {
      const balance: BigNumber = await queryAllowance(
        tokenInContract,
        signerAddress,
        permit2Address
      );
      const decimals = await tokenInContract.decimals();
      if (
        balance.isZero() ||
        balance.lte(
          BigNumber.from(new Decimal(amountIn * 10 ** decimals).toFixed(0))
        )
      ) {
        // 余额为0 或者余额 小于amount 需要approve
        const successApprove = await handleApprove(
          tokenInContract,
          amountIn,
          decimals
        );
        if (successApprove) {
          const { permit, signature } = await signPermit({
            signerAddress,
            token: tokenIn,
            amount: BigInt(amountIn * 10 ** decimals),
            permit2Contract,
            signer,
          });

          const { commands, inputs, etherValue } = await getSwapBytes({
            ...data,
            permit,
            signature,
            recipientAddress: signerAddress,
          });

          sendSwap({
            commands,
            inputs,
            etherValue,
            signer,
            universalRouterAddress,
          });
        }
      } else {
        const { permit, signature } = await signPermit({
          signerAddress,
          token: tokenIn,
          amount: BigInt(amountIn * 10 ** 6),
          permit2Contract,
          signer,
        });
        const { commands, inputs, etherValue } = await getSwapBytes({
          ...data,
          permit,
          signature,
        });
        sendSwap({
          commands,
          inputs,
          etherValue,
          signer,
          universalRouterAddress,
        });
      }
    } else {
      const { commands, inputs, etherValue } = await getSwapBytes({ ...data });
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
