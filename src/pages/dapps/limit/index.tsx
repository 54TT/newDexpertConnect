import { useEffect  } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import OrderCard from './components/OrderCard';
import CreateOrder from './components/CreateOrder';
// useContext
import './index.less';
// import cookie from 'js-cookie';
// import { BigNumber, ethers } from 'ethers';
// import { CountContext } from '@/Layout';
// import { createOrder,  } from "@/../utils/limit/order"
// import Request from '@/components/axios.tsx';
export default function index() {
  // const {user,chainId}=useContext(CountContext)
  // const { loginPrivider } = useContext(CountContext);
  const {t}=useTranslation()
  // const { getAll } = Request();
  // const [nonce, setNonce] = useState('');
  // // 获取签名
  // const getNoce = async () => {
  //   const token = cookie.get('token');
  //   const res = await getAll({
  //     method: 'get',
  //     url: '/api/v1/limit/getNonce',
  //     data: {},
  //     token,
  //   });
  //   if (res?.status === 200) {
  //     setNonce(res?.data?.nonce);
  //   }
  // };
  //  创建订单
  // const setOrder = async () => {
    // const deadlineSeconds = 24 * 60 * 60;
    // const chainId = 11155111;
    // const receipt: string = '0xD3952283B16C813C6cE5724B19eF56CBEE0EaA89';
    // const inputToken: string = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
    // const outputToken: string = '0xb72bc8971d5e595776592e8290be6f31937097c6';
    // const web3Provider = new ethers.providers.Web3Provider(loginPrivider);
    // const orderCreator:any = await web3Provider.getSigner();
    // const orderAmout: BigNumber = BigNumber.from(1000000);
    // chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds
    // const createResponse = await createOrder(chainId, orderCreator, inputToken, outputToken, receipt, orderAmout, orderAmout, deadlineSeconds)
    // console.log("createResponse:",createResponse)
    // const token = cookie.get('token');
    // const res = await getAll({
    //   method: 'get',
    //   url: '/api/v1/limit/createOrder',
    //   data: {},
    //   token,
    // });
    // console.log(res)
  // };

  useEffect(() => {
    // getNoce();
  }, []);
  return (
    <div className="limit">
      <div className="limit-left">
        <div className="limit-left-header">
          <Input
              size="large"
              rootClassName="limit-input"
              variant='borderless'
              // onKeyDown={enter}
              placeholder={t('sniping.Contract')}
              allowClear
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
