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
            <span>Offer</span>
            <span>
              622000 pts
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Equivalent Tokens</span>
            <span>
              TBA
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>For</span>
            <span>
              466.5
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Piece/Point</span>
            <span>
              $0.00075
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Fill Type</span>
            <span>
              PARTIAL FILL
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Filled Amount</span>
            <span>
              284987.3 pts
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Remaining Amount</span>
            <span>
              337912.7 pts
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Offer Creator</span>
            <span>
              address
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Offer Tx</span>
            <span>
              Solscan
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Starting at</span>
            <span>
              TBA
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Closing at</span>
            <span>
              TBA
            </span>
          </div>
          <div className="details-window-content-body-item">
            <span>Closing in</span>
            <span>
              Not Started
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}


export default DetailsWindow