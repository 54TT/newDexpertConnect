import { useEffect, useContext, useState } from 'react';
import Back from '../../../component/Background';
import './index.less';
import { CountContext } from '@/Layout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export default function resultBox() {
  const history = useNavigate();
  const { t } = useTranslation();
  const { from } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const location = useLocation();
  const { chainId, contractConfig, provider } = useContext(CountContext);

  const [tx, setTx] = useState('');

  const [loading] = useState(false);
  const [result, setResult] = useState('loading');
  const [fromCom, setFromCom] = useState(from);
  // const [receipt,setReceipt]=useState(null);
  // 从URL拿信息
  const getResultInfo = async () => {
    console.log('getResultInfo');
    setFromCom(from);
    const tx = searchParams.get('tx');
    const status = searchParams.get('status');
    console.log('from', from, ' ', status);
    // console.log('tx',tx);
    if (tx && status === 'pending') {
      console.log('get recipent');
      setTx(tx);
      setResult('loading');
    }
  };
  // 获取交易状态
  useEffect(() => {
    console.log('getResultInfo');
    setFromCom(from);
    console.log('from', from, ' ');
    console.log('tx', tx);
    const status = searchParams.get('status');
    if (tx && status === 'pending') {
      console.log('get receipt');
      setTx(tx);
      console.log(tx);
      const checkReceipt = async () => {
        try {
          const receipt = await provider.getTransactionReceipt(tx);
          console.log(receipt);
          if (receipt) {
            console.log('Transaction Receipt:', receipt);
            if (receipt.status === 1) {
              console.log('Transaction was successful.');
              history(
                `/dapps/tokencreation/results/${from}?tx=${tx}&status=success`
              );
            } else if (receipt.status === 0) {
              console.log('Transaction failed.');
              history(
                `/dapps/tokencreation/results/${from}?tx=${tx}&status=fail`
              );
            }
          } else {
            // NotificationChange('error', 'Failed to get transaction receipt', 'Please check your network connection and try again.');
          }
        } catch (error) {
          console.error('Failed to get transaction receipt:', error);
        }
      };

      const intervalId = setInterval(checkReceipt, 5000); // 每5秒检查一次
      return () => clearInterval(intervalId); // 清除定时器
    }
  }, [tx, result, from]);
  // 当URL发生变化时，更新状态
  useEffect(() => {
    const status = searchParams.get('status');
    console.log('status ', status);
    if (status === 'success') {
      setResult('success');
    } else if (status === 'fail') {
      setResult('error');
    } else if (status === '1') {
      setResult('loading');
    }
  }, [location]);

  useEffect(() => {
    console.log('result', result);
  }, [result]);

  useEffect(() => {
    if (loading && contractConfig?.chainId === Number(chainId)) {
      // launchTokenByFactory();
    }
  }, [loading, contractConfig, chainId]);

  // 标题
  const ResultsMessage = ({ result, fromCom }) => {
    const messages = {
      loading: {
        launch: t('mint.Deploying'),
        lockliquidity: 'Locking Liquidity...',
        burnliquidity: 'Burning Liquidity...',
        opentrade: 'Initial Dex Offering (IDO)...',
        renounce: 'Renounce Ownership',
      },
      success: {
        launch: t('mint.Successful'),
        lockliquidity: 'Lock Liquidity Successful',
        burnliquidity: 'Burn Liquidity Successful',
        opentrade: 'IDO Launched',
        renounce: t('mint.Ownership'),
      },
      error: {
        launch: t('mint.Deployment'),
        lockliquidity: 'Lock Liquidity Failed',
        burnliquidity: 'Burn Liquidity Failed',
        opentrade: 'IDO Launched Unsuccessful',
        renounce: 'Renounce Ownership',
      },
    };

    const message = messages[result]?.[fromCom] || 'Unknown Status';
    return <p className="back-title">{message}</p>;
  };

  useEffect(() => {
    getResultInfo();
  }, [tx]);
  return (
    <div className="resultBox">
      {/* 成功或失败icon,pending不展示 */}
      {result === 'success' && (
        <img src="/result-success-icon.svg" className="res-icon" />
      )}
      {result === 'error' && (
        <img src="/result-fail-icon.svg" className="res-icon" />
      )}
      <div className="back">
        <ResultsMessage result={result} fromCom={fromCom} />
        {result === 'loading' && (
          <p
            style={{ textAlign: 'center', color: '#fff', marginBottom: '24px' }}
          >
            {t('mint.This')}
          </p>
        )}
        {result === 'error' && (
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {t('mint.Sorry')}
          </p>
        )}

        {/* burn or lock lq */}
        {fromCom !== 'launch' && result !== 'loading' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '24px 0',
            }}
          >
            <span
              className="back-to"
              style={{
                textAlign: 'center',
                color: result === 'success' ? '#86f097' : '#ea6e6e',
                borderColor: result === 'success' ? '#86f097' : '#ea6e6e',
              }}
              onClick={() => {
                history('/dapps/tokencreation/manageToken');
              }}
            >
              {result === 'success'
                ? t('mint.Management')
                : t('mint.Management')}
            </span>
          </div>
        )}

        {/* launch token */}
        {fromCom === 'launch' && result === 'success' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '24px 0 12px',
            }}
          >
            <span
              className="back-to"
              style={{
                textAlign: 'center',
                color: '#000',
                background: '#86f097',
                borderColor: '#86f097',
              }}
              onClick={() => {
                history('/dapps/tokencreation/manageToken');
              }}
            >
              {t('mint.Management')}
            </span>
          </div>
        )}
        {fromCom === 'launch' && result !== 'loading' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px',
              marginTop: result === 'success' ? '12px' : '24px',
            }}
          >
            <span
              className="back-to"
              style={{
                textAlign: 'center',
                color: result === 'success' ? '#86f097' : '#ea6e6e',
                borderColor: result === 'success' ? '#86f097' : '#ea6e6e',
              }}
              onClick={() => {
                history('/dapps/tokencreation');
              }}
            >
              {t('mint.Return')}
            </span>
          </div>
        )}

        {result === 'loading' && (
          <div
            className="goEth"
            onClick={() => {
              if (tx) {
                window.open(contractConfig?.scan + tx);
              }
            }}
          >
            {/* <p>
              <img src="/ethLogo.svg" alt="" />
            </p> */}
            {/* <span>{t('token.go')}</span> */}
            <span>{t('mint.View')}</span>
          </div>
        )}
      </div>
      <img src="/resultBack.svg" alt="" style={{ width: '80%' }} />
      <Back
        style={{
          top: '25%',
          left: '0%',
          transform: 'translateX(-30%)',
          bottom: 'initial',
        }}
      />
    </div>
  );
}
