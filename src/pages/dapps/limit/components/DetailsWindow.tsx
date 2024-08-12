import {useContext } from "react"
import {BigNumber} from 'bignumber.js';
import Copy from "@/components/copy";
import { CountContext } from '@/Layout';
import { getScanLink } from '@/utils/getScanLink';
import { getAddressLink } from '@/utils/getAddressLink';

const DetailsWindow=({order})=>{
  const {contractConfig} =useContext(CountContext)
  const {zeroAddress} = contractConfig
  // bignumber转换number
  const BNtoNumber=(bn,decimals)=>{
    let num = BigNumber(bn).dividedBy(new BigNumber(10).pow(decimals))
    if(num.modulo(1).isZero()){
      return num.toNumber().toString()
    }else{
      return num.toNumber().toFixed(6).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
    }
  }
  // 格式化转换时间
  const timeStampForrmat = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
    }) 
  
    // const formatter = new Intl.DateTimeFormat('en-US', {
    //   month: 'long',
    //   day: 'numeric',
    //   year: 'numeric',
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   hour12: false, // 使用 24 小时制
    // });
    // const formattedDate = formatter.format(date);

    return formattedDate;
  };
  return (
  <>
    <div className="details-window">
      <div className="details-window-content">
        <div className="details-window-content-header">
          <span className="details-window-content-header-title">
            ORDER DETAILS
          </span>
        </div>
        <div className="details-window-content-body">
          <div className="details-window-content-body-item">
            <span>Order Hash</span>
            <span>
              {order.orderHash.slice(0, 5)+'...'+order?.orderHash.slice(-4)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Order Status</span>
            <span>
              {/* {timeStampForrmat(order.createdAt)} */}
              {order.orderStatus}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Nonce</span>
            <span>
              {order.nonce.slice(0, 5)+'...'+order?.nonce.slice(-4)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Offer Amount</span>
            <span>
              {BNtoNumber(JSON.parse(order.input).startAmount.hex,order.inputTokenDecimals)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Offer Creator</span>
            <span style={{display:"flex"}}>
              <p onClick={()=>{
                if(order.fillTx){
                  window.open(getAddressLink(order.chainId,order.offerer))
                }
              }}>
                {order.offerer.slice(0, 5)+'...'+order?.offerer.slice(-4)}
              </p>
            <div>
              <Copy
                img={'/copy-icon.svg'}
                name={order.offerer}
                change={true}
              />
            </div>
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Create At</span>
            <span>
              {timeStampForrmat(order.createdAt)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Deadline</span>
            <span>
              {timeStampForrmat(order.deadline)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Filler</span>
            <span  style={{display:"flex"}}>
              <p onClick={()=>{
                if(order.fillTx){
                  window.open(getAddressLink(order.chainId,order.filler))
                }
              }}>
                {order.filler===zeroAddress?'-':order.filler.slice(0, 5)+'...'+order?.filler.slice(-4)}
              </p>
              {order.filler!==zeroAddress &&
                <div>
                  <Copy
                    img={'/copy-icon.svg'}
                    name={order.filler}
                    change={true}
                  />
                </div>
              }
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Fill Amount</span>
            <span>
              {BNtoNumber(JSON.parse(order.outputs)[0].startAmount.hex,order.outputTokenDecimals)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Fill Tx</span>
            <span
              style={{display:"flex",cursor:order.fillTx?'pointer':'default'}}
            >
              <p onClick={()=>{
                if(order.fillTx){
                  window.open(getScanLink(order.chainId,order.fillTx))
                }
              }}>
              {!order.fillTx?'-':order.fillTx.slice(0, 5)+'...'+order?.fillTx.slice(-4)}
              </p>
              {order.fillTx &&
                <div>
                  <Copy
                    img={'/copy-icon.svg'}
                    name={order.fillTx}
                    change={true}
                  />
                </div>
              }
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Fill At</span>
            <span>
              {order?.fillerAt=='0'?'-':timeStampForrmat(order?.fillerAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}


export default DetailsWindow