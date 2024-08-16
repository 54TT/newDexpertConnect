import { useNavigate } from 'react-router-dom';
import './index.less';
import React,{ useContext, useEffect } from 'react';
import { MintContext, initFormData } from '../../index';
const Back = React.lazy(() => import('../../component/Background'));
const ChangeChain = React.lazy(() => import('@/components/ChangeChain'));
import { useTranslation } from 'react-i18next';
import Effects from '../../component/Effects'
import { CountContext } from '@/Layout';
function LaunchHome() {
  const history = useNavigate();
  const { t } = useTranslation();
  const { setFormData }: any = useContext(MintContext);
  const { user, setIsModalOpen,  }: any = useContext(CountContext);
  useEffect(() => {
    setFormData(initFormData);
  }, []);
  return (
    <>
      <div className="launch-home">
        <div className="launch-home-top">
         <Effects />
          <div className="launch-home-top-icon">
            <img src="/launchTop.svg" alt="" />
          </div>
          <div
            className="launch-home-button"
            onClick={() => {
              if (user?.uid) {
                history('/dapps/tokencreation/fillIn');
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            {user?.uid ? t('token.Creation') : t('Common.Connect Wallet')}
          </div>
          <ChangeChain hideChain={true} disabledChain={true} />
        </div>
        <Back />
      </div>
      <div className="launch-home-manage_token"  onClick={() => {
            if (user?.uid) {
              history('/dapps/tokencreation/manageToken');
            }
          }}>
        <img src="/clickHi.svg" alt="" />
        <span>
          {t('token.me')}
        </span>
      </div>
    </>
  );
}

export default LaunchHome;
