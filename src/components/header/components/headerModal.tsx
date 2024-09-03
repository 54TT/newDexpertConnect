import { Input, Modal } from 'antd';
import { useContext, useState, useEffect, useRef } from 'react';
import { CountContext } from '@/Layout.tsx';
import cookie from 'js-cookie';
import Request from '@/components/axios.tsx';
import { throttle } from 'lodash-es';
import NotificationChange from '@/components/message';
import { client } from '@/client.ts';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { createWallet } from 'thirdweb/wallets';
import { useConnectModal } from 'thirdweb/react';
import { darkTheme } from 'thirdweb/react';
import { createLoginMessage } from '@utils/updateNonce';
import dayjs from 'dayjs';
function HeaderModal() {
  const account = useActiveAccount();
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
    environment,
    setEnvironment,
    login,
  }: any = useContext(CountContext);
  const routerLocation = useLocation();
  function onAnnouncement(event?: any) {
    environment.push(event?.detail);
    setEnvironment([...environment]);
  }
  const current: any = useRef(null);
  useEffect(() => {
    window.addEventListener('eip6963:announceProvider', onAnnouncement);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    return () =>
      window.removeEventListener('eip6963:announceProvider', onAnnouncement);
  }, []);
  const { t } = useTranslation();
  const { getAll } = Request();
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalSet(false);
    setLoad(false);
  };
  const [value, setValue] = useState('');
  const [address, setAddress] = useState('');
  console.log(address);
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

  const { connect, isConnecting } = useConnectModal();
  console.log(isConnecting);

  const yyyyy = async () => {
    const wallet = await connect({ client, wallets: wallets }); // opens the connect modal
    if (wallet?.id) {
      await wallet?.connect({ client, personalAccount: account });
      const signatures = await account.signMessage({
        message:
          'http://localhost:5173 wants you to sign in with your Ethereum account:\n0xb34C0CFAC19819524892E09Afda7402E57CbcDA6\n\ntttttttttttttt\n\nVersion: 1\nNonce: 你好\nIssued At: 1\nExpiration Time: 1\nNot Before: 1',
      });
      console.log(signatures);
    }
  };
  const ttttttt = async () => {
    const wallet = await connect({ client, wallets: wallets }); // opens the connect modal
    console.log(wallet);
    if (wallet?.id) {
      const tt = await wallet?.connect({ client, personalAccount: account });
      // const ttt = await wallet?.autoConnect({
      //   client,
      //   personalAccount: account,
      // });
      console.log(tt);
      const signatures = await tt.signMessage({
        message:
          'http://localhost:5173 wants you to sign in with your Ethereum account:\n0xb34C0CFAC19819524892E09Afda7402E57CbcDA6\n\ntttttttttttttt\n\nVersion: 1\nNonce: 你好\nIssued At: 1\nExpiration Time: 1\nNot Before: 1',
      });
      console.log(signatures);
    }
    // console.log(signature);
    // const signatureResult = await signLoginPayload({
    //   account,
    //   payload: {
    //     address: '0x47830e8E79ed834221ced674F7051A18d9918485',
    //     // domain: window.location?.href?.toString(),
    //     domain: '',
    //     statement: '',
    //     version: '1',
    //     // nonce: data?.data?.nonce,
    //     nonce:
    //       'Verify your account in Dexpert.io\nVerification token:\n1725007362959-BDXCFAXGXBC-mwwb5fnpth',
    //     // issued_at: dayjs().format('YYYY-MM-DD')?.toString(),
    //     issued_at: '',
    //     expiration_time: '',
    //     invalid_before: '',
    //   },
    // });
    // const signature = await account.signMessage({
    //   message:
    //     'Verify your account in Dexpert.io\nVerification token:\n1725007362959-BDXCFAXGXBC-mwwb5fnpth',
    // });
    // console.log(signature);
  };

  const loginTo = (params: any) => {
    const data = {
      signature: params?.signature,
      addr: params?.payload?.address,
      message: current.current,
    };
    login(data, 'eth', 'more');
  };
  const changeNoce = (name: string) => {
    if (name) {
      current.current = name;
    }
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
                      domain: window.location?.href?.toString(),
                      statement: '',
                      version: '1',
                      nonce: data?.data?.nonce,
                      issued_at: dayjs().format('YYYY-MM-DD'),
                      expiration_time: dayjs().format('YYYY-MM-DD'),
                      invalid_before: dayjs().format('YYYY-MM-DD'),
                    };
                    const TT = createLoginMessage(paramsNonce);
                    console.log(TT);
                    if (TT) {
                      changeNoce(TT);
                      return paramsNonce;
                    }
                  }
                },
                async isLoggedIn(address: string) {
                  setAddress(address);
                  return false;
                },
              }}
            />
          </div>
          <div onClick={ttttttt} style={{ height: '100px' }}>
            ddddddddddd
          </div>

          <div onClick={yyyyy} style={{ height: '100px', color: 'white' }}>
            ttttttttt
          </div>
        </div>
      )}
    </Modal>
  );
}

export default HeaderModal;
