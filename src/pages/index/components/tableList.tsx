import { Tooltip, Table, ConfigProvider } from 'antd';
import React, { useContext } from 'react';
import newPair from '@/components/getNewPair.tsx';
const Nodata = React.lazy(() => import('@/components/Nodata'));
const Loading = React.lazy(() => import('@/components/allLoad/loading'));
import { throttle } from 'lodash-es';
import { CountContext } from '@/Layout';
import { setMany, simplify } from '@/../utils/change.ts';
import { useTranslation } from 'react-i18next';
const Time = React.lazy(() => import('./time'));
import { useNavigate } from 'react-router-dom';
const Load = React.lazy(() => import('@/components/allLoad/load.tsx'));
export default function tableList({ tableHei }) {
  const history = useNavigate();
  const { t } = useTranslation();
  const time = '24h';
  const { browser, switchChain }: any = useContext(CountContext);
  const { moreLoad, tableDta, changePage } = newPair() as any;
  const push = throttle(
    function (i: any) {
      history('/newpairDetails/' + i?.id);
    },
    1500,
    { trailing: false }
  );

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
        return <Time create={create} />;
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
    <>
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
          scroll={{ x: browser ? null : 1200, y: Number(tableHei) - 10 }}
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
    </>
  );
}
