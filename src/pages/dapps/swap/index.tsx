import './index.less';
import SwapComp from './components/SwapComp';
import './index.less';
// import { useContext } from 'react';
// import Drawer from '../drawer';
// import { CountContext } from '@/Layout';
function Swap() {
  // const { user, chainId }: any = useContext(CountContext);
  return (
    <div
      className="dis"
      style={{ height: 'calc(100vh - 90px)', justifyContent: 'center' }}
      // style={{margin:'0 auto'}}
    >
      <div className="dapp-sniper">
        {/*         <div className="dapp-sniper-left">
          <PairPriceCharts />
        </div> */}
        <div className="dapp-sniper-right">
          <SwapComp />
        </div>
        {/* {user?.uid && <Drawer id={chainId} />} */}
      </div>
    </div>
  );
}

export default Swap;
