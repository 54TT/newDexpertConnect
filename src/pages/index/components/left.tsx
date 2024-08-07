import { Select, Tooltip, Input, Modal, Table, ConfigProvider } from 'antd';
import React,{ useContext, useEffect, useRef, useState } from 'react';
const Load = React.lazy(() => import('@/components/allLoad/load.tsx'));

import { CountContext } from '@/Layout.tsx';
import newPair from '@/components/getNewPair.tsx';
import { useTranslation } from 'react-i18next';
import { setMany, simplify } from '@/../utils/change.ts';
import { throttle } from 'lodash';
import { getGas } from '@/../utils/getGas.ts';
const ChooseChain = React.lazy(() => import('@/components/ChangeChain/components/chooseChain.tsx'));
const Nodata = React.lazy(() => import('@/components/Nodata'));
const Loading = React.lazy(() => import('@/components/allLoad/loading'));
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // 使用相对时间插件
dayjs.extend(duration); // 使用相对时间插件
import { chainParams } from '@utils/judgeStablecoin.ts';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Search } = Input;
function Left() {
  const history = useNavigate();
  const hei = useRef<any>();
  const {
    ethPrice,
    moreLoad,
    tableDta,
    wait,
    changePage,
    setSearchStr,
    searchStr,
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

  const push = throttle(
    function (i: any) {
      history('/newpairDetails/' + i?.id);
    },
    1500,
    { trailing: false }
  );

  useEffect(() => {
    gasOb();
    setGasLoad(true);
  }, [switchChain]);
  const handleChange = (value: string) => {
    setSelect(value);
  };
  const { t } = useTranslation();

  const onSearchPair = (v: string) => {
    if (searchStr !== v) {
      setSearchStr(v);
    }
  };
  const [countdown, setCountdown] = useState<any>(null);
  useEffect(() => {
    let show = setInterval(() => {
      const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
      setCountdown(time);
    }, 1000);
    return () => clearInterval(show);
  }, []);
  const chang = (name: any) => {
    if (countdown) {
      const diff = dayjs(countdown).diff(
        dayjs.unix(name).format('YYYY-MM-DD HH:mm:ss')
      );
      const duration = dayjs.duration(diff);
      const year = duration.years();
      const month = duration.months();
      const day = duration.days();
      const hour = duration.hours();
      const minute = duration.minutes();
      const second = duration.seconds();
      if (year) {
        return year + ' y ' + month + ' m';
      } else if (month) {
        return month + ' m ' + day + ' d';
      } else if (day) {
        return day + ' d ' + hour + ' h';
      } else if (hour) {
        return hour + ' h ' + minute + ' m';
      } else if (minute) {
        return minute + ' m ' + second + ' ss';
      } else {
        return second + ' ss';
      }
    } else {
      return <Load />;
    }
  };
  const fixedColumns: any = [
    {
      title: t('Market.Name'),
      dataIndex: 'name',
      fixed: 'left',
      render: (_, record) => {
        return (
          <div className="one">
            <p>{simplify(record?.token0?.symbol?.replace(/^\s*|\s*$/g, ''))}</p>
            <p>{simplify(record?.token1?.symbol?.replace(/^\s*|\s*$/g, ''))}</p>
          </div>
        );
      },
    },
    {
      title: `${t('Market.Price')}($)`,
      dataIndex: 'price',
      render: (_, record) => {
        return (
          <p>{Number(record?.priceUSD) ? setMany(record?.priceUSD) : 0}</p>
        );
      },
    },
    {
      title: time + ' Change',
      dataIndex: 'change',
      render: (_, record) => {
        const data =
          time === '24h'
            ? record?.pairDayData
            : time === '6h'
              ? record?.PairSixHourData
              : time === '1h'
                ? record?.pairHourData
                : record?.PairFiveMinutesData;
        const value: any =
          data && data.length > 0
            ? Number(data[0]?.priceChange)
              ? data[0]?.priceChange.includes('.000')
                ? 0
                : Number(data[0]?.priceChange).toFixed(3)
              : 0
            : 0;
        const par = Number(value) !== 0 ? setMany(value) : 0;
        return (
          <p
            style={{
              color:
                Number(value) > 0
                  ? 'rgb(0,255,71)'
                  : Number(value) === 0
                    ? 'white'
                    : 'rgb(213,60,58)',
            }}
          >
            {Number(par) !== 0 ? par + '%' : '0'}
          </p>
        );
      },
    },
    {
      title: t('Market.Create Time'),
      dataIndex: 'time',
      render: (_, record) => {
        const create =
          record?.createdAtTimestamp.toString().length > 10
            ? Number(record.createdAtTimestamp.toString().slice(0, 10))
            : Number(record.createdAtTimestamp);
        return <div style={{ color: 'white',lineHeight:'2.2' }}> {chang(create)}</div>;
      },
    },
    {
      title: (
        <div className="titleHint">
          <span>{t('Market.Pooled Amt')}</span>
          <Tooltip title={t('Market.pooled')} rootClassName="allTooltipClass">
            <img
              src="/wenhao.svg"
              alt=""
              width={'15px'}
              style={{ marginLeft: '3px' }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'pooled',
      render: (_, record) => {
        return (
          <p>
            {setMany(record?.initialReserve)}
            {switchChain === 'Polygon'
              ? 'matic'
              : switchChain === 'BSC'
                ? 'BNB'
                : 'ETH'}
          </p>
        );
      },
    },
    {
      title: (
        <div className="titleHint">
          <span>{t('Market.Swap Count')}</span>
          <Tooltip title={t('Market.swap')} rootClassName="allTooltipClass">
            <img
              src="/wenhao.svg"
              alt=""
              width={'15px'}
              style={{ marginLeft: '3px' }}
            />
          </Tooltip>
        </div>
      ),

      dataIndex: 'swap',
      render: (_, record) => {
        const dateTime =
          time === '24h'
            ? record?.pairDayData
            : time === '6h'
              ? record?.PairSixHourData
              : time === '1h'
                ? record?.pairHourData
                : record?.PairFiveMinutesData;
        return (
          <p>
            {dateTime && dateTime.length > 0
              ? Number(dateTime[0]?.swapTxns)
              : 0}
          </p>
        );
      },
    },
    {
      title: (
        <div className="titleHint">
          <span>{t('Market.Liquidity')}</span>
          <Tooltip
            title={t('Market.liquidity')}
            rootClassName="allTooltipClass"
          >
            <img
              src="/wenhao.svg"
              alt=""
              width={'15px'}
              style={{ marginLeft: '3px' }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'Liquidity',
      render: (_, record) => {
        const data: any =
          record?.liquidity && Number(record.liquidity)
            ? setMany(record.liquidity)
            : 0;
        return <p>{data}</p>;
      },
    },
    {
      title: t('Market.Links'),
      dataIndex: 'link',
      render: (_, record) => {
        return (
          <div className="showLogo">
            {[
              { img: '/ethLogo.svg', name: 'eth' },
              { img: '/feima.svg', name: 'univ2' },
              { img: '/uncx.svg', name: 'uncx' },
            ].map((i: any, index: number) => {
              return (
                <Tooltip
                  key={index}
                  title={
                    i.name === 'eth' ? (
                      <p className="eth">
                        <span>{t('Market.eth')}</span>{' '}
                        <span>{record?.token0?.id}</span>{' '}
                      </p>
                    ) : i.name === 'uncx' ? (
                      t('Market.bluur')
                    ) : (
                      t('Market.uni2')
                    )
                  }
                  rootClassName="allTooltipClass"
                >
                  <div className={'imgBox'}>
                    <img
                      loading={'lazy'}
                      src={i.img}
                      alt=""
                      onClick={throttle(
                        function (e: any) {
                          e.stopPropagation();
                          if (i.name === 'eth') {
                            window.open(
                              'https://etherscan.io/token/' + record?.token0?.id
                            );
                          } else if (i.name === 'univ2') {
                            window.open(
                              'https://app.uniswap.org/#/swap?inputCurrency=' +
                                record?.token1?.id +
                                '&outputCurrency=' +
                                record?.token1?.id
                            );
                          } else if (i.name === 'uncx') {
                            window.open(
                              'https://app.uncx.network/amm/uni-v2/pair/' +
                                record?.id
                            );
                          }
                        },
                        1500,
                        { trailing: false }
                      )}
                    />
                  </div>
                </Tooltip>
              );
            })}
          </div>
        );
      },
    },
  ];
  const scorllBot = (e: any) => {
    if (
      e?.target?.scrollHeight - e?.target?.scrollTop <=
      e?.target?.offsetHeight + 10
    ) {
      changePage();
    }
  };
  return (
    <div className={'indexBox'} style={{ width: browser ? '100%' : 'auto' }}>
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
              /*  { value: 'trading', label: t('Market.Trading'), disabled: true },
              { value: 'watch', label: t('Market.Favorites'), disabled: true }, */
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
      <ConfigProvider
        renderEmpty={() => {
          if (tableDta.length > 0) {
            return <Nodata name={t('token.data')} />;
          } else {
            if (moreLoad) {
              return <Loading status={'20'} browser={browser} />;
            }
          }
        }}
      >
        <Table
          bordered={false}
          virtual
          columns={fixedColumns}
          scroll={{ x: browser ? 'auto' : 1200, y: Number(tableHei) - 10 }}
          rowKey="id"
          className="newoairTable"
          onScroll={scorllBot}
          dataSource={tableDta}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                push(record);
              },
            };
          }}
        />
      </ConfigProvider>
      <div
        style={{
          visibility: moreLoad && tableDta.length > 0 ? 'initial' : 'hidden',
        }}
      >
        <Load />
      </div>
      <Modal
        open={searchModal}
        centered
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
