import { useState } from 'react';
import { Button } from 'antd';
import ProInputNumber from '@/components/ProInputNumber';
import './index.less';
interface SwapCompType {
  onSwap: (data: any) => void;
}

function SwapComp({ onSwap }: SwapCompType) {
  const [amountIn, setAmountIn] = useState<number | null>(0);
  const [amountOut, setAmountOut] = useState<number | null>(0);

  return (
    <>
      <div className="input-token send-token">
        <div className="dapp-sniper-right-token">
          <div className="dapp-sniper-right-token-label">Send</div>
          <div className="dapp-sniper-right-token-icon">
            <img className="eth-logo" src="/eth1.svg" alt="" />
            <span>ETH</span>
            <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
          </div>
        </div>
        <ProInputNumber value={amountIn} onChange={(v) => setAmountIn(v)} />
        <div className="token-info">
          <div>1 USDT</div>
          <div>Balance: 0</div>
        </div>
        <img className="exchange-img" src="/exchange.png" alt="" />
      </div>
      <div className="input-token receive-token">
        <div className="dapp-sniper-right-token">
          <div className="dapp-sniper-right-token-label">Receive</div>
          <div className="dapp-sniper-right-token-icon">
            <img className="eth-logo" src="/eth1.svg" alt="" />
            <span>ETC</span>
            <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
          </div>
        </div>
        <ProInputNumber value={amountOut} onChange={(v) => setAmountOut(v)} />
        <div className="token-info">
          <div>1 USDT</div>
          <div>Balance: 0</div>
        </div>
      </div>
      <Button
        className="swap-button"
        onClick={() => onSwap({ amountIn, amountOut })}
      >
        Swap
      </Button>
    </>
  );
}

export default SwapComp;
