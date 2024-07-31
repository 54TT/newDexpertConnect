import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import OrderCard from './components/OrderCard';
import CreateOrder from './components/CreateOrder';
import './index.less';
export default function index() {
  const {t}=useTranslation()
  return (
    <div className="limit border">
      <div className="limit-left border">
        <div className="limit-left-header">
          <Input
              size="large"
              rootClassName="limit-input"
              variant='borderless'
              // onKeyDown={enter}
              placeholder={t('sniping.Contract')}
              allowClear
              autoComplete={'off'}
              // onChange={searchChange}
              suffix={
                <SearchOutlined
                  // onClick={clickSearch}
                  style={{
                    color: 'rgb(134,240,151)',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                />
              }
              />
              <div style={{borderRight:"2px solid #565656"}}></div>
              <span className='orders-btn active'>Live Orders</span>
              <span className='orders-btn'>Ongoning Order(s)</span>
              <span className='orders-btn'>My Order(s)</span>
        </div>
        <div className="limit-left-body">
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </div>
      </div>
      <div className="limit-right">
        <CreateOrder />
      </div>
      {/* <div
        className="top border"
        onClick={() => {
          if (nonce) {
            setOrder();
          }
        }}
      >
        ppppppp
      </div> */}
      <div className="bot"></div>
    </div>
  );
}
