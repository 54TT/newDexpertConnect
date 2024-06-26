import './index.less';
import { useContext } from 'react';
import SwapComp from './components/SwapComp';
import './index.less';
import Drawer from './components/drawer';
import { CountContext } from '@/Layout.tsx';
function Swap() {
  const { user }: any = useContext(CountContext);
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
        {user?.uid && <Drawer />}
      </div>
    </div>
  );
}

export default Swap;
