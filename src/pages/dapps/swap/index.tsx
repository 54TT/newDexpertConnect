import './index.less';
import SwapComp from './components/SwapComp';
import './index.less';

function Swap() {
  return (
    <div
      className="dis"
      style={{ height: 'calc(100vh - 90px)', justifyContent: 'center' }}
    >
      <div className="dapp-sniper">
        {/*         <div className="dapp-sniper-left">
          <PairPriceCharts />
        </div> */}
        <div className="dapp-sniper-right">
          <SwapComp />
        </div>
      </div>
    </div>
  );
}

export default Swap;
