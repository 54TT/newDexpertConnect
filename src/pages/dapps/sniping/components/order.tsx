import { useEffect, useState, useContext } from 'react';
import './index.less';
import { Modal } from 'antd';
import cookie from 'js-cookie';
import NotificationChange from '@/components/message';
import InfiniteScroll from 'react-infinite-scroll-component';
import Load from '@components/allLoad/load.tsx';
import LoadIng from '@components/allLoad/loading';
import Request from '@/components/axios.tsx';
import { CountContext } from '@/Layout';
export default function order({ setIsShow,setOrderPar }: any) {
  const { getAll } = Request();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const { browser }: any = useContext(CountContext);
  const [load, setLoad] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setIsOrderId] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const changePage = () => {
    if (!show) {
      setPage(page + 1);
      setLoad(true);
      getList(page + 1);
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setOrderPar(null)
  };

  const cancelOrder = async () => {
    const token = cookie.get('token');
    if (token && orderId) {
      const res = await getAll({
        method: 'post',
        url: '/api/v1/preswap/cancel',
        data: { orderId: orderId },
        token,
      });
      if (res?.status === 200) {
        const tt = data?.map((i: any) => {
          if (i.orderCode === orderId) {
            i.status = '2';
          }
          return i;
        });
        setData([...tt]);
        handleCancel();
        NotificationChange('success', res?.data?.message);
      }
    }
  };
  const getList = async (page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/sniper/getSniperOrderList',
      data: { orderPage: page },
      token,
    });
    if (res?.status === 200) {
      if (res?.data?.orderList.length !== 10) {
        setShow(true);
      }
      if (page === 1) {
        setData(res?.data?.orderList);
      } else {
        const tt = data.concat(res?.data?.orderList);
        setData(tt);
      }
      setLoading(true);
    } else {
      setLoading(true);
    }
  };
  useEffect(() => {
    getList(1);
  }, []);
  return (
    <div className="order scrollHei sniperOrder" id="scrollableSniperOrder">
      {loading ? (
        <InfiniteScroll
          hasMore={true}
          next={changePage}
          scrollableTarget={'scrollableSniperOrder'}
          loader={null}
          dataLength={data.length}
        >
          {data.map((i: any, ind: number) => {
            return (
              <div className="oriderItem" key={ind}>
                <div className="top">
                  <div className="left">
                    <p>{i?.tokenOutSymbol}</p>
                    <p>
                      {i?.tokenOutCa?.slice(0, 4) +
                        '...' +
                        i?.tokenOutCa?.slice(-4)}
                    </p>
                  </div>
                  <div className="right">
                    <p
                      onClick={() => {
                        setIsOrderId(i.orderCode);
                        setIsModalOpen(true);
                        setOrderPar(i);
                      }}
                    >
                      {i?.status === '1'
                        ? 'terminate'
                        : i?.status === '2'
                          ? '已取消订单'
                          : '过期'}
                    </p>
                    <img
                      src="/orderRight.svg"
                      alt=""
                      onClick={() => {
                        setOrderPar(i);
                        setIsShow(true);
                      }}
                    />
                  </div>
                </div>
                <p className="line"></p>
                <div className="data">
                  <span>订单编号</span>
                  <div>{i?.orderCode}</div>
                </div>
                <div className="data">
                  <span>使用钱包</span>
                  <div>
                    {i.walletArr.map((it: string, ind: number) => {
                      return <span key={ind}>{it}</span>;
                    })}
                  </div>
                </div>
                <div className="data">
                  <span>金额</span>
                  <div>{i?.tokenInAmount}</div>
                </div>
                <div className="data">
                  <span>订单时限</span>
                  <div>{i?.orderDeadline}</div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <LoadIng status={'20'} browser={browser} />
      )}
      {load && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            visibility: load ? 'visible' : 'hidden',
          }}
        >
          <Load />
        </div>
      )}
      <Modal
        title=""
        rootClassName="orderModalCancel"
        footer={null}
        centered
        open={isModalOpen}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="box">
          <p className="title">取消订单</p>
          <p className="ord">订单编号</p>
          <p className="num">{orderId}</p>
          <div className="bot">
            <p onClick={handleCancel}>再考虑一下</p>
            <p onClick={cancelOrder}>Terminate</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
