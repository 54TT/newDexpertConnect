import {CaretDownOutlined, CaretUpOutlined,} from '@ant-design/icons'
import {Progress} from 'antd'
import {useEffect, useState} from "react";
import {setMany, simplify} from '../../../../utils/change.ts'
import Copy from '../../../components/copy.tsx'
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {throttle} from "lodash";
import {useTranslation} from 'react-i18next';
import {judgeStablecoin} from '../../../../utils/judgeStablecoin.ts'

dayjs.extend(relativeTime); // 使用相对时间插件
function Left({par}: any) {
    const h = window.innerHeight - 25 - 54
    const [data, setData] = useState(par)
    const [status, setStatus] = useState(false)
    const [pairStatus, setPairStatus] = useState(false)
    const {t} = useTranslation();
    useEffect(() => {
        if (status) {
            setTimeout(() => {
                setStatus(false)
            }, 4000);
        }
        if (pairStatus) {
            setTimeout(() => {
                setPairStatus(false)
            }, 4000);
        }
    }, [status, pairStatus]);
    const value = judgeStablecoin(data?.token0?.id, data?.token1?.id)
    const float = data?.pairDayData[0]?.priceChange && Number(data?.pairDayData[0]?.priceChange) > 0 ? 1 : Number(data?.pairDayData[0]?.priceChange) < 0 ? -1 : 0
    const market = Number(data?.MKTCAP) ? setMany(Number(data?.MKTCAP)) : 0
    const fdv = Number(data?.FDV) ? setMany(Number(data?.FDV)) : 0
    const create = data?.createdAtTimestamp.toString().length > 10 ? Number(data.createdAtTimestamp.toString().slice(0, 10)) : Number(data.createdAtTimestamp)
    // const pooled = data?.token0?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && data?.token1?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 1 : data.sure ? (Number(setMany(data?.reserve0.toString())) ? parseFloat(Number(setMany(data?.reserve0.toString())).toFixed(2)) + '  ' : setMany(data?.reserve0.toString()) + '  ') + 'ETH' : (Number(setMany(data?.reserve1.toString())) ? parseFloat(Number(setMany(data?.reserve1.toString())).toFixed(2)) + '  ' : setMany(data?.reserve1.toString()) + '  ') + 'ETH'
    return (
        <div className={`NewpairDetailsOne scrollStyle`} style={{height: h + 'px'}}>
            {/*top*/}
            <div className={`top dis`}>
                <div>
                    {/*<img loading={'lazy'} src="/logo1.svg" alt=""/>*/}
                    <p><span>{data?.token0?.symbol?.slice(0, 1)}</span></p>
                    <p>
                        <span>{value === 1 ? simplify(data?.token1?.symbol?.replace(/^\s*|\s*$/g, "")) : simplify(data?.token0?.symbol?.replace(/^\s*|\s*$/g, ""))}</span>
                        <span>{value !== 1 ? simplify(data?.token1?.symbol?.replace(/^\s*|\s*$/g, "")) : simplify(data?.token0?.symbol?.replace(/^\s*|\s*$/g, ""))}</span>
                    </p>
                </div>
                {/*收藏*/}
                <p style={{display: 'none'}} onClick={
                    throttle(function () {
                        if (data?.collect) {
                            setData({...data, collect: false})
                        } else {
                            setData({...data, collect: true})
                        }
                    }, 1500, {'trailing': false})
                }>
                </p>
            </div>
            {/*address*/}
            <div className={`address dis`}>
                <p>
                    <span>CA:</span><span>{value === 0 ? simplify(data?.token0?.id) : value === 1 ? simplify(data?.token1?.id) : simplify(data?.token1?.id)}</span>
                    <Copy status={status} setStatus={setStatus}
                          name={value === 0 ? data?.token0?.id : value === 1 ? data?.token1?.id : data?.token1?.id}/>
                </p>
                <p><span>Pair:</span><span>{simplify(data?.id)}</span>
                    <Copy status={pairStatus} setStatus={setPairStatus} name={data?.id}/>
                </p>
            </div>
            <div className={`dis img`}>
                {
                    ["/website.svg", "/titter.svg", "/telegram.svg", "/information.svg"].map((i: string, ind: number) => {
                        return <div key={ind}>
                            <img loading={'lazy'} src={i} alt=""/>
                        </div>
                    })
                }
            </div>
            <div className={`price dis`}>
                <p>${Number(data?.priceUSD) ? setMany(data?.priceUSD) : 0}</p>
                <p style={{
                    color: float > 0 ? 'rgb(0, 255, 71)' : float < 0 ? 'rgb(213, 9, 58)' : 'white',
                    display: 'flex',
                    alignItems: 'center'
                }}>{float > 0 ?
                    <CaretUpOutlined/> : float < 0 ?
                        <CaretDownOutlined/> : ''} {setMany(data?.pairDayData[0]?.priceChange || 0) || 0}%(1d)
                </p>
            </div>
            <div className={'valume'}>
                {
                    [{name: t('Common.Volume'), price: setMany(data?.untrackedVolumeUSD) || 0}, {
                        name: t('Common.Liquidity'),
                        price: setMany(data?.liquidity) || 0
                    }, {name: t('Common.Market Cap'), price: market}, {
                        name: t('Common.FDV'),
                        price: fdv
                    }].map((i: any, ind: number) => {
                        return <div className={`dis butt`} key={ind} style={{marginBottom: '10px'}}>
                            <span>{i.name}</span>
                            <span>{i.price}</span>
                        </div>
                    })
                }
            </div>
            <div className={'swap'}>
                <p>{t("Common.Swap Count")}</p>
                <div className={`dis swapTop`} style={{margin: '1.5% 0'}}>
                    <span>{t('Common.buy')}</span>
                    <span>{t('Common.total')}</span>
                    <span>{t('Common.sell')}</span>
                </div>
                <div className={`dis swapTop`} style={{marginTop: '10px', marginBottom: '-5px'}}>
                    <span>{data?.buyTxs || 0}</span>
                    <span>{Number(data?.sellTxs) + Number(data?.buyTxs)}</span>
                    <span>{data?.sellTxs || 0}</span>
                </div>
                <Progress percent={(Number(data?.buyTxs) / (Number(data?.sellTxs) + Number(data?.buyTxs))) * 100}
                          showInfo={false} strokeColor={'rgb(0,255,71)'} trailColor={'gray'}/>
                <div className={`dis swapTop`}>
                    <span>{setMany(data?.buyVolumeUSD) || 0}</span>
                    <span>{setMany(data?.untrackedVolumeUSD) || 0}</span>
                    <span>{setMany(data?.sellVolumeUSD) || 0}</span>
                </div>
            </div>
            <div className={'valume'}>
                {
                    [{name: t('Common.Created Time'), price: dayjs.unix(create).fromNow()}, {
                        name: t('Common.Total Supply'),
                        price: setMany(data?.tokenTotalSupply) || 0
                    }, {name: t('Common.Initial Pool Amount'), price: setMany(data?.initialReserve)}, {
                        name: t('Common.Pooled') + ' ' + data?.token0?.symbol?.replace(/^\s*|\s*$/g, ""),
                        price: setMany(data?.reserve0)
                    }, {
                        name: t('Common.Pooled') + ' ' + data?.token1?.symbol?.replace(/^\s*|\s*$/g, ""),
                        price: setMany(data?.reserve1)
                    },].map((i: any, ind: number) => {
                        return <div className={`dis butt`} key={ind} style={{marginBottom: '10px'}}>
                            <span>{i.name}</span>
                            <span>{i.price}</span>
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default Left;