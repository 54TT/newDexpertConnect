import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Skeleton, notification } from 'antd';
import ProInputNumber from '@/components/ProInputNumber';
import { getAmountIn } from '@utils/swap/v2/getAmountIn';
import { getAmountOut } from '@utils/swap/v2/getAmountOut';
import { getV3AmountIn } from '@utils/swap/v3/getAmountIn';
import { getV3AmountOut } from '@utils/swap/v3/getAmountOut';
import { getSwapEthAndWeth } from '@utils/swap/v2/getSwapEthAndWeth';
import { getSwapExactOutBytes } from '@utils/swap/v2/getSwapExactOutBytes';
import { getSwapExactInBytes } from '@utils/swap/v2/getSwapExactInBytes';
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
import ChooseChain from '@/components/chooseChain';
import {
  CHAIN_ID_TO_CHAIN_NAME,
  CHAIN_NAME_TO_CHAIN_ID,
  CHAIN_NAME_TO_CHAIN_ID_HEX,
} from '@utils/constants';
import useButtonDesc from '@/hook/useButtonDesc';
import UsePass from '@/components/UsePass';
/* import { getPairAddress } from '@utils/swap/v2/getPairAddress';
import { getTokenPrice } from '@utils/getTokenPrice'; */
import checkConnection from '@utils/checkConnect';
import { TokenItemData } from '@/components/SelectToken';
import Request from '@/components/axios';
import Cookies from 'js-cookie';
import useInterval from '@/hook/useInterval';
import getBalanceRpc from '@utils/getBalanceRpc';
import QuotoPathSelect from '@/components/QuotoPathSelect';
import { swapChain } from '@utils/judgeStablecoin';
interface SwapCompType {
  changeAble: boolean; // 是否可修改Token || 网络
  initChainId: string; // 初始化的chainId;
  initToken: [tokenIn: TokenItemData, toeknOut: TokenItemData]; // 初始化的token
}

function SwapComp({ initChainId, initToken }: SwapCompType) {
  const { provider, contractConfig, setIsModalOpen, chainId, setChainId } =
    useContext(CountContext);
  const [amountIn, setAmountIn] = useState<number | null>(0);
  const [amountOut, setAmountOut] = useState<number | null>(0);
  const [tokenIn, setTokenIn] = useState<TokenItemData>();
  const [tokenOut, setTokenOut] = useState<TokenItemData>();
  const [openSelect, setOpenSelect] = useState(false);
  const currentSetToken = useRef<'in' | 'out'>('in');
  const currentInputToken = useRef<'in' | 'out'>('in');

  const [buttonDisable, setButtonDisable] = useState(false);
  const [buttonDescId, setButtonDescId] = useState('1');
  const [buttonDesc] = useButtonDesc(buttonDescId);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { isLogin } = useContext(CountContext);
  const [inLoading, setInLoading] = useState(false);
  const [outLoading, setOutLoading] = useState(false);
  const [balanceIn, setBalanceIn] = useState<Decimal>(new Decimal(0)); // 需要用于计算
  const [balanceOut, setBalanceOut] = useState<Decimal>(new Decimal(0));
  const [swapV3Pool, setSwapV3Pool] = useState({
    fee: 0,
    poolAddress: '',
  }); // 如果是uniswap3 需要的数据
  const [quotePath, setQuotePath] = useState('0'); // 0 uniswapV2 1 V3
  const { getAll } = Request();
  /*   const [tokenPrice, setTokenPrice] = useState<{
    inPrice: string;
    outPrice: string;
  }>({
    inPrice: '-',
    outPrice: '-',
  }); */
  const [payType, setPayType] = useState('0');

  const initData = () => {
    if (initToken?.length) {
      const [initTokenIn, initTokenOut] = initToken;
      setTokenIn(initTokenIn);
      setTokenOut(initTokenOut);
      setAmountIn(0);
      setAmountOut(0);
    }
    if (initChainId) {
      const chianName = CHAIN_ID_TO_CHAIN_NAME[initChainId];
      changeWalletChain(chianName);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const getGasPrice = async () => {
    const gas: BigNumber = await provider.getGasPrice();
    const gasGwei = gas.toNumber() / 10 ** 9;
    return gasGwei < 0.0001
      ? '< 0.0001'
      : parseFloat(gasGwei.toFixed(4)).toString();
  };

  const getAmountExchangeRate = async (data) => {
    if (!tokenIn?.contractAddress && !tokenOut?.contractAddress) {
      return Promise.resolve('');
    }
    let amount: Decimal;
    if (quotePath === '0') {
      amount = await getAmountOut.apply(null, data);
    } else {
      const { quoteAmount } = await getV3AmountOut.apply(null, data);
      amount = quoteAmount;
    }

    return amount.toNumber() < 0.000001
      ? '< 0.000001'
      : parseFloat(amount.toFixed(6)).toString();
  };

  const getExchangeRateAndGasPrice = useCallback(async () => {
    if (!tokenIn?.contractAddress || !tokenOut?.contractAddress)
      return Promise.resolve(['', '']);
    const { universalRouterAddress, uniswapV2RouterAddress } = contractConfig;

    const data = [
      chainId,
      provider,
      quotePath === '0'
        ? await getUniversalRouterContract(provider, universalRouterAddress)
        : null,
      quotePath === '0'
        ? await getUniswapV2RouterContract(provider, uniswapV2RouterAddress)
        : null,
      tokenIn.contractAddress,
      tokenOut.contractAddress,
      new Decimal(1),
      new Decimal(0),
      0,
    ].filter((item) => item !== null);
    return Promise.all([getGasPrice(), getAmountExchangeRate(data)]);
  }, [
    provider,
    tokenIn?.contractAddress,
    tokenOut?.contractAddress,
    quotePath,
  ]);

  const [data, loading, showSkeleton] = useInterval(
    getExchangeRateAndGasPrice,
    10000,
    [tokenIn, tokenOut, quotePath, chainId]
  );

  const [gasPrice, exchangeRate] = data || ['', ''];

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
      setButtonDisable(false);
      setButtonDescId('2');
      return;
    }
    // 登陆了但是没有钱包环境  不支持的链
    if (isLogin && !checkConnection()) {
      setButtonDisable(true);
      setButtonDescId('3');
      return;
    }

    if (isLogin) {
      setButtonDisable(false);
      setButtonDescId('1');
    }

    const amountInDecimal = new Decimal(amountIn || 0);
    if (amountInDecimal.lessThan(balanceIn)) {
      setButtonDisable(false);
      setButtonDescId('1');
    } else {
      setButtonDisable(true);
      setButtonDescId('4');
    }

    if (
      tokenIn?.contractAddress &&
      tokenOut?.contractAddress &&
      amountIn &&
      amountOut &&
      amountInDecimal.lessThan(balanceIn)
    ) {
      setButtonDisable(false);
      setButtonDescId('1');
    } else {
      setButtonDisable(true);
    }
  };

  useEffect(() => {
    setButtonDescAndDisable();
  }, [isLogin, tokenIn, tokenOut, amountIn, amountOut, balanceIn]);

  useEffect(() => {
    if (isLogin) {
      (window as any)?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainId.toString(16),
          },
        ],
      });
    }
  }, [isLogin]);

  const exchange = () => {
    const [newTokenIn, newTokenOut] = [tokenOut, tokenIn];
    setTokenIn(newTokenIn);
    setTokenOut(newTokenOut);
    setAmountIn(amountOut);
    setAmountOut(0);
    getAmount('in', amountOut || 0, payType, quotePath);
  };

  const getAmount = async (
    type: 'in' | 'out',
    value: number,
    payType: string,
    quotePath: string
  ) => {
    if (value === 0) return;
    if (
      ((type === 'in' || type === 'out') && !tokenIn?.contractAddress) ||
      !tokenOut?.contractAddress
    ) {
      return;
    }

    setButtonLoading(true);
    setButtonDescId('7');

    let start = Date.now();
    const { universalRouterAddress, uniswapV2RouterAddress } = contractConfig;

    const slip = advConfig.slipType === '0' ? 0.02 : advConfig.slip;

    const param = [
      chainId,
      provider,
      quotePath === '0'
        ? await getUniversalRouterContract(provider, universalRouterAddress)
        : null,
      quotePath === '0'
        ? await getUniswapV2RouterContract(provider, uniswapV2RouterAddress)
        : null,
      tokenIn.contractAddress,
      tokenOut.contractAddress,
      new Decimal(value),
      new Decimal(slip),
      Number(payType),
    ].filter((item) => item !== null);
    if (type === 'in') {
      setOutLoading(true);
      try {
        let amount;
        if (quotePath === '0') {
          amount = await getAmountOut.apply(null, param);
        } else {
          const { quoteAmount, ...poolInfo } = await getV3AmountOut.apply(
            null,
            param
          );
          amount = quoteAmount;
          setSwapV3Pool(poolInfo);
        }
        setAmountOut(Number(amount.toString()));
      } catch (e) {
        console.error(e);
      }
      setOutLoading(false);
    }
    if (type === 'out') {
      setInLoading(true);
      try {
        let amount;
        if (quotePath === '0') {
          amount = await getAmountIn.apply(null, param);
        } else {
          const { quoteAmount, ...poolInfo } = await getV3AmountIn.apply(
            null,
            param
          );
          amount = quoteAmount;
          setSwapV3Pool(poolInfo);
        }
        setAmountIn(Number(amount.toString()));
      } catch (e) {
        console.error(e);
      }
      setInLoading(false);
    }
    setButtonLoading(false);
    setButtonDescId('1');
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
    let approveTx;
    try {
      // 等待approve;
      setButtonDescId('5');
      setButtonLoading(true);
      approveTx = await tokenContract.approve(
        permit2Address,
        BigInt((amountIn * 10 ** decimals).toFixed(0))
      );
    } catch (e) {
      console.error(e);
      setButtonDescId('1');
      setButtonLoading(false);
    }
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
    setButtonLoading(true);
    setButtonDescId('6');
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
    let signatureData;
    try {
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
      signatureData = { permit, signature };
    } catch (e) {
      setButtonLoading(false);
      setButtonDescId('1');
    }

    return signatureData;
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
      payType == '0',
      Number(payType),
      quotePath === '1' ? swapV3Pool?.fee : null,
      permit,
      signature,
    ].filter((item) => item !== null);

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
        if (quotePath === '0') {
          return await getSwapExactInBytes.apply(null, getBytesParam);
        }
        if (quotePath === '1') {
          return await getSwapExactInBytesV3.apply(null, getBytesParam);
        }
      } else {
        if (quotePath === '0') {
          return await getSwapExactOutBytes.apply(null, getBytesParam);
        }
        if (quotePath === '1') {
          return await getSwapExactOutBytesV3.apply(null, getBytesParam);
        }
      }
    };

    const { commands, inputs } = await getSwapBytesFn(tokenIn, tokenOut);
    console.log('byteCode', { commands, inputs });

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
      data: { payType, tx },
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
    setButtonDescId('8');
    const universalRouterContract = await getUniversalRouterContract(
      provider,
      universalRouterAddress
    );
    const universalRouterWriteContract =
      await universalRouterContract.connect(signer);
    const { scan } = contractConfig;
    /*         const gasLimit = await universalRouterWriteContract[
      'execute(bytes,bytes[],uint256)'
    ](commands, inputs, BigInt(2000000000)); */
    let tx;
    try {
      tx = await universalRouterWriteContract['execute(bytes,bytes[],uint256)'](
        commands,
        inputs,
        BigInt(2000000000),
        {
          value: etherValue,
          gasLimit: 1030000,
        }
      );
      notification.success({
        message: 'Transaction submitted successfully',
        description: (
          <a href={`${scan}${tx.hash}`} target="_blank">
            Click here to view on etherscan
          </a>
        ),
      });
    } catch (e) {
      setButtonLoading(false);
      setButtonDescId('1');
    }
    setButtonLoading(false);
    setButtonDescId('1');
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
    setButtonLoading(true);
    setButtonDescId('9');
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
      console.log(etherValue);

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
        setChainId(evmChainId);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // 获取 输入输出token价格
  /*   const getTokenPriceInAndOut = async ({ tokenIn, tokenOut }) => {
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
  }; */

  useEffect(() => {
    if (
      tokenIn?.contractAddress &&
      tokenOut?.contractAddress &&
      amountOut !== 0
    ) {
      currentInputToken.current = 'out';
      getAmount('out', amountOut, payType, quotePath);
    }
  }, [tokenIn]);

  const getTokenBalance = useCallback(
    async (token, dispatch) => {
      const { wethAddress } = contractConfig;
      if (checkConnection() && token) {
        // @ts-ignore
        const injectProvider = new ethers.providers.Web3Provider(
          // @ts-ignore
          window?.ethereum
        );

        const balance = await getBalanceRpc(injectProvider, token, wethAddress);

        dispatch(balance);
      }
    },
    [contractConfig]
  );

  useEffect(() => {
    if (isLogin) {
      getTokenBalance(tokenIn?.contractAddress, setBalanceIn);
    }
  }, [tokenIn, isLogin]);

  useEffect(() => {
    if (isLogin) {
      getTokenBalance(tokenOut?.contractAddress, setBalanceOut);
    }
  }, [tokenOut, isLogin]);

  useEffect(() => {
    if (
      tokenOut?.contractAddress &&
      tokenIn?.contractAddress &&
      amountIn !== 0
    ) {
      currentInputToken.current = 'in';
      getAmount('in', amountIn, payType, quotePath);
    }
  }, [tokenOut]);

  useEffect(() => {
    if (tokenIn?.contractAddress && tokenOut?.contractAddress) {
      if (currentInputToken.current === 'in' && amountIn !== 0) {
        getAmount('in', amountIn, payType, quotePath);
      }
      if (currentInputToken.current === 'out' && amountOut !== 0) {
        getAmount('out', amountOut, payType, quotePath);
      }
    }
  }, [advConfig.slip, advConfig.slipType]);

  /*  useEffect(() => {
    if (tokenIn?.contractAddress && tokenOut?.contractAddress) {
      getTokenPriceInAndOut({
        tokenIn: tokenIn.contractAddress,
        tokenOut: tokenOut.contractAddress,
      });
    }
  }, [tokenIn, tokenOut]); */

  const tokenExchangeRate = useMemo(() => {
    if (tokenIn?.contractAddress && tokenOut?.contractAddress && exchangeRate) {
      return `1 ${tokenIn.symbol} = ${exchangeRate} ${tokenOut.symbol}`;
    } else {
      return '-';
    }
  }, [tokenIn, tokenOut, exchangeRate]);

  const handleMainButton = () => {
    if (!isLogin) {
      setIsModalOpen(true);
    } else {
      handleSwap({
        amountIn,
        amountOut,
        tokenIn: tokenIn.contractAddress,
        tokenOut: tokenOut.contractAddress,
      });
    }
  };

  return (
    <div className="swap-comp">
      <div className="swap-comp-config">
        <ChooseChain
          disabledChain={true}
          chainList={swapChain}
          onChange={(v) => changeWalletChain(v)}
          hideChain={true}
          wrapClassName="swap-chooose-chain"
        />
        <AdvConfig
          initData={initAdvConfig}
          onClose={(data) => {
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
            getAmountDebounce('in', v, payType, quotePath);
          }}
        />
        <div className="token-info">
          <div></div>
          {isLogin ? (
            <div>Balance: {balanceIn?.toString?.() || '0'}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="exchange">
        <img
          className="exchange-img"
          src="/exchange.svg"
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
            getAmountDebounce('out', v, payType, quotePath);
          }}
        />
        <div className="token-info">
          <div></div>
          {isLogin ? (
            <div>Balance: {balanceOut?.toString?.() || '0'} </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="bottom-info">
        <div className="exchange-rate">
          <span>Reference Exchange Rate</span>
          {showSkeleton ? (
            <Skeleton.Button active size="small" />
          ) : (
            !loading && (
              <span className={'text-easy-in'}>{tokenExchangeRate}</span>
            )
          )}
        </div>
        <div className="exchange-fee">
          <span>Estinated Fees</span>
          {showSkeleton ? (
            <Skeleton.Button active size="small" />
          ) : (
            !loading && (
              <span className={'text-easy-in'}>
                {`${gasPrice ? gasPrice + ' Gwei' : '-'} `}
              </span>
            )
          )}
        </div>
        <div className="exchange-path">
          <span>Quote Path</span>
          <QuotoPathSelect
            data={quotePath}
            onChange={(key: string) => {
              setQuotePath(key);
              const amount =
                currentInputToken.current === 'in' ? amountIn : amountOut;
              getAmount(currentInputToken.current, amount, payType, key);
            }}
          />
        </div>
        <div className="service-fee">
          <span>Service Fees</span>
          <UsePass
            type="swap"
            payType={payType}
            onChange={(v) => {
              setPayType(v);
              const amount =
                currentInputToken.current === 'in' ? amountIn : amountOut;
              getAmount(currentInputToken.current, amount, v, quotePath);
            }}
          />
        </div>
      </div>
      <Button
        className="swap-button"
        disabled={buttonDisable}
        loading={buttonLoading}
        onClick={handleMainButton}
      >
        {buttonDesc}
      </Button>
      <SelectTokenModal
        open={openSelect}
        disabledTokens={[
          tokenIn?.contractAddress?.toLowerCase?.(),
          tokenOut?.contractAddress?.toLowerCase?.(),
        ]}
        chainId={chainId}
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
