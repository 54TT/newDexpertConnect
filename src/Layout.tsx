import Header, { I18N_Key } from './components/header/index.tsx';
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
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useTonConnectUI,
  useTonAddress,
  useTonConnectModal,
} from '@tonconnect/ui-react';
import 'swiper/css';
import 'swiper/css/bundle';
import cookie from 'js-cookie';
import Request from './components/axios.tsx';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import NotificationChange from './components/message';
import { useTranslation } from 'react-i18next';
import Loading from './components/allLoad/loading.tsx';
import { chain } from '../utils/judgeStablecoin.ts';
import { config } from './config/config.ts';
import { client as newClient } from '@/client.ts';
import { ethers } from 'ethers';
import Decimal from 'decimal.js';
const Dpass = React.lazy(() => import('./pages/dpass/index.tsx'));
const ActivePerson = React.lazy(
  () => import('./pages/activity/components/Person/index.tsx')
);
const NewpairDetails = React.lazy(
  () => import('./pages/newpairDetails/index.tsx')
);
import {
  useActiveWalletConnectionStatus,
  useActiveWallet,
  useAutoConnect,
  useDisconnect,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import Index from './pages/index/index.tsx';
import Webx2024 from './pages/webx2024/index.tsx';
const Dapp = React.lazy(() => import('./pages/dapps/index.tsx'));
const Dapps = React.lazy(() => import('./pages/dapps/index.tsx'));
// const Community = React.lazy(() => import('./pages/community/index.tsx'));
const Active = React.lazy(() => import('./pages/activity/index.tsx'));
const Oauth = React.lazy(() => import('./pages/activity/components/oauth.tsx'));
const SpecialActive = React.lazy(
  () => import('./pages/activity/components/specialDetail.tsx')
);
import { injectedProvider } from 'thirdweb/wallets';
export const CountContext = createContext(null);
Decimal.set({ toExpPos: 24, precision: 24 });
function Layout() {
  //    自动连接
  useAutoConnect({
    client: newClient,
  });
  const changeBindind = useRef<any>();
  const [provider, setProvider] = useState();
  const [contractConfig, setContractConfig] = useState();
  const [loginProvider, setloginProvider] = useState<any>(null);
  const [sniperChainId, setSniperChainId] = useState('1');
  const [chainId, setChainId] = useState('1'); // swap 链切换
  const [user, setUserPar] = useState<any>(null);
  const changeConfig = (chainId) => {
    const newConfig = config[chainId ?? '1'];
    setContractConfig(newConfig);
    const rpcProvider = new ethers.providers.JsonRpcProvider(newConfig.rpcUrl);
    //@ts-ignore
    setProvider(rpcProvider);
  };
  // 连接状态
  const useActiveWalletConnectionStatu = useActiveWalletConnectionStatus();
  // 连接的账号和监听账号
  const walletConnect = useActiveWallet();
  console.log(walletConnect);
  // 连接的chain
  const activeChain = useActiveWalletChain();
  // 切换链
  const useSwitchChain = useSwitchActiveWalletChain();
  // 退出连接
  const { disconnect: walletConnectDisconnect } = useDisconnect();
  // 获取 app 钱包的详情
  // const { data: walletInfo } = useWalletInfo(walletConnect?.id);
  const changeAll = async () => {
    const metamaskProvider = injectedProvider(walletConnect?.id);
    setloginProvider(metamaskProvider);
    changeConfig(activeChain?.id?.toString());
    setChainId(activeChain?.id?.toString());
  };
  useEffect(() => {
    // 判断  user是否存在，   在连接账号
    if (user?.uid && useActiveWalletConnectionStatu === 'connected') {
      changeAll();
    }
  }, [user, useActiveWalletConnectionStatu]);
  useEffect(() => {
    //  监听账户变更事件
    walletConnect?.subscribe('accountChanged', async (account) => {
      console.log(account);
      // const ttt = account.signMessage({message:"你好"})
      // console.log(ttt)
    });
    // 监听 chain变更事件
    walletConnect?.subscribe('chainChanged', (chain) => {
      // console.log(chain);
      try {
        useSwitchChain(chain);
      } catch (e) {
        return null;
      }
    });
  }, [walletConnect]);

  const { open: openTonConnect } = useTonConnectModal();
  const [tonWallet, setTonWallet] = useState<any>(null);
  const userFriendlyAddress = useTonAddress();
  useEffect(() => {
    if (userFriendlyAddress && tonWallet?.account) {
      tonConnect('login');
    }
  }, [userFriendlyAddress]);
  //ton钱包连接
  const tonConnect = async (log?: any) => {
    if (log) {
      const proof = tonWallet?.connectItems?.tonProof?.proof;
      const par = {
        payload: proof?.payload,
        value: proof?.domain.value,
        lengthBytes: proof?.domain.lengthBytes,
        stateInit: tonWallet?.account?.walletStateInit,
        signature: proof?.signature,
        address: userFriendlyAddress,
        timestamp: proof?.timestamp,
      };
      login(par, 'ton');
    } else {
      //  获取 授权的message
      const noce: any = await getAll({
        method: 'post',
        url: '/api/v1/token',
        data: { address: '' },
        token: '',
        chainId: '-2',
      });
      if (noce?.data?.nonce) {
        tonConnectUI.setConnectRequestParameters({
          state: 'ready',
          value: {
            tonProof: noce?.data?.nonce,
          },
        });
        openTonConnect();
        setIsModalOpen(false);
      }
    }
  };
  const [tonConnectUI] = useTonConnectUI();
  //  监听ton的 变化
  useEffect(() => {
    tonConnectUI.onStatusChange((wallet) => {
      if (wallet?.account && wallet?.connectItems) {
        setTonWallet(wallet);
      } else {
        setTonWallet(null);
      }
    });
    getUserNow();
  }, []);
  const router: any = useLocation();
  const [search] = useSearchParams();
  const { t } = useTranslation();
  const { getAll } = Request();
  const history = useNavigate();
  const [bindingAddress, setBindingAddress] = useState<any>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [load, setLoad] = useState<boolean>(false);
  const [newPairPar, setNewPairPar] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSet, setIsModalSet] = useState(false);
  const language = (localStorage.getItem('language') || 'en_US') as I18N_Key;
  const [languageChange, setLanguageChange] = useState(language);
  const [switchChain, setSwitchChain] = useState('Ethereum');
  const [browser, setBrowser] = useState<any>(false);
  const [big, setBig] = useState<any>(false);
  const [activityOptions, setActivityOptions] = useState('');
  const [transactionFee, setTransactionFee] = useState({
    swap: new Decimal(0),
  });
  // copy
  const [isCopy, setIsCopy] = useState(false);
  const clear = async () => {
    history('/logout');
    setloginProvider(null);
    walletConnectDisconnect(walletConnect);
    setChainId('1');
    cookie.remove('token');
    cookie.remove('currentAddress');
    changeBindind.current = '';
    cookie.remove('jwt');
    localStorage.clear();
    setContractConfig(null);
    if (tonConnectUI?.connected) {
      tonConnectUI.disconnect();
    }
    // @ts-ignore
    if (window?.ethereum?.isConnected?.()) {
      // @ts-ignore
      await window?.ethereum?.disconnect?.();
    }
    setTonWallet(null);
    setUserPar(null);
    setIsLogin(false);
    setBindingAddress(null);
  };
  const getUser = async (id: string, token: string, jwt: any) => {
    const data: any = await getAll({
      method: 'get',
      url: '/api/v1/userinfo/' + id,
      data: {},
      token,
      chainId,
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
      setLoad(false);
      setIsModalOpen(false);
    }
  };
  const login = async (par: any, chain: string) => {
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
            NotificationChange('success', t('person.bind'));
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
          setTonWallet(null);
          cookie.set('currentAddress', par?.address ? par?.address : par?.addr);
          if (decodedToken && decodedToken?.uid) {
            const uid = decodedToken.sub.split('-')[1];
            getUser(uid, res.data?.accessToken, decodedToken);
            localStorage.setItem('login-chain', chain === 'ton' ? '-2' : '1');
            setIsModalOpen(false);
          }
        } else {
          setTonWallet(null);
        }
      }
    } catch (e) {
      setTonWallet(null);
      return null;
    }
  };

  const getUserNow = () => {
    const jwt = cookie.get('jwt');
    const token = cookie.get('token');
    if (jwt && token) {
      const jwtPar = JSON.parse(jwt);
      if (jwtPar?.uid) {
        const uid = jwtPar.sub.split('-')[1];
        getUser(uid, token, jwtPar);
      }
    }
  };
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
    if (router.pathname === '/logout') {
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
  const clients = new ApolloClient({
    uri: chain[switchChain],
    cache: new InMemoryCache(),
  });
  const noHeaderRoutes = ['/webx2024'];
  const value: any = {
    tonConnect,
    clear,
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
    languageChange,
    setLanguageChange,
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
    provider,
    contractConfig,
    chainId,
    setChainId,
    transactionFee,
    setTransactionFee,
    loginProvider,
    sniperChainId,
    setSniperChainId,
    login,
  };
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
          <Header
            className={`${noHeaderRoutes.includes(router.pathname) ? 'hide-header' : ''}`}
          />
          <Routes>
            <Route path="/webx2024" element={<Webx2024 />} />
          </Routes>
          <div className={big ? 'bigCen' : ''} style={{ overflow: 'hidden' }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/logout" element={<Index />} />
              <Route path="/specialActive/:id" element={<SpecialActive />} />
              <Route path="/newpairDetails/:id" element={<NewpairDetails />} />
              {/* <Route path="/community/:tab" element={<Community />} /> */}
              <Route path="/app/:id" element={<Dapp />} />
              <Route path="/dapps/:id/*" element={<Dapps />} />
              <Route path="/activity" element={<Active />} />
              <Route path="/oauth/:id/callback" element={<Oauth />} />
              <Route path="/dpass/:id" element={<Dpass />} />
              <Route path="/activityPerson" element={<ActivePerson />} />
            </Routes>
          </div>
          <img src="/bodyLeft.png" alt="" className="bodyLeftImg" />
          <img src="/bodyRight.png" alt="" className="bodyRightImg" />
        </CountContext.Provider>
      </Suspense>
    </ApolloProvider>
  );
}

export default Layout;
