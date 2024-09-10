import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import BottomButton from '../../component/BottomButton';
// import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import { CountContext } from '@/Layout';
import { BigNumber, ethers } from 'ethers';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import CommonModal from '@/components/CommonModal';
import { zeroAddress } from '@utils/constants';
import Decimal from 'decimal.js';
// import { UniswapV2RouterAbi } from '@abis/UniswapV2RouterAbi';
import dayjs from 'dayjs';
import { UncxAbi } from '@abis/UncxAbi';
import Loading from '@/components/allLoad/loading';
import { toWeiWithDecimal } from '@utils/convertEthUnit';
import { useTranslation } from 'react-i18next';
import NotificationChange from '@/components/message';
import PairInfo, { PairInfoPropsType } from '@/components/PairInfo';
import { useTokenInfo } from '@/hook/useTokenInfo';
import { ERC20Abi } from '@abis/ERC20Abi';
import InputNumberWithString from '@/components/InputNumberWithString';
import LockLpButton from './components/LockLPToken';
import {
  useWalletBalance,
  useReadContract,
  useActiveAccount,
  useSendTransaction,
} from 'thirdweb/react';
import { client } from '@/client';
import { getContract, prepareContractCall } from 'thirdweb';
function ManagePairDetail() {
  const { t } = useTranslation();
  const router = useParams();
  const history = useNavigate();
  const {
    contractConfig,
    chainId,
    browser,
    openTradeModal,
  } = useContext(CountContext);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [, setInfoData] = useState<any>();
  const [lockLpData, setLockLpData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState('');
  const [isButton, setIsButton] = useState(false);
  //  loading
  const [loading, setLoading] = useState(false);
  // 池子token余额
  const [resever0balance, setResever0balance] = useState<string>('0');
  const [resever1balance, setResever1balance] = useState<string>('0');
  // 用户对应token余额,
  const [tokenETH, setTokenETH] = useState<string>('0');
  const [erc20Token, setErc20Token] = useState<string>('0');
  const [erc20TokenAddress, setErc20TokenAddress] = useState<string>('');
  // modal输入框数据
  const [WETHAmount, setWETHAmount] = useState('');
  const [erc20Amount, setErc20Amount] = useState('');
  // 按钮状态
  const [approveLoading, setApproveLoading] = useState(false);
  const [burnLoading, setBurnLoading] = useState(false);
  const [lockTokenIndex, setLockTokenIndex] = useState(null);
  const [tokenInfo] = useTokenInfo(erc20TokenAddress);
  const { allChain }: any = useContext(CountContext);
  //  连接的账号和监听账号
  const activeAccount = useActiveAccount();
  const { data } = useWalletBalance({
    chain: allChain,
    address: activeAccount?.address,
    client,
  });
  // 生成合约
  const pairContract = getContract({
    client,
    chain: allChain,
    address: router?.pair,
    abi: ERC20Abi as any,
  });

  const uniSwapV2PairContract = getContract({
    client,
    chain: allChain,
    address: router?.pair,
    abi: UniswapV2PairAbi as any,
  });
  const uncxAddressContract = getContract({
    client,
    chain: allChain,
    address: contractConfig?.uncxAddress,
    abi: UncxAbi as any,
  });
  // 获取  getUserNumLocksForToken
  const { data: getUserNumLocksForToken }: any = useReadContract({
    contract: uncxAddressContract,
    method: 'getUserNumLocksForToken',
    params: [activeAccount?.address, router?.pair],
  });

  const {
    mutate: sendTx,
    data: transactionResult,
    error: isError,
  } = useSendTransaction({
    payModal: false,
  });

  useEffect(() => {
    if (transactionResult?.transactionHash) {
      setBurnLoading(true);
      setIsOpenStatus('');
      setOpen(false);
      setIsButton(false);
      history(
        `/dapps/tokencreation/results/launch/${transactionResult?.transactionHash}`
      );
    }
    if (isError) {
      setBurnLoading(true);
      setIsOpenStatus('');
      setOpen(false);
      setIsButton(false);
    }
  }, [transactionResult, isError]);

  // 获取  getUserLockForTokenAtIndex
  const {
    data: getUserLockForTokenAtIndex,
    isLoading: isGetUserLockForTokenAtIndex,
  }: any = useReadContract({
    contract: uncxAddressContract,
    method: 'getUserLockForTokenAtIndex',
    params: [activeAccount?.address, router?.pair, lockTokenIndex?.value],
  });
  useEffect(() => {
    if (
      !isGetUserLockForTokenAtIndex &&
      getUserLockForTokenAtIndex &&
      lockTokenIndex?.balance
    ) {
      updateLoading(lockTokenIndex?.balance, getUserLockForTokenAtIndex?.[1]);
    }
  }, [
    isGetUserLockForTokenAtIndex,
    getUserLockForTokenAtIndex,
    lockTokenIndex,
  ]);
  const updateLoading = (balance: any, data: any) => {
    const infoData = {
      paidAddress: {
        label: 'Pair address',
        value: router?.pair,
        show: `${router?.pair?.slice(0, 4)}...${router?.pair?.slice(router?.pair?.length - 4)}`,
      },
      balance: {
        label: 'Balance',
        value: balance,
        show: balance.toString(),
      },
      lockAmount: {
        label: 'Lock amount',
        value: data,
        show: new Decimal(data.toString())
          .div(new Decimal(10).pow(decimalsParams))
          .toString(),
      },
    };
    setInfoData(infoData);
    setLoading(true);
  };

  // 获取  decimals
  const { data: decimalsParams }: any = useReadContract({
    contract: uniSwapV2PairContract,
    method: 'decimals',
    params: [],
  });

  // 获取  getReserves
  const { data: getReserves, isLoading: isGetReserves }: any = useReadContract({
    contract: uniSwapV2PairContract,
    method: 'getReserves',
    params: [],
  });
  // 获取  token0
  const { data: token0 }: any = useReadContract({
    contract: uniSwapV2PairContract,
    method: 'token0',
    params: [],
  });
  // 获取  token1
  const { data: token1 }: any = useReadContract({
    contract: uniSwapV2PairContract,
    method: 'token1',
    params: [],
  });

  const token0Contract = getContract({
    client,
    chain: allChain,
    address: token0,
    abi: ERC20Abi as any,
  });

  const token1Contract = getContract({
    client,
    chain: allChain,
    address: token1,
    abi: ERC20Abi as any,
  });
  // 获取  balanceOf
  const {
    data: token1ContractBalance,
    isLoading: isToken1ContractBalance,
  }: any = useReadContract({
    contract: token1Contract,
    method: 'balanceOf',
    params: [activeAccount?.address],
  });
  // 获取  balanceOf
  const {
    data: token0ContractBalance,
    isLoading: isToken0ContractBalance,
  }: any = useReadContract({
    contract: token0Contract,
    method: 'balanceOf',
    params: [activeAccount?.address],
  });

  // 获取  decimals
  const { data: decimalsPar, isLoading: isDecimals }: any = useReadContract({
    contract: pairContract,
    method: 'decimals',
    params: [],
  });
  // 获取  balanceOf
  const { data: balanceOf, isLoading: isBalanceOf }: any = useReadContract({
    contract: pairContract,
    method: 'balanceOf',
    params: [activeAccount?.address],
  });

  const pairInfoData: PairInfoPropsType = {
    token0: {
      logo: tokenInfo?.logoLink,
      symbol: router?.t0,
    },
    token1: {
      logo: contractConfig?.wethLogo,
      symbol: contractConfig?.tokenSymbol,
    },
  };
  const getPairInfo = async () => {
    let lpTokenBalance = null as any;
    if (router?.pair === zeroAddress) {
      lpTokenBalance = data?.displayValue;
    } else if (
      router?.pair.toLocaleLowerCase() !== zeroAddress.toLocaleLowerCase() &&
      router?.pair.toLocaleLowerCase() !== contractConfig?.wethAddress.toLocaleLowerCase()
    ) {
      if (!isBalanceOf) {
        if (Number(balanceOf)) {
          lpTokenBalance = new Decimal(balanceOf.toString()).div(
            new Decimal(10).pow(decimalsPar)
          );
        } else {
          lpTokenBalance = '0';
        }
      }
    }
    if (token0?.toLowerCase() < token1?.toLowerCase()) {
      setResever0balance(
        formatDecimalString(ethers.utils.formatEther(getReserves?.[0]))
      );
      setResever1balance(
        formatDecimalString(ethers.utils.formatEther(getReserves?.[1]))
      );
    } else {
      setResever1balance(
        formatDecimalString(ethers.utils.formatEther(getReserves?.[0]))
      );
      setResever0balance(
        formatDecimalString(ethers.utils.formatEther(getReserves?.[1]))
      );
    }
    if (token0?.toLowerCase() === contractConfig?.wethAddress?.toLowerCase()) {
      setErc20TokenAddress(token1);
      setTokenETH(formatDecimalString(ethers.utils.formatEther(data?.value)));
      setErc20Token(
        formatDecimalString(ethers.utils.formatEther(token1ContractBalance))
      );
    } else if (token1?.toLowerCase() === contractConfig?.wethAddress?.toLowerCase()) {
      setErc20TokenAddress(token0);
      setTokenETH(formatDecimalString(ethers.utils.formatEther(data?.value)));
      setErc20Token(
        formatDecimalString(ethers.utils.formatEther(token0ContractBalance))
      );
    }
    setTokenBalance(lpTokenBalance.toString());
    const nu = Number(getUserNumLocksForToken?.toString())
    if (nu) {
      for (let i = 0; i <= nu - 1; i++) {
        setLockTokenIndex({ value: i, balance: lpTokenBalance.toString() });
      }
    } else {
      updateLoading(lpTokenBalance, '0');
    }
  };
  // 格式化
  function formatDecimalString(str) {
    // 移除末尾的 .0
    let formattedStr = str.replace(/\.0+$/, '');
    // 如果字符串以 . 结尾，也移除 .
    formattedStr = formattedStr.replace(/\.$/, '');
    // 分离整数部分和小数部分
    const parts = formattedStr.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';

    // 对整数部分进行每三位加逗号的格式化
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // 重新组合整数部分和小数部分
    formattedStr = `${integerPart}${decimalPart ? '.' + decimalPart : ''}`;
    return formattedStr;
  }
  useEffect(() => {
    if (
      !isBalanceOf &&
      !isDecimals &&
      router?.pair &&
      !isGetReserves &&
      !isToken1ContractBalance &&
      !isToken0ContractBalance &&
      contractConfig?.uncxAddress
    ) {
      getPairInfo();
    }
  }, [
    isDecimals,
    chainId,
    contractConfig,
    router?.pair,
    isBalanceOf,
    isGetReserves,
    isToken1ContractBalance,
    isToken0ContractBalance,
    contractConfig,
  ]);
  // 烧流动性
  const burnLP = async () => {
    try {
      // 合约 授权   approve
      const txsss: any = prepareContractCall({
        contract: pairContract,
        method: 'create',
        params: [
          zeroAddress,
          BigNumber.from(toWeiWithDecimal(tokenBalance, 18)),
        ],
      });
      await sendTx(txsss);
    } catch (e) {
      setIsButton(false);
      setBurnLoading(false);
      NotificationChange('error', 'Burn Liquidity Failed');
    }
  };

  // 查询额度，获取授权
  // const Allowance = async () => {
  //   const erc20TokenContract = new ethers.Contract(
  //     erc20TokenAddress,
  //     ERC20Abi,
  //     signer
  //   );
  //   const address = await signer.getAddress();
  //   const ecr20Allowance = await erc20TokenContract.allowance(
  //     address,
  //     contractConfig?.uniswapV2RouterAddress
  //   );
  //   console.log('ecr20Allowance===========', ecr20Allowance);
  //   const uuuu = ecr20Allowance.lt(
  //     BigNumber.from(toWeiWithDecimal(erc20Amount, 18))
  //   );
  //   console.log('uuuu---------', uuuu);
  //   // ERC20Contract
  //   if (ecr20Allowance.lt(BigNumber.from(toWeiWithDecimal(erc20Amount, 18)))) {
  //     setApproveLoading(true);
  //     const approveTx = await erc20TokenContract.approve(
  //       contractConfig?.uniswapV2RouterAddress,
  //       BigNumber.from(toWeiWithDecimal(erc20Amount, 18))
  //     );
  //     const tx = await approveTx.wait();
  //     if (tx?.status === 1) {
  //       setApproveLoading(false);
  //       return true;
  //     } else {
  //       NotificationChange('error', 'Approve failed');
  //       setApproveLoading(false);
  //       setIsButton(false);
  //       return false;
  //     }
  //   }
  //   if (ecr20Allowance.gte(BigNumber.from(toWeiWithDecimal(erc20Amount, 18))))
  //     return true;
  // };
  // 增加流动性
  const addLp = async () => {
    setApproveLoading(false)
    // const isAllowance = await Allowance();
    // if (isAllowance) {
    //   try {
    //     setApproveLoading(false);
    //     const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    //     const signer = await web3Provider.getSigner();
    //     const v2RouterContract = new ethers.Contract(
    //       contractConfig?.uniswapV2RouterAddress,
    //       UniswapV2RouterAbi,
    //       signer
    //     );
    //     const addLqTx = await v2RouterContract.addLiquidityETH(
    //       erc20TokenAddress,
    //       BigNumber.from(toWeiWithDecimal(erc20Amount, 18)),
    //       0,
    //       0,
    //       router?.pair,
    //       Math.floor(Date.now() / 1000) + 60 * 10,
    //       {
    //         gasLimit: 3000000,
    //         value: BigNumber.from(toWeiWithDecimal(WETHAmount, 18)),
    //       }
    //     );
    //     const tx = await addLqTx.wait();
    //     if (tx?.status === 1) {
    //       NotificationChange('success', 'Add Liquidity Success');
    //       setErc20Amount('');
    //       setWETHAmount('');
    //       await getPairInfo();
    //     }
    //     console.log(tx);
    //     setApproveLoading(false);
    //     setIsButton(false);
    //   } catch (error) {
    //     setApproveLoading(false);
    //     setIsButton(false);
    //     console.log(error);
    //   }
    // } else {
    //   setApproveLoading(false);
    //   setIsButton(false);
    // }
  };
  const item = (name?: string) => {
    return (
      <div style={{ color: '#fff', marginBottom: '6px' }}>
        <PairInfo data={pairInfoData} />
        {/* erc20Token */}
        {name === 'Add' && (
          <InputNumberWithString
            value={erc20Amount}
            onChange={(value) => {
              setErc20Amount(value);
            }}
            balance={erc20Token}
            clickMax={() => {
              setErc20Amount(erc20Token);
            }}
            addonUnit={router?.t0}
          />
        )}
        {name === 'Add' && (
          // WETH
          <InputNumberWithString
            value={WETHAmount}
            onChange={(value) => {
              setWETHAmount(value);
            }}
            balance={tokenETH}
            clickMax={() => {
              setWETHAmount(tokenETH);
            }}
            addonUnit={'ETH'}
          />
        )}
        {name === 'Burn' && (
          <p>{t('mint.Once')}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        // title={`${router?.t0} / ${router?.t1}`}
        title={
          !openTradeModal
            ? t('mint.Management')
            : `${router?.t0} / ${router?.t1}`
        }
      />
      {loading ? (
        <>
          {/* <InfoList className="manage-token-detail-info" data={data} /> */}
          <div className="pair-manage-trad">
            <div className="pair-manage-header">
              <PairInfo data={pairInfoData} />
            </div>
            <div className="pair-manage-content">
              <span className="pair-manage-trad-title">
                {t('mint.Liquidity')}
              </span>
              <div className="pair-manage-trad-content">
                <span>{router?.t0}</span>
                <span>{resever0balance}</span>
              </div>
              <div className="pair-manage-trad-content">
                <span>{router?.t1}</span>
                <span>{resever1balance}</span>
              </div>
            </div>
            <div
              className="pair-manage-content"
              style={{ margin: '32px auto' }}
            >
              <span className="pair-manage-trad-title">
                {t('mint.LiquidityLock')}
              </span>
              <div className="pair-manage-trad-content">
                <span>{t('mint.Maturity')}</span>
                <span>
                  {lockLpData?.unlockDate
                    ? dayjs
                        .unix(lockLpData.unlockDate.toString())
                        .format('YYYY-MM-DD HH:mm')
                    : '-'}
                </span>
              </div>
            </div>
          </div>
          <div className="pair-manage-button">
            <LockLpButton
              pairInfo={pairInfoData}
              lockLpData={lockLpData}
              setLockLpData={setLockLpData}
            />
            <BottomButton
              className="burn-lp-button"
              text={t('mint.Burn')}
              onClick={() => {
                setIsOpenStatus('Burn');
                setOpen(true);
              }}
              danger
            />
          </div>
        </>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <CommonModal
        open={open}
        title={isOpenStatus === 'Add' ? 'Add Liquidity' : t('token.BurnLP')}
        footer={null}
        className="mint-common-modal pair-LP-modal"
        onCancel={() => {
          if (!isButton) {
            setOpen(false);
            setIsOpenStatus('');
          }
        }}
      >
        {isOpenStatus === 'Add' && item('Add')}
        {isOpenStatus === 'Burn' && item('Burn')}
        {/* <p style={{ height: '20px' }}></p> */}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <BottomButton
            className={'cancel-button'}
            ghost
            isBack={false}
            // loading={isButton}
            text={'Cancel'}
            onClick={() => {
              if (!isButton) {
                setOpen(false);
                setIsOpenStatus('');
              }
            }}
          />
          <BottomButton
            // ghost
            className={'confirm-button'}
            isBack={false}
            loading={isButton}
            text={
              approveLoading
                ? 'Approving'
                : burnLoading
                  ? 'burning'
                  : isOpenStatus
            }
            onClick={() => {
              if (isOpenStatus === 'Add' && erc20Amount && WETHAmount) {
                setIsButton(true);
                addLp();
              } else if (isOpenStatus === 'Burn') {
                setIsButton(true);
                burnLP();
              }
            }}
          />
        </div>
      </CommonModal>
    </>
  );
}

export default ManagePairDetail;
