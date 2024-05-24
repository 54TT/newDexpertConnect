import { Modal, Table } from 'antd'
import { useLocation } from 'react-router-dom'
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
import { simplify } from '../../../../utils/change.ts'
function EachActivity({ option, rankList, isRankList, data, getParams }: any) {
    const par = data.length > 0 ? data : data?.campaign ? [data] : []
    const { browser, languageChange, isLogin, setUserPar, user }: any = useContext(CountContext);
    const { getAll, } = Request()
    const router = useLocation()
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
    const [select, setSelect] = useState<any>(null)
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
    const follow = async (id: string, index: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: index.includes('Telegram') ? 'post' : 'get',
                url: index.includes('Twitter') ? '/api/v1/oauth/twitter/follow' : index.includes('Telegram') ? '/api/v1/oauth/telegram/chat/follow' : index.includes('Discord') ? '/api/v1/oauth/discord/follow' : '/api/v1/oauth/instagram/follow',
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
        if (selectActive === id) {
            if (title.includes('Twitter')) {
                return "/tuiActive.svg"
            } else if (title.includes('Telegram')) {
                return "/telegramsActive.svg"
            } else if (title.includes('Discord')) {
                return '/disActive.svg'
            } else if (title.includes('Instagram')) {
                return '/instagramActive.svg'
            } else {
                return '/abc.png'
            }
        } else {
            if (title.includes('Twitter')) {
                return "/tui.svg"
            } else if (title.includes('Telegram')) {
                return "/telegrams.svg"
            } else if (title.includes('Discord')) {
                return '/dis.svg'
            } else if (title.includes('Instagram')) {
                return '/instagram.svg'
            } else {
                return '/abcd.png'
            }
        }
    }
    const verify = async (id: string, index: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post',
                url: index.includes('Twitter') ? '/api/v1/oauth/twitter/verify' : index.includes('Telegram') ? '/api/v1/oauth/telegram/chat/verify' : index.includes('Discord') ? '/api/v1/oauth/discord/verify' : "/api/v1/oauth/instagram/verify",
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

    const getT = async (id: string, index: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: index.includes('Telegram') ? 'post' : 'get',
                url: index.includes('Twitter') ? '/api/v1/oauth/twitter/link' : index.includes('Telegram') ? '/api/v1/oauth/telegram/chat/link' : index.includes('Discord') ? '/api/v1/oauth/discord/link' : '/api/v1/oauth/instagram/link',
                data: { taskId: id },
                token
            })
            if (res?.data?.url) {
                window.open(res?.data?.url, '_self')
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
            url: '/api/v1/campaign/yuliverse/claim',
            data: { taskId },
            token
        })
        if (res?.status === 200) {
            setUserPar({ ...user, rewardPointCnt: Number(user?.rewardPointCnt) + Number(res?.data?.score) })
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

    const param = async (isCompleted: string, taskId: string, title: string) => {
        const token = cookie.get('token')
        if (token) {
            if (router.pathname === '/specialActive/1') {
                // yuliverseDailyTwitterTask
                if (option === 'daily') {
                    if (title.includes('Telegram')) {
                        signIn(token, '/api/v1/telegram/signInChannelLink')
                    } else if (title.includes('Discord')) {
                        signIn(token, '/api/v1/discord/signInChannelLink')
                    } else if (title.includes('Twitter')) {
                        getLink(taskId, token)
                    }
                } else if (option === 'first') {
                    if (Number(isCompleted)) {
                        if (Number(isCompleted) === 1) {
                            follow(taskId, title)
                        }
                        if (Number(isCompleted) === 2) {
                            verify(taskId, title)
                        }
                    } else {
                        getT(taskId, title)
                    }
                }
            } else {
                if (option === 'daily') {
                    getLink(taskId, token)
                } else {
                    if (Number(isCompleted)) {
                        if (data?.campaign?.title?.includes('Yuliverse')) {
                            claimJointActivities(token, taskId)
                        }
                    } else {
                        if (data?.campaign?.title?.includes('Yuliverse')) {
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
    const operate = (isCompleted: string, title: string,) => {
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
                if (Number(isCompleted) === 1) {
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
                url: '/api/v1/airdrop/task/twitter/daily/verify',
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
        if (value && token) {
            setIsConfirm(true)
            const res: any = await getAll({
                method: 'post',
                url: '/api/v1/airdrop/task/twitter/daily/confirm',
                data: { taskId: select?.taskId, url: value },
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
    const showScore = (score: string, id: string, extra: any) => {
        if (router.pathname === '/specialActive/1') {
            if (Number(score)) {
                return '+' + score
            } else {
                return score
            }
        } else {
            if (Number(id)) {
                const aaa: any = extra?.split('|')
                if (aaa.length > 0) {
                    return '+' + aaa[1]
                } else {
                    return '+0'
                }
            } else {
                return ''
            }
        }
    }

    const changeTitle = (title: string, extra: any) => {
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
                                                marginBottom: index === i?.tasks.length - 1 ? '' : '35px',
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
                                                <p className='point' style={{ color: selectActive === it?.taskId ? 'rgb(134,240,151)' : 'white' }}>
                                                    {showScore(it?.score, it?.isCompleted, it?.extra)}
                                                </p>
                                            </div>
                                            <div className='right' style={{ marginTop: browser ? '0' : '10px' }}>
                                                {
                                                    Number(it?.isCompleted) !== 3 ? <p onClick={
                                                        throttle(function () {
                                                            if (!isVerify && !loading) {
                                                                param(it?.isCompleted, it?.taskId, it?.title)
                                                                cookie.set('taskId', it?.taskId)
                                                                setSelect(it)
                                                                setLoading(true)
                                                            }
                                                        }, 1500, { 'trailing': false })} className={'start'}>
                                                        {loading && select?.title === it?.title ?
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
                                                                    verification(it?.taskId)
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

        <Modal centered
            title={select?.title?.includes('Twitter') && option === 'daily' ? t('Dpass.how') : t('Dpass.plea')}
            className={'activeModal'} open={isModalOpen} maskClosable={false}
            footer={null} onCancel={handleCancel}>
            {
                select?.title?.includes('Twitter') && option === 'daily' ?
                    <TwitterRelease handleCancel={handleCancel} openLink={openLink} setValue={setValue}
                        Confirm={Confirm} isConfirm={isConfirm} /> :
                    <Revalidate openLink={openLink} select={select?.title} />
            }
        </Modal>
    </>
}

export default EachActivity;