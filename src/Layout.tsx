import Header, { I18N_Key } from './components/header.tsx';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import './style/all.less';
import React, {
  createContext,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getAppMetadata, getSdkError } from '@walletconnect/utils';
import 'swiper/css';
import 'swiper/css/bundle';
import { Web3Modal } from '@web3modal/standalone';
import cookie from 'js-cookie';
import * as encoding from '@walletconnect/encoding';
import Request from './components/axios.tsx';
import Client from '@walletconnect/sign-client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
  DEFAULT_APP_METADATA,
  DEFAULT_PROJECT_ID,
  getOptionalNamespaces,
  getRequiredNamespaces,
} from '../utils/default';
import _ from 'lodash';
import { MessageAll } from './components/message.ts';
import { useTranslation } from 'react-i18next';
import Loading from './components/allLoad/loading.tsx';
import { chain } from '../utils/judgeStablecoin.ts';
const Dpass = React.lazy(() => import('./pages/dpass/index.tsx'));
const ActivePerson = React.lazy(
  () => import('./pages/activity/components/person.tsx')
);
const NewpairDetails = React.lazy(
  () => import('./pages/newpairDetails/index.tsx')
);
const Index = React.lazy(() => import('./pages/index/index.tsx'));
const Dapp = React.lazy(() => import('./pages/dapp/index.tsx'));
const Community = React.lazy(() => import('./pages/community/index.tsx'));
const Active = React.lazy(() => import('./pages/activity/index.tsx'));
const Oauth = React.lazy(() => import('./pages/activity/components/oauth.tsx'));
const SpecialActive = React.lazy(
  () => import('./pages/activity/components/specialDetail.tsx')
);
import TonConnect, {
  toUserFriendlyAddress,
  WalletInfoCurrentlyEmbedded,
  isWalletInfoCurrentlyInjected,
} from '@tonconnect/sdk';
const web3Modal = new Web3Modal({
  projectId: DEFAULT_PROJECT_ID,
  themeMode: 'dark',
  walletConnectVersion: 1,
});
const connector: any = new TonConnect({
  manifestUrl:
    'https://sniper-bot-frontend-test.vercel.app/tonconnect-manifest.json',
});
export const CountContext = createContext(null);
function Layout() {
  const changeBindind = useRef<any>();
  const [QRCodeLink, setQRCodeLink] = useState('');
  const [tgCodeLink, setTGCodeLink] = useState('');
  //ton钱包连接
  const tonConnect = async () => {
    //  获取 授权的message
    const noce: any = await getNoce('', '-2');
    if (noce?.data?.nonce) {
      const walletsList = await connector.getWallets();
      const embeddedWallet = walletsList.find((value: any) =>
        isWalletInfoCurrentlyInjected(value)
      ) as WalletInfoCurrentlyEmbedded;
      if (embeddedWallet?.name) {
        connector.connect(
          { jsBridgeKey: embeddedWallet?.jsBridgeKey },
          { tonProof: noce?.data?.nonce }
        );
      } else {
        //   TG 链接
        const walletConnectionSource = {
          universalLink: 'https://t.me/wallet?attach=wallet',
          bridgeUrl: 'https://bridge.ton.space/bridge',
        };
        const walletConnectionSource1 = {
          universalLink: 'https://app.tonkeeper.com/ton-connect',
          bridgeUrl: 'https://bridge.tonapi.io/bridge',
        };
        const universalLink = connector.connect(walletConnectionSource, {
          tonProof: noce?.data?.nonce,
        });
        const universalLink1 = connector.connect(walletConnectionSource1, {
          tonProof: noce?.data?.nonce,
        });
        setTGCodeLink(universalLink);
        setQRCodeLink(universalLink1);
      }
    }
  };
  //  监听ton的 变化
  useEffect(() => {
    window.addEventListener('ton-connect-connection-error', () => {
      setLoad(false);
      setIsModalOpen(false);
    });
    connector.onStatusChange((wallet: any) => {
      if (wallet?.account) {
        setIsModalOpen(false);
        const rawAddress = wallet.account.address;
        const tonProof = wallet.connectItems?.tonProof;
        // 地址
        const bouncableUserFriendlyAddress = toUserFriendlyAddress(rawAddress);
        const par = {
          payload: tonProof?.proof?.payload,
          value: tonProof?.proof?.domain.value,
          lengthBytes: tonProof?.proof?.domain.lengthBytes,
          stateInit: wallet.account.walletStateInit,
          signature: tonProof?.proof?.signature,
          address: bouncableUserFriendlyAddress,
          timestamp: tonProof?.proof?.timestamp,
        };
        login(par, 'ton', '');
        connector.pauseConnection();
        setIsModalSet(false);
        setQRCodeLink('');
        setTGCodeLink('');
      } else {
        setQRCodeLink('');
        setTGCodeLink('');
        setLoad(false);
        setIsModalOpen(false);
      }
    });
  }, [connector]);
  const router: any = useLocation();
  const [search] = useSearchParams();
  const { t } = useTranslation();
  const { getAll } = Request();
  const history = useNavigate();
  const [chains, setChains] = useState<any>([]);
  const [client, setClient] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const prevRelayerValue = useRef<any>();
  const [user, setUserPar] = useState<any>(null);
  const [bindingAddress, setBindingAddress] = useState<any>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [load, setLoad] = useState<boolean>(false);
  const [newPairPar, setNewPairPar] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSet, setIsModalSet] = useState(false);
  const language = (localStorage.getItem('language') || 'en_US') as I18N_Key;
  const [languageChange, setLanguageChange] = useState(language);
  const [newAccount, setNewAccount] = useState('');
  const [switchChain, setSwitchChain] = useState('Ethereum');
  const [browser, setBrowser] = useState<any>(false);
  const [big, setBig] = useState<any>(false);
  const [activityOptions, setActivityOptions] = useState('');
  // copy
  const [isCopy, setIsCopy] = useState(false);
  useEffect(() => {
    if (newAccount && user?.address) {
      if (newAccount !== user?.address) {
        // handleLogin()
      }
    }
  }, [newAccount]);
  const createClient = async () => {
    try {
      const _client: any = await Client.init({
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: DEFAULT_PROJECT_ID,
        metadata: {
          ...(getAppMetadata() || DEFAULT_APP_METADATA),
          url: getAppMetadata().url,
        },
      });
      setClient(_client);
    } catch (err) {
      return null;
    }
  };
  const clear = async () => {
    history('/re-register');
    cookie.remove('token');
    cookie.remove('currentAddress');
    changeBindind.current = '';
    cookie.remove('jwt');
    if (connector?.connected) {
      await connector.disconnect();
    }
    setUserPar(null);
    setIsLogin(false);
    setBindingAddress(null);
  };
  const getUser = async (id: string, token: string, name: string, jwt: any) => {
    const data: any = await getAll({
      method: 'get',
      url: '/api/v1/userinfo/' + id,
      data: {},
      token,
    });
    if (data?.status === 200) {
      const user = data?.data?.data;
      const wallet = data?.data?.userWallets;
      setBindingAddress(wallet);
      setUserPar(user);
      setIsLogin(true);
      cookie.set('token', token);
      if (jwt) {
        cookie.set('jwt', JSON.stringify(jwt));
      }
      if (user?.address === user?.username) {
        setIsModalSet(true);
        setIsModalOpen(true);
      }
      if (name === 'modal') {
        web3Modal.closeModal();
      }
      setLoad(false);
    }
  };

  const login = async (par: any, chain: string, name: string) => {
    try {
      const inviteCode = search.get('inviteCode')
        ? search.get('inviteCode')
        : cookie.get('inviteCode') || '';
      // 绑定新钱包
      if (
        changeBindind?.current?.toLocaleLowerCase() ===
        chain.toLocaleLowerCase()
      ) {
        const token = cookie.get('token');
        const data = bindingAddress.filter(
          (res: any) =>
            res?.chainName?.toLocaleLowerCase() === chain.toLocaleLowerCase()
        );
        if (token) {
          const at: any = chain === 'ton' ? { ton: par } : { eth: par };
          const bind = await getAll({
            method: 'post',
            url:
              data.length > 0 ? '/api/v1/wallet/switch' : '/api/v1/wallet/bind',
            data: {
              chainName: chain,
              ...at,
            },
            token: token,
            chainId: chain === 'ton' ? '-2' : '1',
          });
          if (bind?.status === 200) {
            getUserNow();
            MessageAll('success', t('person.bind'));
          }
        }
      } else {
        // 登录
        const res = await getAll({
          method: 'post',
          url: chain === 'ton' ? '/api/v1/ton/login' : '/api/v1/login',
          data: {
            ...par,
            inviteCode,
          },
          token: '',
          chainId: chain === 'ton' ? '-2' : '1',
        });
        if (res?.status === 200 && res?.data?.accessToken) {
          //    解析 token获取用户信息
          const base64Url = res.data?.accessToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decodedToken = JSON.parse(atob(base64));
          setNewAccount('');
          cookie.set('currentAddress', par?.address ? par?.address : par?.addr);
          if (decodedToken && decodedToken?.uid) {
            const uid = decodedToken.sub.split('-')[1];
            getUser(uid, res.data?.accessToken, name, decodedToken);
          }
        }
      }
    } catch (e) {
      return null;
    }
  };
  const handleLogin = async (i: any) => {
    try {
      const account = await i?.provider?.request({
        method: 'eth_requestAccounts',
      });
      // const provider: any = new ethers.providers.Web3Provider((window as any).ethereum)
      // // provider._isProvider   判断是否还有请求没有结束
      // // 请求用户授权连接钱包
      // await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      // const account = await provider.send("eth_requestAccounts", []);
      // 连接的网络和链信息。
      // const chain = await provider.getNetwork();
      // 获取签名
      // const signer = await provider.getSigner();
      // 判断是否有账号
      if (account.length > 0) {
        // 判断是否是eth
        // if (chain && chain.name === 'homestead' && chain.chainId === 1) {
        try {
          const token: any = await getNoce(account[0]);
          if (token?.data && token?.status === 200) {
            // 签名消息
            // const sign = await signer.signMessage(message)
            const message = token?.data?.nonce;
            const sign = await i?.provider?.request({
              method: 'personal_sign',
              params: [message, account[0]],
            });
            const data = { signature: sign, addr: account[0], message };
            login(data, 'eth', 'more');
          } else {
            setLoad(false);
          }
        } catch (err) {
          setLoad(false);
          return null;
        }
      } else {
        MessageAll('warning', t('Market.log'));
        setLoad(false);
      }
    } catch (err) {
      setLoad(false);
      return null;
    }
  };
  // 登录
  const loginMore = async (
    chainId: any,
    address: string,
    client: any,
    session: any,
    toName: string
  ) => {
    try {
      const hexMsg = encoding.utf8ToHex(toName, true);
      const params = [hexMsg, address];
      const signature = await client.request({
        topic: session?.topic,
        chainId,
        request: {
          method: 'personal_sign',
          params,
        },
      });
      const data = { signature, addr: address, message: toName };
      login(data, 'eth', 'modal');
    } catch (e) {
      return null;
    }
  };
  const onDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      return null;
    }
  };
  // 退出
  const reset = () => {
    setSession(undefined);
    setChains([]);
  };
  const disconnect = useCallback(async () => {
    await client.disconnect({
      topic: session.topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });
    reset();
  }, [client, session]);
  const getNoce = async (address: string, chainId?: any) => {
    const noce: any = await getAll({
      method: 'post',
      url: '/api/v1/token',
      data: { address },
      token: '',
      chainId,
    });
    return noce;
  };
  const getBlockchainActions = async (
    acount: any,
    client: any,
    session: any
  ) => {
    try {
      const [namespace, reference, address] = acount[0].split(':');
      const chainId = `${namespace}:${reference}`;
      const token: any = await getNoce(address);
      if (token && token?.data && token?.status === 200) {
        await loginMore(chainId, address, client, session, token?.data?.nonce);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  };
  // 钱包连接
  const onSessionConnected = useCallback(
    async (_session: any, name: any, client: any) => {
      try {
        const allNamespaceAccounts = Object.values(_session.namespaces)
          .map((namespace: any) => namespace.accounts)
          .flat();
        // await getAccountBalances(allNamespaceAccounts);   获取balance
        setSession(_session);
        if (name) {
          await getBlockchainActions(allNamespaceAccounts, client, _session);
        }
      } catch (e) {
        return null;
      }
    },
    []
  );
  const connect = useCallback(async () => {
    try {
      const requiredNamespaces = getRequiredNamespaces(['eip155:1']);
      const optionalNamespaces = getOptionalNamespaces(['eip155:1']);
      const { uri, approval } = await client.connect({
        requiredNamespaces,
        optionalNamespaces,
      });
      if (uri) {
        const standaloneChains = Object.values(requiredNamespaces)
          .map((namespace) => namespace.chains)
          .flat();
        await web3Modal.openModal({ uri, standaloneChains });
      }
      const ab = await approval();
      await onSessionConnected(ab, 'yes', client);
    } catch (e) {
      return null;
    } finally {
      web3Modal.closeModal();
    }
  }, [chains, client, onSessionConnected]);
  const getUserNow = () => {
    const jwt = cookie.get('jwt');
    const token = cookie.get('token');
    if (jwt && token) {
      const jwtPar = JSON.parse(jwt);
      setNewAccount('');
      if (jwtPar?.uid) {
        const uid = jwtPar.sub.split('-')[1];
        getUser(uid, token, '', jwtPar);
      }
    }
  };
  useEffect(() => {
    getUserNow();
    // 监测钱包切换
    // if ((window as any).ethereum) {
    //     (window as any).ethereum.on('accountsChanged', function (accounts: any) {
    //         console.log(accounts)
    //         // setNewAccount(accounts[0])
    //     })
    // }
    // // 监测链切换
    // (window as any).ethereum.on('networkChanged', function (networkIDstring: any) {
    //         console.log(networkIDstring)
    // })
  }, []);
  useEffect(() => {
    if (!client) {
      createClient();
    } else if (
      prevRelayerValue.current &&
      prevRelayerValue.current !== 'wss://relay.walletconnect.com'
    ) {
      client.core.relayer.restartTransport('wss://relay.walletconnect.com');
      prevRelayerValue.current = 'wss://relay.walletconnect.com';
    }
  }, [createClient, client]);
  const changeBody = () => {
    const body = document.getElementsByTagName('body')[0];
    if (window && window?.innerWidth) {
      if (window?.innerWidth > 800) {
        if (
          router.pathname === '/activity' ||
          router.pathname === '/activityPerson' ||
          router.pathname.includes('/Dpass/') ||
          router.pathname.includes('/specialActive/')
        ) {
          body.style.overflow = 'auto';
        } else {
          body.style.overflow = 'hidden';
        }
        setBrowser(true);
      } else {
        body.style.overflow = 'auto';
        setBrowser(false);
      }
      if (window?.innerWidth > 2000) {
        setBig(true);
      } else {
        setBig(false);
      }
    }
  };
  useEffect(() => {
    changeBody();
    const getI = search.get('inviteCode');
    if (getI) {
      cookie.set('inviteCode', getI);
    }
    const handleResize = () => {
      changeBody();
    };
    if (router.pathname === '/re-register') {
      setUserPar(null);
      setBindingAddress(null);
      setIsLogin(false);
    }

    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    // 在组件卸载时移除事件监听器

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [router]);
  const value: any = {
    connect,
    tonConnect,
    clear,
    onDisconnect,
    handleLogin,
    user,
    setLoad,
    load,
    browser,
    newPairPar,
    setNewPairPar,
    isModalOpen,
    setIsModalOpen,
    changeBindind,
    isModalSet,
    setIsModalSet,
    QRCodeLink,tgCodeLink,setTGCodeLink,
    setQRCodeLink,
    languageChange,
    setLanguageChange,
    connector,
    setBindingAddress,
    bindingAddress,
    setUserPar,
    switchChain,
    setSwitchChain,
    isLogin,
    activityOptions,
    setActivityOptions,
    isCopy,
    setIsCopy,
  };

  const clients = new ApolloClient({
    uri: chain[switchChain],
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={clients}>
      <Suspense
        fallback={
          <div className="positionAbsolte">
            <Loading browser={browser} />
          </div>
        }
      >
        <CountContext.Provider value={value}>
          <Header />
          <div className={big ? 'bigCen' : ''} style={{ marginTop: '50px' }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/re-register" element={<Index />} />
              <Route path="/specialActive/:id" element={<SpecialActive />} />
              <Route path="/newpairDetails/:id" element={<NewpairDetails />} />
              <Route path="/community/:tab" element={<Community />} />
              <Route path="/app/:id" element={<Dapp />} />
              <Route path="/activity" element={<Active />} />
              <Route path="/oauth/:id/callback" element={<Oauth />} />
              <Route path="/dpass/:id" element={<Dpass />} />
              <Route path="/activityPerson" element={<ActivePerson />} />
            </Routes>
          </div>
          <img
            src="/bodyLeft.png"
            alt=""
            style={{ position: 'fixed', top: '0', left: '0', zIndex: '-1' }}
          />
          <img
            src="/bodyRight.png"
            alt=""
            style={{ position: 'fixed', bottom: '0', right: '0', zIndex: '-1' }}
          />
        </CountContext.Provider>
      </Suspense>
    </ApolloProvider>
  );
}

export default Layout;
