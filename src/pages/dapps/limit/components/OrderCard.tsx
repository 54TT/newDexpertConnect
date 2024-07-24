import './index.less'
import {Progress } from 'antd'



export default function OrderCard({
  // order,
  // setIsShow,
  // setOrderPar,
}: any) {
  return (
    <div
      className=" order-card"
      onClick={() => {
        // setIsShow(true);
        // setOrderPar(order);
      }}
    >

      <div className="order-card-header">
        <div>
          <div>
            <span>Grass</span>
            <span>0x00..</span>
          </div>
          <span className="partial" >PARTIAL FILL</span>
        </div>
        
        <Progress
          rootClassName='order-progress' 
          percent={50} 
          type="circle"
          size={40}
          strokeColor='#86f097'
          trailColor="#535353"
        />
      </div>
      <div className="order-card-body">
        <div className='token-swap'>
          <span className='offer order-token-item'>
            <span>OFFER</span>
            <div>
              <span>logo</span>
              <span>1.5M pts</span>
            </div>
            <span>$0.0000066 /point</span>
          </span>
          <span className='for order-token-item'>
            <span>FOR</span>
            <div>
              <span>999</span>
              <span>logo</span>
            </div>
            <span>$999</span>
          </span>
        </div>
      </div>
      <div className="order-card-footer">
        <span className="order-time">2 days ago</span>
        <span className="order-status">执行订单</span>
      </div>
    </div>
  )
}