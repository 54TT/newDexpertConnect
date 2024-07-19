import { TokenItemData } from "@/components/SelectToken"
import SelectTokenModal from "@/components/SelectTokenModal"
import DefaultTokenImg from "@/components/DefaultTokenImg"
import { useState } from "react"


export default function CreateOrder() {
  const [showSelectModal, setShowSelectModal] = useState(false)
  const [payToken,setPayToken]=useState<TokenItemData>()
  // const [receiveToken,setReceiveToken]=useState<TokenItemData>()
  
  return (
  <div className="createOrder">
    <div className="wrapper">
      <div className="pay token-card">
        <div className="token-card-header dis-between">
          <span className="token-card-header-left">
            Pay
          </span>
          <span className="token-card-header-right">
            Balance:538.0012
          </span>
        </div>
        <div className="token-card-body dis-between">
          <div className="token-card-body-left">
            <div className="limit-select-token" onClick={()=>{setShowSelectModal(true)}}>
              <DefaultTokenImg
                name={payToken?.symbol}
                icon={payToken?.logoUrl}
              />
            </div>
          </div>
          <span className="token-card-body-right">0.023</span>
        </div>
        <div className="token-card-footer dis-between">
          <span className="token-card-footer-left">
            Pepe
          </span>
          <span className="token-card-footer-right">
            ~$0.00000000985467
          </span>
        </div>
      </div>
      <div className="receive token-card">
      <div className="token-card-header dis-between">
          <span className="token-card-header-left">
            Receive
          </span>
          <span className="token-card-header-right">
            Balance:538.0012
          </span>
        </div>
        <div className="token-card-body dis-between">
          <div className="token-card-body-left"></div>
          <span className="token-card-body-right">0.023</span>
        </div>
        <div className="token-card-footer dis-between">
          <span className="token-card-footer-left">
            Pepe
          </span>
          <span className="token-card-footer-right">
            ~$0.00000000985467
          </span>
        </div>
      </div>
    </div>
    <div className="wrapper choose-card">
      <div className="choose-card-left dis-col">
        <span>You will receive</span>
        <span>0.000245434</span>
      </div>
      <div className="choose-card-middle dis-col">
        <span>Set to market</span>
        <span>SHIB</span>
      </div>
      <div className="choose-card-right dis-col">
        <span>Expires in</span>
        <span>1 hour</span>
      </div>
    </div>
    <span className="approve-btn">Approve</span>
    <span className="place-btn">Place an order</span>
    <div style={{display:'flex',justifyContent:'space-between'}}>
      <span>SHIB price</span>
      <span>1 PEPE ~ $0.00001817</span>
    </div>
    <SelectTokenModal
      open={showSelectModal} 
      onChange={(e)=>{console.log(e)}} 
      chainId="11155111" 
      onCancel={()=>{setShowSelectModal(false)}} 
    />
  </div>
  )
}