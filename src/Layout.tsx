import Header, { I18N_Key } from './components/header.tsx'
import { Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import './style/all.less';
import React, { createContext, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { getAppMetadata, getSdkError } from "@walletconnect/utils";
import 'swiper/css';
import 'swiper/css/bundle'
import { Web3Modal } from "@web3modal/standalone";
import cookie from 'js-cookie';
import * as encoding from "@walletconnect/encoding";
import Request from './components/axios.tsx';
import Client from "@walletconnect/sign-client";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { DEFAULT_APP_METADATA, DEFAULT_PROJECT_ID, getOptionalNamespaces, getRequiredNamespaces } from "../utils/default";
import _ from 'lodash';
import { MessageAll } from "./components/message.ts";
import { useTranslation } from "react-i18next";
import Loading from './components/allLoad/loading.tsx';
import { chain } from '../utils/judgeStablecoin.ts'
const Dpass = React.lazy(() => import('./pages/dpass/index.tsx'))
const ActivePerson = React.lazy(() => import('./pages/activity/components/person.tsx'))
const NewpairDetails = React.lazy(() => import('./pages/newpairDetails/index.tsx'))
const Index = React.lazy(() => import('./pages/index/index.tsx'))
const Dapp = React.lazy(() => import('./pages/dapp/index.tsx'))
const Community = React.lazy(() => import('./pages/community/index.tsx'))
const Active = React.lazy(() => import('./pages/activity/index.tsx'))
const Oauth = React.lazy(() => import('./pages/activity/components/oauth.tsx'))
const SpecialActive = React.lazy(() => import('./pages/activity/components/specialDetail.tsx'))
import TonConnect, { isWalletInfoCurrentlyEmbedded, toUserFriendlyAddress, WalletInfoCurrentlyEmbedded } from '@tonconnect/sdk';
const web3Modal = new Web3Modal({
    projectId: DEFAULT_PROJECT_ID,
    themeMode: "dark",
    walletConnectVersion: 1,
});
export const CountContext = createContext(null);
function Layout() {
    //ton钱包连接
    const connector: any = new TonConnect({ manifestUrl: 'https://sniper-bot-frontend-test.vercel.app/tonconnect-manifest.json', });
    const tonConnect = async () => {
        //  获取 授权的随机数
        const at = { method: 'post', url: '/api/v1/token', data: {}, token: '' }
        const token: any = await getAll(at)
        if (token) {
            const walletsList = await connector.getWallets();
            const embeddedWallet = walletsList.find(isWalletInfoCurrentlyEmbedded) as WalletInfoCurrentlyEmbedded;
            if (embeddedWallet) {
                connector.connect({ jsBridgeKey: embeddedWallet.jsBridgeKey }, { tonProof: '你好' });
            } else {
                const walletConnectionSource = {
                    universalLink: 'https://app.tonkeeper.com/ton-connect',
                    bridgeUrl: 'https://bridge.tonapi.io/bridge'
                }
                const universalLink = connector.connect(walletConnectionSource, { tonProof: '你好' });
                setQRCodeLink(universalLink)
            }
        }
    }
    const duan = async () => {
        if (connector.connected) {
            await connector.disconnect();
        }
    }
    //  监听ton的 变化
    useEffect(() => {
        connector.onStatusChange((wallet: any) => {
            if (wallet?.account) {
                const rawAddress = wallet.account.address;
                const tonProof = wallet.connectItems?.tonProof;
                // 地址
                const bouncableUserFriendlyAddress = toUserFriendlyAddress(rawAddress);
                login(tonProof?.proof?.signature, bouncableUserFriendlyAddress, 'message', 'more')
                setIsModalSet(false)
                setQRCodeLink('')
            }
        });
    }, [connector])
    const router: any = useLocation()
    const [search] = useSearchParams();
    const { t } = useTranslation();
    const { getAll, } = Request()
    const history = useNavigate()
    const [chains, setChains] = useState<any>([]);
    const [client, setClient] = useState<any>(null);
    const [session, setSession] = useState<any>(null);
    const prevRelayerValue = useRef<any>();
    const [user, setUserPar] = useState<any>(null)
    const [isLogin, setIsLogin] = useState(false)
    const [load, setLoad] = useState<boolean>(false)
    const [newPairPar, setNewPairPar] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSet, setIsModalSet] = useState(false);
    const language = (localStorage.getItem("language") || "en_US") as I18N_Key;
    const [languageChange, setLanguageChange] = useState(language);
    const [newAccount, setNewAccount] = useState('');
    const [switchChain, setSwitchChain] = useState('Ethereum');
    const [browser, setBrowser] = useState<any>(false)
    const [big, setBig] = useState<any>(false)
    const [activityOptions, setActivityOptions] = useState('')
    const [QRCodeLink, setQRCodeLink] = useState('')
    // copy
    const [isCopy, setIsCopy] = useState(false)
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
            return null
        }
    }
    const clear = async () => {
        history('/re-register')
        cookie.remove('token')
        cookie.remove('jwt')
        setUserPar(null)
        setIsLogin(false)
    }
    const getUser = async (id: string, token: string, name: string, jwt: any) => {
        const data: any = await getAll({
            method: 'get',
            url: "/api/v1/userinfo/" + id,
            data: '',
            token
        })
        if (data?.status === 200) {
            const user = data?.data?.data
            setUserPar(user)
            setIsLogin(true)
            cookie.set('token', token)
            if (jwt) {
                cookie.set('jwt', JSON.stringify(jwt))
            }
            if (user?.address === user?.username) {
                setIsModalSet(true)
                setIsModalOpen(true)
            }
            if (name === 'modal') {
                web3Modal.closeModal();
            }
            setLoad(false)
        }
    }
    const login = async (sign: string, account: string, message: string, name: string) => {
        try {
            const inviteCode = search.get('inviteCode') ? search.get('inviteCode') : cookie.get('inviteCode') || ''
            const res = await getAll({
                method: 'post', url: '/api/v1/login', data: {
                    signature: sign,
                    addr: account,
                    message,
                    inviteCode
                }, token: ''
            })
            if (res?.status === 200 && res?.data?.accessToken) {
                //    解析 token获取用户信息
                const base64Url = res.data?.accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedToken = JSON.parse(atob(base64));
                setNewAccount('')
                if (decodedToken && decodedToken?.uid) {
                    const uid = decodedToken.sub.split("-")[1];
                    getUser(uid, res.data?.accessToken, name, decodedToken);
                }
            }
        } catch (e) {
            return null
        }
    }
    //  登录
    const getMoneyEnd = _.throttle(function (i: any) {
        handleLogin(i)
    }, 800)
    const handleLogin = async (i: any) => {
        try {
            const account = await i?.provider?.request({ method: "eth_requestAccounts" })
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
                    const at = { method: 'post', url: '/api/v1/token', data: { address: account[0] }, token: '' }
                    const token: any = await getAll(at)
                    if (token?.data && token?.status === 200) {
                        // 签名消息
                        // const sign = await signer.signMessage(message)
                        const message = token?.data?.nonce
                        const sign = await i?.provider?.request({
                            method: "personal_sign",
                            params: [message, account[0]],
                        });
                        login(sign, account[0], message, 'more')
                    } else {
                        setLoad(false)
                    }
                } catch (err) {
                    setLoad(false)
                    return null
                }
            } else {
                MessageAll('warning', t('Market.log'))
                setLoad(false)
            }
        } catch (err) {
            setLoad(false)
            return null
        }
    }
    // 登录
    const loginMore = async (chainId: any, address: string, client: any, session: any, toName: string) => {
        try {
            const hexMsg = encoding.utf8ToHex(toName, true);
            const params = [hexMsg, address];
            const signature = await client.request({
                topic: session?.topic,
                chainId,
                request: {
                    method: "personal_sign",
                    params,
                },
            })
            login(signature, address, toName, 'modal')
        } catch (e) {
            return null
        }
    }
    const onDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            return null
        }
    }
    // 退出
    const reset = () => {
        setSession(undefined);
        setChains([]);
    };
    const disconnect = useCallback(async () => {
        await client.disconnect({
            topic: session.topic,
            reason: getSdkError("USER_DISCONNECTED"),
        });
        reset();
    }, [client, session]);
    const getBlockchainActions = async (acount: any, client: any, session: any) => {
        try {
            const [namespace, reference, address] = acount[0].split(":");
            const chainId = `${namespace}:${reference}`;
            const token: any = await getAll({ method: 'post', url: '/api/v1/token', data: { address: address }, token: '' })
            if (token && token?.data && token?.status === 200) {
                await loginMore(chainId, address, client, session, token?.data?.nonce);
            } else {
                return null
            }
        } catch (e) {
            return null
        }
    };
    // 钱包连接
    const onSessionConnected = useCallback(
        async (_session: any, name: any, client: any) => {
            try {
                const allNamespaceAccounts = Object.values(_session.namespaces).map((namespace: any) => namespace.accounts).flat();
                // await getAccountBalances(allNamespaceAccounts);   获取balance
                setSession(_session)
                if (name) {
                    await getBlockchainActions(allNamespaceAccounts, client, _session)
                }
            } catch (e) {
                return null
            }
        },
        [])
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
                    .flat()
                await web3Modal.openModal({ uri, standaloneChains });
            }
            const ab = await approval();
            await onSessionConnected(ab, 'yes', client);
        } catch (e) {
            return null
        } finally {
            web3Modal.closeModal();
        }
    }, [chains, client, onSessionConnected]);
    useEffect(() => {
        const jwt = cookie.get('jwt')
        const token = cookie.get('token')
        if (jwt && token) {
            const jwtPar = JSON.parse(jwt)
            setNewAccount('')
            if (jwtPar?.uid) {
                const uid = jwtPar.sub.split("-")[1];
                getUser(uid, token, '', jwtPar)
            }
        }
        // 监测钱包切换
        if ((window as any).ethereum) {
            (window as any).ethereum.on('accountsChanged', function (accounts: any) {
                setNewAccount(accounts[0])
            })
        }
        // 监测链切换
        // (window as any).ethereum.on('networkChanged', function (networkIDstring: any) {
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
        const body = document.getElementsByTagName('body')[0]
        if (window && window?.innerWidth) {
            if (window?.innerWidth > 800) {
                if (router.pathname === '/activity' || router.pathname === '/activityPerson' || router.pathname.includes('/Dpass/') || router.pathname.includes('/specialActive/')) {
                    body.style.overflow = 'auto'
                } else {
                    body.style.overflow = 'hidden'
                }
                setBrowser(true)
            } else {
                body.style.overflow = 'auto'
                setBrowser(false)
            }
            if (window?.innerWidth > 2000) {
                setBig(true)
            } else {
                setBig(false)
            }
        }
    }
    useEffect(() => {
        changeBody()
        const getI = search.get('inviteCode')
        if (getI) {
            cookie.set('inviteCode', getI)
        }
        const handleResize = () => {
            changeBody()
        };
        if (router.pathname === '/re-register') {
            setUserPar(null)
            setIsLogin(false)
        }
        // 添加事件监听器
        window.addEventListener('resize', handleResize);
        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [router]);
    const value: any = {
        connect, tonConnect,
        clear,
        onDisconnect,
        getMoneyEnd,
        user,
        setLoad,
        load,
        browser,
        newPairPar,
        setNewPairPar,
        isModalOpen,
        setIsModalOpen,
        isModalSet,
        setIsModalSet, QRCodeLink, setQRCodeLink,
        languageChange,
        setLanguageChange, connector,
        setUserPar, switchChain, setSwitchChain, isLogin, activityOptions, setActivityOptions, isCopy, setIsCopy
    }
    const clients = new ApolloClient({
        uri: chain[switchChain],
        cache: new InMemoryCache(),
    });
    return (
        <ApolloProvider client={clients}>
            <Suspense fallback={<div className='positionAbsolte'>
                <Loading browser={browser} />
            </div>}>
                <CountContext.Provider value={value}>
                    <Header />
                    <p onClick={duan} style={{ color: 'white', display: 'none' }}>断开</p>
                    <div className={big ? 'bigCen' : ''} style={{ marginTop: '50px' }}>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/re-register" element={<Index />} />
                            <Route path="/specialActive/:id" element={<SpecialActive />} />
                            <Route path="/newpairDetails/:id" element={<NewpairDetails />} />
                            <Route path='/community/:tab' element={<Community />} />
                            <Route path='/app/:id' element={<Dapp />} />
                            <Route path='/activity' element={<Active />} />
                            <Route path='/oauth/:id/callback' element={<Oauth />} />
                            <Route path='/dpass/:id' element={<Dpass />} />
                            <Route path='/activityPerson' element={<ActivePerson />} />
                        </Routes>
                    </div>
                </CountContext.Provider>
            </Suspense>
        </ApolloProvider>
    );
}

export default Layout;