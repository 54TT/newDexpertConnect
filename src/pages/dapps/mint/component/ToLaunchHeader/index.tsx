import { useNavigate } from 'react-router-dom';
import './index.less';
import { useTranslation } from 'react-i18next';
import Effects from   '../Effects'
function ToLaunchHeader() {
const { t } = useTranslation();
  const history = useNavigate();
  
  return (
    // <div className="top-launch-header">
    //  <Effects />
    //   <div className="launch-home-button">
    //     <div onClick={() => history('/dapps/tokencreation/fillIn')}>{t('token.Creation')}</div>
    //   </div>
    //   <div className="launch-home-top-icon">
    //     <img src="/arrowDownBlack.svg" alt="" />
    //   </div>
    // </div>
    <></>
  );
}

export default ToLaunchHeader;
