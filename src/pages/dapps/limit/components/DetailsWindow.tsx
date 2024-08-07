import { useEffect } from "react"

const DetailsWindow=(order)=>{
  
  useEffect(()=>{
    console.log(order)
  },[])
  return (
  <>
    <div className="details-window">
      <div className="details-window-content">
        <div className="details-window-content-header">
          <span className="details-window-content-header-title">
            OFFER DETAILS
          </span>
        </div>
        <div className="details-window-content-body">
          <div className="details-window-content-body-item">
            <span>Order Hash</span>
            <span>
              {order?.orderHash?.slice(0,5)+'...'+order?.orderHash?.slice(-4)}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Order Start</span>
            <span>
              {order.createdAt}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Nonce</span>
            <span>
              {order.nonce}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Offer Amount</span>
            <span>
              $0.00075
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Offer Creator</span>
            <span>
              PARTIAL FILL
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Deadline</span>
            <span>
              {order.deadline}
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Filler</span>
            <span>
              337912.7 pts
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Fill Amount</span>
            <span>
              address
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Fill Tx</span>
            <span>
              Solscan
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Fill Time</span>
            <span>
              TBA
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}


export default DetailsWindow