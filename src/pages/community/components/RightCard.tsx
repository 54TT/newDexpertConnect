import { Card } from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import { setMany, simplify } from '@/../utils/change.ts';
import newPair from '@/components/getNewPair.tsx';
const Loading = React.lazy(() => import('@/components/allLoad/loading.tsx'));
import { DownOutlined } from '@ant-design/icons';
import { throttle } from 'lodash-es';
import { useLocation } from 'react-router-dom';
const Nodata = React.lazy(() => import('@/components/Nodata.tsx'));
import { useTranslation } from 'react-i18next';
import { CountContext } from '@/Layout.tsx';
function RightCard({ data, par, load }: any) {
  const { tableDta, wait } = newPair() as any;
  const { browser }: any = useContext(CountContext);
  const { title, value: titleValue } = data;
  const router = useLocation();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [newPage, setNewPage] = useState(1);
  const [params, setData] = useState([]);
  useEffect(() => {
    if (tableDta.length > 0) {
      setData(tableDta);
    }
  }, [tableDta]);

  return (
    <div
      className="dappRightCardBox"
      style={{
        width: router.pathname.includes('/community/') ? '100%' : '32%',
      }}
    >
      <p className="dappRightCardBoxText">{title}</p>
      <Card
        title={
          <div
            className="card-pair-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <p style={{ color: 'white' }}>{t('Slider.Name')}</p>
            <p style={{ color: 'white' }}>{t('Slider.Price')}</p>
            <p style={{ color: 'white' }}>24h(%)</p>
          </div>
        }
        bordered={false}
        style={{ width: '95%', margin: '0 auto' }}
      >
        <div
          className="scrollStyle"
          style={{ overflowY: 'auto', height: '25vh' }}
        >
          {titleValue === 'New Pairs' ? (
            wait ? (
              <Loading status={'20'} browser={browser} />
            ) : params.length > 0 ? (
              <>
                {params.slice(0, newPage * 5).map((i: any, ind: number) => {
                  const change = setMany(i?.pairDayData[0]?.priceChange || 0);
                  const float =
                    i?.pairDayData[0]?.priceChange &&
                    Number(i?.pairDayData[0]?.priceChange) > 0
                      ? 1
                      : Number(i?.pairDayData[0]?.priceChange) < 0
                        ? -1
                        : 0;
                  return change &&
                    change.includes('T') &&
                    change.length > 10 ? (
                    ''
                  ) : (
                    <div className="card-pair-info" key={ind}>
                      <p>
                        {simplify(i?.token0?.symbol?.replace(/^\s*|\s*$/g, ''))}
                      </p>
                      <p>{setMany(i?.priceUSD)}</p>
                      <p
                        style={{
                          color:
                            float > 0
                              ? 'rgb(0,255,71)'
                              : float < 0
                                ? 'rgb(213,9,58)'
                                : '#d6dfd7',
                        }}
                      >
                        {change || 0}
                      </p>
                    </div>
                  );
                })}
                {params.length > 0 && newPage < 5 && (
                  <p
                    className="dappRightNext"
                    onClick={throttle(
                      async function () {
                        setNewPage(newPage + 1);
                      },
                      1500,
                      { trailing: false }
                    )}
                  >
                    <span style={{ marginRight: '4px' }}>
                      {t('Slider.More')}
                    </span>
                    <DownOutlined />
                  </p>
                )}
              </>
            ) : (
              <Nodata />
            )
          ) : load ? (
            <Loading status={'20'} browser={browser} />
          ) : par.length > 0 ? (
            <div>
              {par.slice(0, 5 * page).map((i: any, ind: number) => {
                const change = setMany(i?.pairDayData[0]?.priceChange || 0);
                const float =
                  i?.pairDayData[0]?.priceChange &&
                  Number(i?.pairDayData[0]?.priceChange) > 0
                    ? 1
                    : Number(i?.pairDayData[0]?.priceChange) < 0
                      ? -1
                      : 0;
                return change && change.includes('T') && change.length > 10 ? (
                  ''
                ) : (
                  <div
                    className="card-pair-info"
                    style={{ marginBottom: '0' }}
                    key={ind}
                  >
                    <p>
                      {i?.token0?.symbol && i?.token0?.symbol === 'WETH'
                        ? simplify(i?.token1?.symbol)
                        : simplify(i?.token0?.symbol)}
                    </p>
                    <p>{setMany(i?.priceUSD)}</p>
                    <p
                      style={{
                        color:
                          float > 0
                            ? 'rgb(0,255,71)'
                            : float < 0
                              ? 'rgb(213,9,58)'
                              : '#d6dfd7',
                      }}
                    >
                      {change || 0}
                    </p>
                  </div>
                );
              })}
              {page !== 3 && !(par.length % 5) && (
                <p
                  className="dappRightNext"
                  onClick={throttle(
                    function () {
                      setPage((res) => res + 1);
                    },
                    1500,
                    { trailing: false }
                  )}
                >
                  <span style={{ marginRight: '4px' }}>{t('Slider.More')}</span>
                  <DownOutlined />
                </p>
              )}
            </div>
          ) : (
            <Nodata />
          )}
        </div>
      </Card>
    </div>
  );
}

export default RightCard;
