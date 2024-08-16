import { Button, ConfigProvider } from 'antd';
import React, { useContext, useState } from 'react';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const BottomButton = React.lazy(
  () => import('../../../component/BottomButton')
);
import { useTranslation } from 'react-i18next';
export default function button({
  router,
  setOpenTradeModal,
  isOpenTrade,
  openTradeLoading,
  isRemoveLimit,
  erc20Contract,
  isOwn,
  isVerify,setIsVerify
}) {
  const { t } = useTranslation();
  const history = useNavigate();
  const { getAll } = Request();
  const { chainId } = useContext(CountContext);
  const [renounceLoading, setRenounceLoading] = useState(false);
  const [removeLimitLoading, setRemoveLimitLoading] = useState(false);
  const token = Cookies.get('token');
  const [verifyLoading, setVerifyLoading] = useState(false);
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
      if (data?.data?.tx) {
        setVerifyLoading(false);
        setIsVerify(true);
      }
    } catch (e) {
      setVerifyLoading(false);
      return null;
    }
    setVerifyLoading(false);
  };

  const renounceOwnerShip = async () => {
    if (!isOwn) return;
    try {
      const tx = await erc20Contract.renounceOwnership();
      const recipent = await tx.wait();
      if (tx?.hash && recipent) {
        history(
          '/dapps/tokencreation/result/' + tx?.hash + '/renounceOwnership'
        );
      }
    } catch (e) {
      setRenounceLoading(false);
      return null;
    }
  };
  const removeLimit = async () => {
    if (!isOwn) return;
    if (isRemoveLimit) return;
    try {
      const tx = await erc20Contract.removeLimits();
      const recipent = await tx.wait();
      if (tx?.hash && recipent) {
        history('/dapps/tokencreation/result/' + tx?.hash + '/removeLimits');
      }
    } catch (e) {
      setRemoveLimitLoading(false);
      return null;
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
