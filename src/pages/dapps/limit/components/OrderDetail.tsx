import ExcuteWindow from "./ExcuteWindow";
import DetailsWindow from "./DetailsWindow";
import OrderHistory from "./OrderHistory";
import InfiniteScroll from "react-infinite-scroll-component";
const OrderDetail = ({order,setShowDetailsWindow,setShowExecuteWindow}) => {


  return(
    <>
      <div className="order-detail">
        <InfiniteScroll
          hasMore={false}
          scrollableTarget='order-detail'
          loader={null}
          dataLength={1}
          next={()=>{}}
        >
          <div style={{display:'flex',justifyContent:'space-around'}}>
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
        <OrderHistory />
        </InfiniteScroll>
      </div>
    </>
  )
}




export default OrderDetail;