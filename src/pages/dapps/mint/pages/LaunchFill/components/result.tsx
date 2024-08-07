import React,{ useEffect, useContext } from 'react';
import Back from '../../../component/Background';
import './index.less';
import { toWeiWithDecimal } from '@utils/convertEthUnit';
import { ethers } from 'ethers';
import Request from '@/components/axios';
import { MintContext } from '../../../index';
import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
import { useNavigate } from 'react-router-dom';
const Load = React.lazy(() => import('@/components/allLoad/load.tsx'));
import { useTranslation } from 'react-i18next';
export default function resultBox({
  loading,
  result,
  setResult,
  setLoading,
}: any) {
  const history = useNavigate();
const { t } = useTranslation();
  const { launchTokenPass, formData }: any = useContext(MintContext);
  const { loginProvider, chainId, contractConfig } = useContext(CountContext);
  const { getAll } = Request();
  const token = Cookies.get('token');
  const getByteCode = async () =>
    await getAll({
      method: 'post',
      url: '/api/v1/launch-bot/contract',
      data: formData,
      token,
      chainId,
    });
  const reportDeploy = async (data: {
    contractId: string;
    contractAddress: string;
    deployTx: string;
  }) => {
    await getAll({
      method: 'post',
      url: '/api/v1/launch-bot/contract/deploy',
      data,
      token,
      chainId,
    });
  };
  const deployContract = async () => {
    try {
      const { data } = await getByteCode();
      const { decimals, launchFee } = contractConfig;
      const { bytecode, metadataJson, contractId } = data;
      const ethersProvider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await ethersProvider.getSigner();
      const abi = JSON.parse(metadataJson).output.abi;
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
      // 先默认使用手续费版本
      // launchTokenPass, setLaunchTokenPass   pass或者收费   launchTokenPass
      const { deployTransaction, address } = await contractFactory.deploy(
        launchTokenPass === 'more' ? 0 : 2,
        {
          value: toWeiWithDecimal(launchFee, decimals),
        }
      );
      reportDeploy({
        contractAddress: address,
        contractId,
        deployTx: deployTransaction.hash,
      });
      await deployTransaction.wait();
      // history('/dapps/tokencreation/manageToken');
      setLoading(false);
      setResult('result');
    } catch (e) {
      setResult('result');
      setLoading(false);
      return null;
    }
  };
  useEffect(() => {
    if (loading) {
      deployContract();
    }
  }, [loading]);

  return (
    <div className="resultBox">
      <div className="back">
        <p className="with">
          {result === 'loading' ? t('token.Deploying') : t('token.Done')}
          {result === 'loading' && <Load />}
        </p>
        <p
          onClick={() => {
            if (result !== 'loading') {
              history('/dapps/tokencreation');
            }
          }}
          className="backTo"
          style={{
            backgroundColor:
              result === 'loading' ? '#434343' : 'rgb(134,240,151)',
          }}
        >
         {t('token.Back')}
        </p>
      </div>
      <img src="/resultBack.svg" alt="" style={{ width: '80%' }} />
      <Back
        style={{
          top: '40%',
          left: '0%',
          transform: 'translateX(-30%)',
          bottom: 'initial',
        }}
      />
    </div>
  );
}
