import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CountContext } from '@/Layout';

// 定时任务的hook
const useInterval = (fn, delay, depency): [any, boolean, boolean] => {
  const { provider } = useContext(CountContext);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [dependencyChange, setDependencyChange] = useState(true);
  const timer = useRef(null);

  const getData = useCallback(async () => {
    try {
      const data = await fn();
      setLoading(true);
      setData(data);
    } catch (e) {
      setLoading(false);
    }
  }, [fn]);

  useEffect(() => {
    if (data) {
      setDependencyChange(false);
      setLoading(false);
    }
  }, [data]);

  const getIntervalDataCallback = useCallback(() => {
    getData();
    timer.current = setInterval(getData, delay);
  }, [getData, delay]);

  useEffect(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
    getIntervalDataCallback();
    return () => {
      setDependencyChange(true);
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [provider, delay, ...depency]);
  return [data, loading, dependencyChange];
};

export default useInterval;
