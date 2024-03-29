import InfiniteScroll from "react-infinite-scroll-component";
import {Input, Segmented, Select, Spin} from 'antd'
import {useEffect, useRef, useState} from "react";
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
import {gql} from 'graphql-tag'
import {cloneDeep, differenceBy} from 'lodash';
import {SearchOutlined} from '@ant-design/icons'
import Right from "./components/right.tsx";
import NewPair from './components/newPairDate.tsx'
import {ethers} from 'ethers';
import Loading from '../../components/loading.tsx'

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/levi-dexpert/uniswap-v2', cache: new InMemoryCache(),
});

function Index() {
    const hei = useRef<any>()
    const page = 25
    const [select, setSelect] = useState('newPair')
    // const [page, setPage] = useState(30);
    const [current, setCurrent] = useState(1);
    const [time, setTime] = useState('24h')
    const [tableDta, setDta] = useState([])
    const [tableDtaLoad, setDtaLoad] = useState(true)
    const [tableHei, setTableHei] = useState('')
    const [moreLoad, setMoreLoad] = useState(false)
    const [nextLoad, setNextLoad] = useState(false)
    const [gas, setGas] = useState<string>('')
    const [ethPrice, setEthprice] = useState<string>('')
    const [polling, setPolling] = useState<boolean>(false)
    const GET_DATA = gql`query LiveNewPair {
  _meta {
    block {
      number
      timestamp
    }
  }
  bundles {
    ethPrice
  }
  pairs(first: ${page}, orderBy: createdAtTimestamp,orderDirection:  desc,skip: ${polling ? 0 : (current - 1) * 15}) {
    createdAtTimestamp
    id
    liquidityPositionSnapshots(orderBy: timestamp, orderDirection: desc, first: 1) {
      token0PriceUSD
      token1PriceUSD
    }
    token0 {
      id
      name
      symbol
      totalLiquidity
      totalSupply
    }
    token1 {
      id
      name
      symbol
      totalLiquidity
      totalSupply
    }
    reserve0
    reserve1
    PairFiveMinutesData(first: 1, orderBy: startUnix, orderDirection: desc) {
      priceChange
      startUnix
      swapTxns
      volumeUSD
      buyTxs
      sellTxs
    }
    PairSixHourData(first: 1, orderBy: startUnix, orderDirection: desc) {
      startUnix
      priceChange
      volumeUSD
      swapTxns
      buyTxs
      sellTxs
    }
    liquidity
    pairDayData(first: 1, orderBy: startUnix, orderDirection: desc) {
      priceChange
      volumeUSD
      startUnix
      swapTxns
      sellTxs
      buyTxs
    }
    pairHourData(orderBy: startUnix, first: 1, orderDirection: desc) {
      startUnix
      priceChange
      swapTxns
      volumeUSD
      sellTxs
      buyTxs
    }
    buyTxs
    priceUSD
  }
  uniswapFactories {
    pairCount
    id
  }
}`
    const getParams = (par: any) => {
        const dataLi = []
        const a = cloneDeep(par)
        const STABLECOINS = [
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 'WETH',
            '0x6b175474e89094c44da98b954eedeac495271d0f', 'DAI',
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 'USDC',
            '0xdac17f958d2ee523a2206206994597c13d831ec7', 'USDT',
        ]
        const p = a.map((i: any) => {
            if (STABLECOINS.includes(i?.token0?.id.toLowerCase()) && !STABLECOINS.includes(i?.token1?.id.toLowerCase())) {
                const token0 = i.token0
                i.token0 = i.token1
                i.token1 = token0
                i.sure = true
            }
            return i
        })
        p.map((i: any) => {
            if (!STABLECOINS.includes(i?.token0?.id.toLowerCase())) {
                dataLi.push(i?.token0?.id)
            }
        })
        if (p.length !== 25) {
            setNextLoad(true)
        }
        if (polling) {
            const abcd: any = differenceBy(p, tableDta, 'id')
            if (abcd.length > 0) {
                const at: any = abcd.concat(tableDta)
                setDta(at)
            }
        } else {
            if (current !== 1) {
                const ab = tableDta.concat(p)
                setDta(ab)
            } else {
                setDta(p)
            }
        }
        setMoreLoad(false)
        setDtaLoad(false)
        setPolling(false)
    }
    useEffect(() => {
        if (hei && hei.current) {
            const h = hei.current.scrollHeight
            const w = window.innerHeight
            const o: any = w - h - 25 - 54 - 90
            setTableHei(o)
        }
        getGas()
    }, [])
    const {loading, data, refetch} = useQuery(GET_DATA, {client}) as any
    const getGas = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/BhTc3g2lt1Qj3IagsyOJsH5065ueK1Aw')
        const gasAVGPrice = await provider.send('eth_gasPrice', [])
        const gasAVGPriceInWei = parseInt(gasAVGPrice, 16)
        if (gasAVGPriceInWei) {
            const abc = Number(gasAVGPriceInWei) / (10 ** 9)
            setGas(abc.toFixed(3))
        }
    }
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                getParams(data.pairs)
                const abc = data.bundles
                const price = abc[0].ethPrice
                setEthprice(Number(price).toFixed(3))
            }
        }
    }, [data]);

    const handleChange = (value: string) => {
        setSelect(value)
    };

    const changSeg = (e: string) => {
        setTime(e)
    }
    const changePage = () => {
        if (!nextLoad) {
            setCurrent(current + 1)
            setMoreLoad(true)
            refetch()
        }
    }
    useEffect(() => {
        let interval: any = null
        if (!tableDtaLoad) {
            interval = setInterval(async () => {
                setPolling(true)
                refetch();
            }, 8000);
        }
        return () => {
            clearInterval(interval);
        }
    }, [tableDtaLoad])


    const changeInput = (e: any) => {
        console.log(e)
    }
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 2%'}}>
            <div className={'indexBox'}>
                {/* top*/}
                <div ref={hei} className={`indexTop dis`}>
                    <Select
                        onChange={handleChange}
                        value={select}
                        className={'indexSelect'}
                        popupClassName={'indexSelectPopup'}
                        style={{width: '12%'}}
                        options={[
                            {value: 'newPair', label: 'New Pairs'},
                            {value: 'trading', label: 'Trading'},
                            {value: 'watch', label: 'Watch List'},
                        ]}
                    />
                    <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} className={'homeSegmented'}
                               defaultValue={'24h'}/>
                    <Input suffix={<SearchOutlined style={{fontSize: '16px', color: 'white'}}/>} onChange={changeInput}
                           allowClear className={'indexInput'}/>
                    <div className={`indexRight dis`}>
                        <p><img src="/eth.svg" alt=""/><span>$:{ethPrice}</span></p>
                        <p><img src="/gas.svg" alt=""/><span>{gas}</span></p>
                    </div>
                </div>
                <div className={'indexNewPair'}>
                    {/*tittle*/}
                    <div className={'indexNewPairTitle'}>
                        {
                            ['Name', 'Price($)', time + ' Change(%)', 'Create Time', 'Pooled Amt', 'Swap Count', 'Liquidity', 'Links'].map((i: string, ind: number) => {
                                return <p className={`${ind === 0 ? 'disCen' : 'textAlign'} homeTableTittle`} key={ind}>
                                    {
                                        ind === 0 &&
                                        <img src="/collect.svg" alt="" style={{marginRight: '5px'}} width={'15px'}/>
                                    }
                                    <span>{i}</span>
                                </p>

                            })
                        }
                    </div>
                    <div className={`indexNewPairBody scrollStyle`} id={'scrollableNew'}
                         style={{height: tableHei + 'px', overflowY: 'auto'}}>
                        <InfiniteScroll
                            hasMore={true}
                            scrollableTarget="scrollableNew"
                            next={changePage}
                            loader={null}
                            dataLength={tableDta.length}>
                            {
                                // tableDtaLoad ? <div className={'indexNewSkeleton'}>
                                //     <Spin size={'large'} className={'indexNewSpin'}>
                                //     </Spin>
                                // </div>
                                    tableDtaLoad? <Loading />: tableDta.length > 0 ?
                                    <NewPair tableDta={tableDta} time={time} setDta={setDta}/> : <p>no Data</p>
                            }
                        </InfiniteScroll>
                    </div>
                    {
                        moreLoad &&  <Loading  status={'none'}/>
                    }
                </div>
            </div>
            <Right/>
        </div>
    );
}

export default Index;