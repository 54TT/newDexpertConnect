import { useNavigate, useParams } from 'react-router-dom';
import React,{ useContext, useEffect, useMemo, useState } from 'react';
const BottomButton = React.lazy(() => import('../../component/BottomButton'));
const InfoList = React.lazy(() => import('../../component/InfoList'));
const PageHeader = React.lazy(() => import('../../component/PageHeader'));
const ToLaunchHeader = React.lazy(() => import('../../component/ToLaunchHeader'));
import './index.less';
import { CountContext } from '@/Layout';
import { BigNumber, ethers } from 'ethers';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
const CommonModal = React.lazy(() => import('@/components/CommonModal'));
import { zeroAddress } from '@utils/constants';
import Decimal from 'decimal.js';
import { UniswapV2RouterAbi } from '@abis/UniswapV2RouterAbi';
import dayjs from 'dayjs';
import { UncxAbi } from '@abis/UncxAbi';
import Loading from '@/components/allLoad/loading';
import getBalanceRpcEther from '@utils/getBalanceRpc';
import { toWeiWithDecimal } from '@utils/convertEthUnit';
import { useTranslation } from 'react-i18next';
function ManagePairDetail() {
  const { t } = useTranslation();
  const router = useParams();
  const history = useNavigate();
  const { loginProvider, contractConfig, chainId, browser } =
    useContext(CountContext);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [infoData, setInfoData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState('');
  const [isButton, setIsButton] = useState(false);
  //  loading
  const [loading, setLoading] = useState(false);
  const [pairContract, setPairContract] = useState<ethers.Contract>();
  const getPairInfo = async () => {  
    const { uncxAddress, wethAddress } = contractConfig;
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const address = await signer.getAddress();
    const lpTokenBalance = await getBalanceRpcEther(
      web3Provider,
      router?.pair,
      wethAddress
    );
    const uniSwapV2Pair = new ethers.Contract(
      router?.pair,
      UniswapV2PairAbi,
      signer
    );
    setPairContract(uniSwapV2Pair);
    const decimals = await uniSwapV2Pair.decimals();
    setTokenBalance(lpTokenBalance.toString());
    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
    const lockNum = await uncxContract.getUserNumLocksForToken(
      address,
      router?.pair
    );

    const calcLockAmount = async () => {
      let lockAmount = BigNumber.from(0);
      for (let i = 0; i <= lockNum - 1; i++) {
        const amount = (
          await uncxContract.getUserLockForTokenAtIndex(
            address,
            router?.pair,
            i
          )
        )[1];
        lockAmount = lockAmount.add(amount);
      }
      return lockAmount;
    };
    const lockAmount = await calcLockAmount();
    const infoData = {
      paidAddress: {
        label: 'Pair address',
        value: router?.pair,
        show: `${router?.pair?.slice(0, 4)}...${router?.pair?.slice(router?.pair?.length - 4)}`,
      },
      balance: {
        label: 'Balance',
        value: lpTokenBalance,
        show: lpTokenBalance.toString(),
      },
      lockAmount: {
        label: 'Lock amount',
        value: lockAmount,
        show: new Decimal(lockAmount.toString())
          .div(new Decimal(10).pow(decimals))
          .toString(),
      },
    };
    setInfoData(infoData);
    setLoading(true);
  };
  useEffect(() => {
    if (Number(chainId) === contractConfig?.chainId && router?.pair) {
      getPairInfo();
    }
  }, [loginProvider, chainId, contractConfig, router?.pair]);
  const burnLP = async () => {
    try {
      const tx = await pairContract.transfer(
        zeroAddress,
        BigNumber.from(toWeiWithDecimal(tokenBalance, 18))
      );
      const data = await tx.wait();
      if (tx?.hash && data) {
        history('/dapps/tokencreation/result/' + tx?.hash + '/burnLP');
      }
      setIsOpenStatus('');
      setOpen(false);
      setIsButton(false);
    } catch (e) {
      setIsButton(false);
    }
  };

  const removeLp = async () => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await web3Provider.getSigner();
      const v2RouterContract = new ethers.Contract(
        contractConfig?.uniswapV2RouterAddress,
        UniswapV2RouterAbi,
        signer
      );
      const walletAddress = await signer.getAddress();
      const token0 = await pairContract.token0();
      const balance = await pairContract.balanceOf(walletAddress);
      const approveTx = await pairContract.approve(
        contractConfig?.uniswapV2RouterAddress,
        balance
      );
      const tx = await approveTx.wait();
      if (tx?.status === 1) {
        const deadline = dayjs().add(10, 'm').unix();
        const removeLiquidityTx = await v2RouterContract.removeLiquidityETH(
          token0,
          balance,
          0,
          0,
          walletAddress,
          deadline
        );
        const data = await removeLiquidityTx.wait();
        if (removeLiquidityTx?.hash && data) {
          history(
            '/dapps/tokencreation/result/' +
              removeLiquidityTx?.hash +
              '/removeLP'
          );
        }
      }
      setIsOpenStatus('');
      setOpen(false);
      setIsButton(false);
    } catch (e) {
      setIsButton(false);
    }
  };

  const lockLpToken = async () => {
    history(`/dapps/tokencreation/lockLpList/${router?.pair}`);
  };
  const data = useMemo(
    () => Object?.keys?.(infoData || {})?.map?.((key) => infoData[key]) ?? [],
    [infoData]
  );
  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={`${router?.t0} / ${router?.t1}`}
      />
      {loading ? (
        <>
          <InfoList className="manage-token-detail-info" data={data} />
          <div className="pair-manage-button">
            <BottomButton
              text={t('token.LockLP')}
              onClick={() => lockLpToken()}
            />
            {['remove', 'burn'].map((item: string) => {
              return (
                <BottomButton
                  key={item}
                  className=""
                  ghost
                  danger
                  text={
                    item === 'burn' ? t('token.BurnLP') : t('token.RemoveLP')
                  }
                  onClick={() => {
                    setIsOpenStatus(item);
                    setOpen(true);
                  }}
                />
              );
            })}
          </div>
        </>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <CommonModal
        open={open}
        title={
          isOpenStatus === 'remove' ? t('token.RemoveLP') : t('token.BurnLP')
        }
        footer={null}
        className="mint-common-modal"
        onCancel={() => {
          if (!isButton) {
            setOpen(false);
            setIsOpenStatus('');
          }
        }}
      >
        {isOpenStatus === 'remove' && (
          <div style={{ color: '#fff', marginBottom: '6px' }}>
            <p style={{ marginBottom: '5px' }}> {t('token.remove')}</p>
            <p>
              {t('token.alls')}
              <span
                style={{
                  fontWeight: 'bold',
                  color: 'rgba(255,255,255,0.55)',
                  margin: '0 5px',
                }}
              >{`${router?.t0} / ${router?.t1}`}</span>
              {t('token.pools')}
            </p>
          </div>
        )}
        {isOpenStatus === 'burn' && (
          <div style={{ color: '#fff', marginBottom: '6px' }}>
            <p style={{ marginBottom: '5px' }}> {t('token.al')}</p>
            <p style={{ marginBottom: '5px' }}>
              {t('token.allss')}
              <span
                style={{
                  fontWeight: 'bold',
                  color: 'rgba(255,255,255,0.55)',
                  margin: '0 5px',
                }}
              >{`${router?.t0} / ${router?.t1}`}</span>
            </p>
            <p>{t('token.Note')}</p>
          </div>
        )}
        <p style={{ height: '20px' }}></p>
        <BottomButton
          ghost
          isBack={false}
          loading={isButton}
          text={t('Slider.Confirm')}
          onClick={() => {
            setIsButton(true);
            if (isOpenStatus === 'remove') {
              removeLp();
            } else {
              burnLP();
            }
          }}
        />
      </CommonModal>
    </>
  );
}

export default ManagePairDetail;
