import Header from './components/header'
import Right from './components/right'
import {Route, Routes, useLocation, useNavigate,} from "react-router-dom";
import Index from './pages/index.tsx'
import './style/all.less'
import {createContext, useCallback, useEffect, useRef, useState} from 'react'
import {getAppMetadata, getSdkError} from "@walletconnect/utils";
import 'swiper/css';
import {notification} from 'antd'
import Bot from './components/bottom';
import {Web3Modal} from "@web3modal/standalone";
import cookie from 'js-cookie'
import * as encoding from "@walletconnect/encoding";
import {request} from '../utils/axios.ts';

import Client from "@walletconnect/sign-client";
// import jwt from "jsonwebtoken";
import {DEFAULT_APP_METADATA, DEFAULT_PROJECT_ID, getOptionalNamespaces, getRequiredNamespaces} from "../utils/default";
import _ from 'lodash'
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
    const [client, setClient] = useState<any>(null);
    const [session, setSession] = useState<any>(null);
    const prevRelayerValue = useRef<any>();
    const [headHeight, setHeadHeight] = useState('')
    const [botHeight, setBotHeight] = useState('')
    // s 是否登录
    const [loginSta, setLoginSta] = useState(false)
    // const [user, setUserPar] = useState<any>(null)
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
        const ethereum = (window as any).ethereum;
        if (ethereum === 'undefined') {
            notification.warning({
                message: `warning`,
                description: 'Please install MetaMask! And refresh',
                placement: 'topLeft',
                duration: 2
            });
        } else {
            setLoginSta(true)
        }
    }, 800)
    // const handleLogin = async () => {
    //     const ethereum = (window as any).ethereum;
    //     const {providers}  = ethers as any
    //     try {
    //         let provider: any;
    //         provider = new providers.Web3Provider(ethereum)
    //         // provider._isProvider   判断是否还有请求没有结束
    //         let account:any = await provider.send("eth_requestAccounts", []);
    //         // 连接的网络和链信息。
    //         var chain = await provider.getNetwork()
    //         // 获取签名
    //         var signer = await provider.getSigner();
    //         // 判断是否有账号
    //         if (account.length > 0) {
    //             // 判断是否是eth
    //             if (chain && chain.name === 'homestead' && chain.chainId === 1) {
    //                 try {
    //                     const token:any = await request('post', '/api/v1/token', {address: account[0]})
    //                     if (token && token?.data && token?.status === 200) {
    //                         // 签名消息
    //                         const message = token?.data?.nonce
    //                         const sign = await signer.signMessage(message)
    //                         // const sign = await window.ethereum.request({
    //                         //     method: "personal_sign",
    //                         //     params: [message, account[0]]
    //                         // });
    //                         // 验证签名
    //                         // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    //                         // const pa = router.query && router.query?.inviteCode ? router.query.inviteCode : cookie.get('inviteCode') || ''
    //                         const res = await request('post', '/api/v1/login', {
    //                             signature: sign,
    //                             addr: account[0],
    //                             message,
    //                             inviteCode: ''
    //                         })
    //                         if (res === 'please') {
    //                             setLogin()
    //                             // setLoginBol(false)
    //                         } else if (res && res.data && res.data?.accessToken) {
    //                             //   jwt  解析 token获取用户信息
    //                             const decodedToken:any = jwt.decode(res.data?.accessToken);
    //                             if (decodedToken && decodedToken?.address) {
    //                                 const data = await request('get', "/api/v1/userinfo/" + decodedToken?.uid, '', res.data?.accessToken)
    //                                 if (data === 'please') {
    //                                     setLogin()
    //                                     // setLoginBol(false)
    //                                 } else if (data && data?.status === 200) {
    //                                     const user = data?.data?.data
    //                                     setUserPar(user)
    //                                     cookie.set('username', JSON.stringify(data?.data?.data), {expires: 1})
    //                                     cookie.set('token', res.data?.accessToken, {expires: 1})
    //                                     cookie.set('name', account[0], {expires: 1})
    //                                     cookie.set('user', JSON.stringify(decodedToken), {expires: 1})
    //                                     // changeShowData(true)
    //                                     // setLoginBol(false)
    //                                 } else {
    //                                     // setLoginBol(false)
    //                                 }
    //                             }
    //                         }
    //                     } else {
    //                         // setLoginBol(false)
    //                     }
    //                 } catch (err) {
    //                     // setLoginBol(false)
    //                     return null
    //                 }
    //             } else {
    //                 // notification.warning({
    //                 //     description: 'Please select eth!',
    //                 //     placement: 'topLeft',
    //                 //     duration: 2
    //                 // });
    //             }
    //         } else {
    //             // notification.warning({
    //             //     description: 'Please log in or connect to your account!',
    //             //     placement: 'topLeft',
    //             //     duration: 2
    //             // });
    //         }
    //     } catch (err) {
    //         return null
    //     }
    // }

    // 登录
    const login = async (chainId: any, address: any, client: any, session: any, toName: any) => {
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
                // const decodedToken: any = jwt.decode(res.data?.accessToken);
                const decodedToken: any = ''
                if (decodedToken && decodedToken?.address) {
                    const data = await request('get', "/api/v1/userinfo/" + decodedToken?.uid, '', res.data?.accessToken)
                    if (data === 'please') {
                        await setLogin()
                    } else if (data && data?.status === 200) {
                        const user = data?.data?.data
                        cookie.set('username', JSON.stringify(user), {expires: 1})
                        cookie.set('token', res.data?.accessToken, {expires: 1})
                        cookie.set('name', address, {expires: 1})
                        cookie.set('user', JSON.stringify(decodedToken), {expires: 1})
                        web3Modal.closeModal();
                    } else {
                        return null
                    }
                }
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

    const getBlockchainActions = async (acount: any, client: any, session: any) => {
        try {
            const [namespace, reference, address] = acount[0].split(":");
            const chainId = `${namespace}:${reference}`;
            const token: any = await request('post', '/api/v1/token', {address: address})
            if (token && token?.data && token?.status === 200) {
                await login(chainId, address, client, session, token?.data?.nonce);
            } else {
                return null
            }
        } catch (e) {
            return null
        }
    };
    // 获取余额
    // const getAccountBalances = async (_accounts) => {
    //     try {
    //         const arr = await Promise.all(
    //             _accounts.map(async (account) => {
    //                 const [namespace, reference, address] = account.split(":");
    //                 const chainId = `${namespace}:${reference}`;
    //                 const assets = await apiGetAccountBalance(address, chainId);
    //                 return {account, assets: [assets]};
    //             })
    //         );
    //         const balances = {};
    //         arr.forEach(({account, assets}) => {
    //             balances[account] = assets;
    //         });
    //         setBalances(balances);
    //     } catch (e) {
    //         return null
    //     }
    // };

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
                const {uri, approval} = await client.connect({
                    requiredNamespaces,
                    optionalNamespaces,
                });
                if (uri) {
                    const standaloneChains = Object.values(requiredNamespaces)
                        .map((namespace: any) => namespace.chains)
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
    useEffect(()=>{
        if(loginSta){
            // handleLogin()
        }
    },[loginSta])

    const value: any = {connect, setLogin, onDisconnect, loginSta, getMoneyEnd, headHeight, botHeight,}
    return (
        <CountContext.Provider value={value}>
            <Header setHeadHeight={setHeadHeight}/>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 2%'}}>
                <Routes>
                    <Route path="/" element={<Index/>}/>
                </Routes>
                <Right/>
            </div>
            <Bot setBotHeight={setBotHeight}/>
        </CountContext.Provider>
    );
}

export default Layout;