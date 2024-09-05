import { useContext, useEffect, useState } from 'react';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import { CountContext } from '@/Layout';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { UncxAbi } from '@abis/UncxAbi';
import NotificationChange from '@/components/message';
import dayjs, { Dayjs } from 'dayjs';
import { toEthWithDecimal, toWeiWithDecimal } from '@utils/convertEthUnit';
import BottomButton from '../../component/BottomButton';
import CommonModal from '@/components/CommonModal';
import { Button, DatePicker, Slider } from 'antd';
import type { SliderSingleProps } from 'antd';
import './index.less';
import getBalanceRpcEther from '@utils/getBalanceRpc';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import { zeroAddress } from '@utils/constants';
import approve from '@utils/approve';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Decimal from 'decimal.js';
import Loading from '@/components/allLoad/loading';
import Nodata from '@/components/Nodata';
import BottomActionButton from '@/components/BottomActionButton';
import InputNumberWithString from '@/components/InputNumberWithString';
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
        new Decimal(lpTokenBalance).mul(slider).div(100).toString(),
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
          const recipent = await tx.wait();
          if (recipent.status === 1) {
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
      const recipent = await data.wait();
      if (recipent.status === 1) {
        history('/dapps/tokencreation/result/' + data?.hash + '/unlock');
        setLockLoing('');
      }
    } catch (e) {
      NotificationChange('error', 'pair.unlockfail');
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
        style={{ height: '80%', overflow: 'overlay', overflowX: 'scroll' }}
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
        closeIcon={null}
        title={
          <div style={{ textAlign: 'center', color: '#fff' }}>锁定流动性</div>
        }
        onCancel={() => {
          if (!lockLoing) {
            setOpenModal(false);
          }
        }}
      >
        <>
          <div className="locklp-list-title">
            <span>{'锁定数量'}:</span>
            <span> 0 LP</span>
          </div>
          <div>
            <InputNumberWithString
              onChange={() => {}}
              value={'1'}
              balance={lpTokenBalance}
              clickMax={() => {}}
            ></InputNumberWithString>
          </div>
          <div className="SliderBox"></div>
          <div className="locklp-list-balance"></div>
        </>
        <div className="locklp-list-date">
          <span>{t('token.unti')} :</span>
          <span>2020/4/20</span>
        </div>
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
        {/* <BottomButton
          text={t('Slider.Confirm')}
          loading={lockLoing === 'confirm'}
          onClick={() => {
            if (slider && lockDate && router?.address) {
              setLockLoing('confirm');
              lockLp();
            }
          }}
        /> */}
        <BottomActionButton
          okText={'确认'}
          cancelText={'取消'}
          onOk={() => {}}
          onCancel={() => {}}
        />
      </CommonModal>
    </div>
  );
}

export default LockLpList;
