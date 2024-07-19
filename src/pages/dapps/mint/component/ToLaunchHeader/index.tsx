import { useNavigate } from 'react-router-dom';
import './index.less';
function ToLaunchHeader() {
  const history = useNavigate();
  return (
    <div className="top-launch-header">
      <div className="animate-wave">
        <div className="w1"></div>
        <div className="w2"></div>
        <div className="w3"></div>
        <div className="w4"></div>
        <div className="w5"></div>
        <div className="w6"></div>
      </div>
      <div className="launch-home-top-icon">
        <img src="/arrowDownBlack.svg" alt="" />
      </div>
      <div className="launch-home-button">
        <div onClick={() => history('/dapps/mint/form')}>Launch</div>
      </div>
    </div>
  );
}

export default ToLaunchHeader;
