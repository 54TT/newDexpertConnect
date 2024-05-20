import './index.less'
import Task from './eventsList'
import { useTranslation } from "react-i18next";
import cookie from "js-cookie";
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom'
import { Statistic } from 'antd'
import { CountContext } from "../../../Layout.tsx";
import Loading from '../../../components/loading.tsx';
import Request from "../../../components/axios.tsx";
import { setMany } from '../../../../utils/change.ts'
const { Countdown } = Statistic;
function SpecialActive() {
    const { getAll, } = Request()
    const { t } = useTranslation();
    const { languageChange, }: any = useContext(CountContext);
    const params: any = useParams()
    // campaignHome    campaignHomeCN  
    const [data, setData] = useState<any>(null)
    console.log('66666666666666666',data)
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
                load ? <div className="specialActive">
                    <div className='top'>
                        <img src={languageChange === 'zh_CN' ? data?.campaignHomeCN?.campaign?.noticeUrl?.[0] : data?.campaignHome?.campaign?.noticeUrl?.[0]} alt="" />
                        <div className='right'>
                            <p>{languageChange === 'zh_CN' ? data?.campaignHomeCN?.campaign?.title : data?.campaignHome?.campaign?.title}</p>
                            <p>{languageChange === 'zh_CN' ? data?.campaignHomeCN?.campaign?.description : data?.campaignHome?.campaign?.description}</p>
                            {
                                Number(time) ?
                                    <Countdown title=""
                                        className='setCountdown'
                                        value={time}
                                        format="D[D] H[H] m[M] s[S]"
                                    /> :
                                    <p className={'pTime'}>{time}</p>
                            }
                        </div>
                    </div>
                    <Task getParams={getParams} params={['first', 'daily']} data={data} />
                    <div className='bot'>
                        <p>{t('Active.Earn')}</p>
                        <p>{t('Active.users')}</p>
                        <p>{t('Active.holders')}</p>
                        <p>{t('Active.NFT')}</p>
                        <p>{t('Active.missions')}</p>
                    </div>
                </div> : <Loading status={'20'} />
            }
        </>

    )
}

export default SpecialActive
