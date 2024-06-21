
import './index.less'
import Task from './eventsList'
import { useTranslation } from "react-i18next";
import cookie from "js-cookie";
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom'
import { Statistic } from 'antd'
import { CountContext } from "@/Layout.tsx";
import Loading from '@/components/allLoad/loading.tsx';
import Request from "@/components/axios.tsx";
import { setMany } from '@/../utils/change.ts'
const { Countdown } = Statistic;

function SpecialActive() {
    const { getAll, } = Request()
    const { t } = useTranslation();
    const { languageChange, browser }: any = useContext(CountContext);
    const params: any = useParams()
    const [data, setData] = useState<any>(null)
    const [load, setLoad] = useState(false)
    const [time, setTime] = useState('')
    const getParams = async () => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'get',
                url: '/api/v1/campaign',
                data: { id: params?.id },
                token
            })
            if (res?.status === 200) {
                setData(res?.data)
                setLoad(true)
            } else {
                setLoad(true)
            }
        }
    }
    useEffect(() => {
        const token = cookie.get('token')
        if (params?.id && token) {
            getParams()
        }
    }, [])
    const changeTime = () => {
        const date = setMany(data?.campaignHome?.campaign?.startTime, data?.campaignHome?.campaign?.endTime, languageChange)
        setTime(date)
    }
    useEffect(() => {
        if (data?.campaignHome) {
            changeTime()
        }
    }, [languageChange, data])


    return (
        <>
            {
                load ? <div className='specialActiveBox'>
                    <div className="specialActive" style={{ width: browser ? "70%" : '100%', margin: browser ? '3% auto 60px' : "30px auto 60px" }}>
                        <div className='top' style={{ flexDirection: browser ? 'row' : 'column' }}>
                            <img style={{ width: browser ? '46%' : '100%' }} src={languageChange === 'zh_CN' ? data?.campaignHomeCN?.campaign?.noticeUrl?.[0] : data?.campaignHome?.campaign?.noticeUrl?.[0]} alt="" />
                            <div style={{ width: browser ? '46%' : '100%' }} className='right'>
                                <p style={{ textAlign: browser ? 'left' : 'center' }}>{languageChange === 'zh_CN' ? data?.campaignHomeCN?.campaign?.title : data?.campaignHome?.campaign?.title}</p>
                                <p style={{ textAlign: browser ? 'left' : 'center', margin: browser ? '0' : '20px 0' }}>{languageChange === 'zh_CN' ? data?.campaignHomeCN?.campaign?.description : data?.campaignHome?.campaign?.description}</p>
                                <div style={{ visibility: "hidden" }}>
                                    {
                                        Number(time) ?
                                            <Countdown title=""
                                                className={`setCountdown ${browser ? '' : 'smallCountdown'}`}
                                                value={time}
                                                format="D[D] H[H] m[M] s[S]"
                                            /> :
                                            <p style={{ textAlign: browser ? 'left' : 'center' }}>{time}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <Task getParams={getParams} params={['first', 'daily']} data={data} />
                        {
                            params?.id !== '1' && <div className='bot'>
                                <p>{t('Active.Earn')}</p>
                                <p>{t('Active.users')}</p>
                                <p>{t('Active.holders')}</p>
                                <p>{t('Active.NFT')}</p>
                                <p>{t('Active.missions')}</p>
                            </div>
                        }
                    </div>
                    <div className='backgroundColor' style={{ top: '18vh', background: '#86F097', left: "0" }}></div>
                    <div className='backgroundColor' style={{ top: '17vh', background: '#0FF', right: "0" }}></div>
                </div> : <Loading status={'20'}  browser={browser}/>
            }
        </>
    )
}

export default SpecialActive
