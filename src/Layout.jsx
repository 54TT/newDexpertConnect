import Header from './components/header'
import {Route, Routes, useLocation, useNavigate,} from "react-router-dom";
import Index from './pages/index.tsx'
import NewpairDetails from './pages/newpairDetails/index.tsx'
import './style/all.less'
import {createContext, useCallback, useEffect, useRef, useState} from 'react'
import {getAppMetadata, getSdkError} from "@walletconnect/utils";
import 'swiper/css';
import {notification} from 'antd'
import Bot from './components/bottom';
import {Web3Modal} from "@web3modal/standalone";
import cookie from 'js-cookie';
import * as encoding from "@walletconnect/encoding";
import {request} from '../utils/axios.ts';
import Client from "@walletconnect/sign-client";
import { ethers } from 'ethers';
import {DEFAULT_APP_METADATA, DEFAULT_PROJECT_ID, getOptionalNamespaces, getRequiredNamespaces} from "../utils/default";
import _ from 'lodash';
import Community from './pages/community.tsx';
const web3Modal = new Web3Modal({
    projectId: DEFAULT_PROJECT_ID,
    themeMode: "dark",
    walletConnectVersion: 1,
});
export const CountContext = createContext(null);

function Layout() {
    const router = useLocation()
    const history = useNavigate()
    const [chains, setChains] = useState([]);
    const [client, setClient] = useState(null);
    const [session, setSession] = useState(null);
    const prevRelayerValue = useRef();
    const [headHeight, setHeadHeight] = useState('')
    const [botHeight, setBotHeight] = useState('')
    const [user, setUserPar] = useState(null)
    const [load, setLoad] = useState(false)
    const createClient = async () => {
        try {
            const _client = await Client.init({
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
    const setLogin = async () => {
        if (router.pathname !== '/') {
            history('/')
        }
    }
    //  登录
    const getMoneyEnd = _.throttle(function () {
        if (typeof window.ethereum != 'undefined') {
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
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            // provider._isProvider   判断是否还有请求没有结束
            // 请求用户授权连接钱包
            await window.ethereum.request({method: 'eth_requestAccounts'});
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
                        const token = await request('post', '/api/v1/token', {address: account[0]})
                        if (token && token?.data && token?.status === 200) {
                            // 签名消息
                            const message = token?.data?.nonce
                            const sign = await signer.signMessage(message)
                            // const sign = await window.ethereum.request({
                            //     method: "personal_sign",
                            //     params: [message, account[0]]
                            // });
                            // 验证签名
                            // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
                            //  获取地址  参数
                            // const pa = router.query && router.query?.inviteCode ? router.query.inviteCode : cookie.get('inviteCode') || ''
                            const res = await request('post', '/api/v1/login', {
                                signature: sign,
                                addr: account[0],
                                message,
                                inviteCode: ''
                            })
                            if (res === 'please') {
                                setLogin()
                            } else if (res && res.data && res.data?.accessToken) {
                                //   jwt  解析 token获取用户信息
                               /*  const decodedToken = Jwt.decode(res.data?.accessToken); */
                                // if (decodedToken && decodedToken?.address) {
                                const data = await request('get', "/api/v1/userinfo/" + 1, '', res.data?.accessToken)
                                if (data === 'please') {
                                    setLogin()
                                } else if (data && data?.status === 200) {
                                    const user = data?.data?.data
                                    setUserPar(user)
                                    cookie.set('username', JSON.stringify(user), {expires: 1})
                                    cookie.set('token', res.data?.accessToken, {expires: 1})
                                }
                                // }
                            }
                        }
                    } catch (err) {
                        return null
                    }
                } else {
                    notification.warning({
                        description: 'Please select ETH!',
                        placement: 'topLeft',
                        duration: 2
                    });
                }
            } else {
                notification.warning({
                    description: 'Please log in or connect to your account!',
                    placement: 'topLeft',
                    duration: 2
                });
            }
            setLoad(false)
        } catch (err) {
            setLoad(false)
            return null
        }
    }
    // 登录
    const login = async (chainId, address, client, session, toName) => {
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
            // const pa = router.query && router.query?.inviteCode ? router.query.inviteCode : cookie.get('inviteCode') || ''
            const pa = ''
            const res = await request('post', '/api/v1/login', {
                signature: signature,
                addr: address,
                message: toName,
                inviteCode: pa
            })
            if (res === 'please') {
                await setLogin()
            } else if (res && res.data && res.data?.accessToken) {
                //   jwt  解析 token获取用户信息
                /* const decodedToken = Jwt.decode(res.data?.accessToken); */
/*                 const decodedToken = '' */
/*                 if (decodedToken && decodedToken?.address) { */
                    const data = await request('get', "/api/v1/userinfo/" + 1, '', res.data?.accessToken)
                    if (data === 'please') {
                        await setLogin()
                    } else if (data && data?.status === 200) {
                        const user = data?.data?.data
                        setUserPar(user)
                        cookie.set('username', JSON.stringify(user), {expires: 1})
                        cookie.set('token', res.data?.accessToken, {expires: 1})
                        web3Modal.closeModal();
                    } else {
                        return null
                    }
 /*                } */
            }
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

    const getBlockchainActions = async (acount, client, session) => {
        try {
            const [namespace, reference, address] = acount[0].split(":");
            const chainId = `${namespace}:${reference}`;
            const token = await request('post', '/api/v1/token', {address: address})
            if (token && token?.data && token?.status === 200) {
                await login(chainId, address, client, session, token?.data?.nonce);
            } else {
                return null
            }
        } catch (e) {
            return null
        }
    };
    // 钱包连接
    const onSessionConnected = useCallback(
        async (_session, name, client) => {
            try {
                const allNamespaceAccounts = Object.values(_session.namespaces).map((namespace) => namespace.accounts).flat();
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
                const {uri, approval} = await client.connect({
                    requiredNamespaces,
                    optionalNamespaces,
                });
                if (uri) {
                    const standaloneChains = Object.values(requiredNamespaces)
                        .map((namespace) => namespace.chains)
                        .flat()
                    await web3Modal.openModal({uri, standaloneChains});
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
    useEffect(() => {
        if (cookie.get('username') && cookie.get('username') != undefined) {
            const abc = JSON.parse(cookie.get('username'))
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
    const value = {connect, setLogin, onDisconnect, getMoneyEnd, headHeight, botHeight, user, setLoad, load}
    return (
        <CountContext.Provider value={value}>
            <Header setHeadHeight={setHeadHeight} />
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/newpairDetails" element={<NewpairDetails/>}/>
                <Route path='/community' element={<Community/>}/>
            </Routes>
            <Bot setBotHeight={setBotHeight}/>
        </CountContext.Provider>
    );
}

export default Layout;