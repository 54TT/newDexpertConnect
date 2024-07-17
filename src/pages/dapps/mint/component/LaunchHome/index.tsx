import { useNavigate } from 'react-router-dom';
import './index.less';
function LaunchHome() {
  const history = useNavigate();
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
          <p
            className="launch-home-button"
            onClick={() => history('/dapps/mint/form')}
          >
            Launch
          </p>
        </div>
        <div className="launch-home-bottom">
          <img className="cloud-left cloud" src="/cloudLeft.svg" alt="" />
          <img className="rocket" src="/rocket.svg" alt="" />
          <img className="cloud-right cloud" src="/cloudRight.svg" alt="" />
        </div>
      </div>
      <span className="launch-home-manage_token">代币管理</span>
    </>
  );
}

export default LaunchHome;
