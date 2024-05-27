import { Select } from "antd";
import { LoadingOutlined, } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../../components/loading.tsx";
import NewPair from "./newPairDate.tsx";
import { useContext, useEffect, useRef, useState } from "react";
import { CountContext } from "../../../Layout.tsx";
import newPair from "../../../components/getNewPair.tsx";
import { useTranslation } from "react-i18next";
import { getGas } from "../../../../utils/getGas.ts";
import Nodata from '../../../components/Nodata.tsx';
import ChooseChain from '../../../components/chooseChain.tsx'
function Left() {
    const hei = useRef<any>()
    const { ethPrice, moreLoad, tableDta, setDta, wait, changePage, } = newPair() as any
    const { browser, switchChain }: any = useContext(CountContext);
    const [tableHei, setTableHei] = useState('')
    const [select, setSelect] = useState('newPair')
    const time = '24h'
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
            const o: any = w - h - 120
            setTableHei(o)
        }
    }, [])

    useEffect(() => {
        gasOb()
        setGasLoad(true)
    }, [switchChain]);
    const handleChange = (value: string) => {
        setSelect(value)
    };
    const { t } = useTranslation();
    return (
        <div className={'indexBox'} style={{ width: browser ? '74%' : 'auto' }}>
            {/* top*/}
            <div ref={hei} className={`indexTop dis`}>
                <div className="disDis">
                    <Select
                        onChange={handleChange}
                        value={select}
                        className={'indexSelect'}
                        popupClassName={'indexSelectPopup'}
                        style={{ width: '120px' }}
                        options={[
                            { value: 'newPair', label: 'New Pairs' },
                            { value: 'trading', label: 'Trading', disabled: true },
                            { value: 'watch', label: 'Watch List', disabled: true },
                        ]}
                    />
                    <ChooseChain />
                </div>
                {/* <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} className={'homeSegmented'}
                    defaultValue={'24h'} /> */}
                <div className={`indexRight dis`}>
                    <p style={{ marginRight: '10px' }}>
                        <img
                            src={switchChain === 'Polygon' ? '/PolygonCoin.svg' : switchChain === 'BSC' ? '/BNBChain.svg' : "/EthereumChain.svg"}
                            loading={'lazy'}
                            alt="" />{wait ? <LoadingOutlined /> :
                                <span>$:{ethPrice}</span>}</p>
                    <p><img loading={'lazy'} src="/gas.svg" alt="" />
                        {
                            gasLoad ? <LoadingOutlined /> : <span>{gas}</span>
                        }
                    </p>
                </div>
            </div>
            <div className="scrollStyle" style={{ width: '100%', overflow: browser ? 'hidden' : 'auto hidden' }}>
                <div className={`indexNewPair`}
                    style={{ width: browser ? '100%' : '120vh' }}>
                    {/*tittle*/}
                    <div className={'indexNewPairTitle'}>
                        {
                            [t('Market.Name'), `${t('Market.Price')}($)`, time + ' Change(%)', t('Market.Create Time'), t('Market.Pooled Amt'), t('Market.Swap Count'), t('Market.Liquidity'), t('Market.Links')].map((i: string, ind: number) => {
                                return <p className={` homeTableTittle`}
                                    key={ind}>
                                    {
                                        ind === 0 &&
                                        <img loading={'lazy'} src="/collect.svg" alt=""
                                            style={{ marginRight: '5px', display: 'none' }}
                                            width={'15px'} />
                                    }
                                    <span>{i}</span>
                                </p>
                            })
                        }
                    </div>
                    <div className={`indexNewPairBody scrollStyle`} id={'scrollableNew'}
                        style={{ height: browser ? tableHei + 'px' : '60vh', overflowY: 'auto' }}>
                        <InfiniteScroll
                            hasMore={true}
                            scrollableTarget="scrollableNew"
                            next={changePage}
                            loader={null}
                            dataLength={tableDta.length}>
                            {
                                wait ? <Loading status={'20'} /> : tableDta.length > 0 ?
                                    <NewPair tableDta={tableDta} time={time} setDta={setDta} /> : <Nodata />

                            }
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
            <div style={{ visibility: moreLoad && tableDta.length > 0 ? 'initial' : 'hidden' }}>
                <Loading status={'none'} /></div>
        </div>
    );
}

export default Left;