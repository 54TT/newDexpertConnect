import './index.less';
import { useState, useContext, useEffect } from 'react';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
import FillData from './components/fillData';
import SelectWallet from './components/selectWallet';
import WalletManage from './components/WalletManage';
import Order from './components/order';
import OrderDetail from './components/oriderDetail';
// import WalletDetail from './components/WalletDetail';
import Drawer from '../drawer';
import cookie from 'js-cookie';
import Request from '@/components/axios.tsx';
import _ from 'lodash';
export default function index() {
  const { t } = useTranslation();
  const { getAll } = Request();
  const { browser, user, setIsModalOpen }: any = useContext(CountContext);
  // 是否切换链
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
  const [payType, setPayType] = useState('0');
  // order  信息
  const [orderPar, setOrderPar] = useState<any>(null);
  const more = {
    MaximumSlip: 'Auto',
    GasPrice: 'Auto',
    TradeDeadlineValue: 30,
    TradeDeadlineType: '1',
    OrderDeadlineValue: 30,
    OrderDeadlineType: '1',
  };
  // 设置
  const [params, setParams] = useState<any>(more);
  const sniper = async () => {
    const tokens = cookie.get('token');
    let arr: any = [];
    if (wallet?.length > 0 && token && value && useToken) {
      wallet.map((i: any) => {
        arr.push(i.walletId);
      });
      const res = await getAll({
        method: 'post',
        url: '/api/v1/sniper/preswap',
        data: {
          gasPrice:
            params?.GasPrice === 'Auto' ? '0' : (gasPrice + 100).toString(),
          gasPriceType: params?.GasPrice === 'Auto' ? '1' : '2',
          tokenOutDecimal: token?.decimals.toString(),
          tokenOutAmount: '0',
          tokenOutName: token?.name,
          tokenOutSymbol: token?.symbol,
          tokenOutCa: token?.contractAddress,
          tokenInDecimal: useToken?.decimals,
          tokenInAmount: value.toString(),
          tokenInName: useToken?.name,
          tokenInSymbol: useToken?.symbol,
          tokenInCa: useToken?.contractAddress,
          walletIdArr: arr,
          chainID: id,
          orderDeadline: params?.OrderDeadlineValue.toString(),
          orderDeadlineType: params?.OrderDeadlineType,
          tradeDeadlineType: params?.TradeDeadlineType,
          tradeDeadline: params?.TradeDeadlineValue.toString(),
          slippage:
            params?.MaximumSlip === 'Auto'
              ? '0'
              : (MaximumSlip / 100).toString(),
          slippageType: params?.MaximumSlip === 'Auto' ? '1' : '2',
          type: '1',
          payType: payType,
        },
        token: tokens,
      });
      if (res?.status === 200) {
        setSelect('order');
        setIsShow(false);
        setParams(more);
        setWallet(null);
        setMaximumSlip(0);
        setGasPrice(0);
        setValue(0);
        setToken(null);
      }
    }
  };
  // 取消订单
  const cancelOrder = async () => {
    const token = cookie.get('token');
    if (token && orderPar?.orderCode) {
      const res = await getAll({
        method: 'post',
        url: '/api/v1/preswap/cancel',
        data: { orderId: orderPar?.orderCode },
        token,
      });
      if (res?.status === 200) {
        setIsShow(false);
      }
    }
  };

  const chooseWallet = () => {
    //  第一步  狙击
    if (select === 'Sniping') {
      if (!show) {
        if (params && value && token) {
          if (params?.GasPrice === 'Auto') {
            setIsShow(true);
          } else if (gasPrice) {
            setIsShow(true);
          }
        }
      } else {
        sniper();
      }
    } else {
      // 取消订单
      if (show && orderPar?.status === '1') {
        cancelOrder();
      } else {
        setIsShow(false);
      }
    }
  };
  useEffect(() => {
  }, [orderPar]);
  const operate = {
    params,
    setParams,
    setGasPrice,
    value,
    setValue,
    token,
    setToken,
    setId,
    setUseToken,
    setMaximumSlip,
    payType,
    setPayType,
    useToken,
  };
  const backChange = (name: string) => {
    return (
      <div className="walletBack">
        <img
          src="/sniperBack.svg"
          alt=""
          onClick={() => {
            setOrderPar(null);
            setIsShow(false);
          }}
        />
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
            {backChange(t('sniping.choose'))}
            <SelectWallet setWallet={setWallet} id={id} value={value} />
          </>
        );
      } else {
        return <FillData {...operate} />;
      }
    } else if (select === 'order') {
      if (show) {
        return (
          <>
            {backChange(t('sniping.detail'))}
            <OrderDetail
              orderId={orderPar?.orderCode}
              tokenInAmount={orderPar?.tokenInAmount}
            />
          </>
        );
      } else {
        return <Order setIsShow={setIsShow} setOrderPar={setOrderPar} />;
      }
    } else {
      //   return (
      //     <>
      //       {backChange('Wallet list')}
      //       {/* <WalletManage id={id} setIsShow={setIsShow} /> */}
      //     </>
      //   );
      // }else{
      //   // return <WalletManage id={id} setIsShow={setIsShow} />;
      // }
      return <WalletManage id={id} setIsShow={setIsShow} />;
    }
  };
  return (
    <div className="sniping" style={{ width: browser ? '400px' : '95%' }}>
      {!show && (
        <div className="top">
          {[
            { name: t('sniping.Sniping'), key: 'Sniping' },
            { name: t('sniping.order'), key: 'order' },
            { name: t('sniping.Wallet'), key: 'wallet' },
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
        className={`confirm ${select === 'order' ? 'order-cancel' : ''}`}
        onClick={() => {
          if (user?.uid) {
            chooseWallet();
          } else {
            setIsModalOpen(true);
          }
        }}
        style={{
          display: select === 'order' || select === 'wallet' ? 'none' : 'block',
        }}
      >
        {user?.uid
          ? orderPar?.status === '1'
            ? t('sniping.cancel')
            : orderPar?.status === '2'
              ? t('sniping.canceled')
              : orderPar?.status === '3'
                ? '过期'
                : t('Slider.Confirm')
          : t('Common.Connect Wallet')}
      </div>
      {user?.uid && <Drawer id={id} />}
    </div>
  );
}
