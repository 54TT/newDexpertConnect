import { useEffect, useContext, useState } from 'react';
import Back from '../../../component/Background';
import './index.less';
import { toWeiWithDecimal } from '@utils/convertEthUnit';
import { ethers } from 'ethers';
import Request from '@/components/axios';
import { MintContext } from '../../../index';
import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
import { useNavigate } from 'react-router-dom';
import Load from '@/components/allLoad/load.tsx';
import { useTranslation } from 'react-i18next';
import { reportPayType } from '@/api';
import { injectedProvider } from 'thirdweb/wallets';
import { useActiveWallet } from 'thirdweb/react';

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
  const [tx, setTx] = useState('');
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

  const sendReportPayType = async (tx, payType) => {
    return reportPayType(getAll, {
      data: {
        tx,
        payType,
      },
      options: {
        token,
        chainId,
      },
    });
  };
  // dpass类型
  const payTypeMap = {
    0: '0', // pay fee
    1: '4', // glodenPass
    2: '1', // dpass
  };

  const walletConnect = useActiveWallet();

  const deployContract = async () => {
    try {
      // const { data } = await getByteCode();
      // const signer = await ethersProvider.getSigner();
      const { decimals, launchFee } = contractConfig;
      const ethersProvider = new ethers.providers.Web3Provider(loginProvider);
      const data: any = await Promise.all([
        getByteCode(),
        ethersProvider.getSigner(),
      ]);
      const { bytecode, metadataJson, contractId } = data?.[0]?.data;
      const abi = JSON.parse(metadataJson).output.abi;
      const contractFactory = new ethers.ContractFactory(
        abi,
        bytecode,
        data?.[1]
      );

      // 先默认使用手续费版本
      // launchTokenPass, setLaunchTokenPass   pass或者收费   launchTokenPass
      const { deployTransaction, address } = await contractFactory.deploy(
        launchTokenPass === 'more' ? 0 : 2,
        {
          value:
            launchTokenPass === 'more'
              ? toWeiWithDecimal(launchFee, decimals)
              : 0,
        }
      );

      sendReportPayType(
        deployTransaction.hash,
        payTypeMap[launchTokenPass === 'more' ? 0 : 2]
      );
      reportDeploy({
        contractAddress: address,
        contractId,
        deployTx: deployTransaction.hash,
      });
      if (deployTransaction?.hash) {
        const tx = await deployTransaction.wait();
        if (tx?.transactionHash === deployTransaction?.hash) {
          setLoading(false);
          setResult('success');
        }
        setTx(deployTransaction?.hash);
      }
    } catch (e) {
      setResult('error');
      setLoading(false);
      return null;
    }
  };
  
  const newDeployContract = async () => {
    try {
      const metamaskProvider:any = injectedProvider(walletConnect?.id);
      const { decimals, launchFee } = contractConfig;
      // const ethersProvider = new ethers.providers.Web3Provider(loginProvider);
      const ethersProvider = new ethers.providers.Web3Provider(
        metamaskProvider
      );
      const data: any = await Promise.all([
        getByteCode(),
        ethersProvider.getSigner(),
      ]);
      const { bytecode, metadataJson, contractId } = data?.[0]?.data;
      const abi = JSON.parse(metadataJson).output.abi;
      const contractFactory = new ethers.ContractFactory(
        abi,
        bytecode,
        data?.[1]
      );

      // 先默认使用手续费版本
      // launchTokenPass, setLaunchTokenPass   pass或者收费   launchTokenPass
      const { deployTransaction, address } = await contractFactory.deploy(
        launchTokenPass === 'more' ? 0 : 2,
        {
          value:
            launchTokenPass === 'more'
              ? toWeiWithDecimal(launchFee, decimals)
              : 0,
        }
      );

      sendReportPayType(
        deployTransaction.hash,
        payTypeMap[launchTokenPass === 'more' ? 0 : 2]
      );
      reportDeploy({
        contractAddress: address,
        contractId,
        deployTx: deployTransaction.hash,
      });
      if (deployTransaction?.hash) {
        const tx = await deployTransaction.wait();
        if (tx?.transactionHash === deployTransaction?.hash) {
          setLoading(false);
          setResult('success');
        }
        setTx(deployTransaction?.hash);
      }
    } catch (e) {
      setResult('error');
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (loading && contractConfig?.chainId === Number(chainId)) {
      // deployContract();
    }
    if (walletConnect?.id) {
      newDeployContract();
    }
  }, [loading, contractConfig, chainId, walletConnect]);

  return (
    <div className="resultBox">
      <div className="back">
        <div className="with">
          {result === 'loading'
            ? t('token.Deploying')
            : result === 'success'
              ? t('token.Done')
              : result === 'error'
                ? t('Alert.fail')
                : ''}
          {result === 'loading' && <Load />}
        </div>
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
        <div
          className="goEth"
          onClick={() => {
            if (tx) {
              window.open(contractConfig?.scan + tx);
            }
          }}
        >
          <p>
            <img src="/ethLogo.svg" alt="" />
          </p>
          <span>{t('token.go')}</span>
        </div>
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
