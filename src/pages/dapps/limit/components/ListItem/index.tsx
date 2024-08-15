import './index.less';
import { useEffect } from 'react';
import Copy from "@/components/copy";
import {BNtoNumber} from "@utils/limit/utils"
import { useTranslation } from 'react-i18next';




const ListItem=({
  order,
  setSelectedOrder,
  setShowDetailsWindow,
  historyOrderType,
  userAddress
})=>{
  const {t}=useTranslation()

  const formattedDate=(timestamp)=>{

    const date = new Date(timestamp * 1000);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return formatter.format(date);
  }

  useEffect(()=>{
    // console.log(order);
    // console.log('offer',order.offerer)
    console.log('filler',order?.filler)
    // console.log('filler'.order?.filler)
  },[order])


  return (
  <div
    className="order-list-item"
    onClick={(e) => {
      e.stopPropagation();
      setSelectedOrder(order);
      setShowDetailsWindow(true)
    }}
  >
    <div className="item-header">
      <span className='item-header-left gray-font'>
        <span>
          {t("limit.order hash")}:&emsp;
        </span>
        {/* <span className='white-font'>{order?.orderHash}</span> */}
        <span className='white-font'>
          {order.orderHash.slice(0, 5)+'...'+order?.orderHash.slice(-4)}&ensp;
        </span>
        <span onClick={(e) => {e.stopPropagation()}}>
          <Copy
            img={'/copy-icon.svg'}
            name={order.orderHash}
            change={true}
            
          />
        </span>
      </span>
      <span
        className='item-header-right gray-font'
        style={{
          color:order.orderStatus==="filled"?
                (order.offerer===userAddress?'#ff5555':'#83e72d'):'rgba(255,255,255,0.55)'
        }}
      >
        {t(`limit.${order?.orderStatus.toLowerCase()}`)}</span>
    </div>
    <div className='item-body'>
      <div className='item-body-col'>
        <span className='item-body-col-top gray-font'>
          {t("limit.price")}
        </span>
        <span className='item-body-col-bottom white-font'>
        {BNtoNumber(order.orderPrice)}  {order.outputTokenSymbol}/{order.inputTokenSymbol}
        </span>
      </div>

      <div className='item-body-col'>
        <span className='item-body-col-top gray-font'>
          {t("limit.total price")}
        </span>
        <span className='item-body-col-bottom white-font'>
          {order.outputs?(
            BNtoNumber(JSON.parse(order.outputs)[0].startAmount.hex,order.outputTokenDecimals) 
          ):(
            '-'
          )}&ensp;{order.outputs&&(order.outputTokenSymbol)}
        {/* {BNtoNumber(JSON.parse(order.outputs)[0].startAmount.hex,order.outputTokenDecimals)||'-'}  {order.outputTokenSymbol} */}
        </span>
      </div>

      <div className='item-body-col'>
        <span className='item-body-col-top gray-font'>
          {t("limit.amount")}
        </span>
        <span className='item-body-col-bottom white-font'>
        {/* {BNtoNumber(JSON.parse(order.input).startAmount.hex,order.inputTokenDecimals)+' '+order.inputTokenSymbol} */}
        {order.input?(
            BNtoNumber(JSON.parse(order.input).startAmount.hex,order.inputTokenDecimals) 
          ):(
            '-'
          )}&ensp;{order.input&&(order.inputTokenSymbol)}
        </span>
      </div>

      <div className='item-body-col'>
        <span className='item-body-col-top gray-font'>
        {(historyOrderType==="cancelled"||historyOrderType==='error')&&t("limit.create at")}
        {historyOrderType==="expired"&&t("limit.expire in")}
        {historyOrderType==="filled"&&t("limit.fill at")}
        </span>
        <span className='item-body-col-bottom white-font'>
          {/* {order?.createdAt} */}
          {(historyOrderType==="cancelled"||historyOrderType==='error')&&formattedDate(order?.createdAt)}
          {historyOrderType==='expired'&&formattedDate(order?.deadline)}
          {historyOrderType==='filled'&&formattedDate(order?.fillerAt)}
        </span>
      </div>
    </div>
  </div>
  )
}

export default ListItem