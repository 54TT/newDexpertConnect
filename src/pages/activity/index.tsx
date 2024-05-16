import './index.less';
import { useContext, useEffect, useState } from "react";
import { throttle } from "lodash";
import Request from "../../components/axios.tsx";
import cookie from "js-cookie";
import Loading from '../../components/loading.tsx'
import { LoadingOutlined } from '@ant-design/icons'
import { CountContext } from "../../Layout.tsx";
import { useTranslation } from "react-i18next";
import Task from './components/task.tsx'
function Index() {
    const { getAll, } = Request()
    const { t } = useTranslation();
    const {
        setIsModalOpen,
        browser,
        setUserPar,
        user, isLogin
    }: any = useContext(CountContext);
    const [data, setData] = useState<any>([])
    const [point, setPoint] = useState('0')
    const [select, setSelect] = useState('')
    const [todayPoint, setTodayPoint] = useState('0')
    const [load, setLoad] = useState(false)
    const [dPassCount, setDPassCount] = useState('')
    const [isDPassCount, setIsDPassCount] = useState(false)
    const getParams = async () => {
        const token = cookie.get('token')
        const res = await getAll({
            method: 'post', url: '/api/v1/campaign/home', data: { token: token || '' }, token: token || ''
        })
        if (res?.status === 200) {
            setData(res?.data)
            setPoint(res?.data?.totalPoint)
            setTodayPoint(res?.data?.todayPoint)
            if (user) {
                setUserPar({ ...user, rewardPointCnt: res?.data?.totalPoint })
            }
            setLoad(true)
        } else {
            setLoad(true)
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
            getDpass()
        } else {
            getParams()
        }
    }, [isLogin]);

    return (
        <>
            {
                load ? <div className={'activityBox'} style={{ marginBottom: '50px', overflow: 'hidden' }}>
                    <p className='topTitle'><span style={{ color: 'rgb(134,240,151)' }}>{t('Active.task')}</span><span style={{ color: 'white' }}>{t('Active.task1')}</span></p>
                    <div className={'activeBack'}>
                        {/* // <Swiper data={data}/> */}
                        {/*时间*/}
                        {/* <div className={'allTime'}>
                                {
                                    Number(time) ?
                                        <Countdown title=""
                                                   className={'avtiveCountdown'}
                                                   value={time}
                                                   format="D[D] H[H] m[M] s[S]"
                                        /> :
                                        <p className={'pTime'}>{time}</p>
                                } */}
                        {/* </div> */}
                        <div className={'allTime'} >
                            <img src="/coin.svg" alt="" />
                            <div className='allTimeText'>
                                <p>{t('Active.ye1')}</p>
                                <p>{t('Active.ye2')}</p>
                                <p>{t('Active.ye3')}</p>
                            </div>
                            <img src="/pass.svg" alt="" />
                        </div>
                        <div className={`point`} style={{ width: browser ? '66%' : '90%' }}>
                            {
                                !isLogin && <div className={'connect'}>
                                    <p onClick={() => {
                                        setIsModalOpen(true)
                                    }}>{t('Common.Connect Wallet')}</p>
                                </div>
                            }
                            <div className={`youPoint ${isLogin ? '' : 'frosted'}`}>
                                <div>
                                    <span style={{ fontSize: browser ? '18px' : '16px' }}>{t('Active.point')}</span>
                                    <p>
                                        <span style={{ fontSize: browser ? '25px' : '20px' }}>{point || '0'}</span>
                                        <img onClick={
                                            throttle(function () {
                                                setSelect('d')
                                            }, 1500, { 'trailing': false })} src="/change.svg" alt="" />
                                    </p>
                                </div>
                                <div>
                                    <span style={{ fontSize: browser ? '18px' : '16px' }}>{t('Active.pass')}</span>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', cursor: 'pointer' }} onClick={throttle(function () {
                                        setSelect('d')
                                    }, 1500, { 'trailing': false })}>
                                        {
                                            isDPassCount ?
                                                <span style={{ fontSize: browser ? '25px' : '20px', color: '#86f097' }}>{dPassCount || '0'}</span> :
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                    <LoadingOutlined style={{ color: 'gray' }} />
                                                </div>
                                        }
                                        <img style={{ marginLeft: '7px' }} src="/jian.svg" alt="" />
                                    </div>
                                </div>
                                <div style={{ borderRight: '2px solid #3c453c' }}>
                                    <span style={{ fontSize: browser ? '18px' : '16px' }}>{t('Active.today')}</span>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <span style={{
                                            fontSize: browser ? '25px' : '20px',
                                            color: '#86F097'
                                        }}>{todayPoint || '0'}</span>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: browser ? '18px' : '16px' }}>{t('Active.Multiplier')}</span>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', cursor: 'pointer' }} >
                                        <span style={{
                                            fontSize: browser ? '25px' : '20px',
                                            color: '#86F097'
                                        }}>{'1'}</span>
                                        <img style={{ marginLeft: '7px' }} src="/jian.svg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Task getParams={getParams} select={select} setSelect={setSelect} data={data} />
                        <p style={{
                            width: '72%',
                            margin: '0 auto',
                            color: 'rgb(212,223,214)',
                            lineHeight: '1.1',
                            marginTop: '5%'
                        }}>
                            {t('Active.Each')}
                        </p>
                    </div>
                </div> :
                    <Loading status={'20'} />
            }
        </>
    )
}

export default Index;