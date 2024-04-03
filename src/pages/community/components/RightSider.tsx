import RightCard from './RightCard';
import newPair from "../../../components/getNewPair.tsx";
import {useEffect, useState} from "react";
import {ApolloClient,  InMemoryCache,gql, useQuery} from "@apollo/client";
const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/levi-dexpert/uniswap-v2', cache: new InMemoryCache(),
});
function CommunityRight() {
    const [par, setPar] = useState([])
    const [load, setLoad] = useState(true)
    const GET_DATA = gql`query MyQuery {
  pairs(where: {id_in:  ["0x9e9fbde7c7a83c43913bddc8779158f1368f0413",
    "0xe8196181c5fe192b83c5ca34be910d93d691d935",
    "0x47270ca9a3cdf198d26a847b577e9bbdd96a082a",
    "0xa1bf0e900fb272089c9fd299ea14bfccb1d1c2c0",
    "0xa2bbbe7e2e48311830e41cb43814a821c4c2a16e",
    "0x2a706f26e0bd400ac710bec99150ed9d644f29bd",
    "0x53eef67f96ccb71fb1750df973fb9e8c82096759",
    "0x35ca6a41252f7e0bccdc1d7b2d5b6e2e35a7b483",
    "0x7dbc4253e35f20be7164f0a3e0959c33136d007d",
    "0xff1701e320aa8ab373160c4360586960e7d9e48e",
    "0xc67580e5ef43e86440dc69f315bf6baf30e2ab2a",
    "0xac31783511f166ad4d1b914d2fd620e4e5be52d1",
    "0x88a3a913626803261de234c23c76523699caed8d"]}) {
    createdAtTimestamp
    id
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

    pairDayData(first: 1, orderBy: startUnix, orderDirection: desc) {
      priceChange
      volumeUSD
      startUnix
      swapTxns
      sellTxs
      buyTxs
    }
    priceUSD
  }
}`
    const {loading, data, refetch} = useQuery(GET_DATA, {client}) as any
    console.log(data)
    const {getPage} = newPair() as any
    useEffect(() => {
        const interval = setInterval(async () => {
            refetch();
        }, 8000);
        return () => {
            clearInterval(interval);
        }
    }, [])
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                setPar(data?.pairs)
                setLoad(false)
            }
        }
    }, [data]);
    useEffect(() => {
        getPage(5)
    }, []);
    return <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {/*<RightCard  title={'Watch List'}/>*/}
        <RightCard title={'New Pairs'}/>
        <RightCard title={'Trending'} par={par} load={load}/>
        {/*<RightCard title={'Trending'}/>*/}
    </div>
}

export default CommunityRight;