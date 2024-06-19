import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CountContext } from '@/Layout';

// 定时任务的hook
const useInterval = (fn, initData, delay, depency): [any, boolean] => {
  const { provider } = useContext(CountContext);
  const [data, setData] = useState<any>(initData);
  const [change, setChange] = useState(false);
  const timer = useRef(null);

  const getData = useCallback(async () => {
    try {
      const data = await fn();
      setData(data);
      setChange(true);
      setTimeout(() => {
        setChange(false);
      }, 2500);
    } catch (e) {
      console.log(e);
      setChange(false);
    }
  }, depency);

  const getIntervalDataCallback = useCallback(() => {
    getData();
    timer.current = setInterval(getData, delay);
  }, [...depency, delay]);

  useEffect(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
    getIntervalDataCallback();
    return () => {
      clearInterval(timer.current);

      timer.current = null;
    };
  }, [provider, delay, ...depency]);
  return [data, change];
};

export default useInterval;
