import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { useContext, useState } from 'react';
import { setMany, simplify } from '@/../utils/change.ts';
import Copy from '@/components/copy.tsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import { judgeStablecoin } from '@/../utils/judgeStablecoin.ts';
import { CountContext } from '@/Layout.tsx';
dayjs.extend(relativeTime); // 使用相对时间插件
function Left({ par }: any) {
  const h = window.innerHeight - 25 - 54 + 21;
  const [selectOne, setSelectOne] = useState('more');
  const [selectTwo, setSelectTwo] = useState('more');
  const { switchChain, browser }: any = useContext(CountContext);
  const { t } = useTranslation();
  const value = judgeStablecoin(par?.token0?.id, par?.token1?.id, switchChain);
  const float =
    par?.pairDayData[0]?.priceChange &&
    Number(par?.pairDayData[0]?.priceChange) > 0
      ? 1
      : Number(par?.pairDayData[0]?.priceChange) < 0
        ? -1
        : 0;
  const market = Number(par?.MKTCAP) ? setMany(Number(par?.MKTCAP)) : 0;
  const fdv = Number(par?.FDV) ? setMany(Number(par?.FDV)) : 0;
  const create =
    par?.createdAtTimestamp.toString().length > 10
      ? Number(par.createdAtTimestamp.toString().slice(0, 10))
      : Number(par.createdAtTimestamp);
  const show = throttle(
    function (name: string) {
      if (name === 'one') {
        setSelectOne('select');
      } else {
        setSelectTwo('select');
      }
    },
    1500,
    { trailing: false }
  );
  return (
    <div
      className={`NewpairDetailsOne scrollStyle`}
      style={{ height: h + 'px' }}
    >
      {/*top*/}
      <div className={`top dis`}>
        <div>
          {/*<img loading={'lazy'} src="/logo1.svg" alt=""/>*/}
          <p>
            <span>{par?.token0?.symbol?.slice(0, 1)}</span>
          </p>
          <p>
            <span>
              {value === 1
                ? simplify(par?.token1?.symbol?.replace(/^\s*|\s*$/g, ''))
                : simplify(par?.token0?.symbol?.replace(/^\s*|\s*$/g, ''))}
            </span>
            <span>
              {value !== 1
                ? simplify(par?.token1?.symbol?.replace(/^\s*|\s*$/g, ''))
                : simplify(par?.token0?.symbol?.replace(/^\s*|\s*$/g, ''))}
            </span>
          </p>
        </div>
        {/*收藏*/}
        <p
          style={{ display: 'none' }}
          onClick={throttle(function () {}, 1500, { trailing: false })}
        ></p>
      </div>
      <div className={`address dis`}>
        <div>
          <span>CA:</span>
          <span
            style={{
              color: browser ? '#c2bebe' : 'rgb(89,175,255)',
              borderBottom: browser ? 'none' : '1px solid rgb(89,175,255)',
            }}
          >
            {value === 0
              ? simplify(par?.token0?.id)
              : value === 1
                ? simplify(par?.token1?.id)
                : simplify(par?.token1?.id)}
          </span>
          <div onClick={() => show('one')}>
            <Copy
              setSelect={setSelectOne}
              select={selectOne}
              name={
                value === 0
                  ? par?.token0?.id
                  : value === 1
                    ? par?.token1?.id
                    : par?.token1?.id
              }
            />
          </div>
        </div>
        <div>
          <span>Pair:</span>
          <span
            style={{
              color: browser ? '#c2bebe' : 'rgb(89,175,255)',
              borderBottom: browser ? 'none' : '1px solid rgb(89,175,255)',
            }}
          >
            {simplify(par?.id)}
          </span>
          <div onClick={() => show('two')}>
            <Copy name={par?.id} setSelect={setSelectTwo} select={selectTwo} />
          </div>
        </div>
      </div>
      <div className={`dis img`}>
        {[
          '/website.svg',
          '/titter.svg',
          '/telegram.svg',
          '/information.svg',
        ].map((i: string, ind: number) => {
          return (
            <div key={ind}>
              <img loading={'lazy'} src={i} alt="" />
            </div>
          );
        })}
      </div>
      <div className="all">
        <div className={`price`}>
          <p>${Number(par?.priceUSD) ? setMany(par?.priceUSD) : 0}</p>
          <p
            style={{
              color:
                float > 0
                  ? 'rgb(0, 255, 71)'
                  : float < 0
                    ? 'rgb(213, 9, 58)'
                    : 'white',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {float > 0 ? (
              <CaretUpOutlined />
            ) : float < 0 ? (
              <CaretDownOutlined />
            ) : (
              ''
            )}{' '}
            {setMany(par?.pairDayData[0]?.priceChange || 0) || 0}%(1d)
          </p>
        </div>
        <div className={'valume'}>
          {[
            { name: t('Common.Volume'), price: setMany(par?.volumeUSD) || 0 },
            {
              name: t('Common.Liquidity'),
              price: setMany(par?.liquidity) || 0,
            },
            { name: t('Common.Market Cap'), price: market },
            {
              name: t('Common.FDV'),
              price: fdv,
            },
          ].map((i: any, ind: number) => {
            return (
              <div className={`dis butt`} key={ind}>
                <span>{i.name}</span>
                <span>{i.price}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="all">
        <div className={'swap'}>
          <p>{t('Common.Swap Count')}</p>
          <div className={`dis swapTop`} style={{ color: 'rgb(150,150,150)' }}>
            <span>{t('Common.buy')}</span>
            <span>{t('Common.total')}</span>
            <span>{t('Common.sell')}</span>
          </div>
          <div className={`dis swapTop`} style={{ marginBottom: '-5px' }}>
            <span>{par?.buyTxs || 0}</span>
            <span>{Number(par?.sellTxs) + Number(par?.buyTxs)}</span>
            <span>{par?.sellTxs || 0}</span>
          </div>
          <Progress
            percent={
              (Number(par?.buyTxs) /
                (Number(par?.sellTxs) + Number(par?.buyTxs))) *
              100
            }
            showInfo={false}
            strokeColor={'rgb(0,255,71)'}
            trailColor={'rgb(232,68,68)'}
          />
          <div className={`dis swapTop`}>
            <span>{setMany(par?.buyVolumeUSD) || 0}</span>
            <span>{setMany(par?.volumeUSD) || 0}</span>
            <span>{setMany(par?.sellVolumeUSD) || 0}</span>
          </div>
        </div>
        <div className={'valume'}>
          {[
            {
              name: t('Common.Created Time'),
              price: dayjs.unix(create).fromNow(),
            },
            {
              name: t('Common.Total Supply'),
              price: setMany(par?.tokenTotalSupply) || 0,
            },
            {
              name: t('Common.Initial Pool Amount'),
              price: setMany(par?.initialReserve),
            },
            {
              name:
                t('Common.Pooled') +
                ' ' +
                par?.token0?.symbol?.replace(/^\s*|\s*$/g, ''),
              price: setMany(par?.reserve0),
            },
            {
              name:
                t('Common.Pooled') +
                ' ' +
                par?.token1?.symbol?.replace(/^\s*|\s*$/g, ''),
              price: setMany(par?.reserve1),
            },
          ].map((i: any, ind: number) => {
            return (
              <div className={`dis butt`} key={ind}>
                <span>{i.name}</span>
                <span>{i.price}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Left;
