import { useTranslation } from 'react-i18next';
import cookie from 'js-cookie';
import Load from '@/components/allLoad/load';
import Request from '@/components/axios.tsx';
import { CountContext } from '@/Layout';
import { useState, useEffect, useContext } from 'react';
import Loading from '@/components/allLoad/loading';
import { getScanLink } from '../../../../utils/getScanLink';
export default function sellTokenModal({
  handleCancel,
  wallet,
  tokenItem,
  amount,
  isApproveToken,
  setIsApproveToken,
  chainId,
  contractConfig,
  total,
}: any) {
  const { browser }: any = useContext(CountContext);
  // isApproveToken   是否授权token
  const { t } = useTranslation();
  const [tx, setTx] = useState<any>(null);
  const [isTx, setIsTx] = useState(false);
  const [gasPar, setGasPar] = useState(null);
  const [loading, setLoading] = useState(false);
  //  页面是否   loading
  const [pageLoad, setPageLoad] = useState(false);
  //  结果
  const [result, setResult] = useState('more');
  const [ethValue, setEthValue] = useState('');
  const { getAll } = Request();
  // 卖  token  或者  授权Approve
  const sellToken = async () => {
    const token = cookie.get('token');
    const data = isApproveToken
      ? {
          walletId: wallet?.walletId?.toString(),
          amountIn: amount,
          amountOut: ethValue,
          tokenIn: tokenItem?.address,
          tokenOut: contractConfig?.wethAddress,
          gasLimit: (Number(gasPar?.gasLimit) + 20).toString(),
          gasPrice: gasPar?.gasPrice,
          slippage: '',
        }
      : {
          walletId: wallet?.walletId?.toString(),
          token: tokenItem?.address,
          amount: total,
          gasLimit: (Number(gasPar?.gasLimit) + 20).toString(),
          gasPrice: gasPar?.gasPrice,
        };
    const res = await getAll({
      method: 'post',
      url: isApproveToken
        ? '/api/v1/wallet/sell'
        : '/api/v1/wallet/token/permit2/approve',
      data,
      token,
      chainId,
    });
    if (res?.status === 200) {
      setTx(res?.data);
      setIsTx(!isTx);
      setPageLoad(true);
    }
  };
  // 获取   gas
  const getGas = async () => {
    const token = cookie.get('token');
    const data = isApproveToken
      ? {
          walletId: wallet?.walletId?.toString(),
          amountIn: amount,
          amountOut: ethValue,
          tokenIn: tokenItem?.address,
          tokenOut: contractConfig?.wethAddress,
        }
      : {
          walletId: wallet?.walletId?.toString(),
          token: tokenItem?.address,
          amount: total,
        };
    const res = await getAll({
      method: 'post',
      url: isApproveToken
        ? '/api/v1/wallet/sell/gas'
        : '/api/v1/wallet/token/permit2/approve/gas',
      data,
      token,
      chainId,
    });
    if (res?.status === 200) {
      setGasPar(res?.data);
      setLoading(true);
    } else {
      setLoading(true);
    }
  };
  useEffect(() => {
    if (isApproveToken) {
      if (ethValue) {
        getGas();
      }
    } else {
      getGas();
    }
  }, [isApproveToken, ethValue]);
  useEffect(() => {
    getEth();
  }, []);
  //  预估获得   多少 eth
  const getEth = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/swap/getAmountsOut',
      data: {
        amountIn: amount,
        tokenIn: tokenItem?.address,
        tokenOut: contractConfig?.wethAddress,
      },
      token,
      chainId,
    });
    if (res?.status === 200) {
      setEthValue((Number(res?.data?.amountOut) * 0.5).toString());
    }
  };
  // 轮询  tx状态
  const inquireTx = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: isApproveToken
        ? '/api/v1/wallet/sell/tx'
        : '/api/v1/wallet/token/permit2/approve/tx',
      data: tx,
      token,
      chainId,
    });
    if (res?.status === 200) {
      // 成功
      if (res?.data?.status === '1') {
        //  判断是否approve
        if (isApproveToken) {
          //  结果页面
          setResult('success');
          setPageLoad(true);
        } else {
          setPageLoad(false);
          setIsApproveToken(true);
        }
      } else if (res?.data?.status === '0') {
        setIsTx(!isTx);
      } else {
        setResult('error');
      }
    }
  };

  const content = (
    <div className="contentBox">
      {!pageLoad && (
        <div className="title">
          {isApproveToken ? t('token.con') : 'Approve'}
        </div>
      )}
      <div className="body">
        <div className="left">
          <div>
            {tokenItem?.iconLink ? (
              <img src={tokenItem?.iconLink} alt="" />
            ) : (
              <p className="logo">{tokenItem?.name.slice(0, 1)}</p>
            )}
            <span className="token">{tokenItem?.name}</span>
          </div>
          <p>
            {t('token.Amount')}: <span>{amount}</span>
          </p>
        </div>
        <div className="center">
          <img src="/jianLeft.svg" alt="" />
          <span> {t('token.Sell')}</span>
          <img src="/jianRight.svg" alt="" />
        </div>
        <div className="left">
          <div>
            <img src="/ethSwap.svg" alt="" />
            <span className="token">Eth</span>
          </div>
          <p>
            {t('token.Amount')}:
            <span>
              {Number(ethValue)
                .toFixed(8)
                .replace(/\.?0*$/, '')}
            </span>
          </p>
        </div>
      </div>
      <p className="approveGas">
        {t('token.Gas')}:{gasPar?.gasPriceInGwei}
      </p>
    </div>
  );
  useEffect(() => {
    let setTime: any = null;
    if (tx?.tx) {
      setTime = setTimeout(() => {
        inquireTx();
      }, 2000);
    }
    return () => {
      clearTimeout(setTime);
    };
  }, [tx, isTx]);

  return (
    <div className="sellModal" style={{marginBottom:!loading?'10%':'0'}}>
      {/* 确认   授权 */}
      {loading ? (
        pageLoad ? (
          //  loading  状态
          <div className="sellLoad">
            {result !== 'more' && (
              <div className="ethCancel">
                <img
                  src="/ethLogo.svg"
                  alt=""
                  onClick={() => {
                    const link = getScanLink(chainId, tx?.tx);
                    window.open(link);
                  }}
                />
                <p
                  onClick={() =>
                    handleCancel(result === 'success' ? 'show' : '')
                  }
                >
                  x
                </p>
              </div>
            )}
            <img
              src={
                result === 'more'
                  ? '/delToken.svg'
                  : result === 'success'
                    ? '/sellSuccess.svg'
                    : '/sellError.svg'
              }
              alt=""
              className="logo"
            />
            {result === 'more' && (
              <div style={{ margin: '8px 0 30px' }}>
                <Load />
              </div>
            )}
            {content}
          </div>
        ) : (
          <div className="modalBox">
            {content}
            <div className="butt">
              <p onClick={handleCancel}>{t('token.later')}</p>
              <p onClick={sellToken}>
                {isApproveToken ? t('token.Confirm') : 'Approve'}
              </p>
            </div>
          </div>
        )
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
    </div>
  );
}
