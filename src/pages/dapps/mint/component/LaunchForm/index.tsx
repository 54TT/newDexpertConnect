import { Form, Input, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
import PageHeader from '../PageHeader';
import BottomButton from '../BottomButton';
import { useForm } from 'antd/es/form/Form';
const { TextArea } = Input;
function LaunchForm({ formData, setFormData }) {
  const [showAdv, setShowAdv] = useState(false);
  const [beforeTips, setBeforeTips] = useState(false);
  const [form] = useForm();
  useEffect(() => {
    form.setFieldsValue(formData);
  }, []);
  return (
    <>
      <PageHeader
        className="launch-form-header"
        arrow={true}
        title="Launch"
        desc="填写代币详细信息"
      />
      <div className="launch-form mint-scroll scroll">
        <Form
          form={form}
          onChange={(data) => console.log(data)}
          onFinish={(file) => console.log(file)}
          labelCol={{ span: 8 }}
          labelWrap
          wrapperCol={{ span: 16 }}
          labelAlign="left"
        >
          <Form.Item
            label="合同文件名"
            name="contractFileName"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="代币名称"
            name="name"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="代币符号"
            name="symbol"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="代币供应量"
            name="totalSupply"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="小数点"
            name="decimals"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <TextArea autoSize style={{ minHeight: '66px' }} />
          </Form.Item>
          <>
            <Form.Item label="首次购买税" name="buyTex" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="初始销售税" name="sellTex" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="最终购买税" name="finalBuyTex" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="减少购买税" name="subTex" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="降低购买税" name="lowTex" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Prevent Swap Before"
              name="swapBefore"
              hidden={!showAdv}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item label="最大交易数量" name="maxTrade" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="最大钱包大小" name="maxWallet" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="Max Tax Swap" name="maxSwapTax" hidden={!showAdv}>
              <InputNumber />
            </Form.Item>
          </>
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
