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

const {Countdown} = Statistic;

function Index() {
    const {getAll,} = Request()
    const {t} = useTranslation();
    const {browser,}: any = useContext(CountContext);
    const {
        setIsModalOpen,
        languageChange,
        isLogin,
        changeLan,
        setChangeLan,
        setIsLogin
    }: any = useContext(CountContext);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [time, setTime] = useState<any>(null)
    const [enData, setEnData] = useState<any>([])
    const [zhData, setZhData] = useState<any>([])
    const [point, setPoint] = useState('0')
    console.log(point)
    const [isModalOpen, setIsModalOpe] = useState(false);
    const [link, setLink] = useState('');
    const [load, setLoad] = useState(false)
    const [option, setOption] = useState(0)
    const [show, setShow] = useState(false)
    const [selectActive, setSelectActive] = useState('')
    const [select, setSelect] = useState(0)
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
            setLoad(true)
        } else {
            setLoad(true)
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
    const getT = async (id: string, index: number) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: index === 1 ? 'post' : 'get',
                url: index === 0 ? '/api/v1/oauth/twitter/link' : index === 1 ? '/api/v1/oauth/telegram/chat/link' : '/api/v1/oauth/discord/link',
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
    const follow = async (id: string, index: number) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: index === 1 ? 'post' : 'get',
                url: index === 0 ? '/api/v1/oauth/twitter/follow' : index === 1 ? '/api/v1/oauth/telegram/chat/follow' : '/api/v1/oauth/discord/follow',
                data: index === 1 ? {taskId: id} : {taskId: id},
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
    const verify = async (id: string, index: number) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post',
                url: index === 0 ? '/api/v1/oauth/twitter/verify' : index === 1 ? '/api/v1/oauth/telegram/chat/verify' : '/api/v1/oauth/discord/verify',
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
    const param = (isCompleted: string, taskId: string, index: number) => {
        const token = cookie.get('token')
        if (token) {
            if (Number(isCompleted)) {
                if (Number(isCompleted) === 1) {
                    follow(taskId, index)
                    setLoading(true)
                }
                if (Number(isCompleted) === 2) {
                    verify(taskId, index)
                    setLoading(true)
                }
            } else {
                setLoading(true)
                getT(taskId, index)
            }
        } else {
            setIsModalOpen(true)
        }
    }
    const handleCancel = () => {
        setIsModalOpe(false);
    }
    const openLink = () => {
        if (link) {
            window.open(link)
            setIsModalOpe(false);
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
            title: 'RANK',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'USER',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'TWEETS',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'VIEWS',
            dataIndex: 'address1',
            key: 'address1',
        },
    ];
    const dataSource = [
        {
            key: '1',
            name: 'John Brown',
            money: '￥300,000.00',
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            money: '￥1,256,000.00',
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            money: '￥120,000.00',
            address: 'Sydney No. 1 Lake Park',
        },
    ];

    return (
        <>
            {
                load ? <div className={'activityBox'} style={{marginBottom: '50px', overflow: 'hidden'}}>
                        <div className={'activeBack'}>
                            <div style={{marginTop: '5.5%'}}
                                 className={`activeSwiper ${browser ? 'activeSwiperWeb' : 'activeSwiperActive'}`}>
                                <Swiper
                                    effect={'coverflow'}
                                    grabCursor={true}
                                    centeredSlides={true}
                                    slidesPerView={"auto"}
                                    coverflowEffect={{
                                        rotate: 50,
                                        stretch: 0,
                                        depth: 100,
                                        modifier: 1,
                                        slideShadows: true,
                                    }}
                                    pagination={true}
                                    // navigation
                                    modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                                    loop
                                    autoplay={{delay: 2000, disableOnInteraction: false}}
                                >
                                    {
                                        data.length > 0 && data[0]?.campaign?.noticeUrl?.length > 0 ?
                                            data[0]?.campaign?.noticeUrl.concat(data[0]?.campaign?.noticeUrl).map((i: string, ind: number) => {
                                                return <SwiperSlide key={ind}><img loading={'lazy'}
                                                                                   className={'activeImgHover'}
                                                                                   src={i} onClick={
                                                    throttle(function () {

                                                    }, 1500, {'trailing': false})
                                                } style={{borderRadius: '15px', width: '100%'}} alt=""/></SwiperSlide>
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
                                <p>Airdrop Season 3 Ends</p>
                            </div>
                            <div className={'allTime'} style={{marginTop: '6%'}}>
                                <p className={'pTime'} style={{marginBottom: '0'}}> D Points Task</p>
                            </div>
                        </div>
                        <div className={`point`}>
                            {
                                !show && <div className={'connect'}>
                                    <p>To commemorate the introduction of Dexpert, simply link your wallet to
                                        receive 1000 D-Points.</p>
                                    <p onClick={() => {
                                        setIsModalOpen(true)
                                    }}>Connect wallet</p>
                                </div>
                            }
                            <div className={`youPoint ${show ? '' : 'frosted'}`}>
                                <div>
                                    <span>Your D points</span>
                                    <span>14444</span>
                                </div>
                                <div>
                                    <span>Your D psaa</span>
                                    <span>144</span>
                                </div>
                                <div>
                                    <span>Today's points</span>
                                    <span>14444</span>
                                </div>
                            </div>
                        </div>
                        <div className={'activeOptions'}>
                            {
                                ['Daily mission', 'First mission', 'Ranking list'].map((i: string, ind: number) => {
                                    return <p style={{
                                        backgroundColor: show ? option === ind ? 'rgb(134,240,151)' : '' : '',
                                        color: show ? option === ind ? 'black' : 'white' : 'white'
                                    }} onClick={() => {
                                        if (show) {
                                            if (ind !== option) {
                                                setOption(ind)
                                            }
                                        } else {
                                            MessageAll('warning', 'Please log in first')
                                        }
                                    }}>{i}</p>
                                })
                            }
                        </div>
                        {
                            show && <div className={'activeAll'}>
                                {
                                    option === 2 ? <Table
                                        columns={columns}
                                        className={'activeTable'}
                                        pagination={false}
                                        dataSource={dataSource}
                                        bordered
                                    /> : <div className={'first'}>
                                        {
                                            data.length > 0 ? data.map((i: any) => {
                                                    if (i?.tasks?.length > 0) {
                                                        return i?.tasks.map((it: any, index: number) => {
                                                            return <div key={index} className={'firstLine'}
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
                                                                    {
                                                                        index === 0 ? <img
                                                                            src={selectActive === it?.taskId ? "/tuiActive.svg" : "/tui.svg"}
                                                                            alt=""/> : index === 1 ? <img
                                                                                src={selectActive === it?.taskId ? "/telegramsActive.svg" : '/telegrams.svg'}
                                                                                alt=""/> :
                                                                            <img
                                                                                src={selectActive === it?.taskId ? '/disActive.svg' : "/dis.svg"}
                                                                                alt=""/>
                                                                    }
                                                                    <span
                                                                        style={{color: selectActive === it?.taskId ? 'rgb(134,240,251)' : 'white'}}>{it?.title}</span>
                                                                </div>
                                                                <div>
                                                                    <p style={{color: selectActive === it?.taskId ? 'rgb(134,240,251)' : 'white'}}>+{it?.score}</p>
                                                                    {
                                                                        Number(it?.isCompleted) !== 3 ? <p onClick={() => {
                                                                            param(it?.isCompleted, it?.taskId, index)
                                                                            setSelect(index)
                                                                        }}
                                                                                                           style={{color: 'black'}}>{operate(it?.isCompleted, it?.title)}
                                                                            {loading ? <LoadingOutlined/> : ''}</p> : <div style={{
                                                                            width: '75px',
                                                                            display: 'flex',
                                                                            justifyContent: 'center'
                                                                        }}>
                                                                            <img
                                                                                src={selectActive === it?.taskId ? '/succActive.svg' : '/succ.svg'}
                                                                                alt=""/>
                                                                        </div>
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
                        <p style={{width: '80%', margin: '0 auto', color: 'rgb(212,223,214)', lineHeight: '1.1',marginTop:'5%'}}>
                            Each account is limited to receiving 5 airdrops. Completing all task nodes will result in a
                            blind box reward at each task node. The reward for completing tasks multiple times is
                            invalid. The final interpretation of this activity rule belongs to the company. Each account
                            is limited to receiving 5 airdrops. Completing all task nodes will result in a blind box
                            reward at each task node. The reward for completing tasks multiple times is invalid. The
                            final interpretation of this activity rule belongs to the company.
                        </p>
                    </div> :
                    <Loading status={'20'}/>
            }
            <Modal
                title={`Verification failed, please ${select === 0 ? 'follow' : 'join'} again`}
                className={'activeModal'} open={isModalOpen}
                footer={null} onCancel={handleCancel}>
                <p>{select === 0 ? 'Follow the following Twitter users' : select === 1 ? 'Join the following Telegram group' : 'Join the following Discord group'}:</p>
                <div>
                    <div>
                        <img src="/img_3.png" alt="" onClick={openLink}/>
                        <div>
                            <p onClick={openLink}>Dexpert</p>
                            <p>{select === 0 ? '@DexpertOfficial' : select === 1 ? '@DexpertCommunity' : '@Dexpert'}---<span
                                onClick={openLink}>{select === 0 ? 'Follow' : 'Join'}</span></p>
                        </div>
                    </div>
                    <img
                        src={select === 0 ? "/x.svg" : select === 1 ? '/telegram1.svg' : '/discord.svg'}
                        alt=""
                        onClick={openLink}/>
                </div>
                <p onClick={openLink}>
                    <img
                        src={select === 0 ? "/x.svg" : select === 1 ? '/telegram1.svg' : '/discord.svg'}
                        alt=""/>
                    <span>{select === 0 ? 'Follow @Dexpertofficial' : select === 1 ? 'Join @DexpertCommunity' : 'Join @Dexpert'}</span>
                </p>
            </Modal>
        </>
    )
        ;
}

export default Index;