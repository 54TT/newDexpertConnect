import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import React,{ useEffect, useState, useContext } from 'react';
const Loading = React.lazy(() => import('@/components/allLoad/loading.tsx'));

import { CountContext } from '@/Layout.tsx';
import getBalance from '@/../utils/getBalance';
import { useTranslation } from 'react-i18next';
const InfiniteScrollPage = React.lazy(() => import('@/components/InfiniteScroll'));
export default function walletList({
  setStatus,
  setAddWallet,
  setWalletId,
  id,
}: any) {
  const { t } = useTranslation();
  const { browser }: any = useContext(CountContext);
  const { getAll } = Request();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const getWalletList = async (page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/list',
      data: { page },
      token,
    });
    if (res?.status === 200) {
      let address: any = [];
      if (res?.data?.list.length > 0) {
        res?.data?.list.map((i: any) => {
          address.push(i.address);
        });
        const priceAll = await getBalance(address, id);
        if (priceAll.length > 0) {
          const newer = priceAll.map((i: any) => {
            i.balance = Number(i.balance)
              ? (i.balance / 10 ** 18).toFixed(3)
              : 0;
            return i;
          });
          const tt = res?.data?.list.map((i: any) => {
            newer.map((item: any) => {
              if (i.address === item.address) {
                i.balance = item.balance;
              }
            });
            return i;
          });
          if (page === 1) {
            setList(tt);
          } else {
            const data = list.concat(tt);
            setList(data);
          }
        } else {
          if (page === 1) {
            setList(res?.data?.list);
          } else {
            const data = list.concat(res?.data?.list);
            setList(data);
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
      <div className="wallet" key={i?.privateKey}>
        <div className="left">
          <img src="/backLeft.svg" alt="" />
          <div>
            <p>{i?.name}</p>
            <p>$0</p>
          </div>
        </div>
        <div
          onClick={() => {
            setAddWallet('set');
            setWalletId(i);
          }}
          className="right"
        >
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
    );
  };

  return (
    <div className="walletList">
      <div className="box" id="scrollableWalletList">
        {load ? (
          <InfiniteScrollPage
            data={list}
            next={changePage}
            items={items}
            nextLoad={nextLoad}
            no={t('token.oo')}
            scrollableTarget={'scrollableWalletList'}
          />
        ) : (
          <Loading status={'20'} browser={browser} />
        )}
      </div>
      <div className="add" onClick={() => setStatus('addMethod')}>
        <span>{t('sniping.Add')}</span>
        <img src="/addWalletGo.svg" alt="" />
      </div>
    </div>
  );
}
