import './index.less';
import PageHeader from '../../component/PageHeader';
import { useState,useContext } from 'react';
import BottomButton from '../../component/BottomButton';
import FormD from './components/form';
import Pass from './components/pass';
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
import {MintContext} from '../../index'
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
function LaunchForm({ formData, setFormData }) {
  const history = useNavigate();
  const { launchTokenPass,  }: any = useContext(MintContext);
  const [form] = useForm();
  // form-----填写表单    pass-----选择pass卡
  const [step, setStep] = useState('form');
  // 提交表单
  const onFinishForm = (data) => {
    const formatData = Object.keys(data).reduce((prev, key) => {
      prev[key] = String(data[key]);
      return prev;
    }, {});
    if (formatData) {
      setStep('pass');
      setFormData(formatData);
    }
  };
  return (
    <div className="launchAll">
      <PageHeader
        className="launch-form-header"
        arrow={true}
        title="Launch"
        desc="填写代币详细信息"
        disabled={false}
        name={step === 'form' ? '' : setStep}
      />
      {step === 'form' ? (
        <FormD form={form} formData={formData} onFinishForm={onFinishForm} />
      ) : (
        <Pass />
      )}
      <div className="bott">
        <BottomButton
          text="创建代币"
          onClick={() => {
            if (step === 'form') {
              form.submit();
            } else {
              if (launchTokenPass) {
                history('/dapps/mint/confirm/form');
              }
            }
          }}
        />
      </div>
    </div>
  );
}
export default LaunchForm;
