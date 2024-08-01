import './index.less';
import PageHeader from '../../component/PageHeader';
import { useState, useContext } from 'react';
import BottomButton from '../../component/BottomButton';
import FormD from './components/form';
import Pass from './components/pass';
import Result from './components/result';
import Confirm from './components/confirm';
import { toWeiWithDecimal } from '@utils/convertEthUnit';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
export interface FormDataType {
  filename: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: string;
  description: string;
  initialBuyTax: string;
  initialSellTax: string;
  finalBuyTax: string;
  finalSellTax: string;
  reduceBuyTaxAt: string;
  reduceSellTaxAt: string;
  maxTxAmount: string;
  maxWalletSize: string;
  maxTaxSwap: string;
  taxSwapThreshold: string;
  buyCount: string;
  preventSwapBefore: string;
  payTokenType: string;
}
import { ethers } from 'ethers';
import Request from '@/components/axios';
import { MintContext } from '../../index';
import { useForm } from 'antd/es/form/Form';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
function LaunchForm({ formData, setFormData }) {
  const { getAll } = Request();
  const history = useNavigate();
  const token = Cookies.get('token');
  const { t } = useTranslation();
  const { launchTokenPass }: any = useContext(MintContext);
  const { loginProvider, chainId, contractConfig } = useContext(CountContext);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  // form-----填写表单    pass-----选择pass卡  confirm---创建token确认页面  result---loading和结果页面
  const [step, setStep] = useState('result');
  // 提交表单
  const onFinishForm = (data) => {
    const par = Object.keys(data).reduce((prev, key) => {
      prev[key] = String(data[key]);
      return prev;
    }, {});
    if (par) {
      setStep('pass');
      setFormData({ ...par, ...formData, buyCount: '0' });
    }
  };
  const change = () => {
    if (step === 'pass') {
      setStep('form');
    } else {
      setStep('pass');
    }
  };
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
    setLoading(true);
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
      history('/dapps/tokencreation/manageToken');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      return null;
    }
  };

  return (
    <div className="launchAll">
      {step !== 'result' && (
        <PageHeader
          className="launch-form-header"
          arrow={!loading}
          title="Launch"
          desc={step === 'confirm' ? t('Slider.Confirm') : t('token.fill')}
          disabled={step === 'confirm'}
          name={step === 'form' ? '' : change}
        />
      )}
      {step === 'pass' ? (
        <Pass />
      ) : step === 'confirm' ? (
        <Confirm />
      ) : step === 'result' ? (
        <Result />
      ) : (
        <FormD form={form} formData={formData} onFinishForm={onFinishForm} />
      )}
      {step !== 'result' && (
        <BottomButton
          bottom={true}
          text={t('token.create')}
          loading={loading}
          onClick={() => {
            if (step === 'form') {
              form.submit();
            } else if (step === 'pass') {
              if (launchTokenPass) {
                setStep('confirm');
              }
            } else {
              deployContract();
            }
          }}
        />
      )}
    </div>
  );
}
export default LaunchForm;
