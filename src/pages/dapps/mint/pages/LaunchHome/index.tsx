import { useNavigate } from 'react-router-dom';
import './index.less';
import { useContext, useEffect } from 'react';
import { MintContext, initFormData } from '../../index';
import Back from '../../component/Background';
import ChangeChain from '@/components/ChangeChain';
import { useTranslation } from 'react-i18next';
import { CountContext } from '@/Layout';
function LaunchHome() {
  const history = useNavigate();
  const { t } = useTranslation();
  const { setFormData }: any = useContext(MintContext);
  const { user, setIsModalOpen, chainId, contractConfig }: any = useContext(CountContext);
  console.log( chainId )
  console.log( contractConfig )
  useEffect(() => {
    setFormData(initFormData);
  }, []);
  return (
    <>
      <div className="launch-home">
        <div className="launch-home-top">
          <div className="animate-wave">
            <div className="w1"></div>
            <div className="w2"></div>
            <div className="w3"></div>
            <div className="w4"></div>
            <div className="w5"></div>
            <div className="w6"></div>
          </div>
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
