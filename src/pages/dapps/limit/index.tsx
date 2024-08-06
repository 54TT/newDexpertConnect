import { useEffect, useState,useContext  } from 'react';
import { CountContext } from '@/Layout';
// import { ethers } from 'ethers';
import { Input,Dropdown,Modal, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {Spin} from 'antd';
import { useTranslation } from 'react-i18next';
import OrderCard from './components/OrderCard';
import CreateOrder from './components/CreateOrder';
import Cookies from 'js-cookie';
import Request from '@/components/axios';
import OrderDetail from './components/OrderDetail';
import ExecuteWindow from './components/ExcuteWindow';
import InfiniteScroll from "react-infinite-scroll-component";
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
    // contractConfig,
    loginPrivider,
    chainId,
    // setChainId,
    // transactionFee,
    // setTransactionFee,
    user,
    // isLogin,
  } = useContext(CountContext)
  const {t}=useTranslation()
  const [currentIndex,setCurrentIndex]=useState(0)
  const { getAll } = Request();
  const [orderList,setOrderList]=useState([])
  // 订单列表加载状态
  const [orderLoading,setOrderLoading]=useState(true)
  const [showExecuteWindow,setShowExecuteWindow]=useState(false)
  // 订单请求页码参数
  const [orderPage,setOrderPage]=useState<number>(1)
  // 是否还有更多的订单
  const [hasMore,setHasMore]=useState(true)
  const [selectedOrder,setSelectedOrder]=useState()
  // 展示订单详情
  const [showDetailsWindow,setShowDetailsWindow]=useState(false)
  const [moreOrderLoading,setMoreOrderLoading]=useState(false)
  // my orders type,0:all,1:executing,2:history
  const [orderType,setOrderType]=useState(0)
  const items:any = [
    {
      key: '0',
      label:
        <p
          className={orderType===1?'drop-item-selected drop-item':'drop-item'}
          onClick={(e)=>{
          console.log(e.target);
          setCurrentIndex(1)
          setOrderType(1)
        }}>{t("limit.executing")}</p>
    },
    {
      key:'1',
      label:
        <p
          className={orderType===2?'drop-item-selected drop-item':'drop-item'}
          onClick={(e)=>{
          console.log(e.target);
          setCurrentIndex(1)
          setOrderType(2)
        }}>{t("limit.history")}</p>
    }
  ];
  // const [nonce, setNonce] = useState('');
  // // 获取签名
  // const getNoce = async () => {
  //   const token = cookie.get('token');
  //   const res = await getAll({
  //     method: 'get',
  //     url: '/api/v1/limit/getNonce',
  //     data: {},
  //     token,
  //   });
  //   if (res?.status === 200) {
  //     setNonce(res?.data?.nonce);
  //   }
  // };
  //  创建订单
  // const setOrder = async () => {
    // const deadlineSeconds = 24 * 60 * 60;
    // const chainId = 11155111;
    // const receipt: string = '0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89';
    // const inputToken: string = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
    // const outputToken: string = '0xb72bc8971d5e595776592e8290be6f31937097c6';
    // const web3Provider = new ethers.providers.Web3Provider(loginPrivider);
    // const orderCreator:any = await web3Provider.getSigner();
    // const orderAmout: BigNumber = BigNumber.from(1000000);
    // chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds
    // const createResponse = await createOrder(chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds)
    // console.log("createResponse:",createResponse)
    // const token = cookie.get('token');
    // const res = await getAll({
    //   method: 'get',
    //   url: '/api/v1/limit/createOrder',
    //   data: {},
    //   token,
    // });
    // console.log(res)
  // };
  // 加载更多订单
  const moreOrder=async()=>{
    console.log('get more order');
    setOrderPage(orderPage+1)
    setMoreOrderLoading(true)
    await getOrderList(orderPage +1)
  }
  // 获取订单列表
  const getOrderList=async(page:number)=>{
    // if(currentIndex===1) console.log('ger user orders');
    console.log('page',page);
    if(page===1) setOrderLoading(true)
    if(orderType===0&&currentIndex===1) console.log('get my all orders');
    if(orderType===1&&currentIndex===1) console.log('get my executing orders');
    if(orderType===2&&currentIndex===1) console.log('get my history orders');
    
    try{
      const token = Cookies.get('token');
      // console.log(token);
      const res=await getAll({
        method:'get',
        // url:'/api/v1/limit/getOrderList',
        url:'/api/v1/limit/order/list',
        data:{
          // search:"",
          // uid:0,
          page:page,
          // orderHash:"",
          orderStatus:"open",
          isPersonal:currentIndex,
          offerer:"",
        },
        token,
        chainId
      })
      // console.log(res.data.orders);
      if(res?.status===200){
        console.log(res.data.orders);
        if(res.data.orders.length===0||res.data.orders.length<10){
          // console.log(res.data.orders.length);
          if(page===1)  setOrderList(res.data.orders)
          else{
            setOrderList(prevOrders=>[...prevOrders,...res.data.orders])
          }
          setHasMore(false)
          setOrderLoading(false)
          setMoreOrderLoading(false)
        }else{
          // console.log(res.data.orders.length);
          if(page===1)  setOrderList(res.data.orders)
          else{
            setOrderList(prevOrders=>[...prevOrders,...res.data.orders])
          }
          setOrderLoading(false)
          setMoreOrderLoading(false)
        }
      }
  }catch(err){
    setOrderLoading(false)
    setMoreOrderLoading(false)
    console.log(err)
  }
}
  useEffect(() => {
    console.log(orderType);
    
  }, [orderType]);
  useEffect(() => {
    console.log('currentIndex',currentIndex);
    if(currentIndex===0){
      console.log('get all orders')
      getOrderList(1)
    }
    if(currentIndex===1) {
      getOrderList(1)
      console.log('get user orders')
    };
  }, [currentIndex,chainId,orderType]);
  useEffect(() => {
    console.log(selectedOrder);
    
  }, [selectedOrder]);
  useEffect(() => {
    // getNoce();
    getOrderList(1)
    console.log("get order list");
  }, []);
  return (
    <>
    { (showDetailsWindow && selectedOrder) &&
      <OrderDetail
        order={selectedOrder}
        setShowDetailsWindow={setShowDetailsWindow}
        setShowExecuteWindow={setShowExecuteWindow}
      />
    }
    {
      !showDetailsWindow &&
    <div className="limit">
      <div className="limit-left">
        <div className="limit-left-header">
          <div style={{display:'flex',width:'45%',justifyContent:'space-between'}}>
          <Input
              size="large"
              rootClassName="limit-input"
              variant='borderless'
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
              <div style={{borderRight:"2px solid #565656",marginLeft:'4px'}}></div>
              </div>
              <span className={`orders-btn ${currentIndex===0?'active':''}`}
              onClick={()=>{
                setCurrentIndex(0)
                setOrderType(0)
                setOrderPage(1)
                // getOrderList(1)
                // setOrderLoading(true)
                setHasMore(true)
              }}>
                <p>{t("limit.live orders")}</p>
              </span>
              {/* <span className={`orders-btn ${currentIndex===1?'active':''}`}
                onClick={()=>setCurrentIndex(1)}>
                <p>
                  Ongoing Order(s)
                </p>
              </span> */}
              <Dropdown
                rootClassName='orders-type'
                menu={{items,selectable: false}}
                trigger={['hover']}
                // open
                // destroyPopupOnHide={true}
              >
                <span
                  className={`orders-btn ${currentIndex===1?'active':''}`}
                  onClick={()=>{
                    setCurrentIndex(1)
                    setOrderPage(0)
                    // getOrderList(1)
                  }
                  }
                >
                  <p>
                    {t("limit.my orders")}
                  </p>
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.762 8.15192C14.1077 7.72385 14.0727 7.06837 13.6837 6.68786L7.62603 0.761945C7.26901 0.412685 6.73099 0.412685 6.37397 0.761945L0.316282 6.68786C-0.0726863 7.06837 -0.107722 7.72385 0.238028 8.15192C0.583776 8.57999 1.17938 8.61855 1.56835 8.23804L7 2.92454L12.4316 8.23804C12.8206 8.61855 13.4162 8.57999 13.762 8.15192Z" fill={currentIndex===1?'#1a1a1a':"rgba(255,255,255,0.85)"}/>
                    </svg>
                  {/* <DownOutlined style={{fontSize:'14px',marginLeft:'4px'}} /> */}
                </span>
              </Dropdown>
        </div>
        <div className="limit-left-body">
          
          {
            orderList?.length>0&&!orderLoading?(
              <div id='order-list'>
                <InfiniteScroll
                  hasMore={hasMore}
                  next={moreOrder}
                  scrollableTarget='order-list'
                  loader={null}
                  dataLength={orderList.length}
                >
                  {orderList.map((item:any)=>(
                <OrderCard
                  type={item.uid===user?.uid?'my':''}
                  key={item.orderHash}
                  order={item}
                  chainId={chainId}
                  loginPrivider={loginPrivider}
                  setShowExecuteWindow={setShowExecuteWindow}
                  setSelectedOrder={setSelectedOrder}
                  setShowDetailsWindow={setShowDetailsWindow}
                  getOrderList={getOrderList}
                />
              ))}
              </InfiniteScroll>
              {moreOrderLoading && <Spin />}
              {/* <Spin /> */}
              </div>
            ):(
            <>
              {orderLoading&&<Loading status={'20'} />}
            </>
            )}
                {/* {currentIndex===2?(
                  orderList.filter((item:any)=>item?.uid===user?.uid).map((item)=>(
                    <OrderCard
                      type={item?.uid===user?.uid?'my':''}
                      key={item.orderHash}
                      order={item}
                      chainId={chainId}
                      loginPrivider={loginPrivider}
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
                      loginPrivider={loginPrivider}
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
        onCancel={()=>setShowExecuteWindow(false)}
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
    }
    </>
  );
}
