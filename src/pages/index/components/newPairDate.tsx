import { setMany, simplify } from "../../../../utils/change.ts";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useContext } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime';
import { throttle } from "lodash";
import { CountContext } from "../../../Layout.tsx"; // 引入相对时间插件
dayjs.extend(relativeTime); // 使用相对时间插件
function Date({ tableDta, time, setDta }: any) {
    const { switchChain, browser }: any = useContext(CountContext);
    const history = useNavigate();
    const push = throttle(function (i: any) {
        history('/newpairDetails/' + i?.id)
    }, 1500, { 'trailing': false })
    const click = throttle(function (i: any, e: any) {
        e.stopPropagation();
        tableDta.map((it: any) => {
            if (it?.id === i?.id) {
                it.collect = !i.collect
            }
            return it
        })
        setDta([...tableDta])
    }, 1500, { 'trailing': false })
    return (
        <>
            {
                tableDta.map((record: any, ind: number) => {
                    const data = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                    const a: any = data && data.length > 0 ? Number(data[0]?.priceChange) ? data[0]?.priceChange.includes('.000') ? 0 : Number(data[0]?.priceChange).toFixed(3) : 0 : 0
                    const b = Number(a) !== 0 ? setMany(a) : 0
                    const dateTime = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                    const li: any = record?.liquidity && Number(record.liquidity) ? setMany(record.liquidity) : 0
                    const create = record?.createdAtTimestamp.toString().length > 10 ? Number(record.createdAtTimestamp.toString().slice(0, 10)) : Number(record.createdAtTimestamp)
                    return (b && b.includes('T') && b.length > 10) ? '' :
                        <div key={ind} className={`indexNewPairBodyData dis ${browser ? '' : 'indexNewPairBodyDataSmall'}`} onClick={() => push(record)}>
                            <div className={`indexTableLogo indexNewPairBone`}>
                                <img loading={'lazy'} src={record?.collect ? '/collectSelect.svg' : "/collect.svg"}
                                    style={{ display: 'none' }} alt=""
                                    onClick={(e: any) => click(record, e)} />
                                <div>
                                    <p style={{
                                        marginBottom: '4px',
                                        fontWeight: '500'
                                    }}>{simplify(record?.token0?.symbol?.replace(/^\s*|\s*$/g, ""))}</p>
                                    <div style={{
                                        fontSize: '14px',
                                        color: 'rgb(104,124,105)'
                                    }}>{simplify(record?.token1?.symbol?.replace(/^\s*|\s*$/g, ""))}</div>
                                </div>
                            </div>
                            <div style={{ color: "white" }}>{Number(record?.priceUSD) ? setMany(record?.priceUSD) : 0}</div>
                            <div
                                style={{ color: Number(a) > 0 ? 'rgb(0,255,71)' : Number(a) === 0 ? 'white' : 'rgb(213,9,58)', }}>{Number(b) !== 0 ? b : '0'}</div>
                            <div
                                style={{
                                    color: "white",
                                    lineHeight: '1.2'
                                }}>{dayjs.unix(create).fromNow()}</div>
                            <div
                                style={{ color: 'white' }}>{setMany(record?.initialReserve)} {switchChain === 'Polygon' ? 'matic' : switchChain === 'BSC' ? 'BNB' : "ETH"}</div>
                            <div
                                style={{ color: 'white' }}>{dateTime && dateTime.length > 0 ? Number(dateTime[0]?.swapTxns) : 0}</div>
                            <div style={{ color: 'white' }}>{li}</div>
                            <div className={`dis indexTableLogo logoSet`}>
                                {
                                    ['/ethLogo.svg', '/feima.svg', '/uncx.svg'].map((i: string, index: number) => {
                                        return <div className={'imgBox'} key={index}>
                                            <img loading={'lazy'} src={i} alt="" onClick={
                                                throttle(function (e: any) {
                                                    e.stopPropagation()
                                                    if (ind === 0) {
                                                        window.open('https://etherscan.io/token/' + record?.token0?.id)
                                                    } else if (ind === 1) {
                                                        window.open('https://app.uniswap.org/#/swap?inputCurrency=' + record?.token1?.id + '&outputCurrency=' + record?.token1?.id)
                                                    } else if (ind === 2) {
                                                        window.open('https://app.uncx.network/amm/uni-v2/pair/' + record?.id)
                                                    }
                                                }, 1500, { 'trailing': false })} />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                })
            }
        </>
    );
}

export default Date;