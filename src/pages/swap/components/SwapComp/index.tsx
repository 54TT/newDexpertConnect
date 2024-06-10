import { useCallback, useEffect, useState } from 'react';
import { Button } from 'antd';
import ProInputNumber from '@/components/ProInputNumber';
import { getAmountIn } from '@utils/swap/v2/getAmountIn';
import { getAmountOut } from '@utils/swap/v2/getAmountOut';
import { getTokenPrice } from '@utils/getTokenPrice';
import { getV3AmountIn } from '@utils/swap/v3/getAmountIn';
import {getSwapExactInBytes} from '@utils/swap/v3/getSwapExactInBytes'
import {
  getUniswapV2RouterContract,
  getUniversalRouterContract,
} from '@utils/contracts';
import { debounce } from 'lodash';
import './index.less';
import SelectTokenModal from '@/components/SelectTokenModal';
import Decimal from 'decimal.js';
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
  const [openSelect, setOpenSelect] = useState(false);

  useEffect(() => {
    getWeth();
  }, []);

  const getWeth = async () => {
    console.log("-----------------")
    const param = [
      '11155111',
      await getUniversalRouterContract('11155111'),
      "0x6f57e483790DAb7D40b0cBA14EcdFAE2E9aA2406",
      "0xaA7024098a12e7E8bacb055eEcD03588d4A5d75d",
      BigInt(1000000000000),
      new Decimal(0.01),
      0,
    ];
    const res = await getV3AmountIn.apply(null, param);
    console.log("res-----",res);
    console.log(res.quoteAmount.toString())
    console.log(res.fee)
    console.log(res.poolAddress)

    const a = await getSwapExactInBytes("11155111", "0x6f57e483790DAb7D40b0cBA14EcdFAE2E9aA2406", "0xaA7024098a12e7E8bacb055eEcD03588d4A5d75d", new Decimal(1000000000000), new Decimal(0), "0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89", false, 0, Number(res.fee), res.poolAddress)
    console.log("----------aaaaa",a)
  };

  /*   const getTKPrice = async () => {
    const pairAddress = await getPairAddress(
      '11155111',
      '0xb72bc8971d5e595776592e8290be6f31937097c6'
    );
    console.log(pairAddress);

    const res = await getTokenPrice('11155111', pairAddress);
    console.log(res.toString());
  }; */
  /*   useEffect(() => {
    getTKPrice();
  }, []); */

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
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => setOpenSelect(true)}
          >
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
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => setOpenSelect(true)}
          >
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
      <SelectTokenModal
        open={openSelect}
        onChange={(data) => console.log(data)}
      />
    </>
  );
}

export default SwapComp;
