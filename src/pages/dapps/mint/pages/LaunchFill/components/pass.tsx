import { useEffect, useState, useContext } from 'react';
import cookie from 'js-cookie';
import dayjs from 'dayjs';
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import Loading from '@/components/allLoad/loading.tsx';
import { MintContext } from '../../../index';
import { getContract } from 'thirdweb';
import { useTranslation } from 'react-i18next';
import { client } from '@/client';
import { useReadContract } from 'thirdweb/react';
import { StandardTokenFactoryAddress01Abi } from '@abis/StandardTokenFactoryAddress01Abi';
import { toEthWithDecimal } from '@utils/convertEthUnit';
export default function CommonPass() {
  const { t } = useTranslation();
  const { getAll } = Request();
  const { browser,  contractConfig,  allChain, }: any =
    useContext(CountContext);
  const { launchTokenPass, setLaunchTokenPass, setFormData, formData }: any =
    useContext(MintContext);
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(true);
  const { standardTokenFactoryAddress01, tokenSymbol } = contractConfig;
  // 生成合约
  const contract = getContract({
    client,
    chain: allChain,
    address: standardTokenFactoryAddress01,
    abi: StandardTokenFactoryAddress01Abi as any,
  });
  // 获取  fee
  const { data: fees, isLoading: isFees }: any = useReadContract({
    contract,
    method: 'fees',
    params: [params?.level],
  });
  useEffect(() => {
    if (!isFees) {
      setFormData({ ...formData, fees: fees?.toString(), level: params.level });
      setLoading(false);
    }
  }, [isFees]);

  const getPass = async () => {
    setLoading(true);
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/d_pass/info',
      data: {},
      token,
      chainId:allChain?.id,
    });
    if (res?.status === 200) {
      const { data } = res;
      setParams(data);
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
    if (Number(allChain?.id) === contractConfig?.chainId) {
      getPass();
    }
  }, [allChain, contractConfig]);
  
  return (
    <div className="passBox">
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
            t('mint.Fee'),
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
      </div>
    </div>
  );
}
