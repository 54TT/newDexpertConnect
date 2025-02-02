import { Button, Form, Input, InputNumber } from 'antd';
const { TextArea } = Input;
// import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useState } from 'react';
import CommonModal from '@/components/CommonModal';
import formatDecimalString from '@utils/formatDecimalString';
export default function form({ form, formData, onFinishForm, update = false }) {
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

  const WebSiteInput = (props) => (
    <div className="launc-social-media">
      <img src="/website-launch.svg" alt="" />
      <Input placeholder={t('mint.Web')} autoComplete={'off'} {...props} />
    </div>
  );

  const TWitterInput = (props) => (
    <div className="launc-social-media">
      <img src="/twitter.svg" alt="" />
      <Input placeholder={t('mint.x')} autoComplete={'off'} {...props} />
    </div>
  );

  const TgInput = (props) => (
    <div className="launc-social-media">
      <img src="/telegram.svg" alt="" />
      <Input placeholder={t('mint.Telegram')} autoComplete={'off'} {...props} />
    </div>
  );

  const DiscordInput = (props) => (
    <div className="launc-social-media">
      <img src="/discord-launch.svg" alt="" />
      <Input placeholder={t('mint.Discord')} autoComplete={'off'} {...props} />
    </div>
  );

  return (
    <>
      <div
        className="launch-form mint-scroll scroll"
        style={{ height: '88%', overflowX: 'hidden' }}
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
          <span className="launch-form-item-label">1.{t('mint.Logo')}</span>
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
          <span className="launch-form-item-label">2.{t('mint.Name')}</span>

          <Form.Item
            name="name"
            className={update? 'update-form-item' : ''}
            rules={[{ required: true, message: t('token.input') }]}
          >
            {!update ? (
              <Input placeholder={t('mint.Pepecoin')} autoComplete={'off'} />
            ) : (
              <div>{formData.name}</div>
            )}
          </Form.Item>
          <span className="launch-form-item-label">3.{t('mint.Symbol')}</span>
          <Form.Item
            name="symbol"
            className={update? 'update-form-item' : ''}
            rules={[{ required: true, message: t('token.input') }]}
          >
            {!update ? (
              <Input placeholder={t('mint.Example')} autoComplete={'off'} />
            ) : (
              <div>{formData.symbol}</div>
            )}
          </Form.Item>
          <span className="launch-form-item-label">4.{t('mint.Supply')}</span>
          <Form.Item
            name="totalSupply"
            className={update? 'update-form-item' : ''}
            rules={[{ required: true, message: t('token.input') }]}
          >
            {!update ? (
              <InputNumber
                placeholder={t('mint.total')}
                controls={false}
                stringMode={true}
              />
            ) : (
              <div>{formatDecimalString(formData.totalSupply)}</div>
            )}
          </Form.Item>
          <span className="launch-form-item-label">5.{t('mint.Media')}</span>
          <Form.Item name="websiteLink">
            <WebSiteInput />
          </Form.Item>
          <Form.Item name="twitterLink">
            <TWitterInput />
          </Form.Item>
          <Form.Item name="telegramLink">
            <TgInput />
          </Form.Item>
          <Form.Item name="discordLink">
            <DiscordInput />
          </Form.Item>
          <span className="launch-form-item-label">
            6.{t('mint.Description')}
          </span>
          <Form.Item name="description">
            <TextArea
              placeholder={t('mint.about')}
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
            {t('mint.Logo')}
          </div>
        }
        open={logoLinkModal}
        footer={null}
        closeIcon={null}
      >
        <div>
          <Input
            placeholder={t('mint.The')}
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
            {t('mint.Cancel')}
          </Button>
          <Button className="action-button" onClick={() => onConfirmIcon()}>
            {t('mint.Confirm')}
          </Button>
        </div>
      </CommonModal>
    </>
  );
}
