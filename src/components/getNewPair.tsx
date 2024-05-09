import {ApolloClient, InMemoryCache,gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import {cloneDeep, differenceBy} from "lodash";
const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/levi-dexpert/uniswap-v2', cache: new InMemoryCache(),
});

function GetNewPair() {
    const [current, setCurrent] = useState(1);
    const [ethPrice, setEthprice] = useState<string>('')
    const [moreLoad, setMoreLoad] = useState(false)
    const [polling, setPolling] = useState<boolean>(false)
    const [tableDta, setDta] = useState([])
    const [tableDtaLoad, setDtaLoad] = useState(true)
    const [page, setPage] = useState<any>(5)
    const getPage = (name: number) => {
        setPage(name)
    }
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
    untrackedVolumeUSD
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
      buyTxs
      sellTxs
    }
    PairSixHourData(first: 1, orderBy: startUnix, orderDirection: desc) {
      startUnix
      priceChange
      swapTxns
      buyTxs
      sellTxs
    }
    liquidity
    pairDayData(first: 1, orderBy: startUnix, orderDirection: desc) {
      priceChange
      startUnix
      swapTxns
      sellTxs
      buyTxs
    }
    pairHourData(orderBy: startUnix, first: 1, orderDirection: desc) {
      startUnix
      priceChange
      swapTxns
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
    const {loading, data, refetch} = useQuery( GET_DATA, {client}) as any
    useEffect(() => {
        const interval = setInterval(async () => {
            setPolling(true)
            refetch();
        }, 8000);
        return () => {
            clearInterval(interval);
        }
    }, [])
    useEffect(() => {
        if (page) {
            setCurrent(1)
            refetch()
        }
    }, [page]);
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
        if (polling) {
            const abcd: any = differenceBy(p, tableDta, 'id')
            if (abcd.length > 0) {
                const at: any = abcd.concat(tableDta)
                setDta(at)
            }
        } else {
            if (current !== 1) {
                const abcd: any = differenceBy(p, tableDta, 'id')
                const ab = tableDta.concat(abcd)
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
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                getParams(data.pairs)
                const abc = data.bundles
                const price = abc[0].ethPrice
                setEthprice(parseFloat(Number(price).toFixed(1)).toString())
            }
        }
    }, [data]);
    const changePage = () => {
        setCurrent(current + 1)
        setMoreLoad(true)
        refetch()
    }
    return {ethPrice, moreLoad, tableDta, getPage, setDta, changePage, tableDtaLoad}
}

export default GetNewPair;