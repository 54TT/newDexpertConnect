import { useEffect, useState, useContext } from 'react';
import cookie from 'js-cookie';
import dayjs from 'dayjs';
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import Loading from '@/components/allLoad/loading.tsx';
import { MintContext } from '../../../index';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { StandardTokenFactoryAddress01Abi } from '@abis/StandardTokenFactoryAddress01Abi';
import { toEthWithDecimal } from '@utils/convertEthUnit';
export default function CommonPass() {
  const { t } = useTranslation();
  const { getAll } = Request();
  const { browser, chainId, contractConfig, signer }: any =
    useContext(CountContext);
  const { launchTokenPass, setLaunchTokenPass, setFormData, formData }: any =
    useContext(MintContext);
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(true);
  const { standardTokenFactoryAddress01, tokenSymbol } = contractConfig;
  const getPass = async () => {
    setLoading(true);
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/d_pass/info',
      data: {},
      token,
      chainId,
    });
    if (res?.status === 200) {
      const { data } = res;

      setParams(data);
      const tokenFactoryContract = new ethers.Contract(
        standardTokenFactoryAddress01,
        StandardTokenFactoryAddress01Abi,
        signer
      );
      const fees = await tokenFactoryContract.fees(Number(data.level));
      console.log(fees);
      setFormData({ ...formData, fees, level: data.level });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const passItem = (
    name: string,
    data: string,
    key: string,
    show: string,
    hide?: boolean
  ) => {
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
            console.log(key);
            setLaunchTokenPass(key);
          }
        }}
      >
        <div>
          {!hide && (
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
      {/* <p className="title">{t('token.Fee')}</p> */}
      {/* <p className="hint" style={{ fontSize: '15px', margin: '8px 0' }}>
        {`${contractConfig.launchFee} ${contractConfig.tokenSymbol} ${t('token.need')}`}
      </p> */}
      {!loading ? (
        <div className="passItem">
          {params?.launchBotCreationCnt &&
            passItem(
              'D Pass',
              `${t('mint.Balance')}: ${
                Number(params?.launchBotCreationCnt)
                  ? params?.launchBotCreationCnt
                  : '0'
              }`,
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
          {passItem(
            t("mint.Fee"),
            `${toEthWithDecimal(formData.fees, 18)} ${tokenSymbol}`,
            'more',
            '1',
            true
          )}
        </div>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <div className="showBot">
        {/* <p className="hint">{t('token.Notice')}</p> */}
        {/* <p className="hint">
          {t('token.be', {
            value: launchTokenPass==='launch'||launchTokenPass==='gloden'?'0':contractConfig.launchFee,
            symbol: contractConfig.tokenSymbol,
          })}
        </p> */}
      </div>
    </div>
  );
}
