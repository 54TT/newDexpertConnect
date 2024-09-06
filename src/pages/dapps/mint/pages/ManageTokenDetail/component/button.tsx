import { Button, ConfigProvider } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationChange from '@/components/message';
import '../index.less';
import PairInfo from '@/components/PairInfo';
import { useNavigate } from 'react-router-dom';
export default function button({
  setOpenTradeModal,
  isOwn,
  isOpenTrade,
  setRemoveOwnShipModal,
  clickToPair,
  pairInfoData,
  removeOwnShipLoading,
  router,
}) {
  const { t } = useTranslation();
  const history = useNavigate();
  return (
    <div className="token-detail-button">
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultGhostBorderColor: 'rgba(255, 255, 255, 0.55)',
              defaultGhostColor: 'rgba(255, 255, 255, 0.55)',
            },
          },
        }}
      ></ConfigProvider>
      {isOwn ? (
        <Button
          className="action-button"
          onClick={() => history(`/dapps/tokencreation/edit/${router.address}`)}
        >
          修改表单
        </Button>
      ) : (
        <></>
      )}
      {isOpenTrade && (
        <Button
          className="action-button flex-start-button"
          onClick={clickToPair}
        >
          {<PairInfo data={pairInfoData} showArrow={true} />}
        </Button>
      )}
      {isOwn && !isOpenTrade ? (
        <Button
          className="action-button"
          onClick={() => setOpenTradeModal(true)}
        >
          打开交易
        </Button>
      ) : (
        <></>
      )}
      {isOwn ? (
        <Button
          loading={removeOwnShipLoading}
          danger
          ghost
          onClick={() => setRemoveOwnShipModal(true)}
        >
          放弃所有权
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
