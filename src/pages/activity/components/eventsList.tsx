import './eventsList.less'
import cookie from "js-cookie";
import { useTranslation } from "react-i18next";
import { CountContext } from "../../../Layout.tsx";
import { useContext, useEffect, useState } from "react";
import Request from "../../../components/axios.tsx";
import { MessageAll } from '../../../components/message.ts'
import EachActivity from './eachActivity.tsx'
import { throttle, } from "lodash";
function task({ getParams, data, select, setSelect, params, }: any) {
    const { getAll, } = Request()
    const [rankList, setRankList] = useState<any>([])
    const {
        browser, isLogin, languageChange, activityOptions, setActivityOptions
    }: any = useContext(CountContext);
    const [option, setOption] = useState(activityOptions ? activityOptions : params[0])
    const [isRankList, setIsRankList] = useState(true)
    const { t } = useTranslation();
    const getRank = async () => {
        const token = cookie.get('token')
        const res = await getAll({
            method: 'get', url: '/api/v1/campaign/point/rank', data: {}, token: token
        })
        if (res?.status === 200) {
            setRankList(res?.data?.campaignTaskPointRankInfos)
            setIsRankList(false)
        } else {
            setIsRankList(false)
        }
    }
    useEffect(() => {
        if (select) {
            setOption(select)
            setSelect('')
        }
    }, [select])
    const list: any = [{ name: 'special', value: t('Active.Special') }, { name: "d", value: 'D Pass' }, { name: "ranking", value: t('Active.Ranking') }, { name: 'first', value: t('Active.First') }, { name: 'daily', value: t('Active.Daily') },]
    const now = list.filter((item: any) => params.indexOf(item.name) !== -1) || []
    return (
        <>
            <div className={'activeOptions disCen'}
                style={{ width: browser ? '72%' : '92%', margin: browser ? '35px auto 42px' : '15px auto' }}>
                {
                    now.map((i: any, ind: number) => {
                        return <div style={{
                            backgroundColor: isLogin ? option === i.name ? 'rgb(134,240,151)' : '' : '',
                            color: isLogin ? option === i.name ? 'black' : 'white' : 'white',
                            fontSize: browser ? '18px' : '14px',
                            zIndex: '1'
                        }} onClick={
                            throttle(function () {
                                if (isLogin) {
                                    if (i.name !== option) {
                                        setActivityOptions('')
                                        setOption(i.name)
                                        if (i.name === 'ranking') {
                                            if (isRankList) {
                                                getRank()
                                            }
                                        }
                                    }
                                } else {
                                    MessageAll('warning', t('Market.line'))
                                }
                            }, 1500, { 'trailing': false })} className='disCen' key={ind}>{i.value}
                        </div>
                    })
                }
            </div>
            <EachActivity option={option} rankList={rankList} data={languageChange === 'zh_CN' ? data?.campaignHomeCN || [] : data?.campaignHome || []} isRankList={isRankList}
                getParams={getParams} />
        </>
    )
}
export default task

