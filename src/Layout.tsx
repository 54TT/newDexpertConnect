import Header from './components/header.tsx'
import { Route, Routes, useLocation, useNavigate, } from "react-router-dom";
import Index from './pages/index/index.tsx'
import NewpairDetails from './pages/newpairDetails/index.tsx'
import './style/all.less'
import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { getAppMetadata, getSdkError } from "@walletconnect/utils";
import 'swiper/css';
import { notification } from 'antd'
import Bot from './components/bottom.tsx';
import { Web3Modal } from "@web3modal/standalone";
import cookie from 'js-cookie';
import * as encoding from "@walletconnect/encoding";
import { request } from '../utils/axios.ts';
import Client from "@walletconnect/sign-client";
import { ethers } from 'ethers';
import { DEFAULT_APP_METADATA, DEFAULT_PROJECT_ID, getOptionalNamespaces, getRequiredNamespaces } from "../utils/default";
import _ from 'lodash';
import Dapp from './pages/dapp';
import Community from './pages/community';

const web3Modal = new Web3Modal({
    projectId: DEFAULT_PROJECT_ID,
    themeMode: "dark",
    walletConnectVersion: 1,
});
export const CountContext = createContext(null);

function Layout() {
    const router = useLocation()
    const history = useNavigate()
    const [chains, setChains] = useState<any>([]);
    const [client, setClient] = useState<any>(null);
    const [session, setSession] = useState<any>(null);
    const prevRelayerValue = useRef<any>();
    const [user, setUserPar] = useState<any>(null)
    const [load, setLoad] = useState<boolean>(false)
    const [newPairPar, setNewPairPar] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState<number>(25);
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
        if (router.pathname !== '/') {
            history('/')
        }
        cookie.remove('username')
        cookie.remove('token')
        cookie.remove('jwt')
        setUserPar(null)
    }
    const login = async (sign: string, account: string, message: string, name: string) => {
        try {
            // const pa = router.query && router.query?.inviteCode ? router.query.inviteCode : cookie.get('inviteCode') || ''
            const res: any = await request('post', '/api/v1/login', {
                signature: sign,
                addr: account,
                message,
                inviteCode: ''
            })
            if (res === 'please') {
                clear()
            } else if (res && res.data && res.data?.accessToken) {
                //    解析 token获取用户信息
                const base64Url = res.data?.accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedToken = JSON.parse(atob(base64));
                if (decodedToken && decodedToken?.uid) {
                    const data: any = await request('get', "/api/v1/userinfo/" + decodedToken.uid, '', res.data?.accessToken)
                    if (data === 'please') {
                        clear()
                    } else if (data && data?.status === 200) {
                        const user = data?.data?.data
                        setUserPar(user)
                        cookie.set('username', JSON.stringify(user), { expires: 1 })
                        cookie.set('token', res.data?.accessToken, { expires: 1 })
                        cookie.set('jwt', JSON.stringify(decodedToken), { expires: 1 })
                        if (name === 'modal') {
                            web3Modal.closeModal();
                        }
                    }
                }
            }
        } catch (e) {
            return null
        }
    }
    //  登录
    const getMoneyEnd = _.throttle(function () {
        if (typeof (window as any).ethereum != 'undefined') {
            handleLogin()
        } else {
            notification.warning({
                message: `warning`,
                description: 'Please install MetaMask! And refresh',
                placement: 'topLeft',
                duration: 2
            });
        }
    }, 800)
    const handleLogin = async () => {
        try {
            const provider: any = new ethers.providers.Web3Provider((window as any).ethereum)
            // provider._isProvider   判断是否还有请求没有结束
            // 请求用户授权连接钱包
            await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const account = await provider.send("eth_requestAccounts", []);
            // 连接的网络和链信息。
            const chain = await provider.getNetwork();
            // 获取签名
            const signer = await provider.getSigner();
            // 判断是否有账号
            if (account.length > 0) {
                // 判断是否是eth
                if (chain && chain.name === 'homestead' && chain.chainId === 1) {
                    try {
                        const token: any = await request('post', '/api/v1/token', { address: account[0] })
                        if (token && token?.data && token?.status === 200) {
                            // 签名消息
                            const message = token?.data?.nonce
                            const sign = await signer.signMessage(message)
                            login(sign, account[0], message, 'more')
                        }
                    } catch (err) {
                        return null
                    }
                } else {
                    notification.warning({
                        description: 'Please select ETH!',
                        placement: 'topLeft',
                        duration: 2,
                        message: ''
                    });
                }
            } else {
                notification.warning({
                    description: 'Please log in or connect to your account!',
                    placement: 'topLeft',
                    duration: 2,
                    message: ''
                });
            }
            setLoad(false)
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
            const token: any = await request('post', '/api/v1/token', { address: address })
            if (token === 'please') {
                clear()
            } else if (token && token?.data && token?.status === 200) {
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
        []
    )
    const connect = useCallback(
        async () => {
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
        },
        [chains, client, onSessionConnected]
    );
    const [browser, setBrowser] = useState<any>(false)
    const [big, setBig] = useState<any>(false)
    useEffect(() => {
        if (cookie.get('username') && cookie.get('username') != undefined) {
            const abc = JSON.parse(cookie.get('username') as any)
            setUserPar(abc)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookie.get('username')]);
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

    useEffect(() => {
        if (window && window.innerWidth) {
            const wid = window.innerWidth
            const body = document.getElementsByTagName('body')[0]
            if (wid > 800) {
                body.style.overflow = 'hidden'
                setBrowser(true)
            }
        }
    }, []);
    useEffect(() => {
        const body = document.getElementsByTagName('body')[0]
        if (window && window?.innerWidth) {
            if (window?.innerWidth > 800) {
                body.style.overflow = 'hidden'
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
        const handleResize = () => {
            // 更新状态，保存当前窗口高度
            if (window?.innerWidth > 800) {
                body.style.overflow = 'hidden'
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
        };
        // 添加事件监听器
        window.addEventListener('resize', handleResize);
        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const value: any = {
        connect,
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
        page,
        setPage,
        setIsModalOpen
    }
    return (
        <CountContext.Provider value={value}>
            <Header />
            <div className={big ? 'bigCen' : ''}>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/newpairDetails" element={<NewpairDetails />} />
                    <Route path='/community/:tab' element={<Community />} />
                    <Route path='/dapp' element={<Dapp />} />
                </Routes>
            </div>
            <Bot />
        </CountContext.Provider>
    );
}

export default Layout;