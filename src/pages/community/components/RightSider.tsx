
import React,{ useEffect, useState } from "react";
const RightCard = React.lazy(() => import('./RightCard'));
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
function CommunityRight({ isShow }: any) {
  const [par, setPar] = useState([]);
  const [load, setLoad] = useState(true);
  const { t } = useTranslation();
  const GET_DATA = gql`
    query MyQuery {
      pairs(
        where: {
          id_in: [
            "0x3fFEea07a27Fab7ad1df5297fa75e77a43CB5790",
            "0xbf16540c857b4e32ce6c37d2f7725c8eec869b8b",
            "0xbF16540c857B4e32cE6C37d2F7725C8eEC869B8b",
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
  const { loading, data, refetch } = useQuery(GET_DATA) as any;
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
      } else {
        setLoad(false);
      }
    }
  }, [data]);
  const newPairs = {
    title: t("Slider.New Pairs"),
    value: "New Pairs",
  };
  const trending = {
    title: t("Slider.Trending"),
    value: "Trending",
  };
  return (
    <div className={isShow ? "displ" : ''}>
      <RightCard data={newPairs} />
      <RightCard data={trending} par={par} load={load} />
    </div>
  );
}

export default CommunityRight;
