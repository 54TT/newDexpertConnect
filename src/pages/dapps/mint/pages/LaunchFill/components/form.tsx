import { Form, Input, InputNumber } from 'antd';
const { TextArea } = Input;
import { useState } from 'react';
export default function form({ form, formData ,onFinishForm}) {
  const [showAdv, setShowAdv] = useState(false);
  return (
    <>
      <div className="launch-form mint-scroll scroll">
        <Form
          form={form}
          initialValues={formData}
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
            <Input placeholder="合约文件名称" autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder="代币名称" autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="symbol"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder="代币符号" autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="totalSupply"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber
              placeholder="最大供应量"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item
            name="decimals"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder="decimals" autoComplete={'off'} />
          </Form.Item>
          <Form.Item name="description">
            <TextArea
              placeholder="描述"
              autoSize
              style={{ minHeight: '66px' }}
            />
          </Form.Item>
          {/* <Form.Item label="购买数量" name="buyCount" hidden={!showAdv}>
            <InputNumber controls={false} stringMode={true}/>
          </Form.Item> */}
          <Form.Item name="initialBuyTax" hidden={!showAdv}>
            <InputNumber
              placeholder="初始购买税"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="initialSellTax" hidden={!showAdv}>
            <InputNumber
              placeholder="初始销售税"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="finalBuyTax" hidden={!showAdv}>
            <InputNumber
              placeholder="最终购买税"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="finalSellTax" hidden={!showAdv}>
            <InputNumber
              placeholder="最终销售税"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="reduceBuyTaxAt" hidden={!showAdv}>
            <InputNumber
              placeholder="减少购买税"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="reduceSellTaxAt" hidden={!showAdv}>
            <InputNumber
              placeholder="减少销售税"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="preventSwapBefore" hidden={!showAdv}>
            <InputNumber
              placeholder="Prevent Swap Before"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="maxTxAmount" hidden={!showAdv}>
            <InputNumber
              placeholder="最大交易数量"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="maxWalletSize" hidden={!showAdv}>
            <InputNumber
              placeholder="最大钱包大小"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="maxTaxSwap" hidden={!showAdv}>
            <InputNumber
              placeholder="最大交易税"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="taxSwapThreshold" hidden={!showAdv}>
            <InputNumber
              placeholder="税收互换门槛"
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="buyCount" hidden={true}>
            <InputNumber
              placeholder="税收互换门槛"
              controls={false}
              stringMode={true}
            />
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
      <p className="Advanced">Advanced Options</p>
    </>
  );
}
