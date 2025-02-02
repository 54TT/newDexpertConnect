import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Skeleton } from 'antd';
import NotificationChange from '@/components/message';
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
// import {
//   sendAndConfirmTransaction,
//   prepareContractCall,
//   toWei,
// } from 'thirdweb';
import {
  getUniswapV2RouterContract,
  getUniversalRouterContract,
} from '@utils/contracts';
import { debounce } from 'lodash-es';
import './index.less';
import SelectTokenModal from '@/components/SelectTokenModal';
import Decimal from 'decimal.js';
import AdvConfig, { AdvConfigType } from '../AdvConfig';
import { CountContext } from '@/Layout';
import { PermitSingle, getPermitSignature } from '@utils/permit2';
import { BigNumber, ethers } from 'ethers';
import { Permit2Abi } from '@abis/Permit2Abi';
import { ERC20Abi } from '@abis/ERC20Abi';
import { CHAIN_NAME_TO_CHAIN_ID } from '@utils/constants';
import useButtonDesc from '@/hook/useButtonDesc';
import { useTranslation } from 'react-i18next';
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
import { getSwapFee } from '@utils/getSwapFee';
import DefaultTokenImg from '@/components/DefaultTokenImg';
import { expandToDecimalsBN } from '@utils/utils';
import ChangeChain from '@/components/ChangeChain';
import { reportPayType } from '@/api';
import { valueType } from 'antd/es/statistic/utils';
import { getContract } from 'thirdweb';
import { client } from '@/client';
import { useActiveAccount,  } from 'thirdweb/react';
import { useReadContract } from 'thirdweb/react';

interface SwapCompType {
  changeAble?: boolean; // 是否可修改Token || 网络
  initChainId?: string; // 初始化的chainId;
  initToken?: [tokenIn: TokenItemData, toeknOut: TokenItemData]; // 初始化的token
}
function SwapComp({ initChainId, initToken, changeAble = true }: SwapCompType) {
  const {
    provider,
    contractConfig,
    setIsModalOpen,
    chainId,
    setChainId,
    transactionFee,
    setTransactionFee,
    loginProvider,
    allChain,
  } = useContext(CountContext);
  const { t } = useTranslation();
  const [amountIn, setAmountIn] = useState<valueType>('0');
  const [amountOut, setAmountOut] = useState<valueType>('0');
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
  const [refreshPass, setRefreshPass] = useState(false);
  const { getAll } = Request();
  const activeAccount = useActiveAccount();
  // 生成合约
  const permit2Contract = getContract({
    client,
    chain: allChain,
    address: contractConfig?.permit2Address,
    abi: Permit2Abi as any,
  });
  console.log(permit2Contract)
  const tokenInAddressContract = getContract({
    client,
    chain: allChain,
    address: tokenIn?.contractAddress,
    abi: ERC20Abi as any,
  });

  // 获取
  const { data: allowancePar, }: any = useReadContract({
    contract: tokenInAddressContract,
    method: 'allowance',
    params: [activeAccount?.address, contractConfig?.permit2Address],
  });
  console.log(allowancePar)

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
      setAmountIn('0');
      setAmountOut('0');
    }
    if (initChainId) {
      changeWalletChain(initChainId);
    }
  };

  useEffect(() => {
    const amount = currentInputToken.current === 'in' ? amountIn : amountOut;
    getAmount(currentInputToken.current, amount, quotePath);
  }, [transactionFee?.swap]);

  useEffect(() => {
    initData();
  }, [initToken]);

  const getTransactionFee = async (data) => {
    const fee = await getSwapFee({ ...data, swapType: 0 });
    setTransactionFee({
      swap: fee,
    });
  };
  const getGasPrice = async () => {
    const gas: BigNumber = await provider.getGasPrice();
    const gasGwei = gas.toNumber() / 10 ** 9;
    return gasGwei < 0.0001
      ? '< 0.0001'
      : parseFloat(gasGwei.toFixed(4)).toString();
  };

  const getAmountExchangeRate = async (data) => {
    if (
      !tokenIn?.contractAddress &&
      !tokenOut?.contractAddress &&
      !transactionFee?.swap
    ) {
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
    const { uniswapV2RouterAddress } = contractConfig;
    const data = [
      chainId,
      provider,
      quotePath === '0'
        ? await getUniswapV2RouterContract(provider, uniswapV2RouterAddress)
        : null,
      [tokenIn.contractAddress, Number(tokenIn.decimals)],
      [tokenOut.contractAddress, Number(tokenOut.decimals)],
      new Decimal(1),
      new Decimal(0),
      transactionFee.swap,
    ].filter((item) => item !== null);

    const res = await Promise.all([getGasPrice(), getAmountExchangeRate(data)]);
    return res;
  }, [
    provider,
    tokenIn?.contractAddress,
    tokenOut?.contractAddress,
    quotePath,
    chainId,
    transactionFee.swap,
  ]);

  const [data, loading, showSkeleton] = useInterval(
    getExchangeRateAndGasPrice,
    10000,
    [tokenIn, tokenOut, quotePath, chainId, transactionFee.swap]
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

    const amountInDecimal = new Decimal(amountIn || '0');
    if (amountInDecimal.lessThanOrEqualTo(balanceIn)) {
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
      amountInDecimal.lessThanOrEqualTo(balanceIn)
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

  const exchange = () => {
    const [newTokenIn, newTokenOut] = [tokenOut, tokenIn];
    setTokenIn(newTokenIn);
    setTokenOut(newTokenOut);
    setAmountIn(amountOut);
    setAmountOut('0');
    getAmount('in', amountOut || '0', quotePath);
  };

  const getAmount = async (
    type: 'in' | 'out',
    value: valueType,
    quotePath: string
  ) => {
    if (value == null || value === '0') return;
    if (
      ((type === 'in' || type === 'out') && !tokenIn?.contractAddress) ||
      !tokenOut?.contractAddress
    ) {
      return;
    }
    setButtonLoading(true);
    setButtonDescId('7');
    const { uniswapV2RouterAddress } = contractConfig;
    const slip = advConfig.slipType === '0' ? 0.02 : advConfig.slip;
    const param = [
      chainId,
      provider,
      quotePath === '0'
        ? await getUniswapV2RouterContract(provider, uniswapV2RouterAddress)
        : null,
      [tokenIn.contractAddress, Number(tokenIn.decimals)],
      [tokenOut.contractAddress, Number(tokenOut.decimals)],
      new Decimal(value),
      new Decimal(slip),
      transactionFee.swap,
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
        const aa = amount.toString();
        setAmountOut(Number(aa));
      } catch (e) {
        return null;
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
        setAmountIn(amount.toString());
      } catch (e) {
        return null;
      }
      setInLoading(false);
    }
    setButtonLoading(false);
    setButtonDescId('1');
  };

  const getAmountDebounce = useCallback(debounce(getAmount, 500), [
    tokenIn,
    tokenOut,
    advConfig,
    provider,
  ]);
  // 处理approve
  const handleApprove = async (tokenContract: ethers.Contract) => {
    const { permit2Address } = contractConfig;
    let approveTx;
    try {
      // 等待approve;
      setButtonDescId('5');
      setButtonLoading(true);
      approveTx = await tokenContract.approve(
        permit2Address,
        BigNumber.from(2).pow(BigNumber.from(256)).sub(BigNumber.from(1))
      );
    } catch (e) {
      setButtonDescId('1');
      setButtonLoading(false);
      return null;
    }
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
    const { tradeDeadline } = advConfig;
    const { uint, value } = tradeDeadline;
    const intervalTime = uint === 'h' ? value * 3600 : value * 30;
    const dateTimeStamp =
      Number(String(Date.now()).slice(0, 10)) + intervalTime;
    const permitSingle: PermitSingle = {
      sigDeadline: dateTimeStamp,
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
      console.log('eip712Domain-----------', eip712Domain);
      console.log('PERMIT2_PERMIT_TYPE-----------', PERMIT2_PERMIT_TYPE);
      console.log('permit-----------', permit);

      const signature = await signer._signTypedData(
        eip712Domain,
        PERMIT2_PERMIT_TYPE,
        permit
      );
      console.log('signature-----------', signature);
      signatureData = { permit, signature };
      console.log('signatureData-----------', signatureData);
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
      [tokenIn.contractAddress, tokenIn.decimals],
      [tokenOut.contractAddress, tokenOut.decimals],
      new Decimal(amountIn),
      new Decimal(amountOut),
      recipientAddress,
      payType == '0' ? 1 : 0,
      0,
      quotePath === '1' ? swapV3Pool?.fee : null,
      permit,
      signature,
    ].filter((item) => item !== null);
    const getSwapBytesFn = async (tokenIn, tokenOut) => {
      if (
        (tokenIn.contractAddress.toLowerCase() === ethAddress.toLowerCase() ||
          tokenIn.contractAddress.toLowerCase() ===
            wethAddress.toLowerCase()) &&
        (tokenOut.contractAddress.toLowerCase() === ethAddress.toLowerCase() ||
          tokenOut.contractAddress.toLowerCase() === wethAddress.toLowerCase())
      ) {
        return await getSwapEthAndWeth.apply(null, [
          chainId,
          [tokenIn.contractAddress, Number(tokenIn.decimals)],
          [tokenOut.contractAddress, Number(tokenOut.decimals)],
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
    let etherValue: any = BigNumber.from(0);
    if (tokenIn.contractAddress === contractConfig.ethAddress) {
      etherValue = expandToDecimalsBN(new Decimal(amountIn), 18);
    }
    return { commands, inputs, etherValue };
  };

  const sendReportPayType = async (tx) => {
    const token = Cookies.get('token');
    const payTypeMap = {
      0: 0, // pay fee
      1: 4, // glodenPass
      2: 2, // dpass
    };
    return reportPayType(getAll, {
      data: {
        tx,
        payType: payTypeMap[payType],
      },
      options: {
        token,
        chainId,
      },
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
    const { tradeDeadline } = advConfig;
    const { uint, value } = tradeDeadline;
    const intervalTime = uint === 'h' ? value * 3600 : value * 60;
    const dateTimeStamp =
      Number(String(Date.now()).slice(0, 10)) + intervalTime;
    let tx;
    try {
      tx = await universalRouterWriteContract['execute(bytes,bytes[],uint256)'](
        commands,
        inputs,
        dateTimeStamp,
        {
          value: etherValue,
        }
      );
      NotificationChange(
        'success',
        t('Slider.succ'),
        <a href={`${scan}${tx.hash}`} target="_blank">
          {t('Slider.eth')}
        </a>
      );
    } catch (e) {
      NotificationChange('error', t('Slider.err'));
      setButtonLoading(false);
      setButtonDescId('1');
      console.error(e);
      return;
    }
    setButtonLoading(false);
    setButtonDescId('1');
    await sendReportPayType(tx?.hash);
    setPayType('0');
    setAmountIn('0');
    setAmountOut('0');
    setRefreshPass(true);
  };

  useEffect(() => {
    if (refreshPass) {
      setRefreshPass(false);
    }
  }, [refreshPass]);
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
    console.log(1111111111111111111);
    setButtonLoading(true);
    setButtonDescId('9');
    //@ts-ignore
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const signerAddress = await signer.getAddress();
    // permit2Contract
    const permit2Contract = new ethers.Contract(
      permit2Address,
      Permit2Abi,
      signer
    );
    // tokenInAddressContract
    const tokenInContract = new ethers.Contract(
      tokenIn.contractAddress,
      ERC20Abi,
      signer
    );
    console.log(2222222222222222);
    if (tokenIn.contractAddress !== zeroAddress) {
      console.log(444444444444);
      // allowancePar
      const balance: BigNumber = await queryAllowance(
        tokenInContract,
        signerAddress,
        permit2Address
      );
      const decimals = await tokenIn.decimals;
      // 余额为0 或者余额 小于amount 需要approve
      if (
        balance.isZero() ||
        balance.lte(
          BigNumber.from(
            new Decimal(amountIn).mul(new Decimal(10 ** decimals)).toFixed(0)
          )
        )
      ) {
        // 等待approve;
        // setButtonDescId('5');
        // setButtonLoading(true);
        // // 合约   approve
        // const approveTx: any = prepareContractCall({
        //   contract: tokenInAddressContract,
        //   method: 'approve',
        //   params: [
        //     contractConfig?.permit2Address,
        //     BigNumber.from(2).pow(BigNumber.from(256)).sub(BigNumber.from(1)),
        //   ],
        // });
        // const transactionReceipt = await sendAndConfirmTransaction({
        //   account: activeAccount,
        //   transaction: approveTx,
        // });
        // if (transactionReceipt?.status === 'success') {
        // }
        const successApprove = await handleApprove(tokenInContract);
        if (successApprove) {
          const { permit, signature } = await signPermit({
            signerAddress,
            token: tokenIn.contractAddress,
            amount: expandToDecimalsBN(new Decimal(amountIn), decimals),
            permit2Contract,
            signer,
          });
          console.log('permit-----------', permit);
          console.log('signature-----------', signature);
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
          token: tokenIn.contractAddress,
          amount: expandToDecimalsBN(new Decimal(amountIn), decimals),
          permit2Contract,
          signer,
        });
        console.log('permit-----------', permit);
        console.log('signature-----------', signature);
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
      console.log(33333333333333333);
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
    if (contractConfig?.defaultTokenIn) {
      const { defaultTokenIn, defaultTokenOut } = contractConfig;
      setTokenIn(defaultTokenIn);
      setTokenOut(defaultTokenOut);
    }
    setAmountIn('0');
    setAmountOut('0');
  }, [contractConfig]);
  const changeWalletChain = async (v: string) => {
    const evmChainId = CHAIN_NAME_TO_CHAIN_ID[v];
    const evmChainIdHex = `0x${Number(evmChainId).toString(16)}`;
    if (!isLogin) {
      setChainId(evmChainId);
    } else {
      // 有evm钱包环境
      try {
        //@ts-ignore
        await loginProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: evmChainIdHex,
            },
          ],
        });
      } catch (e) {
        return null;
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
    }
  }; */

  useEffect(() => {
    if (
      tokenIn?.contractAddress &&
      tokenOut?.contractAddress &&
      amountOut !== '0'
    ) {
      currentInputToken.current = 'out';
      getAmount('out', amountOut, quotePath);
    }
  }, [tokenIn]);

  const getTokenBalance = useCallback(
    async (token, dispatch) => {
      const { wethAddress } = contractConfig;
      if (checkConnection() && token) {
        // @ts-ignore
        const injectProvider = new ethers.providers.Web3Provider(loginProvider);
        const balance = await getBalanceRpc(injectProvider, token, wethAddress);
        dispatch(balance);
      }
    },
    [contractConfig, loginProvider]
  );
  useEffect(() => {
    if (isLogin && contractConfig?.defaultTokenIn) {
      getTokenBalance(tokenIn?.contractAddress, setBalanceIn);
    }
  }, [tokenIn, isLogin, chainId, contractConfig, loginProvider]);

  useEffect(() => {
    if (isLogin && contractConfig?.defaultTokenOut) {
      getTokenBalance(tokenOut?.contractAddress, setBalanceOut);
    }
  }, [tokenOut, isLogin, chainId, loginProvider]);

  useEffect(() => {
    if (
      tokenOut?.contractAddress &&
      tokenIn?.contractAddress &&
      amountIn !== '0'
    ) {
      currentInputToken.current = 'in';
      getAmount('in', amountIn, quotePath);
    }
  }, [tokenOut]);

  useEffect(() => {
    if (tokenIn?.contractAddress && tokenOut?.contractAddress) {
      if (currentInputToken.current === 'in' && amountIn !== '0') {
        getAmount('in', amountIn, quotePath);
      }
      if (currentInputToken.current === 'out' && amountOut !== '0') {
        getAmount('out', amountOut, quotePath);
      }
    }
  }, [advConfig?.slip, advConfig?.slipType]);

  /*  useEffect(() => {
    if (tokenIn?.contractAddress && tokenOut?.contractAddress) {
      getTokenPriceInAndOut({
        tokenIn: tokenIn.contractAddress,
        tokenOut: tokenOut.contractAddress,
      });
    }
  }, [tokenIn, tokenOut]); */

  useEffect(() => {
    getTransactionFee({ chainId, provider, payType });
  }, [chainId, provider, payType]);

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
        tokenIn,
        tokenOut,
      });
    }
  };

  return (
    <div className="swap-comp">
      <div className="swap-comp-config">
        {/* <ChooseChain
          disabledChain={true}
          chainList={swapChain}
          onChange={(v) => changeWalletChain(v)}
          hideChain={true}
          disabled={!changeAble}
          data={swapChain.find((i: any) => i.chainId === chainId)}
          wrapClassName="swap-chooose-chain"
        /> */}
        <ChangeChain
          wrapClassName="swap-chooose-chain"
          hideChain={true}
          disabled={!changeAble}
          disabledChain={true}
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
          <div className="dapp-sniper-right-token-label">
            {t('Slider.Send')}
          </div>
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => {
              currentSetToken.current = 'in';
              if (!changeAble) {
                return;
              }
              setOpenSelect(true);
            }}
          >
            <DefaultTokenImg name={tokenIn?.symbol} icon={tokenIn?.logoUrl} />
            <span>{tokenIn?.symbol}</span>
            {changeAble && (
              <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
            )}
          </div>
        </div>
        <ProInputNumber
          inputNumberProps={{
            stringMode: true,
          }}
          value={amountIn}
          className={inLoading && 'inut-font-gray'}
          onChange={(v) => {
            setAmountIn(v || '0');
            if (currentInputToken.current !== 'in')
              currentInputToken.current = 'in';
            getAmountDebounce('in', v, quotePath);
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
          <div className="dapp-sniper-right-token-label">
            {t('Slider.Receive')}
          </div>
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => {
              if (!changeAble) {
                return;
              }
              currentSetToken.current = 'out';
              setOpenSelect(true);
            }}
          >
            <DefaultTokenImg name={tokenOut?.name} icon={tokenOut?.logoUrl} />
            <span>
              {tokenOut?.symbol?.length > 6
                ? tokenOut?.symbol.slice(0, 5) + '..'
                : tokenOut?.symbol}
            </span>
            {changeAble && (
              <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
            )}
          </div>
        </div>
        <ProInputNumber
          value={amountOut}
          className={outLoading && 'inut-font-gray'}
          onChange={(v) => {
            setAmountOut(v || '0');
            if (currentInputToken.current !== 'out')
              currentInputToken.current = 'out';
            getAmountDebounce('out', v, quotePath);
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
          <span>{t('Slider.Quote Rate')}</span>
          {showSkeleton ? (
            <Skeleton.Button active size="small" />
          ) : (
            !loading && (
              <span className={'text-easy-in'}>{tokenExchangeRate}</span>
            )
          )}
        </div>
        <div className="exchange-fee">
          <span>{t('Slider.Estinmated Gas Fee')}</span>
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
          <span>{t('Slider.Dex')}</span>
          <QuotoPathSelect
            chainId={chainId}
            data={quotePath}
            onChange={(key: string) => {
              setQuotePath(key);
              const amount =
                currentInputToken.current === 'in' ? amountIn : amountOut;
              getAmount(currentInputToken.current, amount, key);
            }}
          />
        </div>
        <div className="service-fee">
          <span>{t('Slider.Service Fee')}</span>
          <UsePass
            type="swap"
            payType={payType}
            onChange={(v) => {
              setPayType(v);
            }}
            refreshPass={refreshPass}
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
