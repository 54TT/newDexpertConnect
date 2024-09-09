import { useNavigate } from 'react-router-dom';
import './index.less';
import { useContext, useEffect } from 'react';
import { MintContext, initFormData } from '../../index';
import Back from '../../component/Background';
import ChangeChain from '@/components/ChangeChain';

import { useTranslation } from 'react-i18next';
import Effects from '../../component/Effects';
import { CountContext } from '@/Layout';
import { Button } from 'antd';
function LaunchHome() {
  const history = useNavigate();
  const { t } = useTranslation();
  const { setFormData }: any = useContext(MintContext);
  const { user, setIsModalOpen }: any = useContext(CountContext);
  useEffect(() => {
    setFormData(initFormData);
  }, []);
  return (
    <>
      <div className="launch-home">
        <div className="launch-home-top">
          <Effects />
          <Button
            className="launch-home-button action-button"
            ghost
            onClick={() => {
              if (user?.uid) {
                history('/dapps/tokencreation/fillIn');
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            {user?.uid ? t('mint.launch') : t('mint.Connect')}
          </Button>
          <div className="launch-home-top-icon">
            <img src="/launchTop.svg" alt="" />
          </div>
          <ChangeChain hideChain={true} disabledChain={true} />
        </div>
        <Back />
      </div>
      <div
        className="launch-home-manage_token"
        onClick={() => {
          if (user?.uid) {
            history('/dapps/tokencreation/manageToken');
          }
        }}
      >
        <img src="/clickHi.svg" alt="" />
        <span className={'launch-home-manage_token-span'}>{t('mint.Token')}</span>
      </div>
    </>
  );
}

export default LaunchHome;
