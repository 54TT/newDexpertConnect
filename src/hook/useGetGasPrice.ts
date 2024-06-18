import { useContext, useEffect, useRef, useState } from 'react';
import { CountContext } from '@/Layout';
import { BigNumber } from 'ethers';

const useGetGasPrice = (): [BigNumber, boolean] => {
  const { provider } = useContext(CountContext);
  const [gasPrice, setGasPrice] = useState<BigNumber>();
  const [change, setChange] = useState(false);
  const timer = useRef(null);

  const getGasPrice = async () => {
    const gas: BigNumber = await provider.getGasPrice();
    setChange(true);
    setGasPrice(gas);
    setTimeout(() => {
      setChange(false);
    }, 2000);
  };

  const getGasPriceInterval = () => {
    timer.current = setInterval(getGasPrice, 8000);
  };

  useEffect(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
    getGasPriceInterval();
    () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [provider]);
  return [gasPrice, change];
};

export default useGetGasPrice;
