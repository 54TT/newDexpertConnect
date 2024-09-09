import './index.less';
import { useState, useContext } from 'react';
import PageHeader from '../../component/PageHeader';
import BottomButton from '../../component/BottomButton';
import FormD from './components/form';
import Pass from './components/pass';
// import Result from './components/result';
import Confirm from './components/confirm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CountContext } from '@/Layout';
import { ethers } from 'ethers';
import Cookies from 'js-cookie';
import Request from '@/components/axios';
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
import { MintContext } from '../../index';
import { useForm } from 'antd/es/form/Form';
import { BigNumber } from 'ethers';
function LaunchForm() {
  const { t } = useTranslation();
  const history = useNavigate();
  const { chainId, contractConfig, signer } = useContext(CountContext);
  const { getAll } = Request();
  const token = Cookies.get('token');
  // const { launchTokenPass }: any = useContext(MintContext);
  const { launchTokenPass, formData, setFormData }: any =
    useContext(MintContext);
  const [, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [, setResult] = useState('loading');
  const [, setTx] = useState('');
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
      const { standardTokenFactoryAddress01 } = contractConfig;
      const tokenFactory01 = new ethers.Contract(
        standardTokenFactoryAddress01,
        StandardTokenFactoryAddress01Abi,
        signer
      );
      console.log(1);

      const { totalSupply, fees, level, ...props } = formData;
      const metadata = {
        totalSupply: BigNumber.from(totalSupply),
        ...props,
      };
      console.log(2);
      const tx = await tokenFactory01.create(
        launchTokenPass === 'more' ? level : 0,
        metadata,
        {
          value: launchTokenPass === 'more' ? fees : 0,
        }
      );
      console.log(tx);

      setLoading(true);
      console.log('tx hash', tx?.hash);
      setStep('result');
      history(
        `/dapps/tokencreation/results/launch?tx=${tx?.hash}&status=pending`
      );
      setTx(tx?.hash);
      sendReportPayType(
        tx.hash,
        payTypeMap[launchTokenPass === 'more' ? 0 : 2]
      );
      // const recipent = await tx.wait();
      // console.log('recipent', recipent);
      // if (recipent.status == 1) {
      //   setLoading(false);
      //   setResult('success');
      //   history(`/dapps/tokencreation/results/launch?tx=${tx?.hash}&status=success`)
      //   setCreateLoading(false)
      // } else {
      //   setLoading(false);
      //   setResult('error');
      //   history(`/dapps/tokencreation/results/launch?tx=${tx?.hash}&status=error`)
      //   setCreateLoading(false)
      // }
    } catch (e) {
      console.error(e);
      setResult('error');
      setLoading(false);
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
  console.log(step)
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
        // step === 'result' ? (
        //   <Result
        //     loading={loading}
        //     result={result}
        //     setResult={setResult}
        //     setLoading={setLoading}
        //   />
        // ) :
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
              // step===confirm
              // setLoading(true);
              // setStep('result');
              launchTokenByFactory();
              setCreateLoading(true);
              setResult('loading');
            }
          }}
        />
      )}
    </div>
  );
}
export default LaunchForm;
