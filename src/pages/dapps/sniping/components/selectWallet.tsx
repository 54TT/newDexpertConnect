import './index.less';
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import React,{ useEffect, useState, useContext } from 'react';
const Loading = React.lazy(() => import('@/components/allLoad/loading.tsx'));

import { CountContext } from '@/Layout.tsx';
import getBalance from '@/../utils/getBalance';
import { useTranslation } from 'react-i18next';
const InfiniteScrollPage = React.lazy(() => import('@/components/InfiniteScroll'));

export default function selectWallet({ setWallet, id, value,setAddLink }: any) {
  const { t } = useTranslation();
  const { browser }: any = useContext(CountContext);
  const { getAll } = Request();
  const [data, setData] = useState([]);
  const [select, setSelect] = useState<any>([]);
  const [isSelect, setIsSelect] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const getWalletList = async (page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/list',
      data: { page },
      token,
      chainId: id,
    });
    if (res?.status === 200) {
      let address: any = [];
      if (res?.data?.list.length > 0) {
        res?.data?.list.map((i: any) => {
          address.push(i.address);
        });
        const priceAll = await getBalance(address, id.toString());
        if (priceAll.length > 0) {
          const newer = priceAll.map((i: any) => {
            i.balance = Number(i.balance)
              ? (i.balance / 10 ** 18).toFixed(3)
              : 0;
            return i;
          });
          const tt = res?.data?.list.map((i: any) => {
            newer.map((item: any) => {
              if (i.address === item.account) {
                i.balance = item.balance;
              }
            });
            return i;
          });
          if (page === 1) {
            setData(tt);
          } else {
            const yy = data.concat(tt);
            setData(yy);
          }
        } else {
          if (page === 1) {
            setData(res?.data?.list);
          } else {
            const yy = data.concat(res?.data?.list);
            setData(yy);
          }
        }
      }
      if (res?.data?.list.length !== 10) {
        setIsNext(true);
      }
      setLoad(true);
      setNextLoad(false);
    } else {
      setLoad(true);
      setNextLoad(false);
    }
  };
  const changePage = () => {
    if (!isNext) {
      getWalletList(page + 1);
      setPage(page + 1);
      setNextLoad(true);
    }
  };
  useEffect(() => {
    getWalletList(1);
  }, []);

  const items = (i: any) => {
    return (
      <div
        onClick={() => {
          if (Number(i.balance) && Number(i.balance) >= value) {
            const data = select.filter(
              (item: any) =>
                item?.privateKey === i.privateKey && item?.name === i.name
            );
            if (data.length > 0) {
              const tt = select.filter((item: any) => item?.name !== i.name);
              setSelect(tt);
              setIsSelect(!isSelect);
              setWallet(tt);
            } else {
              select.push(i);
              setSelect(select);
              setIsSelect(!isSelect);
              setWallet(select);
            }
          }
        }}
        style={{
          border:
            select.filter(
              (item: any) =>
                item?.privateKey === i.privateKey && item?.name === i?.name
            ).length > 0
              ? '1px solid rgb(134,240,151)'
              : '1px solid transparent',
          cursor: Number(i.balance) ? 'pointer' : 'not-allowed',
        }}
        className="wallet"
        key={i.privateKey + i.name}
      >
        <div className="left">
            <p>{i.name}</p>
            <p>{i.address.slice(0, 4) + '...' + i.address.slice(-4)}</p>
        </div>
        <p>{i.balance || 0}ETH</p>
      </div>
    );
  };
  return (
    <div className="allWallet scrollHei sniperOrder">
      {load ? (
        <InfiniteScrollPage
          data={data}
          next={changePage}
          items={items}
          nextLoad={nextLoad}
          no={t('token.oo')}
          style={{ overflow: 'hidden' }}
          scrollableTarget={'scrollableSniperOrder'}
          setAddLink={setAddLink}
        />
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
    </div>
  );
}
