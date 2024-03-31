import {Card} from "antd";
import {useContext} from "react";
import {CountContext} from "../../../Layout.tsx";
import {setMany, simplify} from "../../../../utils/change.ts";

function RightCard({title}: any) {
    const {newPairPar}: any = useContext(CountContext);
    return <Card className="" title={title} bordered={false}
                 style={{width: '90%', maxWidth: '400px', marginTop: '24px'}}>
        <div className="card-pair-info">
            <p style={{color: '#eebfe4f5'}}>Name</p>
            <p style={{color: '#eebfe4f5'}}>Price</p>
            <p style={{color: '#eebfe4f5'}}>Fluctuations</p>
        </div>
        {
            title === 'New Pairs' ? newPairPar.length > 0 ? newPairPar.map((i: any, ind: number) => {
                const change = setMany(i?.pairDayData[0]?.priceChange || 0)
                const float = i?.pairDayData[0]?.priceChange && Number(i?.pairDayData[0]?.priceChange) > 0 ? 1 : Number(i?.pairDayData[0]?.priceChange) < 0 ? -1 : 0
                return <div className="card-pair-info" key={ind}>
                    <p>{simplify(i?.token0?.symbol)}-{simplify(i?.token1?.symbol)}</p>
                    <p>{setMany(i?.priceUSD)}</p>
                    <p style={{color: float > 0 ? 'rgb(0,255,71)' : float < 0 ? 'rgb(213,9,58)' : '#d6dfd7'}}>{change || 0}</p>
                </div>
            }) : <p style={{textAlign: 'center', marginTop: '15px'}}>No
                data</p> : ['', '', ''].map((i: any, ind: number) => {
                return <div className="card-pair-info" key={ind}>
                    <p>BTC-WETH{i}</p>
                    <p>{(Math.random() * 980 + 10).toFixed(2)}</p>
                    <p style={{color:'rgb(0,255,71)'}}>{(Math.random() * 100).toFixed(2)}%</p>
                </div>
            })
        }
    </Card>
}

export default RightCard;