import RightCard from "./RightCard";
import {useEffect, useState} from "react";
import { gql,  useQuery} from "@apollo/client";
import {useTranslation} from "react-i18next";
function CommunityRight() {
    const [par, setPar] = useState([]);
    const [load, setLoad] = useState(true);
    const {t} = useTranslation();
    const GET_DATA = gql`
    query MyQuery {
      pairs(
        where: {
          id_in: [
            "0x62fcd2c0a3c7271ccc6b9697878cf551e7b3ab75",
            "0x8fb8fdab60e86d274fa4a24ac292977d1dd3739e",
            "0xd588401166a749097877d720777096cdc3b1047a",
            "0x1b820b20a7183587475506f66dd83cfcaf4c5796",
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
    const {loading, data, refetch} = useQuery(GET_DATA) as any;
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
      }}
    >
      <RightCard data={newPairs} />
      <RightCard data={trending} par={par} load={load} />
    </div>
  );
}

export default CommunityRight;
