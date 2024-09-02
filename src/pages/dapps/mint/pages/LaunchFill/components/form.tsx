import { Form, Input, InputNumber } from 'antd';
const { TextArea } = Input;
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
export default function form({ form, formData, onFinishForm }) {
  const { t } = useTranslation();
  const [showAdv, setShowAdv] = useState(false);

  // const item = (name: string, staus?: string) => {
  //   return (
  //     <p
  //       className="itemHint"
  //       style={{
  //         marginBottom: staus === 'last' ? '' : '15px',
  //       }}
  //     >
  //       {name}
  //     </p>
  //   );
  // };
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
            rules={[
              { required: true, message: t('token.input') },
              {
                pattern: new RegExp('^[A-Za-z][A-Za-z0-9]*$'),
                message: t('token.nameValidMessage'),
              },
            ]}
          >
            <Input placeholder={'Name'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: t('token.input') },
              {
                pattern: new RegExp('^[A-Za-z][A-Za-z0-9]*$'),
                message: t('token.nameValidMessage'),
              },
            ]}
          >
            <Input placeholder={'Name'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="symbol"
            rules={[
              { required: true, message: t('token.input') },
              {
                pattern: new RegExp('^[A-Za-z][A-Za-z0-9]*$'),
                message: t('token.nameValidMessage'),
              },
            ]}
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
            name="websiteLink"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={'website'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="twitterLink"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={'twitter'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="telegramLink"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={'telegram'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name="discordLink"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={'discord'} autoComplete={'off'} />
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
              <Form.Item
                name="decimals"
                rules={[{ required: true, message: t('token.input') }]}
              >
                <InputNumber
                  placeholder={t('token.decimals')}
                  controls={false}
                />
              </Form.Item>
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
