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
import { DatePicker } from 'antd';
import './index.less';
import getBalanceRpcEther from '@utils/getBalanceRpc';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import { zeroAddress } from '@utils/constants';
import approve from '@utils/approve';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  const [lockLoading, setLockLoading] = useState('');
  const [uncxContract, setUncxContract] = useState<ethers.Contract>();
  const [lockAmount, setLockAmount] = useState('0');
  const [locking, setLocking] = useState(false);
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
        setOpenModal(false);
        setLockLoading('');
        history('/dapps/tokencreation/result/' + data?.hash + '/unlock');
      }
    } catch (e) {
      NotificationChange('error', 'pair.unlockfail');
      setLockLoading('');
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
                  loading={item?.lockId?.toString() === lockLoading}
                  isBack={dayjs(
                    dayjs.unix(Number(item?.unlockDate?.toString()))
                  ).isAfter(dayjs())}
                  onClick={() => {
                    if (
                      !dayjs(
                        dayjs.unix(Number(item?.unlockDate?.toString()))
                      ).isAfter(dayjs())
                    ) {
                      setLockLoading(item?.lockId?.toString());
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
          if (!lockLoading) {
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
          if (!lockLoading) {
            setOpenModal(false);
          }
        }}
      >
        <>
          <div className="locklp-list-title">
            <span>{'锁定数量'}: </span>
            <span> {lockAmount || '-'} LP</span>
          </div>
          <div>
            <InputNumberWithString
              onChange={(v) => {
                setLockAmount(v);
              }}
              value={lockAmount}
              addonUnit="LP"
              balance={lpTokenBalance}
              clickMax={() => {
                setLockAmount(lpTokenBalance);
              }}
            ></InputNumberWithString>
          </div>
          <div className="SliderBox"></div>
          <div className="locklp-list-balance"></div>
        </>
        <div className="locklp-list-date">
          <span>解锁日期 : </span>
          <span>{lockDate ? lockDate.format('YYYY-MM-DD HH:mm') : ''}</span>
        </div>
        <DatePicker
          value={lockDate}
          showHour
          rootClassName="unlockDateDropdown"
          className="unlockDate"
          showMinute
          showTime
          onChange={(date: Dayjs) => {
            if (!lockLoading) {
              setLockDate(date);
            }
          }}
        />
        {/* <BottomButton
          text={t('Slider.Confirm')}
          loading={lockLoading === 'confirm'}
          onClick={() => {
            if (slider && lockDate && router?.address) {
              setLockLoading('confirm');
              lockLp();
            }
          }}
        /> */}
        <BottomActionButton
          okText={'确认'}
          cancelText={'取消'}
          loading={locking}
          onOk={() => {
            lockLp();
          }}
          onCancel={() => {
            setOpenModal(false);
          }}
        />
      </CommonModal>
    </div>
  );
}

export default LockLpList;
