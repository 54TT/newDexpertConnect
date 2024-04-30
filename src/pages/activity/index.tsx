import './index.less';
import {useContext, useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectCoverflow, Navigation, Pagination,} from "swiper/modules";
import {throttle} from "lodash";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import Request from "../../components/axios.tsx";
import cookie from "js-cookie";
import {Modal, Statistic} from 'antd';
import Loading from '../../components/loading.tsx'
import {LoadingOutlined} from '@ant-design/icons'
import {CountContext} from "../../Layout.tsx";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

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
    const [select, setSelect] = useState(0)
    console.log(select)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [enData, setEnData] = useState<any>([])
    const [zhData, setZhData] = useState<any>([])
    const [point, setPoint] = useState('0')
    const [isModalOpen, setIsModalOpe] = useState(false);
    const [link, setLink] = useState('');
    const [load, setLoad] = useState(false)
    console.log(zhData)
    console.log(enData)
    console.log(languageChange)
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
            setZhData(res?.data?.campaignHomeCN)
            setEnData(res?.data?.campaignHome)
            setPoint(res?.data?.totalPoint)
            setLoad(true)
        } else {
            setLoad(true)
        }
    }
    useEffect(() => {
        if (isLogin) {
            getParams()
            setIsLogin(false)
        }
    }, [isLogin]);
    const getT = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: select === 1 ? 'post' : 'get',
                url: select === 0 ? '/api/v1/oauth/twitter/link' : select === 1 ? '/api/v1/oauth/telegram/chat/link' : '/api/v1/oauth/discord/link',
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
    const follow = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: select === 1 ? 'post' : 'get',
                url: select === 0 ? '/api/v1/oauth/twitter/follow' : select === 1 ? '/api/v1/oauth/telegram/chat/follow' : '/api/v1/oauth/discord/follow',
                data: select === 1 ? {taskId: id} : {taskId: id},
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
    const verify = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post',
                url: select === 0 ? '/api/v1/oauth/twitter/verify' : select === 1 ? '/api/v1/oauth/telegram/chat/verify' : '/api/v1/oauth/discord/verify',
                data: select === 1 ? {
                    taskId: id,
                } : select === 0 ? {taskId: id} : {taskId: id},
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
    const operate = (tasks: any) => {
        if (tasks?.length > 0) {
            if (Number(tasks[select]?.isCompleted)) {
                if (Number(tasks[select]?.isCompleted) === 1) {
                    return change(tasks[select]?.title)
                } else if (Number(tasks[select]?.isCompleted) === 2) {
                    return t('Market.Claim')
                } else {
                    return t('Market.Completed')
                }
            } else {
                return t('Market.Authorize')
            }
        }
    }
    const param = (tasks: any) => {
        const token = cookie.get('token')
        if (token) {
            if (Number(tasks[select]?.isCompleted)) {
                if (Number(tasks[select]?.isCompleted) === 1) {
                    follow(tasks[select]?.taskId)
                    setLoading(true)
                }
                if (Number(tasks[select]?.isCompleted) === 2) {
                    verify(tasks[select]?.taskId)
                    setLoading(true)
                }
            } else {
                setLoading(true)
                getT(tasks[select]?.taskId)
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
            const abc = dayjs(t2).diff(t1, 'month')
            //  是否过了今天
            const at = dayjs(t2).isAfter(dayjs())
            if (at) {
                if (abc) {
                    return t1 + '---' + t2
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
    return (
        <>
            {
                load ? <div className={'activityBox'} style={{marginBottom: '50px'}}>
                    <div className={'top'} style={{
                        width: browser ? '20%' : '90%',
                        justifyContent: browser ? 'space-between' : 'space-around',
                        padding: browser ? '2.2% 1.7% 1%' : '6% 0 4%'
                    }}>
                        <div>
                            <p>{point}</p>
                            <p>{t('Market.POINTS')}</p>
                        </div>
                        <p>{t('Market.Redeem')}</p>
                    </div>
                    <p className={'p2'}>{t('Market.Events')}</p>
                    <p className={'p3'}> {t('Market.view')}</p>
                    <div className={`activeSwiper ${browser ? 'activeSwiperWeb' : 'activeSwiperActive'}`}>
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
                                        return <SwiperSlide key={ind}><img loading={'lazy'} className={'activeImgHover'}
                                                                           src={i} onClick={
                                            throttle(function () {

                                            }, 1500, {'trailing': false})
                                        } style={{borderRadius: '15px', width: '100%'}} alt=""/></SwiperSlide>
                                    }) : ''
                            }
                        </Swiper>
                    </div>
                    {/*活动*/}
                    {
                        data.length > 0 ? data.map((i: any, ind: number) => {
                            const date = countdownNow(i?.campaign?.startTime, i?.campaign?.endTime)
                            return <div key={ind} style={{padding: browser ? '0 15%' : '0 6%'}} className={'active'}>
                                <p className={'p2'}>{i?.campaign?.title || ''}</p>
                                {
                                    Number(date) ?
                                        <Countdown title=""
                                                   className={'avtiveCountdown'}
                                                   value={date}
                                                   format="D[D] H[H] m[M] s[S]"
                                        /> :
                                        <p className={'p3'}>{date}</p>

                                }
                                <p style={{
                                    marginTop: '20px',
                                    color: 'rgb(200,200,200)',
                                    lineHeight: '1.1', marginBottom: '10px'
                                }}>{i?.campaign?.description}</p>
                                {
                                    i?.tasks?.length > 0 &&
                                    <div className={'box'} style={{flexDirection: browser ? 'row' : 'column'}}>
                                        <div style={{width: browser ? '47%' : '100%'}}>
                                            {
                                                i?.tasks.map((it: any, ind: number) => {
                                                    return <p style={{
                                                        background: select === ind ? 'rgb(52,62,53)' : '',
                                                        color: select === ind ? 'rgb(134,240,151)' : 'white',
                                                        marginBottom: browser ? ind + 1 === i?.tasks.length ? '' : '20px' : '20px',
                                                        padding: browser ? '5% 5%' : '4% 6.5%'
                                                    }} onClick={() => {
                                                        if (select !== ind && !loading) {
                                                            setSelect(ind)
                                                        }
                                                    }} key={ind}>{it?.title}
                                                        {
                                                            Number(it?.isCompleted) && Number(it?.isCompleted) === 3 ?
                                                                <img src="/finish.svg" alt=""/> : ''
                                                        }</p>
                                                })
                                            }
                                        </div>
                                        <div style={{
                                            width: browser ? '47%' : '100%',
                                            padding: browser ? '2.5%' : '5.5%'
                                        }}>
                                            <p>{i?.tasks[select]?.title || ''}</p>
                                            <p>{i?.tasks[select]?.description || ''}</p>
                                            {
                                                Number(i?.tasks[select]?.isCompleted) !== 3 && <p onClick={() => {
                                                    param(i?.tasks)
                                                }} style={{color: 'black'}}>{operate(i?.tasks)}
                                                    {loading ? <LoadingOutlined/> : ''}</p>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }) : <p style={{textAlign: 'center', marginTop: '20px', color: 'white'}}> {t('Market.no')}</p>
                    }
                </div> : <Loading status={'20'}/>
            }
            <Modal title={`Verification failed, please ${select === 0 ? 'follow' : 'join'} again`}
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
                    <img src={select === 0 ? "/x.svg" : select === 1 ? '/telegram1.svg' : '/discord.svg'} alt=""
                         onClick={openLink}/>
                </div>
                <p onClick={openLink}>
                    <img src={select === 0 ? "/x.svg" : select === 1 ? '/telegram1.svg' : '/discord.svg'} alt=""/>
                    <span>{select === 0 ? 'Follow @Dexpertofficial' : select === 1 ? 'Join @DexpertCommunity' : 'Join @Dexpert'}</span>
                </p>
            </Modal>

        </>
    );
}

export default Index;