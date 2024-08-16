import './index.less';
import React,{ useState, useContext } from 'react';
const PageHeader = React.lazy(() => import('../../component/PageHeader'));
const BottomButton = React.lazy(() => import('../../component/BottomButton'));
const FormD = React.lazy(() => import('./components/form'));
const Pass = React.lazy(() => import('./components/pass'));
const Result = React.lazy(() => import('./components/result'));
const Confirm = React.lazy(() => import('./components/confirm'));
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
import { MintContext } from '../../index';
import { useForm } from 'antd/es/form/Form';
function LaunchForm({ formData, setFormData }) {
  const { t } = useTranslation();
  const { launchTokenPass }: any = useContext(MintContext);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('loading');
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
        buyCount: '0',
        filename: par?.symbol?.replace(/\s*/g, ''),
        symbol: par?.symbol?.replace(/\s*/g, ''),
      });
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
          title={t('token.Creation')}
          // desc={step === 'confirm' ? t('Slider.Confirm') : t('token.fill')}
          disabled={step === 'confirm'}
          name={step === 'form' ? '' : change}
        />
      )}
      {step === 'pass' ? (
        <Pass />
      ) : step === 'confirm' ? (
        <Confirm />
      ) : step === 'result' ? (
        <Result
          loading={loading}
          result={result}
          setResult={setResult}
          setLoading={setLoading}
        />
      ) : (
        <FormD form={form} formData={formData} onFinishForm={onFinishForm} />
      )}
      {step !== 'result' && (
        <BottomButton
          bottom={true}
          text={t('token.create')}
          onClick={() => {
            if (step === 'form') {
              form.submit();
            } else if (step === 'pass') {
              if (launchTokenPass) {
                setStep('confirm');
              }
            } else {
              setLoading(true);
              setStep('result');
            }
          }}
        />
      )}
    </div>
  );
}
export default LaunchForm;
