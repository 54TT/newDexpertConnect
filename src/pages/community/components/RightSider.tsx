import RightCard from "./RightCard";
import newPair from "../../../components/getNewPair.tsx";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
const client = new ApolloClient({
  // uri: "http://165.232.163.158:8000/subgraphs/name/levi/uniswapv2",
  uri: 'https://api.thegraph.com/subgraphs/id/QmZXJ7oEnjq9vv5kAQ2G3aXK5ZVCxjG9gZsk3Evo45Q1xy',
  cache: new InMemoryCache(),
});
function CommunityRight() {
  const [par, setPar] = useState([]);
  const [load, setLoad] = useState(true);
  const { t } = useTranslation();
  const GET_DATA = gql`
    query MyQuery {
      pairs(
        where: {
          id_in: [
            "0x04b6326d8305faaab96f3b4be467dcdaff34d0e1",
          ]
        }
      ) {
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
    }
  `;
  const { loading, data, refetch } = useQuery(GET_DATA, { client }) as any;
  const { getPage } = newPair() as any;
  useEffect(() => {
    const interval = setInterval(async () => {
      refetch();
    }, 8000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {    
    if (!loading) {
      if (data && data?.pairs.length > 0) {
        setPar(data?.pairs);
        setLoad(false);
      }else {
        setLoad(false);
      }
    }
  }, [data]);
  useEffect(() => {
    getPage(5);
  }, []);
  const newPairs = {
    title: t("Slider.New Pairs"),
    value: "New Pairs",
  };
  const trending = {
    title: t("Slider.Trending"),
    value: "Trending",
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/*<RightCard  title={'Watch List'}/>*/}
      <RightCard data={newPairs} />
      <RightCard data={trending} par={par} load={load} />
      {/*<RightCard title={'Trending'}/>*/}
    </div>
  );
}

export default CommunityRight;
