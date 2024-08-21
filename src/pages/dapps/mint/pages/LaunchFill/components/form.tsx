import { Form, Input, InputNumber } from 'antd';
const { TextArea } = Input;
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
export default function form({ form, formData, onFinishForm }) {
  const { t } = useTranslation();
  const [showAdv, setShowAdv] = useState(false);

  const item = (name: string, staus?: string) => {
    return (
      <p
        className="itemHint"
        style={{
          marginBottom: staus === 'last' ? '' : '15px',
        }}
      >
        {name}
      </p>
    );
  };
  return (
    <>
      <div
        className="launch-form mint-scroll scroll"
        style={{ height: showAdv ? '380px' : '305px', overflowX: 'hidden' }}
      >
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
            name="name"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={t('token.token')} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="symbol"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input
              placeholder={t('token.symbol') + '  ( ' + t('token.first') + ' )'}
              autoComplete={'off'}
            />
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
            rules={[{ required: true, message: t('token.input') }]}
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
          {showAdv && (
            <>
              <Form.Item name="initialBuyTax">
                <InputNumber
                  placeholder={t('token.tax')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.tax'))}
              <Form.Item name="initialSellTax">
                <InputNumber
                  placeholder={t('token.sel')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.sel'))}
              <Form.Item name="finalBuyTax">
                <InputNumber
                  placeholder={t('token.final')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.final'))}
              <Form.Item name="finalSellTax">
                <InputNumber
                  placeholder={t('token.sela')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.sela'))}
              <Form.Item name="reduceBuyTaxAt">
                <InputNumber
                  placeholder={t('token.redu')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.redu'))}
              <Form.Item name="reduceSellTaxAt">
                <InputNumber
                  placeholder={t('token.reduce')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.reduce'))}
              <Form.Item name="preventSwapBefore">
                <InputNumber
                  placeholder={t('token.Before')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.Before'))}
              <Form.Item name="maxTxAmount">
                <InputNumber
                  placeholder={t('token.of')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.of'))}
              <Form.Item name="maxWalletSize">
                <InputNumber
                  placeholder={t('token.size')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.size'))}
              <Form.Item name="maxTaxSwap">
                <InputNumber
                  placeholder={t('token.taxs')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.taxs'))}
              <Form.Item name="taxSwapThreshold">
                <InputNumber
                  placeholder={t('token.swap')}
                  controls={false}
                  stringMode={true}
                />
              </Form.Item>
              {item(t('token.swap'), 'last')}
            </>
          )}
        </Form>
      </div>
      <div className="launch-form-fix-bottom">
        {showAdv ? (
          <p
            className="launch-form-show-more"
            onClick={() => setShowAdv(false)}
          >
            {t('token.hide')}
          </p>
        ) : (
          <p className="launch-form-show-more" onClick={() => setShowAdv(true)}>
            {t('token.show')}
          </p>
        )}
      </div>
    </>
  );
}
