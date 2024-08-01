import { useNavigate } from 'react-router-dom';
import './index.less';
import { useContext, useEffect } from 'react';
import { MintContext, initFormData } from '../../index';
import Back from '../../component/Background'
import ChangeChain from '@/components/ChangeChain';
function LaunchHome() {
  const history = useNavigate();
  const { setFormData }: any = useContext(MintContext);
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
            onClick={() => history('/dapps/tokencreation/fillIn')}
          >
            Launch
          </div>
          <ChangeChain hideChain={true} disabledChain={true} />
        </div>
        <Back/>
     
      </div>
      <div className="launch-home-manage_token">
        <span
          onClick={() => {
            history('/dapps/tokencreation/manageToken');
          }}
        >
          代币管理
        </span>
      </div>
    </>
  );
}

export default LaunchHome;
