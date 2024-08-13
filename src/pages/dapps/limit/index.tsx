import { useEffect, useState, useContext } from 'react';
import { CountContext } from '@/Layout';
// import { ethers } from 'ethers';
import { Input, Dropdown, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import OrderCard from './components/OrderCard';
import ListItem from './components/ListItem';
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
    isLogin,
  } = useContext(CountContext);
  const { t } = useTranslation();
  // 0:live orders,1:my orders
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reqNum, setReqNum] = useState(1);
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
  // 首次加载
  // const [initialized, setInitialized] = useState(false)
  // my orders type,0:all,1:executing,2:history
  const [orderType, setOrderType] = useState(0);
  // 历史订单类型
  const [historyOrderType, setHistoryOrderType] = useState('cancelled');
  // 搜索字段
  const [search, setSearch] = useState('');
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
            setHistoryOrderType('cancelled')
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
  const getOrderList = async (page: number, chainId: string,search?:string) => {
    console.log('get order list')
    console.log('search',search);
    
    // if(currentIndex===1) console.log('ger user orders')
    if (page === 1) setOrderLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await getAll({
        method: 'get',
        url: '/api/v1/limit/order/list',
        data: {
          search:search?search:"",
          // uid:0,
          page: page,
          // orderHash:"",
          orderStatus: currentIndex === 0 ? 'open' : 
                          orderType===0 ? '': orderType===1 ?'open':historyOrderType,
          offerer: currentIndex === 1&& isLogin? user.username:'',
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
      console.log(err)
      setOrderList([])
      return null;
    }
  };
  useEffect(() => {
    console.log('currentIndex or orderType changed')
  }, [currentIndex, orderType]);
  useEffect(() => {
    // 默认有更多的订单
    setHasMore(true)
    // if(!loginProvider) setOrderList([]);
    if(chainId && contractConfig){
      if (chainId === contractConfig.chainId.toString()) {
          getOrderList(1, chainId);
          setOrderLoading(true);
      }
    }
  }, [chainId, contractConfig,currentIndex, orderType,historyOrderType]);
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
                  placeholder={'Token Address'}
                  allowClear
                  value={search}
                  onChange={(e)=>{
                    setSearch(e.target.value)
                  }}
                  onPressEnter={()=>{
                    getOrderList(1,chainId,search)
                  }}
                  suffix={
                    <SearchOutlined
                      onClick={()=>{
                        getOrderList(1,chainId,search)
                      }}
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
                }}
              >
                <p>{t('limit.live orders')}</p>
              </span>
             
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
                    setOrderPage(1);
                    setHasMore(true);
                    setOrderType(0)
                    // getOrderList(1)
                  }}
                >
                  {orderType===0&&<p>{t('limit.my orders')}</p>}
                  {orderType===1&&<p>{t('limit.executing')}</p>}
                  {orderType===2&&<p>{t('limit.history')}</p>}
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
                </span>
              </Dropdown>
              <img
                style={{
                  width:'40px',
                  transform:`rotate(-${reqNum*360}deg)`,
                  transition:'all 1s',
                  cursor:'pointer'
                }}
                src='/refresh.svg'
                onClick={()=>{
                  getOrderList(1, chainId);
                  setReqNum(reqNum + 1);
                }}
              />
            </div>
            { currentIndex===1&&orderType===2&&(
              <div className={`history history-${historyOrderType}`}>
              <span
                style={{color: historyOrderType === 'cancelled' ? '#86f097' : '#fff'}}
                onClick={()=>{
                  setHistoryOrderType('cancelled')
                }}
                className={`history-header-item ${historyOrderType === 'cancelled' ? 'history-header-item-active':''}`}
              >{t("limit.cancelled")}</span>
              <span
                style={{color: historyOrderType === 'expired' ? '#86f097' : '#fff'}}
                onClick={()=>{
                  setHistoryOrderType('expired')
                }}
                className={`history-header-item ${historyOrderType === 'expired' ? 'history-header-item-active':''}`}
              >{t("limit.expired")}</span>
              <span
                style={{color: historyOrderType === 'filled' ? '#86f097' : '#fff'}}
                onClick={()=>{
                  setHistoryOrderType('filled')
                }}
                className={`history-header-item ${historyOrderType === 'filled' ? 'history-header-item-active':''}`}
              >{t("limit.filled")}</span>
              <span
                style={{color: historyOrderType === 'failed' ? '#86f097' : '#fff'}}
                onClick={()=>{
                  setHistoryOrderType('failed')
                }}
                className={`history-header-item ${historyOrderType === 'failed' ? 'history-header-item-active':''}`}
              >{t("limit.error")}</span>
            </div>
            )}
            <div className="limit-left-body">
              {orderList?.length > 0 && !orderLoading ? (
                <div id="order-list" className={orderType===2?"order-list-col":''}>
                  <InfiniteScroll
                    hasMore={hasMore}
                    next={moreOrder}
                    scrollableTarget="order-list"
                    loader={null}
                    dataLength={orderList.length}
                  >
                    {orderType!==2&& orderList.map((item: any) => (
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
                    { orderType===2&&orderList.map((item: any) => (
                      <ListItem
                      key={item.orderHash}
                      order={item}
                      setSelectedOrder={setSelectedOrder}
                      setShowDetailsWindow={setShowDetailsWindow}
                      historyOrderType={historyOrderType}
                      />
                    ))

                    }
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
            </div>
          </div>
          <div className="limit-right">
            <CreateOrder />
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
        </div>
      )}
    </>
  );
}
