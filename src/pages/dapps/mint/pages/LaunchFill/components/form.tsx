import { Button, Form, Input, InputNumber } from 'antd';
const { TextArea } = Input;
// import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useState } from 'react';
import CommonModal from '@/components/CommonModal';
export default function form({ form, formData, onFinishForm }) {
  const { t } = useTranslation();
  const logoLinkValue = Form.useWatch('logoLink', form);
  const [logoLinkModal, setLogoLinkModal] = useState(false);
  const [logoLink, setLogoLink] = useState(logoLinkValue);
  // const [showAdv, setShowAdv] = useState(false);
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

  const openIconModal = () => {
    setLogoLinkModal(true);
  };

  const onConfirmIcon = () => {
    setLogoLinkModal(false);
    form.setFieldValue('logoLink', logoLink);
  };

  return (
    <>
      <div
        className="launch-form mint-scroll scroll"
        style={{ height: '80%', overflowX: 'hidden' }}
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
          <span className="launch-form-item-label">1.设置形象</span>
          <Form.Item name="logoLink" className="launch-head-icon-item">
            <div className="launch-form-icon" onClick={openIconModal}>
              <img
                src={logoLinkValue ? logoLinkValue : '/default-edit-icon.png'}
                alt=""
              />
              <div className="launch-form-edit">
                <img
                  className="launch-form-edit-icon"
                  src="/editable.png"
                  alt=""
                />
              </div>
            </div>
          </Form.Item>
          <span className="launch-form-item-label">2.代币名称</span>

          <Form.Item
            name="name"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={'Name'} autoComplete={'off'} />
          </Form.Item>
          <span className="launch-form-item-label">3.代币符号</span>
          <Form.Item
            name="symbol"
            rules={[{ required: true, message: t('token.input') }]}
          >
            <Input placeholder={t('token.symbol')} autoComplete={'off'} />
          </Form.Item>
          <span className="launch-form-item-label">4.总供应量</span>
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
          <span className="launch-form-item-label">5.社交媒体</span>
          <Form.Item name="websiteLink">
            <Input placeholder={'website'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item name="twitterLink">
            <Input placeholder={'twitter'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item name="telegramLink">
            <Input placeholder={'telegram'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item name="discordLink">
            <Input placeholder={'discord'} autoComplete={'off'} />
          </Form.Item>
          <span className="launch-form-item-label">6.介绍</span>
          <Form.Item name="description">
            <TextArea
              placeholder={t('token.describe')}
              autoSize
              style={{ minHeight: '66px' }}
            />
          </Form.Item>
        </Form>
      </div>
      <CommonModal
        width={350}
        className="icon-link-modal"
        title={
          <div
            style={{ color: '#fff', textAlign: 'center', marginBottom: '24px' }}
          >
            设置形象
          </div>
        }
        open={logoLinkModal}
        footer={null}
        closeIcon={null}
      >
        <div>
          <Input
            placeholder="你的代币形象的图片URL"
            value={logoLink}
            onChange={(e) => setLogoLink(e.target.value)}
          ></Input>
        </div>
        <div
          style={{
            justifyContent: 'space-evenly',
            display: 'flex',
            marginTop: '24px',
          }}
        >
          <Button
            className="action-button"
            ghost
            onClick={() => setLogoLinkModal(false)}
          >
            取消
          </Button>
          <Button className="action-button" onClick={() => onConfirmIcon()}>
            确认
          </Button>
        </div>
      </CommonModal>
    </>
  );
}
