import { Form, Input, InputNumber } from 'antd';
const { TextArea } = Input;
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
export default function form({ form, formData ,onFinishForm}) {
const { t } = useTranslation();
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
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={t('token.document')} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={t('token.token')} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="symbol"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={t('token.symbol')} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="totalSupply"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <InputNumber
              placeholder={t('token.max')}
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item
            name="decimals"
            rules={[{ required: true, message:t('token.input') }]}
          >
            <InputNumber placeholder={t('token.decimals')} controls={false} />
          </Form.Item>
          <Form.Item name="description">
            <TextArea
              placeholder={t('token.describe')}
              autoSize
              style={{ minHeight: '66px' }}
            />
          </Form.Item>
          <Form.Item name="initialBuyTax" hidden={!showAdv}>
            <InputNumber
              placeholder={t('token.tax')}
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="initialSellTax" hidden={!showAdv}>
            <InputNumber
              placeholder={t('token.sel')}
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="finalBuyTax" hidden={!showAdv}>
            <InputNumber
              placeholder={t('token.final')}
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="finalSellTax" hidden={!showAdv}>
            <InputNumber
              placeholder={t('token.sela')}
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="reduceBuyTaxAt" hidden={!showAdv}>
            <InputNumber
              placeholder={t('token.redu')}
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="reduceSellTaxAt" hidden={!showAdv}>
            <InputNumber
              placeholder={t('token.reduce')}
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
              placeholder={t('token.of')}
              controls={false}
              stringMode={true}
            />
          </Form.Item>
          <Form.Item name="maxWalletSize" hidden={!showAdv}>
            <InputNumber
              placeholder={t('token.size')}
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
