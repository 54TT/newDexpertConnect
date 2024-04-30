import { Button, InputNumber } from "antd";
import "./index.less";
function Dpass() {
  return (
    <div className="dpass-background">
      <div className="dpass-content">
        <div className="dpass-content-left">
          <img className="dapss-card" src="/dpassCard.png" alt="" />
          <img className="dpass-light" src="/light.png" alt="" />
          <img className="dpass-cap" src="/bottomCap.png" alt="" />
        </div>
        <div className="dpass-content-right">
          <p className="dpass-content-right-title">D PASS</p>
          <p className="dpass-content-right-content">
            6000 D points can to redeem one Pass, which allows you to use
            DEXpert’s robot service once. 
          </p>
          <p className="dpass-content-right-content">
          In the future, D point can be
            exchanged for our token, $DEXP.
          </p>
          <p className="dpass-content-right-content">
          6000 D point
          </p>
          <div className="dpass-content-right-action" >
            <div className="dpass-content-right-action-input">
              <span>-</span>
              <input className="dpass-content-right-action-input_number"  />
              <span>+</span>
            </div>
            <Button className="dpass-content-right-action-button">Exchange</Button>
          </div>
          <div className="dpass-content-right-info">
          
              <div className="dpass-content-right-info-points" style={{ borderRight: '1px solid #999' }}>
                <div className="dpass-content-right-info-title" >Your D Points</div>
                <div className="dpass-content-right-info-amount">123123</div>
              </div>
              <div className="dpass-content-right-info-points">
                <div className="dpass-content-right-info-title">Your Pass</div>
                <div className="dpass-content-right-info-amount">123123</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dpass;
