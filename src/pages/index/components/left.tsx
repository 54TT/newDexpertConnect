import {Input, Segmented, Select} from "antd";
import {LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../../components/loading.tsx";
import NewPair from "./newPairDate.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {CountContext} from "../../../Layout.tsx";
import newPair from "../../../components/getNewPair.tsx";
import {useTranslation} from "react-i18next";
import {getGas} from "../../../../utils/getGas.ts";
import Nodata from '../../../components/Nodata.tsx';
function Left() {
    const hei = useRef<any>()
    const {ethPrice, moreLoad, tableDta, setDta, wait, changePage, getPage} = newPair() as any
    const {browser, switchChain}: any = useContext(CountContext);
    const [tableHei, setTableHei] = useState('')
    const [select, setSelect] = useState('newPair')
    const [time, setTime] = useState('24h')
    const [gas, setGas] = useState<string>('')
    const [gasLoad, setGasLoad] = useState(true)
    const gasOb = async () => {
        const data: any = await getGas(switchChain)
        if (data) {
            setGasLoad(false)
            setGas(data)
        }
    }
    useEffect(() => {
        if (hei && hei.current) {
            const h = hei.current.scrollHeight
            const w = window.innerHeight
            const o: any = w - h - 50 - 90
            setTableHei(o)
        }
        getPage(25)
    }, [])
    useEffect(() => {
        gasOb()
        setGasLoad(true)
    }, [switchChain]);
    const handleChange = (value: string) => {
        setSelect(value)
    };
    const changSeg = (e: string) => {
        setTime(e)
    }
    const {t} = useTranslation();
    return (
        <div className={'indexBox'} style={{width: browser ? '74%' : 'auto'}}>
            {/* top*/}
            <div ref={hei} className={`indexTop dis`}>
                <Select
                    onChange={handleChange}
                    value={select}
                    className={'indexSelect'}
                    popupClassName={'indexSelectPopup'}
                    style={{width: '12%', display: 'none'}}
                    options={[
                        {value: 'newPair', label: 'New Pairs'},
                        {value: 'trading', label: 'Trading'},
                        {value: 'watch', label: 'Watch List'},
                    ]}
                />
                <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} className={'homeSegmented'}
                           defaultValue={'24h'}/>
                {
                    browser &&
                    <Input autoComplete={'off'}
                           suffix={<SearchOutlined style={{fontSize: '16px', color: 'white', display: 'none'}}/>}
                           allowClear className={'indexInput'}/>
                }
                <div className={`indexRight dis`}>
                    <p style={{marginRight: '10px'}}><img src="/eth.svg" loading={'lazy'}
                                                          alt=""/><span>$:{ethPrice}</span></p>
                    <p><img loading={'lazy'} src="/gas.svg" alt=""/>
                        {
                            gasLoad ? <LoadingOutlined/> : <span>{gas}</span>
                        }
                    </p>
                </div>
            </div>
            <div style={{width: '100%', overflow: browser ? 'hidden' : 'auto'}}>
                <div className={`indexNewPair`}
                     style={{width: browser ? '100%' : '96vh'}}>
                    {/*tittle*/}
                    <div className={'indexNewPairTitle'}>
                        {
                            [t('Market.Name'), `${t('Market.Price')}($)`, time + ' Change(%)', t('Market.Create Time'), t('Market.Pooled Amt'), t('Market.Swap Count'), t('Market.Liquidity'), t('Market.Links')].map((i: string, ind: number) => {
                                return <p className={`${ind === 0 ? 'disCen' : 'textAlign'} homeTableTittle`}
                                          key={ind}>
                                    {
                                        ind === 0 &&
                                        <img loading={'lazy'} src="/collect.svg" alt=""
                                             style={{marginRight: '5px', display: 'none'}}
                                             width={'15px'}/>
                                    }
                                    <span>{i}</span>
                                </p>

                            })
                        }
                    </div>
                    <div className={`indexNewPairBody scrollStyle`} id={'scrollableNew'}
                         style={{height: browser ? tableHei + 'px' : '60vh', overflowY: 'auto'}}>
                        <InfiniteScroll
                            hasMore={true}
                            scrollableTarget="scrollableNew"
                            next={changePage}
                            loader={null}
                            dataLength={tableDta.length}>
                            {
                                wait ? <Loading status={'20'}/> : tableDta.length > 0 ?
                                    <NewPair tableDta={tableDta} time={time} setDta={setDta}/> : <Nodata/>

                            }
                        </InfiniteScroll>
                    </div>
                    {
                        moreLoad && <Loading status={'none'}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default Left;