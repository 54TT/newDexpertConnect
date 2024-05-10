import RightCard from "./RightCard";
import newPair from "../../../components/getNewPair.tsx";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/id/Qmdxr4hqsky9SDjMqKuQnMNvLGQMFk3AeoA7v7t3sMHBaP",
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
            "0x7d225c4cc612e61d26523b099b0718d03152edef",
            "0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429",
            "0x80ee5c641a8ffc607545219a3856562f56427fe9",
            "0x3a67067efb1aad7facb49b8a59aab0ed974c15b5",
            "0xaf777c52344cb6eaf9a0f683a021f95b77d27a5b",
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
