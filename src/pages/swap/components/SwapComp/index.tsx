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
          <div></div>
        </div>
        <ProInputNumber value={amountIn} onChange={(v) => setAmountIn(v)} />
        <div className="token-info">
          <div>1 Usdt</div>
          <div>123</div>
        </div>
      </div>
      <div className="input-token receive-token">
        <div className="dapp-sniper-right-token">
          <div className="dapp-sniper-right-token-label">Receive</div>
          <div></div>
        </div>
        <ProInputNumber value={amountOut} onChange={(v) => setAmountOut(v)} />
        <div className="token-info">
          <div>1 Usdt</div>
          <div>123</div>
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
