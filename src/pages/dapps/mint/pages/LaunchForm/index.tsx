import { Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import './index.less';
import PageHeader from '../../component/PageHeader';
import BottomButton from '../../component/BottomButton';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

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

function LaunchForm({ formData, setFormData }) {
  const [showAdv, setShowAdv] = useState(false);
  const history = useNavigate();
  // const [beforeTips, setBeforeTips] = useState(false);
  const [form] = useForm();

  const onFinishForm = (data) => {
    const formatData = Object.keys(data).reduce((prev, key) => {
      prev[key] = String(data[key]);
      return prev;
    }, {});
    setFormData(formatData);
    history('/dapps/mint/confirm/form');
  };

  return (
    <>
      <PageHeader
        className="launch-form-header"
        arrow={true}
        title="Launch"
        desc="填写代币详细信息"
        disabled={false}
      />
      <div className="launch-form mint-scroll scroll">
        <Form
          form={form}
          initialValues={formData}
          onChange={(data) => console.log(data)}
          onFinish={(data) => onFinishForm(data)}
          labelCol={{ span: 8 }}
          labelWrap
          wrapperCol={{ span: 24 }}
          labelAlign="right"
        >
          <Form.Item
            name="filename"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder="合约文件名称" />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder="代币名称" />
          </Form.Item>
          <Form.Item
            name="symbol"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder="代币符号" />
          </Form.Item>
          <Form.Item
            name="totalSupply"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber placeholder="最大供应量" />
          </Form.Item>
          <Form.Item
            name="decimals"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder="decimals" />
          </Form.Item>
          <Form.Item name="description">
            <TextArea
              placeholder="描述"
              autoSize
              style={{ minHeight: '66px' }}
            />
          </Form.Item>
          {/* <Form.Item label="购买数量" name="buyCount" hidden={!showAdv}>
            <InputNumber />
          </Form.Item> */}
          <Form.Item name="initialBuyTax" hidden={!showAdv}>
            <InputNumber placeholder="初始购买税" />
          </Form.Item>
          <Form.Item name="initialSellTax" hidden={!showAdv}>
            <InputNumber placeholder="初始销售税" />
          </Form.Item>
          <Form.Item name="finalBuyTax" hidden={!showAdv}>
            <InputNumber placeholder="最终购买税" />
          </Form.Item>
          <Form.Item name="finalSellTax" hidden={!showAdv}>
            <InputNumber placeholder="最终销售税" />
          </Form.Item>
          <Form.Item name="reduceBuyTaxAt" hidden={!showAdv}>
            <InputNumber placeholder="减少购买税" />
          </Form.Item>
          <Form.Item name="reduceSellTaxAt" hidden={!showAdv}>
            <InputNumber placeholder="减少销售税" />
          </Form.Item>
          <Form.Item name="preventSwapBefore" hidden={!showAdv}>
            <InputNumber placeholder="Prevent Swap Before" />
          </Form.Item>
          <Form.Item name="maxTxAmount" hidden={!showAdv}>
            <InputNumber placeholder="最大交易数量" />
          </Form.Item>
          <Form.Item name="maxWalletSize" hidden={!showAdv}>
            <InputNumber placeholder="最大钱包大小" />
          </Form.Item>
          <Form.Item name="maxTaxSwap" hidden={!showAdv}>
            <InputNumber placeholder="最大交易税" />
          </Form.Item>
          <Form.Item name="taxSwapThreshold" hidden={!showAdv}>
            <InputNumber placeholder="税收互换门槛" />
          </Form.Item>
          <Form.Item name="buyCount" hidden={true}>
            <InputNumber placeholder="税收互换门槛" />
          </Form.Item>
        </Form>
      </div>
      <div className="launch-form-fix-bottom">
        {showAdv ? (
          <p
            className="launch-form-show-more"
            onClick={() => setShowAdv(false)}
          >
            隐藏更多选项
          </p>
        ) : (
          <p className="launch-form-show-more" onClick={() => setShowAdv(true)}>
            展示更多选项
          </p>
        )}
      </div>
      <BottomButton text="创建代币" onClick={() => form.submit()} />
    </>
  );
}

export default LaunchForm;
