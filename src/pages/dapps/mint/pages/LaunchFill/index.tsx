import './index.less';
import { useState, useContext, useEffect } from 'react';
import PageHeader from '../../component/PageHeader';
import BottomButton from '../../component/BottomButton';
import FormD from './components/form';
import Pass from './components/pass';
import Confirm from './components/confirm';
import { useNavigate } from 'react-router-dom';
import { prepareContractCall } from 'thirdweb';
import { useTranslation } from 'react-i18next';
import { CountContext } from '@/Layout';
import Cookies from 'js-cookie';
import Request from '@/components/axios';
import { client } from '@/client';

import { getContract } from 'thirdweb';
import { reportPayType } from '@/api';
import { StandardTokenFactoryAddress01Abi } from '@abis/StandardTokenFactoryAddress01Abi';
export interface FormDataType {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  description: string;
  maxWalletSize: string;
  payTokenType: string;
  websiteLink: string;
  twitterLink: string;
  telegramLink: string;
  logoLink: string;
  discordLink: string;
  fees: BigNumber;
  level: string;
}
import { useSendTransaction } from 'thirdweb/react';
import { MintContext } from '../../index';
import { useForm } from 'antd/es/form/Form';
import { BigNumber } from 'ethers';
function LaunchForm() {
  const { t } = useTranslation();
  const history = useNavigate();
  const { chainId, contractConfig, allChain } = useContext(CountContext);
  const { getAll } = Request();
  const token = Cookies.get('token');
  const { launchTokenPass, formData, setFormData }: any =
    useContext(MintContext);
  const [createLoading, setCreateLoading] = useState(false);
  const {
    mutate: sendTx,
    data: transactionResult,
    error: UUUUU,
  } = useSendTransaction({
    payModal: false,
  });

  useEffect(() => {
    if (transactionResult?.transactionHash) {
      setStep('result');
      history(
        `/dapps/tokencreation/results/launch/${transactionResult?.transactionHash}`
      );
      sendReportPayType(
        transactionResult?.transactionHash,
        payTypeMap[launchTokenPass === 'more' ? 0 :launchTokenPass === 'gloden' ?1: 2]  
      );
    }
    if (UUUUU) {
      setCreateLoading(false);
    }
  }, [transactionResult, UUUUU]);
  // later
  const contract = getContract({
    client,
    chain: allChain,
    address: contractConfig?.standardTokenFactoryAddress01,
    abi: StandardTokenFactoryAddress01Abi as any,
  });
  const [form] = useForm();
  // form-----填写表单    pass-----选择pass卡  confirm---创建token确认页面  result---loading和结果页面
  const [step, setStep] = useState('form');
  // 提交表单
  const onFinishForm = (data) => {
    const par: any = Object.keys(data).reduce((prev, key) => {
      prev[key] = String(data[key]);
      return prev;
    }, {});
    if (par) {
      setStep('pass');
      setFormData({
        ...formData,
        ...par,
      });
    }
  };
  const payTypeMap = {
    0: '0', // pay fee
    1: '4', // glodenPass
    2: '1', // dpass
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
  // 使用工厂函数部署token
  const launchTokenByFactory = async () => {
    try {
      const { totalSupply, fees, level, ...props } = formData;
      const metadata = {
        totalSupply: BigNumber.from(totalSupply),
        ...props,
      };
      // 合约 授权   approve
      const txsss: any = prepareContractCall({
        contract,
        method: 'create',
        params: [launchTokenPass === 'more' ? level : 0, metadata],
        value: launchTokenPass === 'more' ? fees : 0,
      });
      await sendTx(txsss);
    } catch (e) {
      setCreateLoading(false);
    }
  };

  const change = () => {
    if (step === 'pass') {
      setStep('form');
    } else {
      setStep('pass');
    }
  };
  return (
    <div className="launchAll">
      {step !== 'result' && (
        <PageHeader
          className="launch-form-header"
          arrow={true}
          title={step === 'confirm' ? t('mint.Information') : t('mint.launch')}
          // desc={step === 'confirm' ? t('Slider.Confirm') : t('token.fill')}
          disabled={step === 'confirm'}
          name={step === 'form' ? '' : change}
        />
      )}
      {step === 'pass' ? (
        <Pass />
      ) : step === 'confirm' ? (
        <Confirm />
      ) : (
        <FormD form={form} formData={formData} onFinishForm={onFinishForm} />
      )}
      {step !== 'result' && (
        <BottomButton
          bottom={true}
          loading={createLoading}
          text={t('mint.Creation')}
          onClick={() => {
            if (step === 'form') {
              form.submit();
            } else if (step === 'pass') {
              if (launchTokenPass) {
                setStep('confirm');
              }
            } else {
              launchTokenByFactory();
              setCreateLoading(true);
            }
          }}
        />
      )}
    </div>
  );
}
export default LaunchForm;
