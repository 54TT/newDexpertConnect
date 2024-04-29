import InfiniteScroll from "react-infinite-scroll-component";
import {Input, Segmented, Select} from 'antd'
import {useContext, useEffect, useRef, useState} from "react";
import {SearchOutlined} from '@ant-design/icons'
import Right from "./components/right.tsx";
import NewPair from './components/newPairDate.tsx'
import {ethers} from 'ethers';
import Loading from '../../components/loading.tsx'
import {CountContext} from "../../Layout.tsx";
import newPair from '../../components/getNewPair.tsx'
import {MessageAll} from "../../components/message.ts";
function Index() {
    const {ethPrice, moreLoad, tableDta, setDta, changePage, tableDtaLoad,getPage} = newPair() as any
    const hei = useRef<any>()
    const {browser,}: any = useContext(CountContext);
    const [select, setSelect] = useState('newPair')
    const [time, setTime] = useState('24h')
    const [tableHei, setTableHei] = useState('')
    const [gas, setGas] = useState<string>('')
    useEffect(() => {
        if (hei && hei.current) {
            const h = hei.current.scrollHeight
            const w = window.innerHeight
            const o: any = w - h - 50 - 90
            setTableHei(o)
        }
        getGas()
        getPage(25)
    }, [])
    const getGas = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/BhTc3g2lt1Qj3IagsyOJsH5065ueK1Aw')
        const gasAVGPrice = await provider.send('eth_gasPrice', [])
        const gasAVGPriceInWei = parseInt(gasAVGPrice, 16)
        if (gasAVGPriceInWei) {
            const abc = Number(gasAVGPriceInWei) / (10 ** 9)
            setGas(parseFloat(abc.toFixed(1)).toString())
        }
    }
    const handleChange = (value: string) => {
        setSelect(value)
    };
    const changSeg = (e: string) => {
        setTime(e)
    }
    const changeInput = (e: any) => {
        console.log(e)
    }
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 2%',
            flexDirection: browser ? 'row' : 'column'
        }}>
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
                        <Input autoComplete={'off'} suffix={<SearchOutlined style={{fontSize: '16px', color: 'white', display: 'none'}}/>}
                               onChange={changeInput}
                               allowClear className={'indexInput'}/>
                    }
                    <div className={`indexRight dis`}>
                        <p style={{marginRight: '10px'}}><img src="/eth.svg"  loading={'lazy'} alt=""/><span>$:{ethPrice}</span></p>
                        <p><img loading={'lazy'} src="/gas.svg" alt=""/><span>{gas}</span></p>
                    </div>
                </div>
                <div style={{width: '100%', overflow: browser ? 'hidden' : 'auto'}}>
                    <div className={`indexNewPair`}
                         style={{width: browser ? '100%' : '96vh'}}>
                        {/*tittle*/}
                        <div className={'indexNewPairTitle'}>
                            {
                                ['Name', 'Price($)', time + ' Change(%)', 'Create Time', 'Pooled Amt', 'Swap Count', 'Liquidity', 'Links'].map((i: string, ind: number) => {
                                    return <p className={`${ind === 0 ? 'disCen' : 'textAlign'} homeTableTittle`}
                                              key={ind}>
                                        {
                                            ind === 0 &&
                                            <img loading={'lazy'} src="/collect.svg" alt="" style={{marginRight: '5px', display: 'none'}}
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
                                    tableDtaLoad ? <Loading status={'20'}/> : tableDta.length > 0 ?
                                        <NewPair tableDta={tableDta} time={time} setDta={setDta}/> : <p>no Data</p>
                                }
                            </InfiniteScroll>
                        </div>
                        {
                            moreLoad && <Loading status={'none'}/>
                        }
                    </div>
                </div>
            </div>

            <Right/>
        </div>
    );
}

export default Index;