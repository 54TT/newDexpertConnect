import {setMany, simplify} from "../../../../utils/change.ts";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {throttle} from "lodash"; // 引入相对时间插件
import {judgeStablecoin} from '../../../../utils/judgeStablecoin.ts'

dayjs.extend(relativeTime); // 使用相对时间插件
function Date({tableDta, time, setDta}: any) {
    const history = useNavigate();
    const push = throttle(function (i: any) {
        history('/newpairDetails/' + i?.id)
    }, 1500, {'trailing': false})
    const click =
        throttle(function (i: any, e: any) {
            e.stopPropagation();
            tableDta.map((it: any) => {
                if (it?.id === i?.id) {
                    it.collect = !i.collect
                }
                return it
            })
            setDta([...tableDta])
        }, 1500, {'trailing': false})
    return (

        <>
            {
                tableDta.map((record: any, ind: number) => {
                    const data = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                    const a: any = data && data.length > 0 ? Number(data[0]?.priceChange) ? data[0]?.priceChange.includes('.000') ? 0 : Number(data[0]?.priceChange).toFixed(3) : 0 : 0
                    const b = a ? setMany(a) : 0
                    const dateTime = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                    const li: any = record?.liquidity && Number(record.liquidity) ? setMany(record.liquidity) : 0
                    const create = record?.createdAtTimestamp.toString().length > 10 ? Number(record.createdAtTimestamp.toString().slice(0, 10)) : Number(record.createdAtTimestamp)
                    return (b && b.includes('T') && b.length > 10) ? '' :
                        <div key={ind} className={`indexNewPairBodyData dis`} onClick={() => push(record)}>
                            <div className={`indexTableLogo indexNewPairBone`}>
                                <img loading={'lazy'} src={record?.collect ? '/collectSelect.svg' : "/collect.svg"}
                                     style={{display: 'none'}} alt=""
                                     onClick={(e: any) => click(record, e)}/>
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
                            <div
                                style={{color: "white"}}>{Number(record?.priceUSD) ? setMany(record?.priceUSD) : 0}</div>
                            <div
                                style={{color: Number(a) > 0 ? 'rgb(0,255,71)' : Number(a) === 0 ? 'white' : 'rgb(213,9,58)',}}>{b !== 0 ? Number(b) ? (parseFloat(Number(b).toFixed(2))).toString() : b : '0'}</div>
                            <div
                                style={{
                                    color: "white",
                                    letterSpacing: '-1px',
                                    lineHeight: '1.2'
                                }}>{dayjs.unix(create).fromNow()}</div>
                            {
                                judgeStablecoin(record?.token0?.id, record?.token1?.id) === 0 ? <div
                                    style={{color: 'white'}}>{Number(setMany(record?.reserve0.toString())) ? parseFloat(Number(setMany(record?.reserve0.toString())).toFixed(2)) + '  ' : setMany(record?.reserve0.toString()) + '  '}ETH</div> : judgeStablecoin(record?.token0?.id, record?.token1?.id) === 1 ?
                                    <div
                                        style={{color: 'white'}}>{Number(setMany(record?.reserve1.toString())) ? parseFloat(Number(setMany(record?.reserve1.toString())).toFixed(2)) + '  ' : setMany(record?.reserve1.toString()) + '  '}ETH</div> :
                                    <div style={{color: 'white'}}>-</div>
                            }
                            <div
                                style={{color: 'white'}}>{dateTime && dateTime.length > 0 ? Number(dateTime[0]?.swapTxns) : 0}</div>
                            <div style={{color: 'white'}}>{li}</div>
                            <div className={`dis indexTableLogo`}>
                                <img loading={'lazy'} src="/ethLogo.svg" alt="" onClick={
                                    throttle(function (e: any) {
                                        e.stopPropagation()
                                        window.open('https://etherscan.io/token/' + record?.token0?.id)
                                    }, 1500, {'trailing': false})}/>
                                <img loading={'lazy'} onClick={throttle(function (e: any) {
                                    e.stopPropagation()
                                    window.open('https://app.uniswap.org/#/swap?inputCurrency=' + record?.token1?.id + '&outputCurrency=' + record?.token1?.id)
                                }, 1500, {'trailing': false})}
                                     src="/feima.svg" style={{margin: '0 5px'}}
                                     alt=""/>
                                <img loading={'lazy'} onClick={throttle(function (e: any) {
                                    e.stopPropagation()
                                    window.open('https://app.uncx.network/amm/uni-v2/pair/' + record?.id)
                                }, 1500, {'trailing': false})}
                                     src="/uncx.svg" alt=""/></div>
                        </div>
                })
            }
        </>
    );
}

export default Date;