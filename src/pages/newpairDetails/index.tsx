import Left from './compontent/left.tsx'
import Center from './compontent/center.tsx'
import Right from './compontent/right.tsx'
import './compontent/all.less'
import {useContext, useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {CountContext} from "../../Layout.tsx";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/levi-dexpert/uniswap-v2', cache: new InMemoryCache(),
});

function Index() {
    const {browser}: any = useContext(CountContext)
    const params: any = useParams()
    const [par, setPar] = useState<any>(null)
    const id = params?.id
    const [load, setLoad] = useState<boolean>(false)
    const GET_DATA = gql`query MyQuery {
  pair(id: "${id}"){
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
    }
    PairSixHourData(first: 1, orderBy: startUnix, orderDirection: desc) {
      startUnix
      priceChange
      swapTxns
    }
    liquidity
    pairDayData(first: 1, orderBy: startUnix, orderDirection: desc) {
      priceChange
      startUnix
      swapTxns
    }
    pairHourData(orderBy: startUnix, first: 1, orderDirection: desc) {
      startUnix
      priceChange
      swapTxns
    }
    buyTxs
    sellTxs
    priceUSD
  }
  uniswapFactories {
    pairCount
    id
  }
}`
    const {data, refetch} = useQuery(GET_DATA, {client}) as any
    useEffect(() => {
        const interval = setInterval(async () => {
            refetch()
        }, 8000);
        return () => {
            clearInterval(interval);
        }
    }, [])
    useEffect(() => {
        if (data?.pair) {
            setPar(data?.pair)
            setLoad(true)
        }
    }, [data])
    return (
        <>
            {
                load ? <div className={'NewpairDetails'} style={{flexDirection: browser ? 'row' : 'column'}}>
                    <Left par={par}/>
                    <Center par={par}/>
                    <Right/>
                </div> : ''
            }
        </>

    );
}

export default Index;