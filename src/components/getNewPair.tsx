import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { cloneDeep, differenceBy } from "lodash";
import { judgeStablecoin } from '../../utils/judgeStablecoin.ts'
import { CountContext } from "../Layout.tsx";

function GetNewPair() {
  const { switchChain, }: any = useContext(CountContext);
  const [current, setCurrent] = useState(1);
  const [ethPrice, setEthprice] = useState<string>('0')
  const [moreLoad, setMoreLoad] = useState(false)
  const [polling, setPolling] = useState<boolean>(false)
  const [tableDta, setDta] = useState([])
  const [wait, setWait] = useState<boolean>(true)

  useEffect(() => {
    setEthprice('0')
    setDta([])
    setWait(true)
    setCurrent(1)
    setMoreLoad(true)
  }, [switchChain]);
  const GET_DATA = gql`query LiveNewPair {
  _meta {
    block {
      number
      timestamp
    }
  }
  bundles {
    ${switchChain === 'Polygon' ? 'maticPrice' : switchChain === 'BSC' ? 'bnbPrice' : 'ethPrice'}
  }
  pairs(first: 25, orderBy: createdAtTimestamp,orderDirection:  desc,skip: ${polling ? 0 : (current - 1) * 15}) {
    createdAtTimestamp
    id
    liquidityPositionSnapshots(orderBy: timestamp, orderDirection: desc, first: 1) {
      token0PriceUSD
      token1PriceUSD
    }
    untrackedVolumeUSD
    volumeUSD
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
  const { loading, data, refetch } = useQuery(GET_DATA) as any
  useEffect(() => {
    const interval = setInterval(async () => {
      setPolling(true)
      refetch();
    }, 8000);
    return () => {
      clearInterval(interval);
    }
  }, [])
  const getParams = (par: any) => {
    const a = cloneDeep(par)
    const p = a.map((i: any) => {
      const value = judgeStablecoin(i?.token0?.id, i?.token1?.id, switchChain)
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
    setPolling(false)
  }
  useEffect(() => {
    if (!loading) {
      setWait(false)
      if (data && data?.pairs.length > 0) {
        getParams(data.pairs)
        const abc: any = data.bundles
        let price: any = null
        if (switchChain === 'Polygon') {
          price = abc[0].maticPrice
        } else if (switchChain === 'BSC') {
          price = abc[0].bnbPrice
        } else {
          price = abc[0].ethPrice
        }
        if (price) {
          setEthprice(Number(price).toFixed(2).replace(/\.?0*$/, ''))
        } else {
          setEthprice('0')
        }
      }
    }
  }, [data]);
  useEffect(() => {
    if (moreLoad) {
      refetch()
    }
  }, [moreLoad])
  const changePage = () => {
    setCurrent(current + 1)
    setMoreLoad(true)
  }
  return { ethPrice, moreLoad, wait, tableDta, setDta, changePage }
}

export default GetNewPair;