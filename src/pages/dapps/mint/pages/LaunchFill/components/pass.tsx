import { useEffect, useState, useContext } from 'react';
import cookie from 'js-cookie';
import dayjs from 'dayjs';
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import Loading from '@/components/allLoad/loading.tsx';
import { MintContext } from '../../../index';
import { useTranslation } from 'react-i18next';
export default function pass() {
  const { t } = useTranslation();
  const { getAll } = Request();
  const { browser, chainId, contractConfig }: any = useContext(CountContext);
  const { launchTokenPass, setLaunchTokenPass }: any = useContext(MintContext);
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const getPass = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/d_pass/info',
      data: {},
      token,
      chainId,
    });
    if (res?.status === 200) {
      setParams(res?.data);
      setLoading(true);
    } else {
      setLoading(true);
    }
  };
  const passItem = (name: string, data: string, key: string, show: string) => {
    return (
      <div
        className="item"
        style={{
          border:
            key === launchTokenPass
              ? '1px solid rgb(134,240,151)'
              : '1px solid rgba(94, 94, 94, 0.3)',
        }}
        onClick={() => {
          if (Number(show)) {
            setLaunchTokenPass(key);
          }
        }}
      >
        <div>
          {data && (
            <div
              className="left"
              style={{
                backgroundColor: key === 'gloden' ? '#DBC926' : '#86F097',
              }}
            >
              <img src="/passLogo.svg" alt="" />
            </div>
          )}
          <p>{name}</p>
        </div>
        <p>{data}</p>
      </div>
    );
  };
  useEffect(() => {
    if (Number(chainId) === contractConfig?.chainId) {
      getPass();
    }
  }, [chainId, contractConfig]);
  return (
    <div className="passBox">
      <p className="title">{t('token.Fee')}</p>
      <p className="hint" style={{ fontSize: '15px', margin: '8px 0' }}>
        {`${launchTokenPass==='launch'||launchTokenPass==='gloden'?'0':contractConfig.launchFee} ${contractConfig.tokenSymbol} ${t('token.need')}`}
      </p>
      {loading ? (
        <div className="passItem">
          {params?.launchBotCreationCnt &&
            passItem(
              'D Pass',
              Number(params?.launchBotCreationCnt)
                ? params?.launchBotCreationCnt
                : '0',
              'launch',
              params?.launchBotCreationCnt
            )}
          {params?.stopTs &&
            passItem(
              'Gloden Pass',
              Number(params?.stopTs)
                ? dayjs
                    .unix(Number(params?.stopTs))
                    .format('YYYY-MM-DD HH:mm:ss')
                : '暂未拥有',
              'gloden',
              params?.stopTs
            )}
          {passItem(t('token.Fee'), '', 'more', '1')}
        </div>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <div className="showBot">
        {/* <p className="hint">{t('token.Notice')}</p>
        <p className="hint">
          {t('token.be', {
            value: launchTokenPass==='launch'||launchTokenPass==='gloden'?'0':contractConfig.launchFee,
            symbol: contractConfig.tokenSymbol,
          })}
        </p> */}
      </div>
    </div>
  );
}
