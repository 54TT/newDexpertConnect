import { useEffect, useContext, useState } from 'react';
import Back from '../../../component/Background';
import './index.less';
import { CountContext } from '@/Layout';
import { useWaitForReceipt } from 'thirdweb/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { client } from '@/client';
export default function resultBox() {
  const history = useNavigate();
  const { t } = useTranslation();
  const { from, tx: routerTx } = useParams();
  const { contractConfig, allChain } = useContext(CountContext);
  const [result, setResult] = useState('loading');
  const {
    data: receipt,
    isLoading,
    error: isError,
  } = useWaitForReceipt({
    client,
    chain: allChain,
    transactionHash: routerTx as any,
  });
  useEffect(() => {
    // 判断是否成功
    if (!isLoading && receipt) {
      setResult('success');
    }
    //   判断是否失败
    if (isError) {
      setResult('error');
    }
  }, [isLoading, receipt, isError]);

  // 标题
  const ResultsMessage = ({ result, fromCom }) => {
    const messages = {
      loading: {
        launch: t('mint.Deploying'),
        lockliquidity: t('mint.Lock'),
        burnliquidity: t('mint.Burn'),
        opentrade: t('mint.Initial'),
        renounce: t('mint.res renounce'),
      },
      success: {
        launch: t('mint.Successful'),
        lockliquidity: t('mint.Lock'),
        burnliquidity: t('mint.Burn'),
        opentrade: t('mint.Launched'),
        renounce: t('mint.Ownership'),
      },
      error: {
        launch: t('mint.Deployment'),
        lockliquidity: t('mint.Lock'),
        burnliquidity: t('mint.Burn'),
        opentrade: t('mint.IDO'),
        renounce: t('mint.res renounce'),
      },
    };
    const message = messages[result]?.[fromCom] || 'Unknown Status';
    return <p className="back-title">{message}</p>;
  };
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
        <ResultsMessage result={result} fromCom={from} />
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
        {from !== 'launch' && result !== 'loading' && (
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
        {from === 'launch' && result === 'success' && (
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
        {from === 'launch' && result !== 'loading' && (
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
              if (routerTx) {
                window.open(contractConfig?.scan + routerTx);
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
