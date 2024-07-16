import './index.less';
export default function oriderDetail() {
  return (
    <div className="scrollHei sniperOrder oriderDetailBox ">
      <div className="oriderDetail ">
        <p>Token Information</p>
        <div className="symbol dis">
          <span>pepe</span>
          <span>pepe</span>
        </div>
        <div className="more dis">
          <span>shul</span>
          <span>13232323232</span>
        </div>
        {/* 线 */}
        <div className="line"></div>
        {/*  */}
        <p className="address">Token address</p>
        <p className="add">0x5EA722e0DA4c1777699b314307b2265c57f6C366</p>
        <div className="more dis">
          <span>订单编号</span>
          <span>123232</span>
        </div>
        <div className="line"></div>
        <p className="sni">sniper amount</p>
        <div className="more dis" style={{ margin: '10px 0 14px' }}>
          <span>Max slippage</span>
          <span>23232323</span>
        </div>
        <div className="more dis">
          <span>Gas Price</span>
          <span>23232323</span>
        </div>
        <div className="line"></div>
        <p className="wallet">使用钱包</p>
        {/* EA6E6E */}
        <div style={{ border: '1px solid #86F097' }} className="walletItem">
          <div className="dis">
            <span>钱包</span>
            <div className="num">
              <span>dsada 1ETH</span>
              <img src="" alt="" />
            </div>
          </div>
          <p className="walletAddress">dsadsadsadsadsadsadsadsadsad</p>
        </div>
        <div className="line"></div>
        <div className="more dis">
          <span>订单开始时间</span>
          <span>23232323</span>
        </div>
        <div className="more dis" style={{ margin: '16px 0' }}>
          <span>订单结束时间</span>
          <span>23232323</span>
        </div>
        <div className="more dis">
          <span>金额</span>
          <span>23232323</span>
        </div>
      </div>
    </div>
  );
}
