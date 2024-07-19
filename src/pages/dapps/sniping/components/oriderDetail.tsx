import { useEffect, useState, useContext } from 'react';
import './index.less';
import cookie from 'js-cookie';
import Request from '@/components/axios.tsx';
import { CountContext } from '@/Layout';
import LoadIng from '@components/allLoad/loading';
import { useTranslation } from 'react-i18next';
import { getScanLink } from '@/utils/getScanLink';
export default function oriderDetail({ orderId ,}: any) {
  const { t } = useTranslation();
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
      console.log(res?.data?.orderDetail);
      setLoad(true);
    } else {
      setLoad(true);
    }
  };
  useEffect(() => {
    if (orderId) {
      getOrder(orderId);
    }
  }, [orderId]);

  return (
    <div className="scrollHei sniperOrder oriderDetailBox ">
      {load ? (
        <div className="oriderDetail ">
          <p>{t('sniping.Information')}</p>
          <div className="symbol dis">
            <span>{par?.tokenOutName}</span>
            <span>{par?.tokenOutSymbol}</span>
          </div>
          <div className="more dis">
            <span>{t('sniping.Total')}</span>
            <span>{par?.totalSupply || 0}</span>
          </div>
          {/*线*/}
          <div className="line"></div>
          {/*  */}
          <p className="address">{t('sniping.address')}</p>
          <p className="add">{par?.tokenOutCa}</p>
          <div className="more dis">
            <span>{t('sniping.number')}</span>
            <span>{par?.orderCode}</span>
          </div>
          <div className="line"></div>
          <p className="sni">{t('sniping.Sniper')}</p>
          <div className="more dis" style={{ margin: '10px 0 14px' }}>
            <span>{t('sniping.Max')}</span>
            <span>
              {par?.slippageType === '1' ? 'Auto' : par?.slippage*100+' %' || '0'}
            </span>
          </div>
          <div className="more dis">
            <span>{t('sniping.Gas')}</span>
            <span>
              {par?.gasPriceType === '1' ? 'Auto' : par?.gasPrice+'%' || '0'}
            </span>
          </div>
          <div className="more dis">
            <span>Service Fee</span>
            {par?.payType==='0' &&
              <span>
                0.2% fee
              </span>
            }
            {par?.payType==='1' &&
              <span>
                Golden Card
              </span>
            }
            {par?.payType==='2' &&
              <span>
                Dpass Card
              </span>
            }
          </div>
          <div className="line"></div>
          <p className="wallet">{t('sniping.wallet')}</p>
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
                            ? t('sniping.Expired')
                            : i?.orderStatus === '5'
                              ? t('sniping.cancele')
                              : i?.orderStatus === '3' || i?.orderStatus === '4'
                                ? t('sniping.wait')
                                : i?.orderStatus === '2'
                                  ? t('sniping.failed')
                                  : t('sniping.get') +
                                    i?.tokenOutAmount +
                                    i?.tokenOutName}
                        </span>
                        <img
                          src="/ethLogo111.svg"
                          alt=""
                          style={{ width: '20px' ,cursor:'pointer'}}
                          onClick={(e)=>{
                            e.stopPropagation()
                            if(par?.walletArr[0]?.tx){
                              // 后端接口需要传回chainId
                              window.open(getScanLink(par?.walletArr[0].chainID,par.walletArr[0].tx))
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{color:'rgba(255,255,255,0.55'}}>address</span>
                      <p className="walletAddress">{i?.walletAddress.slice(0,6)+'...'+i?.walletAddress.slice(-4)}</p>
                    </div>
                  </div>
                );
              })
            : ''}
          <div className="line"></div>
          <div className="more dis">
            <span>{t('sniping.start')}</span>
            <span>{par?.orderStartTime}</span>
          </div>
          <div className="more dis" style={{ margin: '16px 0' }}>
            <span>{t('sniping.end')}</span>
            <span>{par?.orderEndTime}</span>
          </div>
          <div className="more dis">
            <span>{t('sniping.Amount')}</span>
            <span>{par?.tokenInAmount || 0} ETH</span>
          </div>
        </div>
      ) : (
        <LoadIng browser={browser} status={'20'} />
      )}
    </div>
  );
}
