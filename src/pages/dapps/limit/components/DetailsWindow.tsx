import { useContext } from 'react';
import { BigNumber } from 'bignumber.js';
import Copy from '@/components/copy';
import { CountContext } from '@/Layout';
import { getScanLink } from '@/utils/getScanLink';
import { getAddressLink } from '@/utils/getAddressLink';
import { useTranslation } from "react-i18next";
const DetailsWindow=({order})=>{
  const {contractConfig} =useContext(CountContext)
  const {zeroAddress} = contractConfig
  const {t} = useTranslation()

  // bignumber转换number
  const BNtoNumber=(bn,decimals)=>{
    let num = BigNumber(bn).dividedBy(new BigNumber(10).pow(decimals))

    if(num.modulo(1).isZero()){
      return num.toNumber().toString()
    }else{
      // 如果结果是小数，使用 toNumber() 转换为浮点数
      const floatNum = num.toNumber();

      // 使用 toFixed(6) 保留最多6位小数，然后使用 toPrecision() 来移除不必要的零和小数点
      let result = floatNum.toFixed(6).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '').replace(/\.$/, '');
    return result;
    }
  };
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
    return formattedDate
  };
  return (
  <>
    <div className="details-window">
      <div className="details-window-content">
        <div className="details-window-content-header">
          <span className="details-window-content-header-title">
            {t("limit.order details")}
          </span>
        </div>
        <div className="details-window-content-body">
          <div className="details-window-content-body-item">
            <span>{t("limit.order hash")}</span>
            <span style={{display:'flex'}}>
              <p>
              {order.orderHash.slice(0, 5)+'...'+order?.orderHash.slice(-4)}
              </p>
                  <Copy
                    img={'/copy-icon.svg'}
                    name={order.orderHash}
                    change={true}
                  />
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>{t("limit.order status")}</span>
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
            <span>{t("limit.offer amount")}</span>
            <span>
              {BNtoNumber(JSON.parse(order.input).startAmount.hex,order.inputTokenDecimals)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>{t("limit.offer creator")}</span>
            <span style={{display:"flex"}}>
              <p onClick={()=>{
                if(order.offerer){
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
            <span>{t("limit.create at")}</span>
            <span>
              {timeStampForrmat(order.createdAt)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>{t("limit.deadline")}</span>
            <span>
              {timeStampForrmat(order.deadline)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>{t("limit.filler")}</span>
            <span  style={{display:"flex"}}>
              <p onClick={()=>{
                if(order.filler){
                  window.open(getAddressLink(order.chainId,order.filler))
                }
              }}>
                {order.filler===zeroAddress?'-':order.filler.slice(0, 5)+'...'+order?.filler.slice(-4)}
              </p>
              {order.filler!==zeroAddress &&
                <div>
                  <Copy
                    img={'/copy-icon.svg'}
                    name={order.offerer}
                    change={true}
                  />
                </div>
              }
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>{t("limit.fill amount")}</span>
            <span>
              {BNtoNumber(JSON.parse(order.outputs)[0].startAmount.hex,order.outputTokenDecimals)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>{t("limit.fill tx")}</span>
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
            <span>{t("limit.fill at")}</span>
            <span>
              {order?.fillerAt=='0'?'-':timeStampForrmat(order?.fillerAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DetailsWindow;
