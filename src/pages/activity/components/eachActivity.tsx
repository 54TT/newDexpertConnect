import { Modal, Table } from 'antd';
import { useLocation, useParams } from 'react-router-dom'
import { CountContext } from "../../../Layout.tsx";
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { throttle } from "lodash";
import TwitterRelease from "./twitterRelease.tsx";
import Revalidate from "./revalidate.tsx";
import cookie from "js-cookie";
import { LoadingOutlined } from '@ant-design/icons'
import Nodata from '../../../components/Nodata.tsx';
import { MessageAll } from "../../../components/message.ts";
import Request from "../../../components/axios.tsx";
import SpecialOrPass from '../components/specialOrPass.tsx';
import { simplify } from '../../../../utils/change.ts';
function EachActivity({ option, rankList, isRankList, data, getParams }: any) {
    const par = data.length > 0 ? data : data?.campaign ? [data] : []
    const { browser, languageChange, isLogin, setUserPar, user }: any = useContext(CountContext);
    const { getAll, } = Request()
    const router = useLocation()
    const params: any = useParams()
    const [loading, setLoading] = useState(false)
    const [isVerify, setIsVerify] = useState(false)
    const { t } = useTranslation();
    const [value, setValue] = useState('')
    const [link, setLink] = useState('')
    useEffect(() => {
        setLoading(false)
        setIsVerify(false)
    }, [data])
    const columns = [
        {
            title: t('Active.ra'),
            render: (_: null, record: any) => {
                return <span>{record?.rank}</span>
            }
        },
        {
            title: t('Active.us'),
            render: (_: any, record: any) => {
                return <span>{browser ? record?.userName : simplify(record?.userName)}</span>
            }
        },
        // {
        //     title: t('Active.tw'),
        //     render: (_: any, record: any) => {
        //         return <span>{record?.tweets}</span>
        //     }
        // },
        {
            title: t('Active.po'),
            render: (_: any, record: any) => {
                return <span>{record?.views || '0'}</span>
            }
        },
    ];
    const [selectActive, setSelectActive] = useState('')
    const [select, setSelect] = useState('')
    const [isModalOpen, setIsModalOpe] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const signIn = async (token: string, url: string) => {
        const res = await getAll({
            method: 'get',
            url: url,
            data: {},
            token
        })
        if (res?.status === 200 && res?.data?.url) {
            window.open(res?.data?.url)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }
    const follow = async (id: String) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: id === '2' ? 'post' : 'get',
                url: id === '1' ? '/api/v1/oauth/twitter/follow' : id === '2' ? '/api/v1/oauth/telegram/chat/follow' : id === '3' ? '/api/v1/oauth/discord/follow' : id === '5' ? '/api/v1/oauth/instagram/follow' : '',
                data: { taskId: id },
                token
            })
            if (res?.data?.url) {
                window.open(res?.data?.url)
                getParams()
            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }
    const changeImg = (id: string, title: string) => {
        if (title.includes('Twitter')) {
            return selectActive === id ? "/tuiActive.svg" : "/tui.svg"
        } else if (title.includes('Telegram')) {
            return selectActive === id ? "/telegramsActive.svg" : "/telegrams.svg"
        } else if (title.includes('Discord')) {
            return selectActive === id ? '/disActive.svg' : '/dis.svg'
        } else if (title.includes('Instagram')) {
            return selectActive === id ? '/instagramActive.svg' : '/instagram.svg'
        } else {
            return selectActive === id ? '/abc.png' : '/abcd.png'
        }
    }
    const verify = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post',
                url: id === '1' ? '/api/v1/oauth/twitter/verify' : id === '2' ? '/api/v1/oauth/telegram/chat/verify' : id === '3' ? '/api/v1/oauth/discord/verify' : "/api/v1/oauth/instagram/verify",
                data: { taskId: id },
                token
            })
            if (res?.status === 200 && res.data?.exist) {
                getParams()
            } else {
                if (res?.data?.url) {
                    setLink(res?.data?.url)
                    setIsModalOpe(true);
                }
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }

    const getT = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: id === '2' ? 'post' : 'get',
                url: id === '1' ? '/api/v1/oauth/twitter/link' : id === '2' ? '/api/v1/oauth/telegram/chat/link' : id === '3' ? '/api/v1/oauth/discord/link' : '/api/v1/oauth/instagram/link',
                data: { taskId: id },
                token
            })
            if (res?.data?.url) {
                window.open(res?.data?.url)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }
    const handleCancel = () => {
        setIsModalOpe(false);
    }

    const verifyJointActivities = async (token: string, taskId: string) => {
        const res = await getAll({
            method: 'post',
            url: '/api/v1/campaign/yuliverse/verify',
            data: { taskId },
            token
        })
        if (res?.status === 200) {
            getParams()
        } else {
            setLoading(false)
        }
    }
    const claimJointActivities = async (token: string, taskId: string) => {
        const res = await getAll({
            method: 'post',
            url: taskId==='11'?'/api/v1/campaign/yuliverse/claim':'/api/v1/campaign/yuliverse/golden-pass/claim',
            data: { taskId },
            token
        })
        if (res?.status === 200) {
            if(taskId==='11'){
                setUserPar({ ...user, rewardPointCnt: Number(user?.rewardPointCnt) + Number(res?.data?.score)})
            }
            getParams()
        } else {
            setLoading(false)
        }
    }


    const getLink = async (taskId: string, token: string) => {
        // 获取链接
        const res: any = await getAll({
            method: 'get',
            url: '/api/v1/airdrop/task/twitter/daily/intent',
            data: { taskId },
            token
        })
        if (res?.status === 200 && res?.data?.intent) {
            setLoading(false)
            setLink(res?.data?.intent)
            setIsModalOpe(true)
        } else {
            setLoading(false)
        }
    }

    const param = async (isCompleted: string, taskId: string) => {
        const token = cookie.get('token')
        if (token) {
            if (params?.id === '1') {
                if (option === 'daily') {
                    //   id为8的  是twitter
                    if (taskId !== '8') {
                        signIn(token, taskId === '6' ? '/api/v1/telegram/signInChannelLink' : '/api/v1/discord/signInChannelLink')
                    } else {
                        getLink(taskId, token)
                    }
                } else if (option === 'first') {
                    if (Number(isCompleted)) {
                        if (Number(isCompleted) === 1) {
                            follow(taskId)
                        }
                        if (Number(isCompleted) === 2) {
                            verify(taskId)
                        }
                    } else {
                        getT(taskId)
                    }
                }
            } else {
                if (option === 'daily') {
                    getLink(taskId, token)
                } else {
                    if (Number(isCompleted)) {
                        if (taskId==='11'||taskId==='15') {
                            claimJointActivities(token, taskId)
                        }
                    } else {
                        if (taskId==='11') {
                            verifyJointActivities(token, taskId)
                        }
                    }
                }
            }
        }
    }
    const change = (name: string) => {
        if (name.length > 0) {
            if (languageChange === 'zh_CN') {
                return name.slice(0, 2)
            } else {
                const data = name.split(' ')
                return data[0]
            }
        } else {
            return ''
        }
    }
    const operate = (isCompleted: string, title: string) => {
        if (option === 'daily') {
            return t('Market.start')
        } else if (option === 'first') {
            if (router.pathname === '/specialActive/1') {
                if (Number(isCompleted)) {
                    if (Number(isCompleted) === 1) {
                        return change(title)
                    } else if (Number(isCompleted) === 2) {
                        return t('Market.Claim')
                    } else {
                        return t('Market.Completed')
                    }
                } else {
                    return t('Market.Authorize')
                }
            } else {
               if (Number(isCompleted)) {
                    return t('Market.Claim')
                } else {
                    return t('Dpass.verify')
                }
            }
        }
    }
    const verification = async (id: string) => {
        const token = cookie.get('token')
        if (id && token) {
            const res: any = await getAll({
                method: 'post',
                url: router.pathname === '/specialActive/1' ? '/api/v1/airdrop/task/twitter/daily/verify' : '/api/v1/airdrop/task/twitter/daily/yuliverseVerify',
                data: { taskId: id, },
                token
            })
            if (res?.data?.message === 'success' && res?.status === 200) {
                getParams()
            } else if (res?.data?.code === '400') {
                setIsVerify(false)
                MessageAll('warning', res?.data?.message)
            }
        }
    }
    const openLink = () => {
        if (link) {
            window.open(link)
        }
    }
    const Confirm = async () => {
        const token = cookie.get('token')
        if (value && token && select) {
            setIsConfirm(true)
            const res: any = await getAll({
                method: 'post',
                url: '/api/v1/airdrop/task/twitter/daily/confirm',
                data: { taskId: select, url: value },
                token
            })
            if (res?.status === 200 && res?.data?.message === 'success') {
                setIsModalOpe(false)
                setIsConfirm(false)
            } else {
                setIsConfirm(false)
            }
        }
    }
    const showScore = (score: string, extra: any) => {
        if (params?.id === '1') {
            if (Number(score)) {
                return '+' + score
            } else {
                return score
            }
        } else {
            if (extra) {
                const par: any = extra?.split('|')
                if (par.length > 0) {
                    return '+' + par[1]
                } else {
                    return '+0'
                }
            } else {
                if (Number(score) || Number(score) === 0) {
                    return '+' + score
                } else {
                    return score
                }
            }
        }
    }

    const changeTitle = (title: string, extra: any) => {
        if (params?.id === '1') {
            return title
        } else {
            if (extra) {
                const aaa: any = extra?.split('|')
                if (aaa.length > 0) {
                    return aaa[0]
                } else {
                    return title
                }
            } else {
                return title
            }
        }
    }


    return <>
        {
            isLogin && <div className={'activeAll'} style={{ padding: browser ? '0 17%' : '0 5%' }}>
                {
                    option === 'ranking' ? <Table
                        columns={columns}
                        rowKey={(record: any) => record?.userName}
                        className={'activeTable'}
                        pagination={false}
                        dataSource={rankList}
                        loading={isRankList}
                        bordered
                    /> : option === 'daily' || option === 'first' ? <div className={'first'}>
                        {
                            par.length > 0 ? par.map((i: any) => {
                                let at: any = []
                                if (option === 'first') {
                                    at = i?.tasks
                                } else {
                                    at = i?.dailTasks
                                }
                                if (at.length > 0) {
                                    return at.map((it: any, index: number) => {
                                        return <div key={it?.taskId} className={'firstLine'}
                                            style={{
                                                background: selectActive === it?.taskId ? 'rgb(52,62,53)' : 'linear-gradient(to right, #020c02, rgb(38, 45, 38))',
                                                marginBottom: index === at.length - 1 ? '' : '35px',
                                                display: browser ? 'flex' : 'block'
                                            }}
                                            onClick={
                                                throttle(function () {
                                                    if (selectActive !== it?.taskId) {
                                                        setSelectActive(it?.taskId)
                                                    } else {
                                                        setSelectActive('')
                                                    }
                                                }, 1500, { 'trailing': false })}>
                                            <div className='left'>
                                                <img src={changeImg(it?.taskId, it?.title)} alt="" />
                                                <span
                                                    style={{ color: selectActive === it?.taskId ? 'rgb(134,240,151)' : 'white' }}>{changeTitle(it?.title, it?.extra)}</span>
                                            </div>
                                            <div className='right' style={{ marginTop: browser ? '0' : '10px' }}>
                                            <p className='point' style={{ color: selectActive === it?.taskId ? 'rgb(134,240,151)' : 'white' ,marginRight:'20px'}}>
                                                    {(it?.taskId !== '11' || (it?.taskId === '11' && it?.extra)) && showScore(it?.score, it?.extra)}
                                                </p>
                                                {
                                                    Number(it?.isCompleted) !== 3 ? <p onClick={
                                                        throttle(function () {
                                                            if (!isVerify && !loading) {
                                                                param(it?.isCompleted, it?.taskId)
                                                                cookie.set('taskId', it?.taskId)
                                                                setSelect(it?.taskId)
                                                                setLoading(true)
                                                            }
                                                        }, 1500, { 'trailing': false })} className={'start'}>
                                                        {loading && select === it?.taskId ?
                                                            <LoadingOutlined /> : operate(it?.isCompleted, it?.title)}</p> :
                                                        <div className={'success'}>
                                                            <img src={selectActive === it?.taskId ? '/succActive.svg' : '/succ.svg'} alt="" />
                                                        </div>
                                                }
                                                {
                                                    option === 'daily' && Number(it?.isCompleted) !== 3 &&
                                                    <p className={'verify'}
                                                        onClick={
                                                            throttle(function () {
                                                                if (!isVerify && !loading) {
                                                                    setIsVerify(true)
                                                                    if (!it?.title?.includes('Twitter') && router.pathname === '/specialActive/1') {
                                                                        getParams()
                                                                    } else {
                                                                        verification(it?.taskId)
                                                                    }
                                                                }
                                                            }, 1500, { 'trailing': false })}>{t('Dpass.verify')}{isVerify && selectActive === it?.taskId ? <LoadingOutlined /> : ''}</p>
                                                }
                                            </div>
                                        </div>
                                    })
                                } else {
                                    return <p style={{
                                        textAlign: 'center',
                                        marginTop: '20px',
                                        color: 'white'
                                    }}> {t('Market.no')}</p>
                                }
                            }) : <Nodata />
                        }
                    </div> : <SpecialOrPass option={option} data={par} />
                }
            </div>
        }

        <Modal centered style={{ width: browser ? '30%' : '90%' }}
            title={(select === '8' || select === '10') && option === 'daily' ? t('Dpass.how') : t('Dpass.plea')}
            className={'activeModal'} open={isModalOpen} maskClosable={false}
            footer={null} onCancel={handleCancel}>
            {
                (select === '8' || select === '10') && option === 'daily' ?
                    <TwitterRelease handleCancel={handleCancel} openLink={openLink} setValue={setValue}
                        Confirm={Confirm} isConfirm={isConfirm} /> :
                    <Revalidate openLink={openLink} select={select} />
            }
        </Modal>
    </>
}

export default EachActivity;