import { useEffect, useState,useContext  } from 'react';
import { CountContext } from '@/Layout';
import { Input,Dropdown,Modal, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
// import { useTranslation } from 'react-i18next';
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
  // const {t}=useTranslation()
  const [currentIndex,setCurrentIndex]=useState(0)
  const { getAll } = Request();
  const [orderList,setOrderList]=useState([])
  const [orderLoading,setOrderLoading]=useState(true)
  const [showExecuteWindow,setShowExecuteWindow]=useState(false)
  // 订单请求页码参数
  const [orderPage,setOrderPage]=useState<number>(1)
  // 是否还有更多的订单
  const [hasMore,setHasMore]=useState(true)
  const [selectedOrder,setSelectedOrder]=useState()
  // 展示订单详情
  const [showDetailsWindow,setShowDetailsWindow]=useState(false)
  const items:any = [
    {
      key: '0',
      label:<p onClick={(e)=>{
        console.log(e.target);
        setCurrentIndex(2)
      }}>Excuteing</p>
    },
    {
      key:'1',
      label:<p onClick={(e)=>{
        console.log(e.target);
        setCurrentIndex(2)
      }}>History</p>
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
  // more order
  const moreOrder=async()=>{
    console.log('get more order');
    setOrderPage(orderPage+1)
    await getOrderList(orderPage +1)
  }
  // 获取订单列表
  const getOrderList=async(page:number,uid?:number)=>{
    if(uid) console.log('ger user orders');
    
    try{
      const token = Cookies.get('token');
      const res=await getAll({
        method:'post',
        url:'/api/v1/limit/getOrderList',
        data:{
          search:"",
          uid:0,
          page:page,
        },
        token,
        chainId
      })
      // console.log(res.data.orders);
      if(res?.status===200){
        console.log(res.data.orders);
        
        if(res.data.orders.length===0||res.data.orders.length<10){
          console.log(res.data.orders.length);
          
          setHasMore(false)
        }else{
          console.log(res.data.orders.length);
          if(page===1)  setOrderList(res.data.orders)
            else{
              setOrderList(prevOrders=>[...prevOrders,...res.data.orders])
          }
          setOrderLoading(false)
        }
      }
  }catch(err){
    setOrderLoading(false)
    console.log(err)
  }
}
  useEffect(() => {
    console.log(showDetailsWindow);
    
  }, [showDetailsWindow]);
  useEffect(() => {
    console.log(selectedOrder);
    
  }, [selectedOrder]);
  useEffect(() => {
    // getNoce();
    getOrderList(1)
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
              <div style={{borderRight:"2px solid #565656"}}></div>
              <span className={`orders-btn ${currentIndex===0?'active':''}`}
              onClick={()=>{
                setCurrentIndex(0)
                // getOrderList(1)
                // setOrderLoading(true)
                setHasMore(true)
              }}>
                <p>Live Orders</p>
              </span>
              {/* <span className={`orders-btn ${currentIndex===1?'active':''}`}
                onClick={()=>setCurrentIndex(1)}>
                <p>
                  Ongoing Order(s)
                </p>
              </span> */}
              <Dropdown
                rootClassName='orders-type'
                menu={{items,selectable: true,}}
                trigger={['hover']}
              >
                <span
                  className={`orders-btn ${currentIndex===2?'active':''}`}
                  onClick={()=>{
                    setCurrentIndex(2)
                    getOrderList(1,user.uid)
                  }
                  }
                >
                  <p>
                    My Order(s)
                  </p>
                </span>
              </Dropdown>
        </div>
        <div className="limit-left-body">
          {orderLoading&&<Loading status={'20'} />}
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
                {currentIndex===2?(
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

                }
              {/* {orderList.map((item:any)=>(
                <OrderCard
                  type={item.uid===user.uid?'my':''}
                  key={item.orderHash}
                  order={item}
                  chainId={chainId}
                  loginPrivider={loginPrivider}
                  setShowExecuteWindow={setShowExecuteWindow}
                  setSelectedOrder={setSelectedOrder}
                  setShowDetailsWindow={setShowDetailsWindow}
                />
              ))} */}
              </InfiniteScroll>
              </div>
            ):(<></>)
          }
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
