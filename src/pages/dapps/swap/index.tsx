import './index.less';
import SwapComp from './components/SwapComp';
import './index.less';
import PairPriceCharts from './components/PairPriceCharts';

function Swap() {
  return (
    <div className="dapp-sniper">
      <div className="dapp-sniper-left">
        <PairPriceCharts />
      </div>
      <div className="dapp-sniper-right">
        <SwapComp />
      </div>
    </div>
  );
}

export default Swap;
