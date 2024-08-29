import { Input, Modal } from 'antd';
import { useContext, useState, useEffect } from 'react';
import { CountContext } from '@/Layout.tsx';
import cookie from 'js-cookie';
import Request from '@/components/axios.tsx';
import { throttle } from 'lodash-es';
import NotificationChange from '@/components/message';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
function HeaderModal() {
  const {
    browser,
    isModalOpen,
    setIsModalOpen,
    changeBindind,
    isModalSet,
    setIsModalSet,
    connect,
    setLoad,
    handleLogin,
    user,
    setUserPar,
    tonConnect,
    environment,
    setEnvironment,
  }: any = useContext(CountContext);
  const routerLocation = useLocation();
  function onAnnouncement(event?: any) {
    environment.push(event?.detail);
    setEnvironment([...environment]);
  }
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
  const connectWallet = throttle(
    function (i: any) {
      handleLogin(i);
      setIsModalOpen(false);
    },
    1500,
    { trailing: false }
  );
  const onConnect = throttle(
    function () {
      connect();
      setIsModalOpen(false);
    },
    1500,
    { trailing: false }
  );
  // only wallect connect
  const newWallet=[
    {
      name: 'WalletConnect',
      img: '/webAll.svg',
      key: 'WalletConnect',
      binding: 'ETH',
    },
  ]
  const wallet = [
    {
      name: 'MetaMask',
      img: '/metamask.svg',
      key: 'MetaMask',
      value: 'io.metamask',
      binding: 'ETH',
    },
    {
      name: 'Coinbase Wallet',
      img: '/coinbase.svg',
      key: 'Coinbase Wallet',
      value: 'com.coinbase.wallet',
      binding: 'ETH',
    },
    {
      name: 'OKX Wallet',
      img: '/okx.png',
      key: 'OKX Wallet',
      value: 'com.okex.wallet',
      binding: 'ETH',
    },
    {
      name: 'Trust Wallet',
      img: '/trust.png',
      key: 'Trust Wallet',
      value: 'com.trustwallet.app',
      binding: 'ETH',
    },
    {
      name: 'Phantom',
      img: '/phantom.png',
      key: 'Phantom',
      value: 'app.phantom',
      binding: 'ETH',
    },
    { name: 'Ton', img: '/ton.webp', key: 'Ton', binding: 'Ton' },
    {
      name: 'WalletConnect',
      img: '/webAll.svg',
      key: 'WalletConnect',
      binding: 'ETH',
    },
  ];
  const allConnect = throttle(
    async function (i: any) {
      if (i.key === 'WalletConnect') {
        onConnect();
        setLoad(true);
        setIsModalOpen(false);
      } else if (i.key === 'Ton') {
        tonConnect();
      } else {
        //  判断浏览器是否安装了  evm链钱包
        const data = environment.filter(
          (item: any) =>
            item?.info?.name === i?.key || item?.info?.rdns === i?.value
        );
        if (data.length > 0) {
          //   判断是否是   phantom钱包  solana连接
          connectWallet(data[0]);
          setLoad(true);
          setIsModalOpen(false);
        } else {
          if (i?.key === 'Phantom' || i.value === 'app.phantom') {
            window.open(
              'https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?utm_source=ext_app_menu'
            );
          } else if (
            i?.key === 'Coinbase Wallet' ||
            i.value === 'com.coinbase.wallet'
          ) {
            window.open(
              'https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?utm_source=ext_app_menu'
            );
          } else if (
            i?.key === 'Trust Wallet' ||
            i.value === 'com.trustwallet.app'
          ) {
            window.open(
              'https://chromewebstore.google.com/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph?utm_source=ext_app_menu'
            );
          } else if (i?.key === 'OKX Wallet' || i.value === 'com.okex.wallet') {
            window.open(
              'https://chromewebstore.google.com/detail/%E6%AC%A7%E6%98%93-web3-%E9%92%B1%E5%8C%85/mcohilncbfahbmgdjkbpemcciiolgcge?hl=en-US&utm_source=ext_sidebar'
            );
          } else if (i?.key === 'MetaMask' || i.value === 'io.metamask') {
            window.open(
              'https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US&utm_source=ext_sidebar'
            );
          }
        }
      }
    },
    1500,
    { trailing: false }
  );
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
          {
            routerLocation.pathname === '/webx2024'?
            (
              newWallet.map((i: any) => {
                return (
                  (!changeBindind?.current ||
                    changeBindind?.current === i?.binding) && (
                    <button
                      key={i?.key}
                      onClick={() => allConnect(i)}
                      className={'walletButton'}
                    >
                      <img src={i?.img} loading={'lazy'} alt="" />
                      <span>{i.name}</span>
                    </button>
                  )
                );
              })
            ):(
              wallet.map((i: any) => {
                return (
                  (!changeBindind?.current ||
                    changeBindind?.current === i?.binding) && (
                    <button
                      key={i?.key}
                      onClick={() => allConnect(i)}
                      className={'walletButton'}
                    >
                      <img src={i?.img} loading={'lazy'} alt="" />
                      <span>{i.name}</span>
                    </button>
                  )
                );
              })
            )
          }
          {/* {wallet.map((i: any) => {
            return (
              (!changeBindind?.current ||
                changeBindind?.current === i?.binding) && (
                <button
                  key={i?.key}
                  onClick={() => allConnect(i)}
                  className={'walletButton'}
                >
                  <img src={i?.img} loading={'lazy'} alt="" />
                  <span>{i.name}</span>
                </button>
              )
            );
          })} */}
        </div>
      )}
    </Modal>
  );
}

export default HeaderModal;
