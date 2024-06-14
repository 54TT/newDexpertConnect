import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import ProInputNumber from '@/components/ProInputNumber';
import { getAmountIn } from '@utils/swap/v2/getAmountIn';
import { getAmountOut } from '@utils/swap/v2/getAmountOut';
import { getSwapEthAndWeth } from '@utils/swap/v2/getSwapEthAndWeth';
import { getSwapExactOutBytes } from '@utils/swap/v2/getSwapExactOutBytes';
import { getSwapExactInBytes } from '@utils/swap/v2/getSwapExactInBytes';
import { getV3AmountOut } from '@utils/swap/v3/getAmountOut';
import { getSwapExactInBytes as getSwapExactInBytesV3 } from '@utils/swap/v3/getSwapExactInBytes';
import {
  getUniswapV2RouterContract,
  getUniversalRouterContract,
} from '@utils/contracts';
import { debounce } from 'lodash';
import './index.less';
import SelectTokenModal from '@/components/SelectTokenModal';
import Decimal from 'decimal.js';
import AdvConfig from '../AdvConfig';
import { CountContext } from '@/Layout';
import { PermitSingle, getPermitSignature } from '@utils/permit2';
import { BigNumber, ethers } from 'ethers';
import { Permit2Abi } from '@abis/Permit2Abi';
import { ERC20Abi } from '@abis/ERC20Abi';

interface TokenInfoType {
  address: string;
  icon: string;
  symbol: string;
  name: string;
}
const mockChainId = '11155111';
function SwapComp() {
  const { provider, contractConfig } = useContext(CountContext);
  const [amountIn, setAmountIn] = useState<number | null>(0);
  const [amountOut, setAmountOut] = useState<number | null>(0);
  const [tokenIn, setTokenIn] = useState<TokenInfoType>();
  const [tokenOut, setTokenOut] = useState<TokenInfoType>();
  const [openSelect, setOpenSelect] = useState(false);
  const currentSetToken = useRef<'in' | 'out'>('in');
  const currentInputToken = useRef<'in' | 'out'>('in');

  useEffect(() => {
    getWeth();
  }, []);

  const getWeth = async () => {
    console.log('-----------------');
    const param = [
      '11155111',
      provider,
      await getUniversalRouterContract(
        provider,
        '0xD06CBe0ec2138c7aAFA8eAB031EA164f5c1C6bC1'
      ),
      '0x6f57e483790DAb7D40b0cBA14EcdFAE2E9aA2406',
      '0xaA7024098a12e7E8bacb055eEcD03588d4A5d75d',
      new Decimal(1000000000000),
      new Decimal(0.01),
      0,
    ];
    const res = await getV3AmountOut.apply(null, param);
    console.log('res-----', res);
    console.log(res.quoteAmount.toString());
    console.log(res.fee);
    console.log(res.poolAddress);

    const a = await getSwapExactInBytesV3(
      '11155111',
      provider,
      '0x6f57e483790DAb7D40b0cBA14EcdFAE2E9aA2406',
      '0xaA7024098a12e7E8bacb055eEcD03588d4A5d75d',
      new Decimal(1000000000000),
      new Decimal(res.quoteAmount),
      '0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89',
      false,
      0,
      Number(res.fee),
      res.poolAddress
    );
    console.log('----------aaaaa', a);
  };

  const exchange = () => {
    const [newTokenIn, newTokenOut] = [tokenOut, tokenIn];
    setTokenIn(newTokenIn);
    setTokenOut(newTokenOut);
    setAmountIn(amountOut);
    setAmountOut(0);
  };

  const getAmount = async (type: 'in' | 'out', value: number) => {
    let start = Date.now();
    const { universalRouterAddress, uniswapV2RouterAddress } = contractConfig;
    console.log(tokenIn, tokenOut);

    const param = [
      '11155111',
      provider,
      await getUniversalRouterContract(provider, universalRouterAddress),
      await getUniswapV2RouterContract(provider, uniswapV2RouterAddress),
      tokenIn.address,
      tokenOut.address,
      new Decimal(value),
      new Decimal(0.02),
      0,
    ];
    if (type === 'in') {
      const amount = await getAmountOut.apply(null, param);
      setAmountOut(Number(amount.toString()));
    }
    if (type === 'out') {
      const amount = await getAmountIn.apply(null, param);
      setAmountIn(Number(amount.toString()));
    }
    console.log(`获取输入输出总耗时${(Date.now() - start) / 1000} 秒 `);
  };

  const getAmountDebounce = useCallback(debounce(getAmount, 500), [
    tokenIn,
    tokenOut,
  ]);
  // 处理approve
  const handleApprove = async (
    tokenContract: ethers.Contract,
    amountIn: number,
    decimals: number
  ) => {
    const { permit2Address } = contractConfig;
    const approveTx = await tokenContract.approve(
      permit2Address,
      BigInt((amountIn * 10 ** decimals).toFixed(0))
    );
    console.log(approveTx, 'approve--tx');

    const recipent = await approveTx.wait();
    // 1 成功 2 失败
    return recipent.status === 1;
  };

  // 查询对 permit2 的approve额度，未授权为 0
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
    const { universalRouterAddress } = contractConfig;
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
    const { ethAddress, wethAddress } = contractConfig;
    const {
      amountIn,
      amountOut,
      tokenIn,
      tokenOut,
      permit,
      signature,
      recipientAddress,
    } = data;

    const getBytesParam = [
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
      signature,
    ];

    const getSwapBytesFn = async (tokenIn, tokenOut) => {
      if (
        (tokenIn === ethAddress || tokenIn === wethAddress) &&
        (tokenOut === ethAddress || tokenOut === wethAddress)
      ) {
        return await getSwapEthAndWeth.apply(null, [
          mockChainId,
          provider,
          tokenIn,
          tokenOut,
          new Decimal(amountIn),
          new Decimal(amountOut),
          recipientAddress,
          permit,
          signature,
        ]);
      }
      if (currentInputToken.current === 'in') {
        return await getSwapExactInBytes.apply(null, getBytesParam);
      } else {
        return await getSwapExactOutBytes.apply(null, getBytesParam);
      }
    };

    const { commands, inputs } = await getSwapBytesFn(tokenIn, tokenOut);
    console.log('swap-code', {
      commands,
      inputs,
    });

    let etherValue = BigInt(0);
    if (tokenIn === contractConfig.ethAddress) {
      etherValue = BigInt((amountIn * 10 ** 18).toFixed(0));
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
      contractConfig;
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
            amount: BigInt((amountIn * 10 ** decimals).toFixed(0)),
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
          amount: BigInt((amountIn * 10 ** decimals).toFixed(0)),
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
      const { commands, inputs, etherValue } = await getSwapBytes({
        ...data,
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
  };

  return (
    <div className="swap-comp">
      <div>
        <AdvConfig onClose={() => console.log('123123')} />
      </div>
      <div className="input-token send-token">
        <div className="dapp-sniper-right-token">
          <div className="dapp-sniper-right-token-label">Send</div>
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => {
              currentSetToken.current = 'in';
              setOpenSelect(true);
            }}
          >
            <img className="eth-logo" src={tokenIn?.icon} alt="" />
            <span>{tokenIn?.symbol}</span>
            <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
          </div>
        </div>
        <ProInputNumber
          value={amountIn}
          onChange={(v) => {
            setAmountIn(v);
            if (currentInputToken.current !== 'in')
              currentInputToken.current = 'in';
            getAmountDebounce('in', v);
          }}
        />
        <div className="token-info">
          <div>1 USDT</div>
          <div>Balance: 0</div>
        </div>
      </div>
      <div className="exchange">
        <img
          className="exchange-img"
          src="/exchange.png"
          alt=""
          onClick={() => exchange()}
        />
      </div>
      <div className="input-token receive-token">
        <div className="dapp-sniper-right-token">
          <div className="dapp-sniper-right-token-label">Receive</div>
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => {
              currentSetToken.current = 'out';
              setOpenSelect(true);
            }}
          >
            <img className="eth-logo" src={tokenOut?.icon || ''} alt="" />
            <span>{tokenOut?.symbol}</span>
            <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
          </div>
        </div>
        <ProInputNumber
          value={amountOut}
          onChange={(v) => {
            setAmountOut(v);
            if (currentInputToken.current !== 'out')
              currentInputToken.current = 'out';
            getAmountDebounce('out', v);
          }}
        />
        <div className="token-info">
          <div>1 USDT</div>
          <div>Balance: 0</div>
        </div>
      </div>
      <div className="bottom-info">
        <div className="exchange-rate">
          <span>Reference Exchange Rate</span>
          <span>-</span>
        </div>
        <div className="exchange-fee">
          <span>Estinated Fees</span>
          <span>-</span>
        </div>
        <div className="exchange-path">
          <span>Quote Path</span>
          <span>-</span>
        </div>
      </div>
      <Button
        className="swap-button"
        onClick={() =>
          handleSwap({
            amountIn,
            amountOut,
            tokenIn: tokenIn.address,
            tokenOut: tokenOut.address,
          })
        }
      >
        Swap
      </Button>
      <SelectTokenModal
        open={openSelect}
        onChange={(data) => {
          if (currentSetToken.current === 'in') {
            setTokenIn(data);
          } else {
            setTokenOut(data);
          }
          setOpenSelect(false);
        }}
        onCancel={() => setOpenSelect(false)}
      />
    </div>
  );
}

export default SwapComp;
