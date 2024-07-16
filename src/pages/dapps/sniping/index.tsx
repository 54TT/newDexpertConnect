import './index.less';
import { useState, useContext } from 'react';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
import FillData from './components/fillData';
import SelectWallet from './components/selectWallet';
import Order from './components/order';
import OrderDetail from './components/oriderDetail';
import Loading from '@/components/allLoad/loading';
import Drawer from '../drawer';
import cookie from 'js-cookie'
import Request from '@/components/axios.tsx';
import _ from 'lodash';
export default function index() {
  const { t } = useTranslation();
const { getAll } = Request();
  const { browser, user, setIsModalOpen }: any = useContext(CountContext);
  // 是否切换链
  const [isChain, setIsChain] = useState('more');
  const [select, setSelect] = useState('Sniping');
  //  第几步
  const [show, setIsShow] = useState(false);
  // sniper   token
  const [token, setToken] = useState<any>(null);
  // use  token
  const [useToken, setUseToken] = useState<any>(null);
  //  输入 数量
  const [value, setValue] = useState(0);
  // 链  id
  const [id, setId] = useState('1');
  // gas  价格
  const [gasPrice, setGasPrice] = useState(0);
  const [MaximumSlip, setMaximumSlip] = useState(0);
  const [wallet, setWallet] = useState(null);
  // 设置
  const [params, setParams] = useState<any>({
    MaximumSlip: 'Auto',
    GasPrice: 'Auto',
    TradeDeadlineValue: 30,
    TradeDeadlineType: '1',
    OrderDeadlineValue: 30,
    OrderDeadlineType: '1',
  });

const sniper=async()=>{
  // const tokens = cookie.get('token');
  console.log(wallet)
  console.log(useToken)
  console.log(token)
  console.log(params)
  console.log(gasPrice)
  console.log(id)
  // let arr:any =[]
  // if(wallet.length>0){
  //   wallet.map((i:any)=>{
  //     arr.push(i.address)
  //   })
  //   const res = await getAll({
  //     method: 'post',
  //     url: '/api/v1/sniper/preswap',
  //     data: { walletIdArr: arr,chainID:id,orderDeadline:params?.OrderDeadlineValue,orderDeadlineType:params?.OrderDeadlineType,gasPrice,tradeDeadlineType:params?.TradeDeadlineType,tradeDeadline:params?.TradeDeadlineValue},
  //     token,
  //   });
  // }
  

    // "tokenInCa": "string",
    // "tokenInSymbol": "string",
    // "tokenInName": "string",
    // "tokenInAmount": "string",
    // "tokenInDecimal": "string",
    // "tokenOutCa": "string",
    // "tokenOutSymbol": "string",
    // "tokenOutName": "string",
    // "tokenOutAmount": "string",
    // "tokenOutDecimal": "string",

    // "type": "string",
    // "slippage": "string",
}


  const chooseWallet = () => {
    //  第一步
    if (!show) {
      if (params && value && token) {
        if (params?.GasPrice === 'Auto') {
          setIsShow(true);
        } else if (gasPrice) {
          setIsShow(true);
        }
      }
    } else {
      sniper()
    }
  };
  const operate = {
    params,
    setParams,
    setIsChain,
    setGasPrice,
    value,
    setValue,
    token,
    setToken,setId,setUseToken,setMaximumSlip
  };

  const backChange = (name: string) => {
    return (
      <div className="walletBack">
        <img src="/sniperBack.svg" alt="" onClick={() => setIsShow(false)} />
        <p>{name}</p>
        <p></p>
      </div>
    );
  };
  const filterPage = () => {
    if (select === 'Sniping') {
      if (show) {
        return (
          <>
            {backChange('选择钱包')}
            <SelectWallet setWallet={setWallet} />
          </>
        );
      } else {
        return <FillData {...operate} />;
      }
    } else {
      if (show) {
        return (
          <>
            {backChange('订单详情')}
            <OrderDetail />
          </>
        );
      } else {
        return <Order setIsShow={setIsShow} />;
      }
    }
  };
  return (
    <div className="sniping" style={{ width: browser ? '400px' : '95%' }}>
      {!show && (
        <div className="top">
          {[
            { name: 'Sniping', key: 'Sniping' },
            { name: '订单', key: 'order' },
          ].map((i: any) => {
            return (
              <p
                onClick={() => setSelect(i.key)}
                key={i.key}
                style={{
                  color: select === i.key ? 'rgb(134,240,151)' : 'white',
                }}
              >
                {i.name}
              </p>
            );
          })}
        </div>
      )}
      {filterPage()}
      {/* confirm */}
      <div
        className="confirm"
        onClick={() => {
          if (user?.uid) {
            chooseWallet();
          } else {
            setIsModalOpen(true);
          }
        }}
      >
        {user?.uid
          ? isChain === 'more'
            ? t('Slider.Confirm')
            : t('Slider.Confirm')
          : t('Common.Connect Wallet')}
      </div>
      {isChain === 'more' && (
        <div className="coveredDust">
          <Loading browser={browser} />
        </div>
      )}
      {user?.uid && <Drawer />}
    </div>
  );
}
