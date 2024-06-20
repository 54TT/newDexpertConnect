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
import { getSwapExactOutBytes as getSwapExactOutBytesV3 } from '@utils/swap/v3/getSwapExactOutBytes';
import {
  getUniswapV2RouterContract,
  getUniversalRouterContract,
} from '@utils/contracts';
import { debounce } from 'lodash';
import './index.less';
import SelectTokenModal from '@/components/SelectTokenModal';
import Decimal from 'decimal.js';
import AdvConfig, { AdvConfigType } from '../AdvConfig';
import { CountContext } from '@/Layout';
import { PermitSingle, getPermitSignature } from '@utils/permit2';
import { BigNumber, ethers } from 'ethers';
import { Permit2Abi } from '@abis/Permit2Abi';
import { ERC20Abi } from '@abis/ERC20Abi';
import useGetGasPrice from '@/hook/useGetGasPrice';
import ChooseChain from '@/components/chooseChain';
import {
  CHAIN_NAME_TO_CHAIN_ID,
  CHAIN_NAME_TO_CHAIN_ID_HEX,
} from '@utils/constants';
import useButtonDesc from '@/hook/useButtonDesc';
import UsePass from '@/components/UsePass';
import { getPairAddress } from '@utils/swap/v2/getPairAddress';
import { getTokenPrice } from '@utils/getTokenPrice';
import checkConnection from '@utils/checkConnect';
import { TokenItemData } from '@/components/SelectToken';
import Request from '@/components/axios';
import Loading from '@/components/allLoad/loading';
import Cookies from 'js-cookie';

function SwapComp() {
  const { provider, contractConfig, changeConfig } = useContext(CountContext);
  const [amountIn, setAmountIn] = useState<number | null>(0);
  const [amountOut, setAmountOut] = useState<number | null>(0);
  const [tokenIn, setTokenIn] = useState<TokenItemData>();
  const [tokenOut, setTokenOut] = useState<TokenItemData>();
  const [openSelect, setOpenSelect] = useState(false);
  const currentSetToken = useRef<'in' | 'out'>('in');
  const currentInputToken = useRef<'in' | 'out'>('in');
  const [chainId, setChainId] = useState('1');
  const [gasPrice, easyIn] = useGetGasPrice();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [buttonDescId, setButtonDescId] = useState('1');
  const [buttonDesc] = useButtonDesc(buttonDescId);
  const [buttonLoading] = useState(false);
  const { isLogin } = useContext(CountContext);
  const [openDpass, setOpenDpass] = useState(false);
  const [inLoading, setInLoading] = useState(false);
  const [outLoading, setOutLoading] = useState(false);
  const { getAll } = Request();
  /*   const [tokenPrice, setTokenPrice] = useState<{
    inPrice: string;
    outPrice: string;
  }>({
    inPrice: '-',
    outPrice: '-',
  }); */
  const payType = useRef('0');

  useEffect(() => {
    changeConfig(chainId);
  }, [chainId]);

  const initAdvConfig: AdvConfigType = {
    slipType: '0',
    slip: 0.02,
    tradeDeadline: {
      uint: 'm',
      value: 30,
    },
  };
  const [advConfig, setAdvConfig] = useState(initAdvConfig);
  // 检测是否连接EVM钱包 或 是否有钱包环境, 设置按钮文案与是否可用
  const setButtonDescAndDisable = () => {
    // 没登陆信息 Connect Wallet
    if (!isLogin) {
      setButtonDisable(true);
      setButtonDescId('2');
      return;
    }
    // 登陆了但是没有钱包环境  不支持的链
    if (isLogin && !checkConnection()) {
      setButtonDisable(true);
      setButtonDescId('3');
      return;
    }

    if (Loading) {
      setButtonDisable(true);
      setButtonDescId('1');
    }

    if (
      tokenIn?.contractAddress &&
      tokenOut?.contractAddress &&
      amountIn &&
      amountOut
    ) {
      setButtonDisable(false);
      setButtonDescId('1');
    } else {
      setButtonDisable(true);
    }
  };
  useEffect(() => {
    getWeth();
  }, []);

  useEffect(() => {
    setButtonDescAndDisable();
  }, [isLogin, tokenIn, tokenOut, amountIn, amountOut]);

  const getWeth = async () => {
    console.log('-----------------');
    const provider1 = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/9XFPPIAIzHPbfcr7BV6hPwNeMS65beJC");
    const param = [
      "11155111",
      provider1,
      '0xb72bc8971d5e595776592e8290be6f31937097c6',
      '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
      new Decimal(10),
      new Decimal(0.01),
      0,
    ];
    const res = await getV3AmountOut.apply(null, param);
    console.log('res-----', res);
    console.log(res.quoteAmount.toString());
    console.log(res.fee);
    console.log(res.poolAddress);

    const a = await getSwapExactInBytesV3(
      "11155111",
      provider1,
      '0x0000000000000000000000000000000000000000',
      '0xb72bc8971d5e595776592e8290be6f31937097c6',
      new Decimal(0.001),
      new Decimal(0),
      '0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89',
      true,
      0,
      Number(res.fee),
      null,
      null
    );
    console.log('----------aaaaa', a);

    const b = await getSwapExactOutBytesV3(
      "11155111",
      provider1,
      '0x0000000000000000000000000000000000000000',
      '0xb72bc8971d5e595776592e8290be6f31937097c6',
      new Decimal(0.001),
      new Decimal(0),
      '0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89',
      true,
      0,
      Number(res.fee),
      null,
      null
    )
    console.log('----------bbb', b);
  };

  const exchange = () => {
    const [newTokenIn, newTokenOut] = [tokenOut, tokenIn];
    setTokenIn(newTokenIn);
    setTokenOut(newTokenOut);
    setAmountIn(amountOut);
    setAmountOut(0);
    getAmount('in', amountOut || 0);
  };

  const getAmount = async (type: 'in' | 'out', value: number) => {
    if (value === 0) return;
    if (
      ((type === 'in' || type === 'out') && !tokenIn?.contractAddress) ||
      !tokenOut?.contractAddress
    ) {
      return;
    }

    let start = Date.now();
    const { universalRouterAddress, uniswapV2RouterAddress } = contractConfig;

    const slip = advConfig.slipType === '0' ? 0.02 : advConfig.slip;

    const param = [
      chainId,
      provider,
      await getUniversalRouterContract(provider, universalRouterAddress),
      await getUniswapV2RouterContract(provider, uniswapV2RouterAddress),
      tokenIn.contractAddress,
      tokenOut.contractAddress,
      new Decimal(value),
      new Decimal(slip),
      0,
    ];

    if (type === 'in') {
      setOutLoading(true);
      try {
        const amount = await getAmountOut.apply(null, param);

        setAmountOut(Number(amount.toString()));
      } catch (e) {
        console.error(e);
      }
      setOutLoading(false);
    }
    if (type === 'out') {
      setInLoading(true);
      try {
        const amount = await getAmountIn.apply(null, param);
        setAmountIn(Number(amount.toString()));
      } catch (e) {
        console.error(e);
      }
      setInLoading(false);
    }
    console.log(`获取输入输出总耗时${(Date.now() - start) / 1000} 秒 `);
  };

  const getAmountDebounce = useCallback(debounce(getAmount, 500), [
    tokenIn,
    tokenOut,
    provider,
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
        Number(chainId),
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
      chainId,
      provider,
      tokenIn,
      tokenOut,
      new Decimal(amountIn),
      new Decimal(amountOut),
      recipientAddress,
      payType.current == '0',
      Number(payType.current),
      permit,
      signature,
    ];

    const getSwapBytesFn = async (tokenIn, tokenOut) => {
      if (
        (tokenIn === ethAddress || tokenIn === wethAddress) &&
        (tokenOut === ethAddress || tokenOut === wethAddress)
      ) {
        return await getSwapEthAndWeth.apply(null, [
          chainId,
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

    let etherValue = BigInt(0);
    if (tokenIn === contractConfig.ethAddress) {
      etherValue = BigInt((amountIn * 10 ** 18).toFixed(0));
    }
    return { commands, inputs, etherValue };
  };

  const reportPayType = (tx) => {
    const token = Cookies.get('token');
    getAll({
      method: 'get',
      url: '/api/v1/d_pass/pay',
      data: { payType: payType.current, tx },
      token,
      chainId,
    });
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

    /*     const gasLimit = await universalRouterWriteContract.estimateGas[
      'execute(bytes,bytes[],uint256)'
    ](commands, inputs, BigInt(2000000000)); */

    const tx = await universalRouterWriteContract[
      'execute(bytes,bytes[],uint256)'
    ](commands, inputs, BigInt(2000000000), {
      value: etherValue,
      gasLimit: 1030000,
    });
    console.log(tx.hash);

    reportPayType(tx.hash);
    console.log('swap-tx', tx);
  };
  // 触发交易流程
  const handleSwap = async (data: {
    amountIn: any;
    amountOut: any;
    tokenIn: any;
    tokenOut: any;
  }) => {
    const { zeroAddress, universalRouterAddress, permit2Address } =
      contractConfig;
    const { tokenIn, amountIn } = data;
    //@ts-ignore
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

  useEffect(() => {
    const { usdtAddress, ethAddress } = contractConfig;
    const usdtToken: TokenItemData = {
      name: 'USDT',
      symbol: 'USDT',
      logoUrl: '/usdt.svg',
      contractAddress: usdtAddress,
      balance: '0',
    };
    const ethToken: TokenItemData = {
      name: 'ETH',
      symbol: 'ETH',
      logoUrl: '/eth-logo.svg',
      contractAddress: ethAddress,
      balance: '0',
    };
    setTokenIn(ethToken);
    setTokenOut(usdtToken);
    setAmountIn(0);
    setAmountOut(0);
  }, [contractConfig]);

  const changeWalletChain = async (v: string) => {
    const evmChainIdHex = CHAIN_NAME_TO_CHAIN_ID_HEX[v];
    const evmChainId = CHAIN_NAME_TO_CHAIN_ID[v];

    if (!isLogin) {
      changeConfig(evmChainId);
      setChainId(evmChainId);
    } else {
      // 有evm钱包环境
      try {
        //@ts-ignore
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: evmChainIdHex,
            },
          ],
        });
        changeConfig(evmChainId);
        setChainId(evmChainId);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // 获取 输入输出token价格
  const getTokenPriceInAndOut = async ({ tokenIn, tokenOut }) => {
    const { universalRouterAddress } = contractConfig;

    const pairAddress = await getPairAddress(
      provider,
      universalRouterAddress,
      tokenIn,
      tokenOut
    );
    if (pairAddress) {
      const res = await getTokenPrice(provider, chainId, pairAddress);
      console.log(res);
    }
  };

  useEffect(() => {
    if (
      tokenIn?.contractAddress &&
      tokenOut?.contractAddress &&
      amountOut !== 0
    ) {
      currentInputToken.current = 'out';
      getAmount('out', amountOut);
    }
  }, [tokenIn]);

  useEffect(() => {
    if (
      tokenOut?.contractAddress &&
      tokenIn?.contractAddress &&
      amountIn !== 0
    ) {
      currentInputToken.current = 'in';
      getAmount('in', amountIn);
    }
  }, [tokenOut]);

  useEffect(() => {
    if (tokenIn?.contractAddress && tokenOut?.contractAddress) {
      if (currentInputToken.current === 'in' && amountIn !== 0) {
        getAmount('in', amountIn);
      }
      if (currentInputToken.current === 'out' && amountOut !== 0) {
        getAmount('out', amountOut);
      }
    }
  }, [advConfig.slip, advConfig.slipType]);

  useEffect(() => {
    if (tokenIn?.contractAddress && tokenOut?.contractAddress) {
      getTokenPriceInAndOut({
        tokenIn: tokenIn.contractAddress,
        tokenOut: tokenOut.contractAddress,
      });
    }
  }, [tokenIn, tokenOut]);

  return (
    <div className="swap-comp">
      <div className="swap-comp-config">
        <ChooseChain onChange={(v) => changeWalletChain(v)} />
        <AdvConfig
          initData={initAdvConfig}
          onClose={(data) => {
            console.log(data);
            setAdvConfig({ ...data });
          }}
        />
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
            <img className="eth-logo" src={tokenIn?.logoUrl} alt="" />
            <span>{tokenIn?.symbol}</span>
            <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
          </div>
        </div>
        <ProInputNumber
          value={amountIn}
          className={inLoading && 'inut-font-gray'}
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
            <img className="eth-logo" src={tokenOut?.logoUrl || ''} alt="" />
            <span>{tokenOut?.symbol}</span>
            <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
          </div>
        </div>
        <ProInputNumber
          value={amountOut}
          className={outLoading && 'inut-font-gray'}
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
          <span className={easyIn && 'text-easy-in'}>
            {`${
              gasPrice?.div(ethers.BigNumber.from(10 ** 9))?.toString?.() || '-'
            } Gwei`}
          </span>
        </div>
        <div className="exchange-path">
          <span>Quote Path</span>
          <span>-</span>
        </div>
      </div>
      <Button
        className="swap-button"
        disabled={buttonDisable}
        loading={buttonLoading}
        onClick={() => setOpenDpass(true)}
      >
        {buttonDesc}
      </Button>
      <SelectTokenModal
        open={openSelect}
        chainId={chainId}
        onChange={(data) => {
          if (currentSetToken.current === 'in') {
            setTokenIn(data);
          } else {
            setTokenOut(data);
            setTimeout(() => {
              if (tokenIn?.contractAddress && amountIn !== 0) {
                currentInputToken.current = 'in';
                getAmount('in', amountIn);
              }
            }, 0);
          }
          setOpenSelect(false);
        }}
        onCancel={() => setOpenSelect(false)}
      />
      <UsePass
        open={openDpass}
        onClose={() => setOpenDpass(false)}
        type="swap"
        onChange={(v: string) => {
          payType.current = v;
          setOpenDpass(false);
          handleSwap({
            amountIn,
            amountOut,
            tokenIn: tokenIn.contractAddress,
            tokenOut: tokenOut.contractAddress,
          });
        }}
      />
    </div>
  );
}

export default SwapComp;
