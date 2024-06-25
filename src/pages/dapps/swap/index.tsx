import './index.less';
import SwapComp from './components/SwapComp';
import './index.less';
import Drawer from './components/drawer'
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
        <Drawer />
      </div>
    </div>
  );
}

export default Swap;
