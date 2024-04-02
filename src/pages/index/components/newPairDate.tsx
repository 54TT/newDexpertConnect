import {setMany, simplify} from "../../../../utils/change.ts";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import cookie from "js-cookie";
import {useEffect} from "react"; // 引入相对时间插件
dayjs.extend(relativeTime); // 使用相对时间插件
function Date({tableDta, time, setDta}: any) {
    const history = useNavigate();
    const push = (i: any) => {
        history('/newpairDetails')
        cookie.set('newpair', JSON.stringify(i))
    }
    useEffect(() => {
        cookie.remove('newpair')
    }, []);
    const click = (i: any, e: any) => {
        e.stopPropagation();
        tableDta.map((it: any) => {
            if (it?.id === i?.id) {
                it.collect = !i.collect
            }
            return it
        })
        setDta([...tableDta])
    }
    return (
        <>
            {
                tableDta.map((record: any, ind: number) => {
                    const data = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                    const a: any = data && data.length > 0 ? Number(data[0]?.priceChange) ? data[0]?.priceChange.includes('.000') ? 0 : Number(data[0]?.priceChange).toFixed(3) : 0 : 0
                    const b = a ? setMany(a) : 0
                    const ab = record?.token0?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && record?.token1?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 1 : record.sure ? 2 : 3
                    const dateTime = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                    const li: any = record?.liquidity && Number(record.liquidity) ? setMany(record.liquidity) : 0
                    const create = record?.createdAtTimestamp.toString().length > 10 ? Number(record.createdAtTimestamp.toString().slice(0, 10)) : Number(record.createdAtTimestamp)
                    return <div key={ind} className={`indexNewPairBodyData dis`} onClick={() => push(record)}>
                        <div className={`indexTableLogo indexNewPairBone`}>
                            <img src={record.collect ? '/collectSelect.svg' : "/collect.svg"} style={{display:'none'}} alt=""
                                 onClick={(e: any) => click(record, e)}/>
                            <div>
                                <p style={{marginBottom: '4px'}}>{simplify(record?.token0?.symbol)}</p>
                                <div style={{
                                    fontSize: '14px',
                                    color: 'rgb(104,124,105)'
                                }}>{simplify(record?.token1?.symbol)}</div>
                            </div>
                        </div>
                        <div style={{color: "white"}}>{Number(record?.priceUSD) ? setMany(record?.priceUSD) : 0}</div>
                        <div style={{color: Number(a) > 0 ? 'rgb(0,255,71)' : Number(a) === 0 ? 'white' : 'rgb(213,9,58)',}}>{b !== 0 ? Number(b) ? (parseFloat(Number(b).toFixed(2))).toString() : b : '0'}</div>
                        <div
                            style={{
                                color: "white",
                                letterSpacing: '-1px',
                                lineHeight: '1.2'
                            }}>{dayjs.unix(create).fromNow()}</div>
                        {
                            ab === 1 ? <div style={{color: 'white'}}>-</div> : ab === 2 ? <div
                                    style={{color: 'white'}}>{Number(setMany(record?.reserve0.toString())) ? parseFloat(Number(setMany(record?.reserve0.toString())).toFixed(2)) + '  ' : setMany(record?.reserve0.toString()) + '  '}ETH</div> :
                                <div
                                    style={{color: 'white'}}>{Number(setMany(record?.reserve1.toString())) ? parseFloat(Number(setMany(record?.reserve1.toString())).toFixed(2)) + '  ' : setMany(record?.reserve1.toString()) + '  '}ETH</div>
                        }
                        <div
                            style={{color: 'white'}}>{dateTime && dateTime.length > 0 ? Number(dateTime[0]?.swapTxns) : 0}</div>
                        <div style={{color: 'white'}}>{li}</div>

                        <div className={`dis indexTableLogo`}>
                            <img src="/ethLogo.svg" alt=""/>
                            <img
                                src="/feima.svg" style={{margin: '0 5px'}}
                                alt=""/>
                            <img
                                src="/huo.svg" alt=""/></div>
                    </div>
                })
            }
        </>
    );
}

export default Date;