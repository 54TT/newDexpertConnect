import { Input, Modal } from 'antd';
import { useContext, useState,  } from 'react';
import { CountContext } from '@/Layout.tsx';
import cookie from 'js-cookie';
import Request from '@/components/axios.tsx';
import { throttle } from 'lodash-es';
import NotificationChange from '@/components/message';
import { client } from '@/client.ts';
import { ConnectButton } from 'thirdweb/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { createWallet } from 'thirdweb/wallets';
import { darkTheme } from 'thirdweb/react';

function HeaderModal() {
  const {
    browser,
    isModalOpen,
    setIsModalOpen,
    isModalSet,
    setIsModalSet,
    setLoad,
    user,
    setUserPar,
    tonConnect,
    login,
  }: any = useContext(CountContext);
  const routerLocation = useLocation();
  const { t } = useTranslation();
  const { getAll } = Request();
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalSet(false);
    setLoad(false);
  };
  const [value, setValue] = useState('');
  const [address, setAddress] = useState('');
  const changeName = (e: any) => {
    setValue(e.target.value);
  };
  const pushSet = throttle(
    async function () {
      if (value) {
        const token = cookie.get('token');
        if (user && token) {
          const param = { ...user, username: value };
          const result: any = await getAll({
            method: 'post',
            url: '/api/v1/userinfo',
            data: { user: param },
            token,
          });
          if (result?.status === 200) {
            setUserPar(param);
            NotificationChange('success', t('Market.update'));
            handleCancel();
          }
        }
      }
    },
    1500,
    { trailing: false }
  );
  // only wallect connect
  const wallets = [
    createWallet('io.metamask'),
    createWallet('app.phantom'),
    createWallet('app.backpack'),
    createWallet('com.trustwallet.app'),
    createWallet('com.okex.wallet'),
    createWallet('com.coinbase.wallet'),
  ];
  const clickConnect = async (e: any) => {
    if (e?.target?.children) {
      e?.target?.children?.[1]?.click();
    }
  };
  const loginTo = (params: any) => {
    const data = {
      signature: params?.signature,
      addr: params?.payload?.address,
      message: params?.payload?.nonce,
    };
    login(data, 'eth', 'more');
  };
  return (
    <Modal
      destroyOnClose={true}
      centered
      title={null}
      footer={null}
      className={`walletModal ${browser ? 'walletModalBig' : 'walletModalSmall'}`}
      maskClosable={false}
      open={isModalOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
    >
      {isModalSet ? (
        <div className={'headerModalSetName'}>
          <p>{t('Common.new')}</p>
          <p>{t('Common.set')}</p>
          <Input
            autoComplete={'off'}
            allowClear
            onChange={changeName}
            className={'input'}
          />
          <p onClick={pushSet}>OK</p>
        </div>
      ) : (
        <div className={'headerModal'}>
          <img
            src="/logo1.svg"
            loading={'lazy'}
            alt=""
            style={{ width: '120px' }}
          />
          <p>{t('Common.Connect to Dexpert')}</p>
          {routerLocation.pathname !== '/webx2024' && (
            <button onClick={tonConnect} className={'walletButton'}>
              <img src={'/ton.webp'} loading={'lazy'} alt="" />
              <span>Ton</span>
            </button>
          )}
          <div className="WalletConnect" onClickCapture={clickConnect}>
            <img src={'/webAll.svg'} loading={'lazy'} alt="" />
            <ConnectButton
              client={client}
              wallets={wallets}
              connectButton={{ label: 'WalletConnect' }}
              theme={darkTheme({
                colors: {
                  primaryButtonBg: '#000000',
                  primaryButtonText: '#ffffff',
                },
              })}
              auth={{
                async doLogin(params: any) {
                  if (params?.payload) {
                    loginTo(params);
                  }
                },
                async doLogout() {},
                async getLoginPayload(params) {
                  const data: any = await getAll({
                    method: 'post',
                    url: '/api/v1/token',
                    data: { address },
                    token: '',
                    chainId: '',
                  });
                  if (data?.status === 200) {
                    const paramsNonce: any = {
                      ...params,
                      domain: '',
                      statement: '你好',
                      version: '1',
                      nonce: data?.data?.nonce,
                      issued_at: '',
                      expiration_time: '',
                      invalid_before: '',
                    };
                    return paramsNonce;
                  }
                },
                async isLoggedIn(address: string) {
                  setAddress(address);
                  return false;
                },
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default HeaderModal;
