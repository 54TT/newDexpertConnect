import './index.less';
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import { useEffect, useState, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '@/components/allLoad/loading';
import Load from '@/components/allLoad/load';
import { CountContext } from '@/Layout.tsx';
import getBalance from '@/../utils/getBalance';
export default function selectWallet({ setWallet }: any) {
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
    });
    if (res?.status === 200) {
      let address: any = [];
      if (res?.data?.list.length > 0) {
        res?.data?.list.map((i: any) => {
          address.push(i.address);
        });
        const priceAll = await getBalance(address);
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
  return (
    <div className="allWallet scrollHei sniperOrder" id="scrollableWalletList">
      {load ? (
        <InfiniteScroll
          hasMore={true}
          next={changePage}
          scrollableTarget={'scrollableWalletList'}
          loader={null}
          dataLength={data.length}
          style={{ overflow: 'hidden' }}
        >
          {data.length > 0 ? (
            data.map((i: any) => {
              return (
                <div
                  onClick={() => {
                    if (Number(i.balance)) {
                      const data = select.filter(
                        (item: any) => item?.privateKey === i.privateKey
                      );
                      if (data.length > 0) {
                        const tt = select.filter(
                          (item: any) => item?.privateKey !== i.privateKey
                        );
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
                        (item: any) => item?.privateKey === i.privateKey
                      ).length > 0
                        ? '1px solid rgb(134,240,151)'
                        : '1px solid transparent',
                    cursor: Number(i.balance) ? 'pointer' : 'not-allowed',
                  }}
                  className="wallet"
                  key={i.privateKey}
                >
                  <div className="left">
                    <img src="/abc.png" alt="" />
                    <div>
                      <p>{i.name}</p>
                      <p>
                        {i.address.slice(0, 4) + '...' + i.address.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <p>{i.balance || 0}ETH</p>
                </div>
              );
            })
          ) : (
            <p
              style={{
                textAlign: 'center',
                marginTop: '20px',
                color: 'white',
              }}
            >
              No wallet yet
            </p>
          )}
        </InfiniteScroll>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <div style={{ visibility: nextLoad ? 'visible' : 'hidden' }}>
        <Load />
      </div>
    </div>
  );
}
