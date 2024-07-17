import { useEffect, useState } from 'react';
import './index.less';
import { Modal } from 'antd';
import cookie from 'js-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import Load from '@components/allLoad/load.tsx';
import Request from '@/components/axios.tsx';
export default function order({ setIsShow }: any) {
  const { getAll } = Request();
  const [data, setData] = useState([1, 2, 3, 4]);
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const changePage = () => {
    if (!show) {
      setPage(page + 1);
      setLoad(true);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getList = async (page:number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/sniper/getOrderList',
      data: { page },
      token,
    });
    console.log(res);
  };

  useEffect(() => {
    getList(1);
  }, []);

  return (
    <div className="order scrollHei sniperOrder" id="scrollableSniperOrder">
      <InfiniteScroll
        hasMore={true}
        next={changePage}
        scrollableTarget={'scrollableSniperOrder'}
        loader={null}
        dataLength={data.length}
      >
        {data.map((post: any, ind: number) => {
          return (
            <div className="oriderItem" key={ind}>
              <div className="top">
                <div className="left">
                  <p>Token symbol</p>
                  <p>0x5EA7....6C366</p>
                </div>
                <div className="right">
                  <p onClick={() => setIsModalOpen(true)}>terminate</p>
                  <img
                    src="/orderRight.svg"
                    alt=""
                    onClick={() => setIsShow(true)}
                  />
                </div>
              </div>
              <p className="line"></p>
              <div className="data">
                <span>订单编号</span>
                <div>
                  <span>1</span>
                  <span>2</span>
                </div>
              </div>
              <div className="data">
                <span>订单编号</span>
                <div>1811377668717432832</div>
              </div>
              <div className="data">
                <span>订单编号</span>
                <div>1811377668717432832</div>
              </div>
              <div className="data">
                <span>订单编号</span>
                <div>1811377668717432832</div>
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
      {load && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          <p className="num">dsadsadsdsdsadsadsdsads</p>
          <div className="bot">
            <p>1</p>
            <p>2</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
