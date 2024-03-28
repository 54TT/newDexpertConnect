import { Card } from "antd";

function RightCard() {
  return <Card className="" title="Card title" bordered={false} style={{ width: '90%', maxWidth: '400px', marginTop: '24px' }}>
    <div className="card-pair-info">
      <p>BTC-WETH</p>
      <p>60000</p>
      <p>10%</p>
    </div>
    <div className="card-pair-info">
      <p>BTC-WETH</p>
      <p>60000</p>
      <p>10%</p>
    </div>
    <div className="card-pair-info">
      <p>BTC-WETH</p>
      <p>60000</p>
      <p>10%</p>
    </div>
  </Card>
}

export default RightCard;