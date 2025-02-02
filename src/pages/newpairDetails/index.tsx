import React,{ useContext, useEffect, useState } from 'react';
const Left = React.lazy(() => import('./compontent/left.tsx'));

const Center = React.lazy(() => import('./compontent/center.tsx'));

const Right = React.lazy(() => import('./compontent/right.tsx'));
import './compontent/all.less';
import { useParams } from 'react-router-dom';
import { CountContext } from '@/Layout.tsx';
import { gql, useQuery } from '@apollo/client';
function Index() {
  const { browser }: any = useContext(CountContext);
  const params: any = useParams();
  const [par, setPar] = useState<any>(null);
  const id = params?.id;
  const [load, setLoad] = useState<boolean>(false);
  const GET_DATA = gql`query MyQuery {
  pair(id: "${id}"){
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
      decimals
      totalSupply
    }
    token1 {
      id
      name
      symbol
      totalLiquidity
      decimals
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
}`;
  const { data, refetch } = useQuery(GET_DATA) as any;
  useEffect(() => {
    const interval = setInterval(async () => {
      refetch();
    }, 8000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (data?.pair) {
      setPar(data?.pair);
      setLoad(true);
    }
  }, [data]);
  return (
    <>
      <div
        className={'NewpairDetails'}
        style={{
          flexDirection: browser ? 'row' : 'column',
          padding: browser ? '0' : '0 3%',
        }}
      >
        {load ? <Left par={par} /> : ''}
        <Center id={id} />
        <Right par={par}/>
      </div>
    </>
  );
}

export default Index;
