import './index.less'
import {Modal } from 'antd'
import DefaultTokenImg from '@/components/DefaultTokenImg'
import { useEffect, useState } from 'react'
import {BigNumber} from 'bignumber.js';
import { ethers, BigNumber as BNtype } from 'ethers'
import {chainConfig} from '@utils/limit/constants'
import Permit2ABI from '@utils/limit/Permit2ABI.json'
import { useTranslation } from 'react-i18next';
export default function OrderCard({
  order,
  type,
  setSelectedOrder,
  chainId,
  setShowExecuteWindow,
  setShowDetailsWindow,
  loginProvider
}: any) {
  const [showCancelWindow,setShowCancelWindow]=useState(false)
  const {t}=useTranslation()
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
  // bignumber转换number
  const BNtoNumber=(bn,decimals)=>{
    // console.log(bn,decimals);
    // console.log(BigNumber(bn).dividedBy(new BigNumber(10).pow(decimals)).toNumber())
    let num = BigNumber(bn).dividedBy(new BigNumber(10).pow(decimals))
    if(num.modulo(1).isZero()){
      return num.toNumber().toString()
    }else{
      return num.toNumber().toFixed(6).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
    }
  }
  const timeBefore=(timeStamp:number)=>{
    const now=new Date()
    const then=new Date(timeStamp*1000)
    const diff=now.getTime()-then.getTime()
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
  }

  useEffect(()=>{
    // console.log(order.offerer);
    // console.log(order.orderStatus)
  },[order])
  return (
    <div
      className={"order-card " + 
        (type === 'my' ? 'my-order' : '') +
        (type === 'open'? 'open-order ' : '')+
        (order.orderStatus === 'error' ? 'error-order' : '')+
        (order.orderStatus === 'cancelled' ? 'cancelled-order' : '')+
        (order.orderStatus === 'filled' ? 'filled-order' : '')
      }
      onClick={() => {
        setSelectedOrder(order);
        setShowDetailsWindow(true)
      }}
    >
      <div className="order-card-header">
        <div>
          <div className='order-card-header-left'>
            <span>{order.inputTokenName} </span>
            {/* <span style={{display:'block',marginTop:'4px'}}>{order.inputToken.slice(0,6)}...{order.inputToken.slice(-8)}</span> */}
            {/* <span style={{display:'block',marginTop:'4px'}}>{order.orderHash}</span> */}
            <div className='order-price'>
              <span>
                1 {order.inputTokenSymbol} = {order.orderPrice} {order.outputTokenSymbol}
              </span>
              <div className='order-price-change decre'>
                {/* <img src="/incre-icon.svg" alt="" /> */}
                <img src="/decre-icon.svg" alt="" />
                <span>10%</span>
              </div>
            </div>
          </div>
          {/* <span className="partial" >{t("limit.partial fill")}</span> */}
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
      <div className="order-card-body">
        <div className='token-swap'>
          <span className='offer order-token-item'>
            <span>{t("limit.offer")}</span>
            <div className='token-item-info'>
              <DefaultTokenImg name={order.inputTokenSymbol} icon={''} />
              <span style={{color:'#fff',fontSize:'14px'}}>{BNtoNumber(JSON.parse(order.input).startAmount.hex,order.inputTokenDecimals)} </span>
            </div>
            {/* <span style={{fontSize:'12px'}}>$0.0000066 /point</span> */}
          </span>
          {/* <span className='transfer-icon'>
          <img style={{zIndex:100}} src="/transfer-arrow.svg" alt="" />
          </span> */}
          <span className='limit-transfer'>
            <img src="/limit-transfer.svg" />
          </span>
          <span className='for order-token-item'>
            <span>{t("limit.for")}</span>
            <div className='token-item-info'>
              <span style={{color:'#fff',fontSize:'14px'}}>{BNtoNumber(JSON.parse(order.outputs)[0].startAmount.hex,order.outputTokenDecimals)} </span>
              <DefaultTokenImg name={order.outputTokenSymbol} icon={''} />
            </div>
          </span>
        </div>
      </div>
      <div className="order-card-footer">
        <span className="order-time">{timeBefore(order.createdAt)}</span>
        {type === 'my' &&
          <span
            className="cancel-btn"
            onClick={(e)=>{
              e.stopPropagation()
              // setShowExecuteWindow(true);
              setShowCancelWindow(true);
              setSelectedOrder(order)
          }}>{t("limit.cancel order")}</span>
        }
        <span className="order-status" onClick={(e)=>{
          e.stopPropagation()
          setSelectedOrder(order)
          setShowExecuteWindow(true);
        }}>{t("limit.execute order")}</span>
      </div>
      <Modal
        rootClassName='cancel-window'
        title="取消订单"
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
        okText="确认"
        cancelText="取消"
      >
        <p>cancel the order?</p>
      </Modal>
    </div>
  )
}