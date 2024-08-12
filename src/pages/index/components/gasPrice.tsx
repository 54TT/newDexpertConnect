import { CountContext } from '@/Layout.tsx';
import { useContext, useEffect,  useState } from 'react';
import Load from '@/components/allLoad/load';
import { getGas } from '@/../utils/getGas.ts';
import newPair from '@/components/getNewPair.tsx';
export default function gasPrice() {
  const {
    ethPrice,
    wait,
  } = newPair() as any;
  const { switchChain }: any = useContext(CountContext);
  const [gasLoad, setGasLoad] = useState(true);
  const [gas, setGas] = useState<string>('');

  const gasEthGas = async () => {
    const data: any = await getGas(switchChain);
    if (data) {
      setGasLoad(false);
      setGas(data);
    }
  };
  useEffect(() => {
    gasEthGas();
    setGasLoad(true);
  }, [switchChain]);

  return (
    <div className={`indexRight dis`}>
      <div style={{ marginRight: '10px' }} className="div">
        <img
          src={
            switchChain === 'Polygon'
              ? '/PolygonCoin.svg'
              : switchChain === 'BSC'
                ? '/BNBChain.svg'
                : '/EthereumChain.svg'
          }
          loading={'lazy'}
          alt=""
        />
        {wait ? (
          <Load />
        ) : (
          <p>
            $ : <span>{ethPrice}</span>
          </p>
        )}
      </div>
      <div className="div">
        <img loading={'lazy'} src="/gas.svg" alt="" />
        {gasLoad ? (
          <Load />
        ) : (
          <p>
            Gas : <span>{gas}</span>
          </p>
        )}
      </div>
    </div>
  );
}
