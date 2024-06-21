import { Select } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../../../components/allLoad/loading.tsx';
import Load from '../../../components/allLoad/load.tsx';
import NewPair from './newPairDate.tsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { CountContext } from '../../../Layout.tsx';
import newPair from '../../../components/getNewPair.tsx';
import { useTranslation } from 'react-i18next';
import { getGas } from '../../../../utils/getGas.ts';
import Nodata from '../../../components/Nodata.tsx';
import ChooseChain from '../../../components/chooseChain.tsx';
import { chainParams } from '@utils/judgeStablecoin.ts';
function Left() {
  const hei = useRef<any>();
  const { ethPrice, moreLoad, tableDta, setDta, wait, changePage } =
    newPair() as any;
  const { browser, switchChain, setSwitchChain }: any =
    useContext(CountContext);
  const [tableHei, setTableHei] = useState('');
  const [select, setSelect] = useState('newPair');
  const time = '24h';
  const [gas, setGas] = useState<string>('');
  const [gasLoad, setGasLoad] = useState(true);
  const gasOb = async () => {
    const data: any = await getGas(switchChain);
    if (data) {
      setGasLoad(false);
      setGas(data);
    }
  };
  useEffect(() => {
    if (hei && hei.current) {
      const h = hei.current.scrollHeight;
      const w = window.innerHeight;
      const o: any = w - h - 120 + 35;
      setTableHei(o);
    }
  }, []);

  useEffect(() => {
    gasOb();
    setGasLoad(true);
  }, [switchChain]);
  const handleChange = (value: string) => {
    setSelect(value);
  };
  const { t } = useTranslation();
  return (
    <div className={'indexBox'} style={{ width: browser ? '74%' : 'auto' }}>
      {/* top*/}
      <div ref={hei} className={`indexTop dis`}>
        <div className="disDis">
          <ChooseChain
            chainList={chainParams}
            disabledChain={true}
            onChange={(v) => setSwitchChain(v)}
          />
          <Select
            onChange={handleChange}
            value={select}
            suffixIcon={
              <img
                src="/down.svg"
                alt=""
                width={'14px'}
                style={{ marginTop: '3px' }}
              />
            }
            className={'indexSelect'}
            popupClassName={'indexSelectPopup'}
            style={{
              width: '120px',
              border: '2px solid #3c453c',
              borderRadius: '7px',
              marginLeft: '7px',
            }}
            options={[
              { value: 'newPair', label: t('Market.New') },
              { value: 'trading', label: t('Market.Trading'), disabled: true },
              { value: 'watch', label: t('Market.Favorites'), disabled: true },
            ]}
          />
        </div>
        {/* <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} className={'homeSegmented'} defaultValue={'24h'} /> */}
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
            {wait ? <Load /> : <span>$:{ethPrice}</span>}
          </div>
          <div className="div">
            <img loading={'lazy'} src="/gas.svg" alt="" />
            {gasLoad ? <Load /> : <span>{gas}</span>}
          </div>
        </div>
      </div>
      <div
        className="scrollStyle"
        style={{ width: '100%', overflow: browser ? 'hidden' : 'auto hidden' }}
      >
        <div
          className={`indexNewPair`}
          style={{ width: browser ? '100%' : '170%' }}
        >
          {/*tittle*/}
          <div className={'indexNewPairTitle'}>
            {[
              t('Market.Name'),
              `${t('Market.Price')}($)`,
              time + ' Change',
              t('Market.Create Time'),
              t('Market.Pooled Amt'),
              t('Market.Swap Count'),
              t('Market.Liquidity'),
              t('Market.Links'),
            ].map((i: string, ind: number) => {
              return (
                <p className={` homeTableTittle`} key={ind}>
                  {ind === 0 && (
                    <img
                      loading={'lazy'}
                      src="/collect.svg"
                      alt=""
                      style={{ marginRight: '5px', display: 'none' }}
                      width={'15px'}
                    />
                  )}
                  <span>{i}</span>
                </p>
              );
            })}
          </div>
          <div
            className={`indexNewPairBody scrollStyle`}
            id={'scrollableNew'}
            style={{
              height: browser ? tableHei + 'px' : '60vh',
              overflowY: 'auto',
            }}
          >
            <InfiniteScroll
              hasMore={true}
              scrollableTarget="scrollableNew"
              next={changePage}
              loader={null}
              dataLength={tableDta.length}
            >
              {wait ? (
                <Loading status={'20'} browser={browser} />
              ) : tableDta.length > 0 ? (
                <NewPair tableDta={tableDta} time={time} setDta={setDta} />
              ) : (
                <Nodata />
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>
      <div
        style={{
          visibility: moreLoad && tableDta.length > 0 ? 'initial' : 'hidden',
        }}
      >
        <Load />
      </div>
    </div>
  );
}

export default Left;
