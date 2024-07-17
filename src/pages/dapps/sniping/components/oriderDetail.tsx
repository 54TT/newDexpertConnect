import { useEffect, useState, useContext } from 'react';
import './index.less';
import cookie from 'js-cookie';
import Request from '@/components/axios.tsx';
import { CountContext } from '@/Layout';
import LoadIng from '@components/allLoad/loading';
export default function oriderDetail({ orderId }: any) {
  const { getAll } = Request();
  const { browser }: any = useContext(CountContext);
  const [par, setPar] = useState<any>(null);
  const [load, setLoad] = useState(false);
  const getOrder = async (orderId: string) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/sniper/getSniperOrderDetail',
      data: { orderCode: orderId },
      token,
    });
    if (res?.status === 200) {
      setPar(res?.data?.orderDetail);
      setLoad(true);
    } else {
      setLoad(true);
    }
  };
  console.log(par);
  useEffect(() => {
    if (orderId) {
      getOrder(orderId);
    }
  }, [orderId]);

  return (
    <div className="scrollHei sniperOrder oriderDetailBox ">
      {load ? (
        <div className="oriderDetail ">
          <p>Token Information</p>
          <div className="symbol dis">
            <span>{par?.tokenOutName}</span>
            <span>{par?.tokenOutSymbol}</span>
          </div>
          <div className="more dis">
            <span>Total Supply</span>
            <span>{}</span>
          </div>
          {/* 线 */}
          <div className="line"></div>
          {/*  */}
          <p className="address">Token address</p>
          <p className="add">{par?.tokenOutCa}</p>
          <div className="more dis">
            <span>订单编号</span>
            <span>{par?.orderCode}</span>
          </div>
          <div className="line"></div>
          <p className="sni">sniper amount</p>
          <div className="more dis" style={{ margin: '10px 0 14px' }}>
            <span>Max slippage</span>
            <span>{par?.slippageType === '1' ? 'Auto' : par?.slippage}</span>
          </div>
          <div className="more dis">
            <span>Gas Price</span>
            <span>{par?.gasPriceType === '1' ? 'Auto' : par?.gasPrice}</span>
          </div>
          <div className="line"></div>
          <p className="wallet">使用钱包</p>
          {par?.walletArr?.length > 0
            ? par?.walletArr.map((i: any, ind: number) => {
                return (
                  <div
                    key={ind}
                    style={{
                      border:
                        i?.orderStatus === '1'
                          ? '1px solid rgb(134,240,151)'
                          : i?.orderStatus === '2'
                            ? '1px solid #EA6E6E'
                            : '1px solid rgba(255,255,255,0.55)',
                    }}
                    className="walletItem"
                  >
                    <div className="dis">
                      <span>{i?.walletName}</span>
                      <div className="num">
                        <span
                          style={{
                            color:
                              i?.orderStatus === '1'
                                ? 'rgb(134,240,151)'
                                : i?.orderStatus === '2'
                                  ? '#EA6E6E'
                                  : 'rgba(255,255,255,0.55)',
                          }}
                        >
                          {i?.orderStatus === '6'
                            ? '过期'
                            : i?.orderStatus === '5'
                              ? '已取消'
                              : i?.orderStatus === '3' || i?.orderStatus === '4'
                                ? '等待'
                                : i?.orderStatus === '2'
                                  ? '失败'
                                  : '获得' +
                                    i?.tokenOutAmount +
                                    i?.tokenOutName}
                        </span>
                        <img
                          src="/ethLogo111.svg"
                          alt=""
                          style={{ width: '20px' }}
                        />
                      </div>
                    </div>
                    <p className="walletAddress">{i?.walletAddress}</p>
                  </div>
                );
              })
            : ''}
          <div className="line"></div>
          <div className="more dis">
            <span>订单开始时间</span>
            <span>{par?.orderStartTime}</span>
          </div>
          <div className="more dis" style={{ margin: '16px 0' }}>
            <span>订单结束时间</span>
            <span>{par?.orderEndTime}</span>
          </div>
          <div className="more dis">
            <span>金额</span>
            <span>{par?.tokenInAmount || 0}ETH</span>
          </div>
        </div>
      ) : (
        <LoadIng browser={browser} status={'20'} />
      )}
    </div>
  );
}
