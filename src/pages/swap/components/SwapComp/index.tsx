import { useCallback, useEffect, useState } from 'react';
import { Button } from 'antd';
import ProInputNumber from '@/components/ProInputNumber';
import { getAmountIn } from '@utils/getAmountIn';
import { getAmountOut } from '@utils/getAmountOut';
import { getWethPrice } from '@utils/getWethPrice';
import {
  getUniswapV2RouterContract,
  getUniversalRouterContract,
} from '@utils/contracts';
import { debounce } from 'lodash';
import './index.less';
interface SwapCompType {
  onSwap: (data: any) => void;
}
const mockTokenIn = '0x0000000000000000000000000000000000000000';
const mockTokenOut = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
function SwapComp({ onSwap }: SwapCompType) {
  const [amountIn, setAmountIn] = useState<number | null>(0);
  const [amountOut, setAmountOut] = useState<number | null>(0);
  const [tokenIn, setTokenIn] = useState<string>(mockTokenIn);
  const [tokenOut, setTokenOut] = useState<string>(mockTokenOut);

  useEffect(() => {
    getWeth();
  }, []);

  const getWeth = async () => {
    const res = await getWethPrice('11155111');
    console.log(res);
  };

  const getAmount = async (type: 'in' | 'out', value: number) => {
    const param = [
      '11155111',
      await getUniversalRouterContract('11155111'),
      await getUniswapV2RouterContract('11155111'),
      tokenIn,
      tokenOut,
      BigInt((value as number) * 10 ** 18),
      0.02,
      0,
    ];
    if (type === 'in') {
      const amount = await getAmountOut.apply(null, param);
      setAmountOut(Number(amount.div(10 ** 18).toString()));
    }
    if (type === 'out') {
      const amount = await getAmountIn.apply(null, param);
      setAmountIn(Number(amount.div(10 ** 18).toString()));
    }
  };

  const getAmountDebounce = useCallback(debounce(getAmount, 300), []);

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
        <ProInputNumber
          value={amountIn}
          onChange={(v) => {
            setAmountIn(v);
            getAmountDebounce('in', v);
          }}
        />
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
        <ProInputNumber
          value={amountOut}
          onChange={(v) => {
            setAmountIn(v);
            getAmountDebounce('out', v);
          }}
        />
        <div className="token-info">
          <div>1 USDT</div>
          <div>Balance: 0</div>
        </div>
      </div>
      <Button
        className="swap-button"
        onClick={() => onSwap({ amountIn, amountOut, tokenIn, tokenOut })}
      >
        Swap
      </Button>
    </>
  );
}

export default SwapComp;
