import ExcuteWindow from "./ExcuteWindow";
import DetailsWindow from "./DetailsWindow";
const OrderDetail = ({order,setShowDetailsWindow,setShowExecuteWindow}) => {


  return(
    <>
      <div className="order-detail">
        <div className="order-detail-left">
          <ExcuteWindow
            order={order?order:null}
            setShowDetailsWindow={setShowDetailsWindow}
            setShowExecuteWindow={setShowExecuteWindow}
          />
        </div>
        <div className="order-detail-right">
          <DetailsWindow order={order?order:null} />
        </div>
      </div>
    </>
  )
}




export default OrderDetail;