import { Button, ConfigProvider } from 'antd';
import {  useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationChange from '@/components/message';
import "../index.less"
export default function button({
  setOpenTradeModal,
  tokenContract,
  isOwn,
  setIsOwn,
  isOpenTrade,
  setRemoveOwnShipModal,
  clickToPair
}) {
  const { t } = useTranslation();
  const [renounceLoading, setRenounceLoading] = useState(false);
  const [removeLimitLoading, setRemoveLimitLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  let timer = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);



  return (
    <div className='token-detail-button'>
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
        
      </ConfigProvider>
      {isOwn?   <Button className='action-button'>修改表单</Button> : <></>}
      {
        isOpenTrade && <Button className='action-button' onClick={clickToPair}>Pair</Button>
      }
      { isOwn && !isOpenTrade ?  <Button className='action-button' onClick={() => setOpenTradeModal(true)}>打开交易</Button> : <></>}
      {isOwn? <Button  danger ghost onClick={() => setRemoveOwnShipModal(true)}>放弃所有权</Button> : <></>}
    </div>
  );
}
