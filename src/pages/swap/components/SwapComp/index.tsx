import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import ProInputNumber from '@/components/ProInputNumber';
import { getAmountIn } from '@utils/swap/v2/getAmountIn';
import { getAmountOut } from '@utils/swap/v2/getAmountOut';
import { getTokenPrice } from '@utils/getTokenPrice';
import { getV3AmountOut } from '@utils/swap/v3/getAmountOut';
import { getSwapExactInBytes } from '@utils/swap/v3/getSwapExactInBytes';
import {
  getUniswapV2RouterContract,
  getUniversalRouterContract,
} from '@utils/contracts';
import { debounce } from 'lodash';
import './index.less';
import SelectTokenModal from '@/components/SelectTokenModal';
import Decimal from 'decimal.js';
import AdvConfig from '../AdvConfig';
import { CountContext } from '@/Layout';
import { config } from '@/config/config';
interface SwapCompType {
  onSwap: (data: any) => void;
}

interface TokenInfoType {
  address: string;
  icon: string;
  symbol: string;
  name: string;
}

function SwapComp({ onSwap }: SwapCompType) {
  const { provider, changeProvider } = useContext(CountContext);
  const [amountIn, setAmountIn] = useState<number | null>(0);
  const [amountOut, setAmountOut] = useState<number | null>(0);
  const [tokenIn, setTokenIn] = useState<TokenInfoType>();
  const [tokenOut, setTokenOut] = useState<TokenInfoType>();
  const [openSelect, setOpenSelect] = useState(false);
  const currentSetToken = useRef<'in' | 'out'>('in');

  useEffect(() => {
    getWeth();
  }, []);

  const getWeth = async () => {
    console.log('-----------------');
    const param = [
      '11155111',
      provider,
      await getUniversalRouterContract(provider, '0xD06CBe0ec2138c7aAFA8eAB031EA164f5c1C6bC1'),
      '0x6f57e483790DAb7D40b0cBA14EcdFAE2E9aA2406',
      '0xaA7024098a12e7E8bacb055eEcD03588d4A5d75d',
      new Decimal(1000000000000),
      new Decimal(0.01),
      0,
    ];
    const res = await getV3AmountOut.apply(null, param);
    console.log('res-----', res);
    console.log(res.quoteAmount.toString());
    console.log(res.fee);
    console.log(res.poolAddress);

    const a = await getSwapExactInBytes(
      '11155111',
      provider,
      "0x6f57e483790DAb7D40b0cBA14EcdFAE2E9aA2406",
      "0xaA7024098a12e7E8bacb055eEcD03588d4A5d75d",
      new Decimal(1000000000000),
      new Decimal(res.quoteAmount),
      '0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89',
      false,
      0,
      Number(res.fee),
      res.poolAddress
    );
    console.log('----------aaaaa', a);
  };

  const exchange = () => {
    const [newTokenIn, newTokenOut] = [tokenOut, tokenIn];
    setTokenIn(newTokenIn);
    setTokenOut(newTokenOut);
    setAmountIn(amountOut);
    setAmountOut(0);
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
    const chainId = localStorage.getItem('chainId');
    const { universalRouterAddress, uniswapV2RouterAddress } =
      config[chainId || '11155111'];
    console.log(provider);

    const param = [
      '11155111',
      provider,
      await getUniversalRouterContract(provider, universalRouterAddress),
      await getUniswapV2RouterContract(provider, uniswapV2RouterAddress),
      tokenIn.address,
      tokenOut.address,
      new Decimal(value),
      new Decimal(0.02),
      0,
    ];
    if (type === 'in') {
      const amount = await getAmountOut.apply(null, param);

      setAmountOut(Number(amount.toString()));
    }
    if (type === 'out') {
      const amount = await getAmountIn.apply(null, param);
      console.log(amount);
      setAmountIn(Number(amount.toString()));
    }
  };

  const getAmountDebounce = useCallback(debounce(getAmount, 300), [
    tokenIn,
    tokenOut,
  ]);

  return (
    <div className="swap-comp">
      <div>
        <AdvConfig onClose={() => console.log('123123')} />
      </div>
      <div className="input-token send-token">
        <div className="dapp-sniper-right-token">
          <div className="dapp-sniper-right-token-label">Send</div>
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => {
              currentSetToken.current = 'in';
              setOpenSelect(true);
            }}
          >
            <img className="eth-logo" src={tokenIn?.icon} alt="" />
            <span>{tokenIn?.symbol}</span>
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
      </div>
      <div className="exchange">
        <img
          className="exchange-img"
          src="/exchange.png"
          alt=""
          onClick={() => exchange()}
        />
      </div>
      <div className="input-token receive-token">
        <div className="dapp-sniper-right-token">
          <div className="dapp-sniper-right-token-label">Receive</div>
          <div
            className="dapp-sniper-right-token-icon"
            onClick={() => {
              currentSetToken.current = 'out';
              setOpenSelect(true);
            }}
          >
            <img className="eth-logo" src={tokenOut?.icon || ''} alt="" />
            <span>{tokenOut?.symbol}</span>
            <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
          </div>
        </div>
        <ProInputNumber
          value={amountOut}
          onChange={(v) => {
            setAmountOut(v);
            getAmountDebounce('out', v);
          }}
        />
        <div className="token-info">
          <div>1 USDT</div>
          <div>Balance: 0</div>
        </div>
      </div>
      <div className="bottom-info">
        <div className="exchange-rate">
          <span>Reference Exchange Rate</span>
          <span>-</span>
        </div>
        <div className="exchange-fee">
          <span>Estinated Fees</span>
          <span>-</span>
        </div>
        <div className="exchange-path">
          <span>Quote Path</span>
          <span>-</span>
        </div>
      </div>
      <Button
        className="swap-button"
        onClick={() =>
          onSwap({
            amountIn,
            amountOut,
            tokenIn: tokenIn.address,
            tokenOut: tokenOut.address,
          })
        }
      >
        Swap
      </Button>
      <SelectTokenModal
        open={openSelect}
        onChange={(data) => {
          console.log(data);

          if (currentSetToken.current === 'in') {
            setTokenIn(data);
          } else {
            setTokenOut(data);
          }
          setOpenSelect(false);
        }}
        onCancel={() => setOpenSelect(false)}
      />
    </div>
  );
}

export default SwapComp;
