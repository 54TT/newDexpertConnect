import './index.less';
import {useContext, useEffect, useState} from "react";
import {throttle} from "lodash";
import Request from "../../components/axios.tsx";
import cookie from "js-cookie";
import {Statistic} from 'antd';
import Loading from '../../components/loading.tsx'
import {LoadingOutlined} from '@ant-design/icons'
import {CountContext} from "../../Layout.tsx";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {MessageAll} from '../../components/message.ts'
import {useNavigate} from "react-router-dom";
import Swiper from './components/swiper.tsx';
import EachActivity from './components/eachActivity.tsx'

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
    const [data, setData] = useState<any>([])
    const [time, setTime] = useState<any>(null)
    const [enData, setEnData] = useState<any>([])
    const [zhData, setZhData] = useState<any>([])
    const [point, setPoint] = useState('0')
    const [todayPoint, setTodayPoint] = useState('0')
    const [load, setLoad] = useState(false)
    const [option, setOption] = useState(1)
    const [show, setShow] = useState(false)
    const [dPassCount, setDPassCount] = useState('')
    const [isDPassCount, setIsDPassCount] = useState(false)
    const [rankList, setRankList] = useState<any>([])
    const [isRankList, setIsRankList] = useState(true)
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
    useEffect(() => {
        const token = cookie.get('token')
        if (token) {
            setShow(true)
        }
        getParams()
    }, []);
    useEffect(() => {
        if (show) {
            getDpass()
        }
    }, [show]);

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
    return (
        <>
            {
                load ? <div className={'activityBox'} style={{marginBottom: '50px', overflow: 'hidden'}}>
                        <div className={'activeBack'}>
                            <Swiper data={data}/>
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
                                !show && <div className={'connect'}>
                                    <p onClick={() => {
                                        setIsModalOpen(true)
                                    }}>{t('Common.Connect Wallet')}</p>
                                </div>
                            }
                            <div className={`youPoint ${show ? '' : 'frosted'}`}>
                                <div>
                                    <span style={{fontSize: browser ? '18px' : '16px'}}>{t('Active.point')}</span>
                                    <p>
                                        <span style={{fontSize: browser ? '25px' : '20px'}}>{point || '0'}</span>
                                        <img onClick={
                                            throttle(function () {
                                                history('/Dpass')
                                            }, 1500, {'trailing': false})} src="/change.svg" alt=""/>
                                    </p>
                                </div>
                                <div onClick={throttle(function () {
                                    history('/Dpass')
                                }, 1500, {'trailing': false})} style={{cursor: 'pointer'}}>
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
                                        }}>{'1'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'activeOptions'}
                             style={{width: browser ? '72%' : '92%', margin: browser ? '35px auto 42px' : '20px auto'}}>
                            {
                                [t('Active.Special'), t('Active.First'), t('Active.Daily'), t('Active.Ranking')].map((i: string, ind: number) => {
                                    return <div style={{
                                        backgroundColor: show ? option === ind ? 'rgb(134,240,151)' : '' : '',
                                        color: show ? ind === 0 ? 'gray' : option === ind ? 'black' : 'white' : 'white',
                                        width: '22%',
                                        fontSize: browser ? '18px' : '14px'
                                    }} onClick={
                                        throttle(function () {
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
                                        }, 1500, {'trailing': false})} key={ind}>{i}
                                    </div>
                                })
                            }
                        </div>
                        <EachActivity show={show} option={option} rankList={rankList} data={data} isRankList={isRankList}
                                      setLoad={setLoad} getParams={getParams}/>
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
        </>
    )
}

export default Index;