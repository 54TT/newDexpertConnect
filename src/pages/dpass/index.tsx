import { Button, message } from "antd";
import Cookies from "js-cookie";
import "./index.less";
import Request from '../../components/axios';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
function Dpass() {
  const token = Cookies.get('token');
  const { getAll } = Request();
  const [dPassCount, setDpassCount] = useState(0);
  const [redeemCount, setRedeemCount] = useState(0);
  const { t } = useTranslation();

  const getDpassCount = async () => {
    const { data }: any = await getAll({
      method: 'get',
      url: '/api/v1/d_pass',
      data: {},
      token,
    })
    
    setDpassCount(data?.dPassCount || 0);
  }

  const redeemDpass = () => {
    if (redeemCount === 0){
      message.warning(t('Alert.Please enter the purchase quantity'));
      return;
    }
    const res = getAll({
      method: 'post',
      url: '/api/v1/d_pass/redeem',
      data: {
        count: redeemCount
      },
      token,
    })
   if (res?.data?.code === 200) {
    getDpassCount();
    return message.success(t('Alert.success'))
   }
  }

  useEffect(() => {
    getDpassCount()
  },[])


  const clickPlusOrReduce = (e) => {
    const { id } = e.target;
    if (id === 'plus') {
      setRedeemCount(redeemCount + 1)
    }
    if (id === 'reduce') {
      if (redeemCount === 0) return;
      setRedeemCount(redeemCount - 1)
    }
  }

  const handleOnInput = (e: any) => {
    const { value } = e.target;
    
      const count = Number(value);
      if (Number.isNaN(count)) {
        return setRedeemCount(0);
      }
      if (typeof count === 'number') {
        return setRedeemCount(count);
      }

    
    if(typeof(value))
    if (value === "") {
      setRedeemCount(0)
    }
  }


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
              <span id="reduce" onClick={clickPlusOrReduce}>-</span>
              <input value={redeemCount} className="dpass-content-right-action-input_number" defaultValue={1} onChange={handleOnInput} />
              <span id="plus" onClick={clickPlusOrReduce}>+</span>
            </div>
            <Button className="dpass-content-right-action-button" onClick={() => redeemDpass()}>Exchange</Button>
          </div>
          <div className="dpass-content-right-info">
          
              <div className="dpass-content-right-info-points" style={{ borderRight: '1px solid #999' }}>
                <div className="dpass-content-right-info-title" >Your D Points</div>
                <div className="dpass-content-right-info-amount">123123</div>
              </div>
              <div className="dpass-content-right-info-points">
                <div className="dpass-content-right-info-title">Your Pass</div>
                <div className="dpass-content-right-info-amount">{dPassCount}</div>
              </div>
          </div>
        </div>
      </div>
      <div className="dpass-redeem">
        <div>
          <div className="dpass-redeem-table">
           <div className="dpass-redeem-table-th">
           <span>Time</span>
           <span>Your Pass Id</span>
           <span>Status</span>
           <span>Key</span>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dpass;
