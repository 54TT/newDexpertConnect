import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import {cloneDeep, differenceBy} from "lodash";
import {judgeStablecoin} from '../../utils/judgeStablecoin.ts'

const client = new ApolloClient({
    // uri: 'https://api.thegraph.com/subgraphs/id/Qmdxr4hqsky9SDjMqKuQnMNvLGQMFk3AeoA7v7t3sMHBaP',
    uri: 'http://165.232.163.158:8000/subgraphs/name/levi/uniswapv2',
    cache: new InMemoryCache(),
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
     FDV
    MKTCAP
    initialReserve0
    initialReserve1
    initialReserve
    tokenTotalSupply
    buyVolumeUSD
    sellVolumeUSD
  }
  uniswapFactories {
    pairCount
    id
  }
}`
    const {loading, data, refetch} = useQuery(GET_DATA, {client}) as any
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
        const a = cloneDeep(par)
        const p = a.map((i: any) => {
            const value = judgeStablecoin(i?.token0?.id, i?.token1?.id)
            if (value === 1) {
                const token0 = i.token0
                i.token0 = i.token1
                i.token1 = token0
            }
            return i
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