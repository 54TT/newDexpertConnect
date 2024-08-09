import React, { useContext, useEffect, useState } from 'react';
const PageHeader = React.lazy(() => import('../../component/PageHeader'));
const ToLaunchHeader = React.lazy(
  () => import('../../component/ToLaunchHeader')
);
import { CountContext } from '@/Layout';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { UncxAbi } from '@abis/UncxAbi';
import NotificationChange from '@/components/message';
import dayjs, { Dayjs } from 'dayjs';
import { toEthWithDecimal, toWeiWithDecimal } from '@utils/convertEthUnit';
const BottomButton = React.lazy(() => import('../../component/BottomButton'));
import CommonModal from'@/components/CommonModal'
import { DatePicker, Slider } from 'antd';
import type { SliderSingleProps } from 'antd';
import './index.less';
import getBalanceRpcEther from '@utils/getBalanceRpc';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import { zeroAddress } from '@utils/constants';
import approve from '@utils/approve';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
const Loading = React.lazy(() => import('@/components/allLoad/loading'));
const Nodata = React.lazy(() => import('@/components/Nodata'));
function LockLpList() {
  const { t } = useTranslation();
  const { contractConfig, loginProvider, chainId, browser } =
    useContext(CountContext);
  const history = useNavigate();
  const router = useParams();
  // pair展示
  const [infoData, setInfoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // 锁定流动性弹窗相关参数
  const [openModal, setOpenModal] = useState(false);
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [lockDate, setLockDate] = useState<Dayjs>(null);
  // lock   loading
  const [lockLoing, setLockLoing] = useState('');
  const [uncxContract, setUncxContract] = useState<ethers.Contract>();
  const [slider, setSlider] = useState(0);
  const getLockList = async () => {
    const { uncxAddress, wethAddress } = contractConfig;
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const address = await signer.getAddress();
    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
    setUncxContract(uncxContract);
    const lockNum = await uncxContract.getUserNumLocksForToken(
      address,
      router?.address
    );
    const lpTokenBalance = await getBalanceRpcEther(
      web3Provider,
      router?.address,
      wethAddress
    );
    setLpTokenBalance(lpTokenBalance.toString());
    const getUncxLockList = async () => {
      const promiseList = [];
      for (let i = 0; i <= lockNum - 1; i++) {
        promiseList.push(
          uncxContract.getUserLockForTokenAtIndex(address, router?.address, i)
        );
      }
      return Promise.all(promiseList);
    };
    const lockList = await getUncxLockList();
    const data = lockList.map((item) => {
      const [lockDate, lockAmount, initialAmount, unlockDate, lockId, owner] =
        item;
      return {
        remark: toEthWithDecimal(lockAmount, 18),
        unlockDate,
        lockAmount,
        lockDate,
        initialAmount,
        lockId,
        owner,
      };
    });
    setInfoData(data);
    setIsLoading(true);
  };
  const lockLp = async () => {
    try {
      const { uncxAddress } = contractConfig;
      const web3Provider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await web3Provider.getSigner();
      const walletAddress = await signer.getAddress();
      const pairContract = new ethers.Contract(
        router?.address,
        UniswapV2PairAbi,
        signer
      );
      const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
      const fee = (await uncxContract.gFees()).ethFee;
      const decimals = await pairContract.decimals();
      const lockAmount = toWeiWithDecimal(
        ((slider * Number(lpTokenBalance)) / 100).toString(),
        decimals
      );
      const unlockDate = lockDate.unix();
      const isShow = await approve(pairContract, uncxAddress, lockAmount);
      if (isShow) {
        try {
          const tx = await uncxContract.lockLPToken(
            router?.address,
            lockAmount,
            unlockDate,
            zeroAddress,
            true,
            walletAddress,
            {
              value: fee,
            }
          );
          if (tx?.hash) {
            history('/dapps/tokencreation/result/' + tx?.hash + '/lock');
          }
        } catch (e) {
          NotificationChange('warning', t('Dapps.Insufficient Fund'));
          return null;
        }
      }
      getLockList();
      setLockDate(null);
      setSlider(0);
      setLockLoing('');
    } catch (e) {
      setLockLoing('');
    }
  };
  useEffect(() => {
    if (
      loginProvider &&
      contractConfig?.chainId === Number(chainId) &&
      router?.address
    ) {
      getLockList();
    }
  }, [chainId, loginProvider, contractConfig, router?.address]);
  const withdraw = async (index, lockId, amount) => {
    try {
      const data = await uncxContract.withdraw(
        router?.address,
        index,
        lockId,
        amount
      );
      if (data?.hash) {
        history('/dapps/tokencreation/result/' + data?.hash + '/unlock');
        setLockLoing('');
      }
    } catch (e) {
      setLockLoing('');
    }
  };

  const marks: SliderSingleProps['marks'] = {
    0: '0%',
    20: '20%',
    40: '40%',
    60: '60%',
    80: '80%',
    100: '100%',
  };

  const changeSlider = (e: number) => {
    if (!lockLoing) {
      setSlider(e);
    }
  };
  return (
    <div className="locklpBox">
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={t('token.Unon')}
      />
      <div
        style={{ maxHeight: '330px', overflow: 'overlay', overflowX: 'hidden' }}
        className="mint-scroll"
      >
        {isLoading ? (
          infoData.length > 0 ? (
            infoData?.map?.((item, index) => (
              <div className="itemLP" key={item?.lockId?.toString()}>
                <div className="it item">
                  <p>{t('token.unti')}</p>
                  <p>{t('token.am')}</p>
                </div>
                <div className="it data">
                  <p>
                    {dayjs
                      .unix(Number(item?.unlockDate?.toString()))
                      .format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                  <p>{item?.remark}</p>
                </div>
                <BottomButton
                  text={t('token.Unlock')}
                  loading={item?.lockId?.toString() === lockLoing}
                  isBack={dayjs(
                    dayjs.unix(Number(item?.unlockDate?.toString()))
                  ).isAfter(dayjs())}
                  onClick={() => {
                    if (
                      !dayjs(
                        dayjs.unix(Number(item?.unlockDate?.toString()))
                      ).isAfter(dayjs())
                    ) {
                      setLockLoing(item?.lockId?.toString());
                      withdraw(index, item.lockId, item.lockAmount);
                    }
                  }}
                />
              </div>
            ))
          ) : (
            <Nodata name={t('token.noLp')} />
          )
        ) : (
          <Loading status={'20'} browser={browser} />
        )}
      </div>
      <BottomButton
        text={t('token.LockLP')}
        bottom
        onClick={() => {
          if (!lockLoing) {
            setOpenModal(true);
          }
        }}
      />
      <CommonModal
        className="mint-common-modal"
        open={openModal}
        footer={null}
        title=""
        onCancel={() => {
          if (!lockLoing) {
            setOpenModal(false);
          }
        }}
      >
        <>
          <div className="locklp-list-title">{t('token.Lock')}</div>
          <div className="SliderBox">
            <Slider
              className="ampuntSlider"
              marks={marks}
              value={slider}
              styles={{
                track: { backgroundColor: 'rgb(134,240,151)' },
                rail: { backgroundColor: 'rgb(67,67,67)' },
                handle: { backgroundColor: 'transparent' },
              }}
              onChange={changeSlider}
            />
            <p>{slider}%</p>
          </div>
          <div className="butt">
            {[20, 40, 60, 80, 100].map((item: number) => {
              return (
                <p
                  style={{
                    border:
                      slider === item
                        ? '1px solid rgb(134,240,151)'
                        : '1px solid white',
                    color: slider === item ? 'rgb(134,240,151)' : 'white',
                  }}
                  onClick={() => {
                    if (!lockLoing) {
                      setSlider(item);
                    }
                  }}
                  key={item}
                >
                  {item}%
                </p>
              );
            })}
          </div>
          <div className="locklp-list-balance">
            {t('token.Balance')}: {lpTokenBalance}
          </div>
        </>
        <div className="date">{t('token.unti')}</div>
        <DatePicker
          value={lockDate}
          showHour
          rootClassName="unlockDateDropdown"
          className="unlockDate"
          showMinute
          showTime
          onChange={(date: Dayjs) => {
            if (!lockLoing) {
              setLockDate(date);
            }
          }}
        />
        <BottomButton
          text={t('Slider.Confirm')}
          loading={lockLoing === 'confirm'}
          onClick={() => {
            if (slider && lockDate && router?.address) {
              setLockLoing('confirm');
              lockLp();
            }
          }}
        />
      </CommonModal>
    </div>
  );
}

export default LockLpList;
