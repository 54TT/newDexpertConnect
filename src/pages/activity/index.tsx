import './index.less';
import {useContext, useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectCoverflow, Navigation, Pagination,} from "swiper/modules";
import {throttle} from "lodash";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import Request from "../../components/axios.tsx";
import cookie from "js-cookie";
import {Modal, Statistic, Table} from 'antd';
import Loading from '../../components/loading.tsx'
import {LoadingOutlined} from '@ant-design/icons'
import {CountContext} from "../../Layout.tsx";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {MessageAll} from '../../components/message.ts'
import {useNavigate} from "react-router-dom";
import {simplify} from '../../../utils/change.ts';
import TwitterRelease from './components/twitterRelease.tsx'
import Revalidate from './components/revalidate.tsx'

const {Countdown} = Statistic;

function Index() {
    const {getAll,} = Request()
    const {t} = useTranslation();
    const {
        setIsModalOpen,
        browser,
        languageChange,
        isLogin,
        changeLan,
        setChangeLan, setUserPar,
        setIsLogin, user
    }: any = useContext(CountContext);
    const history = useNavigate()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [time, setTime] = useState<any>(null)
    const [enData, setEnData] = useState<any>([])
    const [zhData, setZhData] = useState<any>([])
    const [point, setPoint] = useState('0')
    const [todayPoint, setTodayPoint] = useState('0')
    const [isModalOpen, setIsModalOpe] = useState(false);
    const [link, setLink] = useState('');
    const [load, setLoad] = useState(false)
    const [option, setOption] = useState(1)
    const [show, setShow] = useState(false)
    const [selectActive, setSelectActive] = useState('')
    const [select, setSelect] = useState<any>(null)
    const [dPassCount, setDPassCount] = useState('')
    const [isDPassCount, setIsDPassCount] = useState(false)
    const [rankList, setRankList] = useState<any>([])
    const [isRankList, setIsRankList] = useState(true)
    const [value, setValue] = useState('')

    const getParams = async () => {
        const token = cookie.get('token')
        const res = await getAll({
            method: 'post', url: '/api/v1/campaign/home', data: {token: token || ''}, token: token || ''
        })
        if (res?.status === 200) {
            if (languageChange === 'zh_CN') {
                setData(res?.data?.campaignHomeCN)
            } else {
                setData(res?.data?.campaignHome)
            }
            const date = countdownNow(res?.data?.campaignHome[0]?.campaign?.startTime, res?.data?.campaignHome[0]?.campaign?.endTime)
            setTime(date)
            setZhData(res?.data?.campaignHomeCN)
            setEnData(res?.data?.campaignHome)
            setPoint(res?.data?.totalPoint)
            setTodayPoint(res?.data?.todayPoint)
            if (user) {
                setUserPar({...user, rewardPointCnt: res?.data?.totalPoint})
            }
            setLoad(true)
        } else {
            setLoad(true)
        }
    }
    const getRank = async () => {
        const token = cookie.get('token')
        const res = await getAll({
            method: 'get', url: '/api/v1/reward_point/rank', data: {}, token: token || ''
        })
        if (res?.status === 200) {
            setRankList(res?.data?.list)
            setIsRankList(false)
        } else {
            setIsRankList(false)
        }
    }
    const getDpass = async () => {
        const token = cookie.get('token')
        const res = await getAll({
            method: 'get', url: '/api/v1/d_pass', data: {}, token: token || ''
        })
        if (res?.status === 200) {
            setIsDPassCount(true)
            setDPassCount(res?.data?.dPassCount)
        }
    }
    // 是否登录
    useEffect(() => {
        if (isLogin) {
            getParams()
            setIsLogin(false)
            setShow(true)
        }
    }, [isLogin]);
    const getT = async (id: string, index: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: index.includes('Telegram') ? 'post' : 'get',
                url: index.includes('Twitter') ? '/api/v1/oauth/twitter/link' : index.includes('Telegram') ? '/api/v1/oauth/telegram/chat/link' : index.includes('Discord') ? '/api/v1/oauth/discord/link' : '/api/v1/oauth/instagram/link',
                data: {taskId: id},
                token
            })
            if (res?.data?.url) {
                window.open(res?.data?.url, '_self')
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        const token = cookie.get('token')
        if (token) {
            setShow(true)
        }
        getParams()
    }, []);
    useEffect(() => {
        if (show) {
            // getTodayPoint()
            getDpass()
        }
    }, [show]);

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

    const follow = async (id: string, index: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: index.includes('Telegram') ? 'post' : 'get',
                url: index.includes('Twitter') ? '/api/v1/oauth/twitter/follow' : index.includes('Telegram') ? '/api/v1/oauth/telegram/chat/follow' : index.includes('Discord') ? '/api/v1/oauth/discord/follow' : '/api/v1/oauth/instagram/follow',
                data: {taskId: id},
                token
            })
            if (res?.data?.url) {
                window.open(res?.data?.url)
                getParams()
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
    }
    const verify = async (id: string, index: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post',
                url: index.includes('Twitter') ? '/api/v1/oauth/twitter/verify' : index.includes('Telegram') ? '/api/v1/oauth/telegram/chat/verify' : index.includes('Discord') ? '/api/v1/oauth/discord/verify' : "/api/v1/oauth/instagram/verify",
                data: {taskId: id},
                token
            })
            if (res?.status === 200 && res.data?.exist) {
                setLoading(false)
                getParams()
            } else {
                if (res?.data?.url) {
                    setLink(res?.data?.url)
                    setIsModalOpe(true);
                }
                setLoading(false)
            }
        }
    }
    const operate = (isCompleted: string, title: string) => {
        if (option === 1) {
            return t('Market.start')
        } else {

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
        }
    }
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
        }
    }

    const param = async (isCompleted: string, taskId: string, title: string) => {
        const token = cookie.get('token')
        if (token) {
            if (option === 1) {
                if (title.includes('Telegram')) {
                    signIn(token, '/api/v1/telegram/signInChannelLink')

                } else if (title.includes('Discord')) {
                    signIn(token, '/api/v1/discord/signInChannelLink')
                } else if (title.includes('Twitter')) {
                    // 获取链接
                    const res: any = await getAll({
                        method: 'get',
                        url: '/api/v1/airdrop/task/twitter/daily/intent',
                        data: {taskId: taskId},
                        token
                    })
                    if (res?.status === 200 && res?.data?.intent) {
                        setLoading(false)
                        setLink(res?.data?.intent)
                        setIsModalOpe(true)
                    }
                }
            } else if (option === 2) {
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
        }
    }
    const handleCancel = () => {
        setIsModalOpe(false);
    }
    const openLink = () => {
        if (link) {
            window.open(link)
        }
    }

    const countdownNow = (t1: string, t2: string) => {
        if (t1 && t2) {
            // 判断有几个月
            const abc = dayjs(t2).diff(dayjs(), 'month')
            //  是否过了今天
            const at = dayjs(t2).isAfter(dayjs())
            if (at) {
                if (abc) {
                    if (languageChange === 'zh_CN') {
                        return t1 + '——' + t2
                    } else {
                        return t1.slice(8, 10) + '/' + t1.slice(5, 7) + '/' + t1.slice(0, 4) + '——' + t2.slice(8, 10) + '/' + t2.slice(5, 7) + '/' + t2.slice(0, 4)
                    }
                } else {
                    const date = dayjs(t2).diff(dayjs())
                    return Date.now() + Number(date)
                }
            } else {
                return '00:00:00 00:00:00'
            }
        } else {
            return '00:00:00 00:00:00'
        }
    }
    useEffect(() => {
        if (changeLan) {
            if (languageChange === 'zh_CN') {
                setData([...zhData])
                setChangeLan(false)
            } else {
                setData([...enData])
                setChangeLan(false)
            }
        }
    }, [changeLan]);
    const columns = [
        {
            title: t('Active.ra'),
            render: () => {
                return <span>UNRANKED</span>
            }
        },
        {
            title: t('Active.us'),
            render: (_: any, record: any) => {
                return <span>{record?.user?.username ? simplify(record?.user?.username) : simplify(record?.user?.address)}</span>
            }
        },
        {
            title: t('Active.po'),
            render: (_: any, record: any) => {
                return <span>{record?.score || '0'}</span>
            }
        },
    ];
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
            }
        }
    }
    const Confirm = async () => {
        const token = cookie.get('token')
        if (value && token) {
            const res: any = await getAll({
                method: 'post',
                url: '/api/v1/airdrop/task/twitter/daily/confirm',
                data: {taskId: select?.taskId, url: value},
                token
            })
            if (res?.status === 200 && res?.data?.message === 'success') {
                setIsModalOpe(false)
            }
        }
    }
    const verification = async (id: string) => {
        const token = cookie.get('token')
        if (id && token) {
            const res: any = await getAll({
                method: 'post',
                url: '/api/v1/airdrop/task/twitter/daily/verify',
                data: {taskId: id,},
                token
            })
            if (res?.data?.message === 'success' && res?.status === 200) {
                getParams()
            }
        }
    }
    return (
        <>
            {
                load ? <div className={'activityBox'} style={{marginBottom: '50px', overflow: 'hidden'}}>
                        <div className={'activeBack'}>
                            <div
                                className={`activeSwiper ${browser ? 'activeSwiperWeb' : 'activeSwiperActive'}`}>
                                <Swiper
                                    effect={'coverflow'}
                                    grabCursor={true}
                                    centeredSlides={true}
                                    slidesPerView={"auto"}
                                    coverflowEffect={{
                                        rotate: 50,
                                        stretch: 0,
                                        // depth: 50,
                                        modifier: 1,
                                        slideShadows: true,
                                    }}
                                    pagination={true}
                                    // navigation
                                    modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                                    loop
                                    autoplay={{delay: 3500, disableOnInteraction: false}}
                                >
                                    {
                                        data.length > 0 && data[0]?.campaign?.noticeUrl?.length > 0 ?
                                            data[0]?.campaign?.noticeUrl.concat(data[0]?.campaign?.noticeUrl).map((i: string, ind: number) => {
                                                return <SwiperSlide key={ind}
                                                                    style={{
                                                                        height: browser ? '72vh' : '215px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}><img
                                                    loading={'lazy'}
                                                    className={'activeImgHover'}
                                                    src={i} onClick={
                                                    throttle(function () {
                                                    }, 1500, {'trailing': false})
                                                } alt=""/></SwiperSlide>
                                            }) : ''
                                    }
                                </Swiper>
                            </div>
                            {/*时间*/}
                            <div className={'allTime'}>
                                {
                                    Number(time) ?
                                        <Countdown title=""
                                                   className={'avtiveCountdown'}
                                                   value={time}
                                                   format="D[D] H[H] m[M] s[S]"
                                        /> :
                                        <p className={'pTime'}>{time}</p>
                                }

                                {/*<p className={'ac'} style={{width: browser ? '32%' : "70%"}}>* {t('Active.title')}</p>*/}
                                {/*<p className={'ac'} style={{width: browser ? '32%' : "70%"}}> * {t('Active.title1')}</p>*/}
                                {/*<p className={'ac'} style={{width: browser ? '32%' : "70%"}}> * {t('Active.title2')}</p>*/}
                            </div>
                            <div className={'allTime'} style={{marginTop: '5%'}}>
                                <p className={'pTime'} style={{marginBottom: '0'}}>{t('Active.task')}</p>
                                <p style={{
                                    color: '#D6DFD7',
                                    width: browser ? '50%' : '80%',
                                    margin: "10px auto",
                                    textAlign: 'center'
                                }}>{t('Active.ye1')}</p>
                            </div>
                        </div>
                        <div className={`point`} style={{width: browser ? '66%' : '90%'}}>
                            {
                                // style={{padding: browser ? "17px 15%" : "10px"}}
                                !show && <div className={'connect'}>
                                    <p onClick={() => {
                                        setIsModalOpen(true)
                                        // style={{marginTop: browser ? "25px" : '10px'}}
                                    }}>{t('Common.Connect Wallet')}</p>
                                </div>
                            }
                            <div className={`youPoint ${show ? '' : 'frosted'}`}>
                                <div>
                                    <span style={{fontSize: browser ? '18px' : '16px'}}>{t('Active.point')}</span>
                                    <p>
                                        <span style={{fontSize: browser ? '25px' : '20px'}}>{point || '0'}</span>
                                        <img onClick={() => {
                                            history('/Dpass')
                                        }} src="/change.svg" alt=""/>
                                    </p>
                                </div>
                                <div onClick={() => {
                                    history('/Dpass')
                                }} style={{cursor: 'pointer'}}>
                                    <span style={{fontSize: browser ? '18px' : '16px'}}>{t('Active.pass')}</span>
                                    {
                                        isDPassCount ?
                                            <span style={{fontSize: browser ? '25px' : '20px'}}>{dPassCount || '0'}</span> :
                                            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                                <LoadingOutlined style={{color: 'gray'}}/>
                                            </div>
                                    }
                                </div>
                                <div style={{borderRight: '2px solid #3c453c'}}>
                                    <span style={{fontSize: browser ? '18px' : '16px'}}>{t('Active.today')}</span>
                                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                        <span style={{
                                            fontSize: browser ? '25px' : '20px',
                                            color: '#86F097'
                                        }}>{todayPoint || '0'}</span>
                                    </div>
                                </div>
                                <div>
                                    <span style={{fontSize: browser ? '18px' : '16px'}}>{t('Active.Multiplier')}</span>
                                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                        <span style={{
                                            fontSize: browser ? '25px' : '20px',
                                            color: '#86F097'
                                        }}>{todayPoint || '0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'activeOptions'}
                             style={{width: browser ? '72%' : '92%', margin: browser ? '35px auto 42px' : '20px auto'}}>
                            {
                                [t('Active.Special'), t('Active.Daily'), t('Active.First'), t('Active.Ranking')].map((i: string, ind: number) => {
                                    return <div style={{
                                        backgroundColor: show ? option === ind ? 'rgb(134,240,151)' : '' : '',
                                        color: show ? ind === 0 ? 'gray' : option === ind ? 'black' : 'white' : 'white',
                                        width: '22%',
                                        fontSize: browser ? '18px' : '14px'
                                    }} onClick={() => {
                                        if (show) {
                                            if (ind !== option && ind !== 0) {
                                                setOption(ind)
                                                if (ind === 3) {
                                                    if (isRankList) {
                                                        getRank()
                                                    }
                                                }
                                            }
                                        } else {
                                            MessageAll('warning', t('Market.line'))
                                        }
                                    }} key={ind}>{i}
                                    </div>
                                })
                            }
                        </div>
                        {
                            show && <div className={'activeAll'} style={{padding: browser ? '0 17%' : '0 5%'}}>
                                {
                                    option === 3 ? <Table
                                        columns={columns}
                                        rowKey={(record: any) => record?.user?.uid}
                                        className={'activeTable'}
                                        pagination={false}
                                        dataSource={rankList}
                                        loading={isRankList}
                                        bordered
                                    /> : <div className={'first'}>
                                        {
                                            data.length > 0 ? data.map((i: any) => {
                                                    let at: any = []
                                                    if (option === 1) {
                                                        at = i?.dailTasks
                                                    } else {
                                                        at = i?.tasks
                                                    }
                                                    if (at.length > 0) {
                                                        return at.map((it: any, index: number) => {
                                                            return <div key={it?.taskId} className={'firstLine'}
                                                                        style={{
                                                                            background: selectActive === it?.taskId ? 'rgb(52,62,53)' : 'linear-gradient(to right, #020c02, rgb(38, 45, 38))',
                                                                            marginBottom: index === i?.tasks.length - 1 ? '' : '35px'
                                                                        }}
                                                                        onClick={() => {
                                                                            if (selectActive !== it?.taskId) {
                                                                                setSelectActive(it?.taskId)
                                                                            } else {
                                                                                setSelectActive('')
                                                                            }
                                                                        }}>
                                                                <div>
                                                                    <img src={changeImg(it?.taskId, it?.title)} alt=""/>
                                                                    <span
                                                                        style={{color: selectActive === it?.taskId ? 'rgb(134,240,151)' : 'white'}}>{it?.title}</span>
                                                                </div>
                                                                <div>
                                                                    <p style={{color: selectActive === it?.taskId ? 'rgb(134,240,151)' : 'white'}}>+{it?.score}</p>
                                                                    {
                                                                        Number(it?.isCompleted) !== 3 ? <p onClick={() => {
                                                                                param(it?.isCompleted, it?.taskId, it?.title)
                                                                                cookie.set('taskId', it?.taskId)
                                                                                setSelect(it)
                                                                                setLoading(true)
                                                                            }} className={'start'}>
                                                                                {loading && select?.title === it?.title ?
                                                                                    <LoadingOutlined/> : operate(it?.isCompleted, it?.title)}</p> :
                                                                            <div className={'success'}>
                                                                                <img
                                                                                    src={selectActive === it?.taskId ? '/succActive.svg' : '/succ.svg'}
                                                                                    alt=""/>
                                                                            </div>
                                                                    }
                                                                    {
                                                                        option === 1 && Number(it?.isCompleted) !== 3 &&
                                                                        <p className={'verify'}
                                                                           onClick={() => {
                                                                               if (it?.title.includes('Twitter')) {
                                                                                   verification(it?.taskId)
                                                                               } else {
                                                                                   getParams()
                                                                               }
                                                                           }}>verify</p>
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
                                                }) :
                                                <p style={{
                                                    textAlign: 'center',
                                                    marginTop: '20px',
                                                    color: 'white'
                                                }}> {t('Market.no')}</p>
                                        }
                                    </div>
                                }
                            </div>
                        }
                        <p style={{
                            width: '72%',
                            margin: '0 auto',
                            color: 'rgb(212,223,214)',
                            lineHeight: '1.1',
                            marginTop: '5%'
                        }}>
                            {t('Active.Each')}
                        </p>
                    </div> :
                    <Loading status={'20'}/>
            }
            <Modal centered
                   title={select?.title?.includes('Twitter') && option === 1 ? t('Dpass.how') : t('Dpass.plea')}
                   className={'activeModal'} open={isModalOpen} maskClosable={false}
                   footer={null} onCancel={handleCancel}>
                {
                    select?.title?.includes('Twitter') && option === 1 ?
                        <TwitterRelease handleCancel={handleCancel} openLink={openLink} setValue={setValue}
                                        Confirm={Confirm}/> :
                        <Revalidate openLink={openLink} select={select?.title}/>
                }
            </Modal>
        </>
    )
        ;
}

export default Index;