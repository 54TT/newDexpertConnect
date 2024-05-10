import Left from './compontent/left.tsx'
import Center from './compontent/center.tsx'
import Right from './compontent/right.tsx'
import './compontent/all.less'
import {useContext, useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {CountContext} from "../../Layout.tsx";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/id/Qmdxr4hqsky9SDjMqKuQnMNvLGQMFk3AeoA7v7t3sMHBaP',
    cache: new InMemoryCache(),
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
    liquidity
    pairDayData(first: 1, orderBy: startUnix, orderDirection: desc) {
      priceChange
      startUnix
      swapTxns
    }
    buyTxs
    sellTxs
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
            <div className={'NewpairDetails'} style={{flexDirection: browser ? 'row' : 'column'}}>
                {
                    load ? <Left par={par}/> : ''
                }
                <Center id={id}/>
                <Right/>
            </div>
        </>
    );
}

export default Index;