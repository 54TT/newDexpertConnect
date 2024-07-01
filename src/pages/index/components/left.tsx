import { Select, Tooltip, Input, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '@/components/allLoad/loading.tsx';
import Load from '@/components/allLoad/load.tsx';
import NewPair from './newPairDate.tsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { CountContext } from '@/Layout.tsx';
import newPair from '@/components/getNewPair.tsx';
import { useTranslation } from 'react-i18next';
import { getGas } from '../../../../utils/getGas.ts';
import Nodata from '../../../components/Nodata.tsx';
import ChooseChain from '../../../components/chooseChain.tsx';
import { chainParams } from '@utils/judgeStablecoin.ts';
import { SearchOutlined } from '@ant-design/icons';
const { Search } = Input;
function Left() {
  const hei = useRef<any>();
  const {
    ethPrice,
    moreLoad,
    tableDta,
    setDta,
    wait,
    changePage,
    setSearchStr,
  } = newPair() as any;
  const { browser, switchChain, setSwitchChain }: any =
    useContext(CountContext);
  const [tableHei, setTableHei] = useState('');
  const [select, setSelect] = useState('newPair');
  const time = '24h';
  const [gas, setGas] = useState<string>('');
  const [gasLoad, setGasLoad] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [] = useState(false);
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

  const onSearchPair = (v: string) => {
    setSearchStr(v);
  };

  return (
    <div className={'indexBox'} style={{ width: browser ? '74%' : 'auto' }}>
      {/* top*/}
      <div
        ref={hei}
        className={`indexTop`}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <div className="disDis">
          <ChooseChain
            chainList={chainParams}
            disabledChain={true}
            hideChain={true}
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
            options={[
              { value: 'newPair', label: t('Market.New') },
              { value: 'trading', label: t('Market.Trading'), disabled: true },
              { value: 'watch', label: t('Market.Favorites'), disabled: true },
            ]}
          />
          {browser ? (
            <div className="pair-search">
              <Search
                className="common-search"
                placeholder={t('Common.SearchPairPlaceholder')}
                onSearch={onSearchPair}
                allowClear
              />
            </div>
          ) : (
            <SearchOutlined
              style={{ color: '#fff', marginLeft: '8px', fontSize: '18px' }}
              onClick={() => setSearchModal(true)}
            />
          )}
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
      </div>
      <div
        className="scrollStyle"
        style={{ width: '100%', overflow: browser ? 'hidden' : 'auto hidden' }}
      >
        <div
          className={`indexNewPair`}
          style={{ width: browser ? '100%' : '170%' }}
        >
          <div className={'indexNewPairTitle'}>
            {[
              { name: t('Market.Name'), key: 'name' },
              { name: `${t('Market.Price')}($)`, key: 'price' },
              { name: time + ' Change', key: 'change' },
              { name: t('Market.Create Time'), key: 'time' },
              { name: t('Market.Pooled Amt'), key: 'pooled' },
              { name: t('Market.Swap Count'), key: 'swap' },
              { name: t('Market.Liquidity'), key: 'Liquidity' },
              { name: t('Market.Links'), key: 'link' },
            ].map((i: any, ind: number) => {
              return (
                <p className={` homeTableTittle`} key={ind}>
                  {i.key === 'name' && (
                    <img
                      loading={'lazy'}
                      src="/collect.svg"
                      alt=""
                      style={{ marginRight: '5px', display: 'none' }}
                      width={'15px'}
                    />
                  )}
                  <span>{i.name}</span>
                  {(i.key === 'pooled' ||
                    i.key === 'swap' ||
                    i.key === 'Liquidity') && (
                    <Tooltip
                      title={
                        i.key === 'pooled'
                          ? t('Market.pooled')
                          : i.key === 'swap'
                            ? t('Market.swap')
                            : t('Market.liquidity')
                      }
                      rootClassName="allTooltipClass"
                    >
                      <img
                        src="/wenhao.svg"
                        alt=""
                        width={'15px'}
                        style={{ marginLeft: '3px' }}
                      />
                    </Tooltip>
                  )}
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
      <Modal
        open={searchModal}
        onCancel={() => setSearchModal(false)}
        footer={null}
      >
        <Search
          className="common-search pair-search-modal"
          placeholder={t('Common.SearchPairPlaceholder')}
          onSearch={onSearchPair}
          allowClear
        />
      </Modal>
    </div>
  );
}

export default Left;
