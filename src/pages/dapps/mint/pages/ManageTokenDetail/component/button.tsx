import { Button, ConfigProvider } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import Cookies from 'js-cookie';
import BottomButton from '../../../component/BottomButton';
import { useTranslation } from 'react-i18next';
import NotificationChange from '@/components/message';
export default function button({
  router,
  setOpenTradeModal,
  isOpenTrade,
  openTradeLoading,
  isRemoveLimit,
  setIsRemoveLimit,
  erc20Contract,
  isOwn,
  isVerify,
  setIsVerify,
}) {
  const { t } = useTranslation();
  const { getAll } = Request();
  const { chainId } = useContext(CountContext);
  const [renounceLoading, setRenounceLoading] = useState(false);
  const [removeLimitLoading, setRemoveLimitLoading] = useState(false);
  const token = Cookies.get('token');
  const [verifyLoading, setVerifyLoading] = useState(false);
  let timer = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);
  const checkVerify = async ({ tx }) => {
    try {
      const data = await getAll({
        method: 'post',
        url: '/api/v1/launch-bot/tx/status/check',
        data: {
          tx,
          txType: 10,
          txTableId: router.id,
        },
        token,
        chainId,
      });
      if (data.data.code === '1') {
        setVerifyLoading(false);
        setIsVerify(true);
        clearInterval(timer.current);
        NotificationChange('success', t('token.verifysuccess'));
      }
      if (data.data.code === '2') {
        setVerifyLoading(false);
        setIsVerify(false);
        clearInterval(timer.current);
        NotificationChange('error', t('token.verifyfaild'));
      }
    } catch (e) {
      setVerifyLoading(false);
      NotificationChange('error', t('token.verifyfaild'));
    }
  };
  const verifyingContract = async () => {
    if (!isOwn) return;
    if (isVerify) return;
    setVerifyLoading(true);
    try {
      const data = await getAll({
        method: 'post',
        url: '/api/v1/launch-bot/contract/verify',
        data: { contractId: router?.id },
        token,
        chainId,
      });
      const tx = data?.data?.tx;
      if (tx) {
        timer.current = setInterval(() => {
          checkVerify({ tx });
        }, 5000);
      }
    } catch (e) {
      setVerifyLoading(false);
      NotificationChange('error', t('token.verifyfaild'));
      return null
    }
  };

  const renounceOwnerShip = async () => {
    if (!isOwn) return;
    try {
      const tx = await erc20Contract.renounceOwnership();
      const recipent = await tx.wait();
      if (recipent.status === 1) {
        NotificationChange('success', t('token.renounceOwnership'));
      } else {
        NotificationChange('error', t('token.renounceOwnershipfailed'));
      }
    } catch (e) {
      setRenounceLoading(false);
      NotificationChange('error', t('token.renounceOwnershipfailed'));
      return null
    }
    setRenounceLoading(false);
  };
  const removeLimit = async () => {
    if (!isOwn) return;
    if (isRemoveLimit) return;
    try {
      const tx = await erc20Contract.removeLimits();
      const recipent = await tx.wait();
      if (recipent.status === 1) {
        setRemoveLimitLoading(false);
        setIsRemoveLimit(true);
        NotificationChange('success', t('token.removeLimits'));
      } else {
        setRemoveLimitLoading(false);
        NotificationChange('error', t('token.Remove limit failed'));
      }
    } catch (e) {
      setRemoveLimitLoading(false);
      NotificationChange('error', t('token.Remove limit failed'));
      return null
    }
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultGhostBorderColor: 'rgba(255, 255, 255, 0.55)',
              defaultGhostColor: 'rgba(255, 255, 255, 0.55)',
            },
          },
        }}
      >
        <div className={`manage-token-button_box ${isOwn ? '' : 'not-owner'}`}>
          <Button
            iconPosition={'end'}
            className={isVerify ? 'buttonBackActi' : 'buttonBack'}
            ghost
            icon={
              isVerify ? (
                <CheckCircleOutlined style={{ marginLeft: '8px' }} />
              ) : (
                <RightOutlined style={{ marginLeft: '8px' }} />
              )
            }
            loading={verifyLoading}
            onClick={() => verifyingContract()}
          >
            {t('token.Verify')}
          </Button>
          <Button
            iconPosition={'end'}
            className={!isOwn ? 'buttonBackActi' : 'buttonBack'}
            ghost
            icon={
              !isOwn ? (
                <CheckCircleOutlined style={{ marginLeft: '8px' }} />
              ) : (
                <RightOutlined style={{ marginLeft: '8px' }} />
              )
            }
            loading={renounceLoading}
            onClick={() => {
              setRenounceLoading(true);
              renounceOwnerShip();
            }}
          >
            {t('token.Renounce')}
          </Button>
          <Button
            iconPosition={'end'}
            className={isRemoveLimit ? 'buttonBackActi' : 'buttonBack'}
            ghost
            icon={
              isRemoveLimit ? (
                <CheckCircleOutlined style={{ marginLeft: '8px' }} />
              ) : (
                <RightOutlined style={{ marginLeft: '8px' }} />
              )
            }
            loading={removeLimitLoading}
            onClick={() => {
              setRemoveLimitLoading(true);
              removeLimit();
            }}
          >
            {t('token.Remove')}
          </Button>
        </div>
      </ConfigProvider>
      <BottomButton
        ghost
        bottom
        classname={isOpenTrade ? 'openTradeSelect' : 'openTrade'}
        loading={openTradeLoading}
        icon={
          isOpenTrade ? (
            <CheckCircleOutlined style={{ marginLeft: '8px' }} />
          ) : (
            <RightOutlined style={{ marginLeft: '8px' }} />
          )
        }
        text={<div>{t('token.Open')}</div>}
        onClick={() => {
          if (!isOwn) return;
          if (isOpenTrade) return;
          setOpenTradeModal(true);
        }}
      />
    </>
  );
}
