import { useEffect, useState, useContext } from 'react';
import { CountContext } from '@/Layout';
// import { ethers } from 'ethers';
import { Input, Dropdown, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import OrderCard from './components/OrderCard';
import CreateOrder from './components/CreateOrder';
import Cookies from 'js-cookie';
import Request from '@/components/axios';
import OrderDetail from './components/OrderDetail';
import ExecuteWindow from './components/ExcuteWindow';
import InfiniteScroll from 'react-infinite-scroll-component';
import Nodata from '@/components/Nodata'
// import ExcuteWindow from './components/ExcuteWindow';
// useContext
import './index.less';
import Loading from '@/components/allLoad/loading';
// import { BigNumber, ethers } from 'ethers';
// import { CountContext } from '@/Layout';
// import { createOrder,  } from "@/../utils/limit/order"
// import Request from '@/components/axios.tsx';
export default function index() {
  const {
    // provider,
    contractConfig,
    loginProvider,
    chainId,
    // setChainId,
    // transactionFee,
    // setTransactionFee,
    user,
    // isLogin,
  } = useContext(CountContext);
  const { t } = useTranslation();
  // 0:live orders,1:my orders
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reqNum, setReqNum] = useState(0);
  const { getAll } = Request();
  const [orderList, setOrderList] = useState([]);
  // 订单列表加载状态
  const [orderLoading, setOrderLoading] = useState(true);
  const [showExecuteWindow, setShowExecuteWindow] = useState(false);
  // 订单请求页码参数
  const [orderPage, setOrderPage] = useState<number>(1);
  // 是否还有更多的订单
  const [hasMore, setHasMore] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState();
  // 展示订单详情
  const [showDetailsWindow, setShowDetailsWindow] = useState(false);
  const [moreOrderLoading, setMoreOrderLoading] = useState(false);
  // my orders type,0:all,1:executing,2:history
  const [orderType, setOrderType] = useState(0);
  const items: any = [
    {
      key: '0',
      label: (
        <p
          className={
            orderType === 1 ? 'drop-item-selected drop-item' : 'drop-item'
          }
          onClick={() => {
            setCurrentIndex(1);
            setOrderType(1);
          }}
        >
          {t('limit.executing')}
        </p>
      ),
    },
    {
      key: '1',
      label: (
        <p
          className={
            orderType === 2 ? 'drop-item-selected drop-item' : 'drop-item'
          }
          onClick={() => {
            setCurrentIndex(1);
            setOrderType(2);
          }}
        >
          {t('limit.history')}
        </p>
      ),
    },
  ];

  // 加载更多订单
  const moreOrder = async () => {
    setOrderPage(orderPage + 1);
    setMoreOrderLoading(true);
    await getOrderList(orderPage + 1, chainId);
  };
  // 获取订单列表
  const getOrderList = async (page: number, chainId: string) => {
    // if(currentIndex===1) console.log('ger user orders')
    if (page === 1) setOrderLoading(true);
    if (orderType === 0 && currentIndex === 1) {
    }
    // console.log('get my all orders');
    if (orderType === 1 && currentIndex === 1) {
    }
    // console.log('get my executing orders');
    if (orderType === 2 && currentIndex === 1) {
    }
    // console.log('get my history orders');
    try {
      setReqNum(reqNum + 1);
      const token = Cookies.get('token');
      const res = await getAll({
        method: 'get',
        url: '/api/v1/limit/order/list',
        data: {
          // search:"",
          // uid:0,
          page: page,
          // orderHash:"",
          orderStatus: currentIndex === 0 ? 'open' : '',
          offerer: currentIndex === 0 ? '' : user.username,
        },
        token,
        chainId,
      });
      if (res?.status === 200) {
        if (res.data.orders.length === 0 || res.data.orders.length < 10) {
          if (page === 1) setOrderList(res.data.orders);
          else {
            setOrderList((prevOrders) => [...prevOrders, ...res.data.orders]);
          }
          setHasMore(false);
          setOrderLoading(false);
          setMoreOrderLoading(false);
        } else {
          if (page === 1) setOrderList(res.data.orders);
          else {
            setOrderList((prevOrders) => [...prevOrders, ...res.data.orders]);
          }
          setOrderLoading(false);
          setMoreOrderLoading(false);
        }
        console.log(res.data.orders)
      }
    } catch (err) {
      setOrderLoading(false);
      setMoreOrderLoading(false);
      return null;
    }
  };
  useEffect(() => {
    // if (currentIndex === 0) console.log('get all orders');
    // if (currentIndex === 1) console.log('get user orders');
    console.log('currentIndex or orderType changed')
    getOrderList(1,chainId)
  }, [currentIndex, orderType]);
  useEffect(() => {
    console.log(chainId);
    console.log(contractConfig.chainId);
    if(chainId && contractConfig){
      if (chainId === contractConfig.chainId.toString()) {
        getOrderList(1, chainId);
        setOrderLoading(true);
      }
    }
  }, [chainId, contractConfig]);
  return (
    <>
      {showDetailsWindow && selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          setShowDetailsWindow={setShowDetailsWindow}
          setShowExecuteWindow={setShowExecuteWindow}
        />
      )}
      {!showDetailsWindow && (
        <div className="limit">
          <div className="limit-left">
            <div className="limit-left-header">
              <div
                style={{
                  display: 'flex',
                  flex:'1 1',
                  // width: '65%',
                  maxWidth:'60%',
                  
                  justifyContent: 'space-between',
                }}
              >
                <Input
                  size="large"
                  rootClassName="limit-input"
                  variant="borderless"
                  // onKeyDown={enter}
                  placeholder={'token address'}
                  allowClear
                  // onChange={searchChange}
                  suffix={
                    <SearchOutlined
                      // onClick={clickSearch}
                      style={{
                        color: 'rgb(134,240,151)',
                        fontSize: '16px',
                        cursor: 'pointer',
                      }}
                    />
                  }
                />
                <div
                  style={{
                    borderRight: '2px solid #565656',
                    marginLeft: '4px',
                  }}
                ></div>
              </div>
              <span
                className={`orders-btn ${currentIndex === 0 ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(0);
                  setOrderType(0);
                  setOrderPage(1);
                  // getOrderList(1)
                  // setOrderLoading(true)
                  setHasMore(true);
                }}
              >
                <p>{t('limit.live orders')}</p>
              </span>
              {/* <span className={`orders-btn ${currentIndex===1?'active':''}`}
                onClick={()=>setCurrentIndex(1)}>
                <p>
                  Ongoing Order(s)
                </p>
              </span> */}
              <Dropdown
                rootClassName="orders-type"
                menu={{ items, selectable: false }}
                trigger={['hover']}
                // open
                // destroyPopupOnHide={true}
              >
                <span
                  className={`orders-btn ${currentIndex === 1 ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIndex(1);
                    setOrderPage(0);
                    // getOrderList(1)
                  }}
                >
                  <p>{t('limit.my orders')}</p>
                  <svg
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.762 8.15192C14.1077 7.72385 14.0727 7.06837 13.6837 6.68786L7.62603 0.761945C7.26901 0.412685 6.73099 0.412685 6.37397 0.761945L0.316282 6.68786C-0.0726863 7.06837 -0.107722 7.72385 0.238028 8.15192C0.583776 8.57999 1.17938 8.61855 1.56835 8.23804L7 2.92454L12.4316 8.23804C12.8206 8.61855 13.4162 8.57999 13.762 8.15192Z"
                      fill={
                        currentIndex === 1
                          ? '#1a1a1a'
                          : 'rgba(255,255,255,0.85)'
                      }
                    />
                  </svg>
                  {/* <DownOutlined style={{fontSize:'14px',marginLeft:'4px'}} /> */}
                </span>
              </Dropdown>
            </div>
            <div className="limit-left-body">
              {orderList?.length > 0 && !orderLoading ? (
                <div id="order-list">
                  <InfiniteScroll
                    hasMore={hasMore}
                    next={moreOrder}
                    scrollableTarget="order-list"
                    loader={null}
                    dataLength={orderList.length}
                  >
                    {orderList.map((item: any) => (
                      <OrderCard
                        type={
                          item.uid === user?.uid
                            ? currentIndex === 0
                              ? 'my'
                              : 'open'
                            : ''
                        }
                        key={item.orderHash}
                        order={item}
                        chainId={chainId}
                        loginProvider={loginProvider}
                        setShowExecuteWindow={setShowExecuteWindow}
                        setSelectedOrder={setSelectedOrder}
                        setShowDetailsWindow={setShowDetailsWindow}
                      />
                    ))}
                  </InfiniteScroll>
                  {moreOrderLoading && <Spin />}
                  {/* <Spin /> */}
                </div>
              ) : (
                <>
                  {orderLoading && <Loading status={'20'} />}
                  {orderList.length===0&&!orderLoading&&(<Nodata />)}
                </>
              )}
              {/* {currentIndex===2?(
                  orderList.filter((item:any)=>item?.uid===user?.uid).map((item)=>(
                    <OrderCard
                      type={item?.uid===user?.uid?'my':''}
                      key={item.orderHash}
                      order={item}
                      chainId={chainId}
                      loginProvider={loginProvider}
                      setShowExecuteWindow={setShowExecuteWindow}
                      setSelectedOrder={setSelectedOrder}
                      setShowDetailsWindow={setShowDetailsWindow}
                    />
                  ))
                ):(
                  orderList.map((item:any)=>(
                    <OrderCard
                      type={item?.uid===user?.uid?'my':''}
                      key={item.orderHash}
                      order={item}
                      chainId={chainId}
                      loginProvider={loginProvider}
                      setShowExecuteWindow={setShowExecuteWindow}
                      setSelectedOrder={setSelectedOrder}
                      setShowDetailsWindow={setShowDetailsWindow}
                    />
                  ))
                )
                } */}
            </div>
          </div>
          <div className="limit-right">
            <CreateOrder getOrderList={getOrderList} />
          </div>
          <Modal
            maskClosable={false}
            centered
            open={showExecuteWindow}
            onCancel={() => setShowExecuteWindow(false)}
            footer={null}
            destroyOnClose
            width={800}
          >
            <ExecuteWindow
              order={selectedOrder}
              setShowDetailsWindow={setShowDetailsWindow}
              setShowExecuteWindow={setShowExecuteWindow}
            />
          </Modal>
          {/* <div
        className="top border"
        onClick={() => {
          if (nonce) {
            setOrder();
          }
        }}
      >
        ppppppp
      </div> */}
          {/* <div className="bot"></div> */}
        </div>
      )}
    </>
  );
}
