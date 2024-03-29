import {CaretDownOutlined, CaretUpOutlined, CheckCircleOutlined} from '@ant-design/icons'
import {Popover, Progress} from 'antd'
import {useEffect, useState} from "react";
import {setMany, simplify} from '../../../../utils/change.ts'
import copy from 'copy-to-clipboard'
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime); // 使用相对时间插件

function Left({par}: any) {
    console.log(par)
    const h = window.innerHeight - 25 - 54
    const [data, setData] = useState(par)
    const [status, setStatus] = useState(false)
    const [pairStatus, setPairStatus] = useState(false)
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
    const float = data?.pairDayData[0]?.priceChange && Number(data?.pairDayData[0]?.priceChange) > 0 ? 1 : Number(data?.pairDayData[0]?.priceChange) < 0 ? -1 : 0
    const market = Number(data?.token0?.totalSupply) && Number(data?.priceUSD) ? setMany(Number(data?.token0?.totalSupply) * Number(data?.priceUSD)) : 0
    const create = data?.createdAtTimestamp.toString().length > 10 ? Number(data.createdAtTimestamp.toString().slice(0, 10)) : Number(data.createdAtTimestamp)
    const pooled = data?.token0?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && data?.token1?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 1 : data.sure ? (Number(setMany(data?.reserve0.toString())) ? parseFloat(Number(setMany(data?.reserve0.toString())).toFixed(2)) + '  ' : setMany(data?.reserve0.toString()) + '  ') + 'ETH' : (Number(setMany(data?.reserve1.toString())) ? parseFloat(Number(setMany(data?.reserve1.toString())).toFixed(2)) + '  ' : setMany(data?.reserve1.toString()) + '  ')+'ETH'
    return (
        <div className={`NewpairDetailsOne scrollStyle`} style={{height: h + 'px'}}>
            {/*top*/}
            <div className={`top dis`}>
                <div>
                    <img src="/logo1.svg" alt=""/>
                    <p>
                        <span>{simplify(data?.token0?.symbol)}</span>
                        <span>{simplify(data?.token1?.symbol)}</span>
                    </p>
                </div>
                <p onClick={() => {
                    if (data?.collect) {
                        setData({...data, collect: false})
                    } else {
                        setData({...data, collect: true})
                    }
                }}><img src={data?.collect ? '/collectSelect.svg' : "/collect.svg"} alt=""/></p>
            </div>
            {/*address*/}
            <div className={`address dis`}>
                <p><span>CA:</span><span>{simplify(data?.token0?.id)}</span>
                    <Popover placement="top" title={''} overlayClassName={'newPairLeftPopover'}
                             content={status ? 'CA Copied successfully' : 'copy to clipboard'}>
                        {
                            status ? <CheckCircleOutlined style={{marginLeft: '5px'}}/> :
                                <img src="/copy.svg" alt="" onClick={() => {
                                    copy(data?.token0?.id)
                                    setStatus(true)
                                }}/>
                        }
                    </Popover>
                </p>
                <p><span>Pair:</span><span>{simplify(data?.id)}</span>
                    <Popover placement="top" title={''} overlayClassName={'newPairLeftPopover'}
                             content={pairStatus ? 'Pair Copied successfully' : 'copy to clipboard'}>
                        {
                            pairStatus ? <CheckCircleOutlined style={{marginLeft: '5px'}}/> :
                                <img src="/copy.svg" alt="" onClick={() => {
                                    copy(data?.id)
                                    setPairStatus(true)
                                }}/>
                        }
                    </Popover>
                </p>
            </div>
            <div className={`dis img`}>
                <div>
                    <img src="/website.svg" alt=""/>
                </div>
                <div>
                    <img src="/titter.svg" alt=""/>
                </div>
                <div>
                    <img src="/telegram.svg" alt=""/>
                </div>
                <div>
                    <img src="/information.svg" alt=""/>
                </div>
            </div>
            <div className={`price dis`}>
                <p>$
                    {Number(data?.priceUSD) ? setMany(data?.priceUSD) : 0}
                </p>
                <p style={{color: float > 0 ? 'rgb(0, 255, 71)' : float < 0 ? 'rgb(213, 9, 58)' : 'white'}}>{float > 0 ?
                    <CaretUpOutlined
                        style={{marginTop: '2px'}}/> : float < 0 ?
                        <CaretDownOutlined
                            style={{marginTop: '2px'}}/> : ''} {setMany(data?.pairDayData[0]?.priceChange || 0) || 0}%(1d)
                </p>
            </div>
            <div className={'valume'}>
                {
                    [{name: 'Volume', price: data?.pairDayData[0]?.volumeUSD || 0}, {name: 'Liquidity', price: setMany(data?.liquidity) || 0}, {name: 'Market Cap', price: market}, {name: 'FDV', price: market},].map((i: any, ind: number) => {
                        return <div className={`dis butt`} key={ind} style={{marginBottom: '10px'}}>
                            <span>{i.name}</span>
                            <span>{i.price}</span>
                        </div>
                    })
                }
            </div>
            <div className={'swap'}>
                <p>Swap Count</p>
                <div className={`dis swapTop`} style={{margin: '1.5% 0'}}>
                    <span>Buys</span>
                    <span>Total</span>
                    <span>Sells</span>
                </div>
                <div className={`dis swapTop`} style={{marginTop: '10px', marginBottom: '-5px'}}>
                    <span>{data?.buyTxs || 0}</span>
                    <span>{setMany(data?.token0?.totalSupply) || 0}</span>
                    <span>——</span>
                </div>
                <Progress percent={50} showInfo={false} strokeColor={'rgb(0,255,71)'}/>
                <div className={`dis swapTop`}>
                    <span>——</span>
                    <span>——</span>
                    <span>——</span>
                </div>
            </div>
            <div className={'valume'}>
                {
                    [{name: 'Created Time', price: dayjs.unix(create).fromNow()}, {name: 'Total Supply', price: setMany(data?.token0?.totalSupply) || 0}, {name: 'Initial Pool Amount', price: pooled}, {name: 'Pooled WETH', price: '——'}, {name: 'Pooled bTC', price: '——'},].map((i: any, ind: number) => {
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