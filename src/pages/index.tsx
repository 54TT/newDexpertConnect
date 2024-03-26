import {Segmented, Select, Table} from 'antd'
import {useContext, useEffect, useRef, useState} from "react";
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
import {gql} from 'graphql-tag'
import {setMany} from '../../utils/change.ts'
import {cloneDeep} from 'lodash';
import {CountContext} from '../Layout.tsx'
import InfiniteScroll from "react-infinite-scroll-component";
const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/levi-dexpert/uniswap-v2', cache: new InMemoryCache(),
});

function Index() {
    const {headHeight,botHeight}: any = useContext(CountContext)
    const hei = useRef<any>()
    const [select, setSelect] = useState('newPair')
    const [page, setPage] = useState(15);
    const [current, setCurrent] = useState(1);
    const [time, setTime] = useState('24h')
    const [tableDta, setDta] = useState([])
    const [tableDtaLoad, setDtaLoad] = useState(true)
    const [tableHei, setTableHei] = useState('')
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
  pairs(first: ${page}, orderBy: createdAtTimestamp,skip: ${(current - 1) * 15}) {
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
        setDta(p)
        setDtaLoad(false)
    }
    useEffect(() => {
        if (hei && hei.current&&botHeight&&headHeight) {
            const h = hei.current.scrollHeight
            const w = window.innerHeight
            const o: any = w - h - headHeight - 90-botHeight
            setTableHei(o)
        }
    }, [botHeight,headHeight])
    const {loading, data, refetch} = useQuery(GET_DATA, {client}) as any
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                getParams(data.pairs)
            }
        }
    }, [loading]);
    const handleChange = (value: string) => {
        setSelect(value)
    };

    function extractDecimalFromString(inputString: any) {
        // 使用正则表达式匹配小数点后两位的数字
        const match = inputString.match(/(\d+\.\d{1,2})/);
        // 如果有匹配，返回匹配的结果；否则返回 null
        return match ? match[1] : null;
    }

    const columns: any = [
        {
            fixed: 'left',
            title: <p className={`disCen homeTableTittle`}><img src="/collect.svg" alt=""
                                                                                    style={{marginRight: '5px'}}
                                                                                    width={'15px'}/><span>Name</span>
            </p>,
            dataIndex: 'name',
            render: (_: any, record: any) => <div className={`disCen indexTableLogo`}>
                <img src="/collect.svg" alt=""/>
                <div className={'disCen'} style={{flexDirection: 'column'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span>{record?.token0?.symbol ? record?.token0?.symbol.length > 7 ? record?.token0?.symbol.slice(0, 5) + '/' : record?.token0?.symbol + '/' : ''}</span>
                        <span
                            style={{color: 'rgb(98,98,98)'}}>{record?.token1?.symbol ? record?.token1?.symbol.length > 7 ? record?.token1?.symbol.slice(0, 5) : record?.token1?.symbol : ''}</span>
                    </div>
                    <div>{record?.id ? record?.id.length > 13 ? record?.id.slice(0, 5) + '...' + record?.id.slice(-4) : record?.id : ''}</div>
                </div>
            </div>,
        },
        {
            title: <p className={'homeTableTittle'}>Price</p>,
            dataIndex: 'age', align: 'center',
            render: (_: any, record: any) => {
                return <p
                    style={{color: "white"}}>{Number(record?.priceUSD) ? setMany(record?.priceUSD) : 0}</p>
            }
        },
        {
            title: <p  className={'homeTableTittle'}>{time} Change</p>, align: 'center',
            dataIndex: 'txCount',
            render: (_: any, record: any) => {
                const data = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                const a: any = data && data.length > 0 ? Number(data[0]?.priceChange) ? data[0]?.priceChange.includes('.000') ? 0 : Number(data[0]?.priceChange).toFixed(3) : 0 : 0
                const b = a ? a.includes('e+') || a.includes('e-') ? setMany(a) : a : 0
                return <span
                    style={{
                        color: Number(a) > 0 ? 'rgb(0,255,71)' : Number(a) === 0 ? 'white' : 'rgb(213,9,58)',
                    }}>{b !== 0 ? (parseFloat(Number(b).toFixed(2))).toString() + '%' : '0'}</span>
            }
        },
        {
            title: <p  className={'homeTableTittle'}>Pooled Amt</p>, align: 'center',
            dataIndex: 'reserve0',
            render: (_: any, record: any) => {
                if (record?.token0?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && record?.token1?.id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
                    return <span style={{color: 'white'}}>-</span>
                } else if (record.sure) {
                    const ab = setMany(record?.reserve0.toString())
                    return <span
                        style={{color: 'white'}}>{Number(ab) ? parseFloat(Number(ab).toFixed(2)) + '  ' : ab + '  '}ETH</span>
                } else {
                    const ac = setMany(record?.reserve1.toString())
                    return <span
                        style={{color: 'white'}}>{Number(ac) ? parseFloat(Number(ac).toFixed(2)) + '  ' : ac + '  '}ETH</span>
                }
            }
        },
        {
            title: <p  className={'homeTableTittle'}>Swap Count</p>, align: 'center',
            dataIndex: 'txCount',width:100,
            render: (_: any, record: any) => {
                const data = time === '24h' ? record?.pairDayData : time === '6h' ? record?.PairSixHourData : time === '1h' ? record?.pairHourData : record?.PairFiveMinutesData
                return <span style={{color: 'white'}}>{data && data.length > 0 ? Number(data[0]?.swapTxns) : 0}</span>
            }
        },
        {
            title: <p  className={'homeTableTittle'}>Liquidity</p>, align: 'center',
            dataIndex: 'tags',
            render: (_: any, record: any) => {
                const data: any = record?.liquidity && Number(record.liquidity) ? setMany(record.liquidity) : 0
                let b: any
                if (data && data.includes('K')) {
                    b = data.includes('.00') ? parseInt(data) + 'K' : extractDecimalFromString(data) + 'K'
                } else if (data && data.includes('M')) {
                    b = data.includes('.00') ? parseInt(data) + 'M' : extractDecimalFromString(data) + 'M'
                } else {
                    if (Number(data)) {
                        b = parseFloat(Number(data).toFixed(3))
                    } else {
                        b = data
                    }
                }
                return <span style={{color: 'white'}}>{b}</span>
            }
        },
        {
            title: <p  className={'homeTableTittle'}>Links</p>,
            align: 'center',
            render: () => {
                return <p className={`dis indexTableLogo`} style={{marginRight: '6px'}}><img src="/ethLogo.svg" alt=""/><img
                    src="/feima.svg "
                    alt=""/><img
                    src="/huo.svg" alt=""/></p>
            }
        },
    ];
    const changSeg = (e: string) => {
        setTime(e)
    }

    const changeAll = () => {
        refetch()
        setPage(10)
        setCurrent(2)
    }

    const changePage = () => {
        console.log(11111111111)
        // if (!status) {
        //     getTweet(page + 1)
        //     setPage(page + 1)
        //     setIconLoad(true)
        // }
    }

    return (
        <div className={'indexBox'}>
            <p onClick={changeAll}>22222222222222222</p>
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
                <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} defaultValue={'24h'}/>
                <input type="text"/>
                <div className={`indexRight dis`}>
                    <p><img src="/eth.svg" alt=""/><span>$:121</span></p>
                    <p><img src="/gas.svg" alt=""/><span>abc</span></p>
                </div>
            </div>
            {/*    data top*/}
            <InfiniteScroll
                hasMore={true}
                next={changePage}
                loader={null}
                dataLength={tableDta.length}>
                <Table columns={columns}
                       scroll={{x: 'max-content', y: tableHei,}}
                       rowKey={(record: any) => record?.token0?.id + record?.token1?.id}
                       className={'indexTable'}
                       loading={tableDtaLoad}
                       onRow={(record) => {
                           return {
                               onClick: (event) => {
                                   console.log(event)
                                   console.log(record)
                               },
                           };
                       }}
                       dataSource={tableDta}
                       pagination={false} bordered={false}/>
            </InfiniteScroll>

        </div>
    );
}

export default Index;