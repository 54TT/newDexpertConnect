import './index.less'
import {Modal, Skeleton } from 'antd'
import DefaultTokenImg from '@/components/DefaultTokenImg'
import { useEffect, useState,useContext } from 'react'
// import {BigNumber} from 'bignumber.js';
import { ethers, BigNumber as BNtype } from 'ethers'
import {chainConfig} from '@utils/limit/constants'
import Permit2ABI from '@abis/Permit2ABI.json'
import { useTranslation } from 'react-i18next';
import { CountContext } from '@/Layout';
import { getUniswapV2RouterContract } from "@utils/contracts";
// import {setMany} from "@utils/change";
import {BNtoNumber} from "@utils/limit/utils"
import Decimal from "decimal.js";
import { getAmountOut } from "@utils/swap/v2/getAmountOut";
export default function OrderCard({
  order,
  type,
  setSelectedOrder,
  chainId,
  setShowExecuteWindow,
  setShowDetailsWindow,
  loginProvider,
  userAddress
}: any) {
  const {contractConfig,provider}=useContext(CountContext)
  const [showCancelWindow,setShowCancelWindow]=useState(false)
  const {t}=useTranslation()
  const [tokenRate,setTokenRate]=useState('')
  // 涨幅跌幅
  const [rateRelation,setRateRelation]=useState('equality')
  const [diffRate,setDiffRate]=useState('0')
  const [deadline,setDeadline]=useState<Number>(0)
  const [rateLoading,setRateLoading]=useState(true)
  // const [timeLoading,setTimeLoading]=useState(true)
  const [timeLeft, setTimeLeft] = useState({
    days:0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });


  const bitmapPositions=(nonce:BNtype)=>{
    const wordPos = nonce.shr(8);
    const bitPos = nonce.and(BNtype.from(0xFF)); // Equivalent to extracting the last 8 bits
    return { wordPos, bitPos };
  }
  // 取消订单
  const cancelOrder = async (order) => {
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const config = chainConfig[chainId]
    const provider = config.provider
    const permit2Address = config.permit2Address
    const permit2Contract = new ethers.Contract(permit2Address, Permit2ABI, provider);



    const { wordPos, bitPos }: any = bitmapPositions(BNtype.from(order.nonce));
    const mask = 1 << bitPos;
    const res= await permit2Contract.connect(signer).invalidateUnorderedNonces(wordPos, mask);
    console.log(res);
  }
  // // bignumber转换number
  // const BNtoNumber=(bn,decimals?)=>{
  //   let num;

  //   if(!decimals){
  //     num = new BigNumber(bn);
  //   }else{
  //     num = BigNumber(bn).dividedBy(new BigNumber(10).pow(decimals))
  //   }
  //   let absNumber = num.abs();
  //   let formattedNumber;
  //   let unit:string;

  // if (absNumber.lte(0.1)) { 
  //   return setMany(absNumber.toString()).replace(/\.?0+$/, '')
  // } else if (absNumber.gte(1e9)) { // Billions
  //   formattedNumber = absNumber.dividedBy(1e9).toFixed(2);
  //   unit = 'B';
  // } else if (absNumber.gte(1e6)) { // Millions
  //   formattedNumber = absNumber.dividedBy(1e6).toFixed(2);
  //   unit = 'M';
  // } else if (absNumber.gte(1e3)) { // Thousands
  //   formattedNumber = absNumber.dividedBy(1e3).toFixed(2);
  //   unit = 'K';
  // } else {
  //   formattedNumber = absNumber.toFixed(2);
  //   unit = '';
  // }
  // if (formattedNumber.includes('.')) {
  //   formattedNumber = formattedNumber.replace(/\.?0+$/, '');
  // }
  
  // return `${formattedNumber}${unit}`;
  //   // if(num.modulo(1).isZero()){
  //   //   return num.toNumber().toString()
  //   // }else{
  //   //   return num.toNumber().toFixed(6).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
  //   // }
  // }
  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now() / 1000; // 当前时间戳
      const timeRemaining = Number(deadline) - now;

      if (timeRemaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ days:0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeRemaining / (60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = Math.floor(timeRemaining % 60);

        setTimeLeft({days, hours, minutes, seconds });
      }
    }, 1000);

    // 清理定时器
    // setTimeLoading(false)
    return () => clearInterval(timer);
  }, [deadline]);
  // 获取当前汇率与订单汇率的比值
  const getRateRelation=()=>{
    // const orderRate=Number(Number(order.orderPrice).toFixed(2))
    if(tokenRate&&order.orderPrice){
      // const orderRate=Number(Number(order.orderPrice).toFixed(6))
      // const rateNum = Number(rate.toFixed(6));
      // console.log('---getRateRelation---');
      // console.log(Number(tokenRate));
      // console.log(Number(order.orderPrice))
      const result = new Decimal(tokenRate).dividedBy(new Decimal(order.orderPrice));
      if(result) setRateLoading(false)
      if(result.toNumber()>1){
        setRateRelation('incre')
        console.log('incre',result.toNumber()-1);
        setDiffRate(((result.toNumber()-1)*100).toFixed(2))
        // return result.toFixed(3)
      }else if(result.toNumber()<1){
        setRateRelation('decre')
        console.log('decre',1-result.toNumber());
        setDiffRate(((1-result.toNumber())*100).toFixed(2))
      }
      // console.log(rateNum-orderRate);
      // console.log(Number(tokenRate)-Number(order.orderPrice));
    }
  }
  // 获取两个token当前的汇率
  const getTokenRate=async(inputTokenAddress:string,inputTokenDecimals:number,outputTokenAddress:string,outputTokenDecimals:number)=>{
    const { uniswapV2RouterAddress } = contractConfig;
    const params=[
      chainId,
      provider,
      await getUniswapV2RouterContract (provider,uniswapV2RouterAddress),
      [inputTokenAddress,inputTokenDecimals],
      [outputTokenAddress,outputTokenDecimals],
      new Decimal(1),
      new Decimal(0),
      // 暂定5%
      // transactionFee.limit
      new Decimal(0),
    ].filter((item)=>item!==null)
    let amount:Decimal
    try {
      amount=await getAmountOut.apply(null,params)
    } catch (error) {
      console.log(error);
    }
    const amountValue=new Decimal(amount)
    // console.log(amountValue.toString());
    setTokenRate(amountValue.toString())
  }
  useEffect(()=>{
    // console.log(tokenRate);
    if(tokenRate) getRateRelation()
  },[tokenRate])
  useEffect(()=>{
    // console.log('offerer',order.offerer);
    // console.log(order.orderHash.length)
    // console.log('filler',order.filler)
    getTokenRate(order.inputToken,order.inputTokenDecimals,order.outputToken,order.outputTokenDecimals)
    setDeadline(Number(order.deadline))
  },[order])
  return (
    <div
      className={"order-card " + 
        (type === 'my' ? 'my-order ' : '') +
        (type === 'open'&&order.orderStatus==='open'? 'open-order ' : '')+
        (order.orderStatus === 'error' ? 'error-order' : '')+
        (order.orderStatus === 'cancelled' ? 'cancelled-order' : '')+
        (order.orderStatus === 'filled' ? 'filled-order' : '')+
        (order.orderStatus === 'expired' ? 'expired-order' : '')
      }
      onClick={() => {
        setSelectedOrder(order);
        setShowDetailsWindow(true)
      }}
    >
      <div className="order-card-header">
        <div>
          <div className='order-card-header-left'>
            <div style={{display:'flex',alignItems:'center',width:'80%'}}>
              <DefaultTokenImg name={order.inputTokenSymbol} icon={order?.inputTokenLogo} />
              <span className="order-output-amount">{BNtoNumber(JSON.parse(order.input).startAmount.hex,order.inputTokenDecimals) +' '+order.inputTokenSymbol} </span>
              </div>
            {/* <span style={{display:'block',marginTop:'4px'}}>{order.inputToken.slice(0,6)}...{order.inputToken.slice(-8)}</span> */}
            {/* <span style={{display:'block',marginTop:'4px'}}>{order.orderHash}</span> */}
            <div className='order-price'>
              {/* <span>
                1 {order.inputTokenSymbol} = {Number(order.orderPrice)>1?Number(order.orderPrice).toFixed(4):Number(order.orderPrice).toFixed(6)}  {order.outputTokenSymbol}
              </span> */}
              {
                rateLoading?<Skeleton.Button size='small' active />:(
                  <div className={`order-price-change ${rateRelation}`}>
                  {rateRelation=='incre'&&<img src="/incre-icon.svg" alt="" />}
                  {rateRelation=='decre'&&<img src="/decre-icon.svg" alt="" />}
                  {<span>{diffRate} %</span>}
              </div>
                )}
              
            </div>
          </div>
        </div>
        
        {/* <Progress
          rootClassName='order-progress' 
          percent={50} 
          type="circle"
          size={45}
          strokeColor='#86f097'
          trailColor="#535353"
        /> */}
      </div>
      <div className='new-order-body'>
        <div className='order-body-item'>
          <div style={{display:'flex',alignItems:'center'}}>
            <span className='order-body-item-header'>{t('limit.price')}</span>
            <span style={{display:"flex",paddingLeft:'10px'}}>
              <DefaultTokenImg name={order?.outputTokenSymbol} icon={order?.outputTokenLogo?order?.outputTokenLogo:''} />
              <p>/</p>
              <DefaultTokenImg name={order?.inputTokenSymbol} icon={order.inputTokenLogo?order.inputTokenLogo:''} />
            </span>
          </div>
          <span className='order-rate'>{BNtoNumber(order.orderPrice)} {order.outputTokenSymbol}/{order.inputTokenSymbol}</span>
          
        </div>
        <div className='order-body-item'>
        <div style={{display:'flex',alignItems:'center'}}>
          <span className='order-body-item-header'>{t("limit.total price")}</span>
          <span style={{paddingLeft:'10px'}}>
            <DefaultTokenImg name={order.outputTokenSymbol} icon={order?.outputTokenLogo?order?.outputTokenLogo:''} />
        </span>
        </div>
        <span className='order-rate'>
        {BNtoNumber(JSON.parse(order.outputs)[0].startAmount.hex,order.outputTokenDecimals)} {order.outputTokenSymbol}
        </span>
        </div>
      </div>
      {/* <div className="order-card-body">
        <div className='token-swap'>
          <span className='offer order-token-item'>
            <span>{t("limit.offer")}</span>
            <div className='token-item-info'>
              <DefaultTokenImg name={order.inputTokenSymbol} icon={''} />
              <span style={{color:'#fff',fontSize:'14px'}}>{BNtoNumber(JSON.parse(order.input).startAmount.hex,order.inputTokenDecimals)} </span>
              <span>{order.inputTokenSymbol}</span>
            </div>
          </span>
          <span className='limit-transfer'>
            <img src="/limit-transfer.svg" />
          </span>
          <span className='for order-token-item'>
            <span>{t("limit.for")}</span>
            <div className='token-item-info'>
              <DefaultTokenImg name={order.outputTokenSymbol} icon={''} />
              <span style={{color:'#fff',fontSize:'14px'}}>{BNtoNumber(JSON.parse(order.outputs)[0].startAmount.hex,order.outputTokenDecimals)} </span>
              <span>{order.outputTokenSymbol}</span>
            </div>
          </span>
        </div>
      </div> */}
      <div className="order-card-footer">
        {order?.orderStatus==='filled'||order?.orderStatus==='cancelled'||order?.orderStatus==='expired'?(
          <span className="order-time"></span>
        ):(
        <span className="order-time">
          {t('limit.deadline')}:&ensp;
          {order?.orderStatus==='expired'?(
            '已过期'
          ):(
            <>
            {timeLeft.days > 0 && (
              <span>
                {timeLeft.days}d&nbsp;
              </span>
            )}
            {timeLeft.hours > 0 && (
              <span>
                {timeLeft.hours}h&nbsp;
              </span>
            )}
            {timeLeft.minutes > 0 && (
              <span>
                {timeLeft.minutes}m&nbsp;
              </span>
            )}
            {timeLeft.seconds > 0 && (
              <span>
                {timeLeft.seconds}s
              </span>
            )}
            {!(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
              <Skeleton.Button size="small" active />
            )}
          </>
          )}
        </span>
        )}
        {(order?.orderStatus=== 'open'&&order?.offerer===userAddress)&&
          <span
            className="cancel-btn"
            onClick={(e)=>{
              e.stopPropagation()
              // setShowExecuteWindow(true);
              setShowCancelWindow(true);
              setSelectedOrder(order)
          }}>{t("limit.cancel order")}</span>
        }
        {order?.orderStatus=== 'open'?(
        <span className="order-status" onClick={(e)=>{
          e.stopPropagation()
          setSelectedOrder(order)
          setShowExecuteWindow(true);
        }}>{t("limit.execute order")}</span>
      ):<span></span>}
      </div>
      <Modal
        rootClassName='cancel-window'
        title={`${t("limit.cancel title")}`}
        open={showCancelWindow}
        onOk={(e)=>{
          e.stopPropagation()
          setShowCancelWindow(false)
          cancelOrder(order)
        }}
        onCancel={(e)=>{
          e.stopPropagation()
          setShowCancelWindow(false)
        }}
        okText={`${t("limit.yes")}`}
        cancelText={`${t("limit.no")}`}
      >
        <p>{t("limit.cancel content")}</p>
      </Modal>
    </div>
  )
}