import {CaretUpOutlined} from '@ant-design/icons'
import {Progress} from 'antd'

function Left() {
    const h = window.innerHeight - 25 - 54
    return (
        <div className={`NewpairDetailsOne scrollStyle`} style={{height: h + 'px'}}>
            {/*top*/}
            <div className={`top dis`}>
                <div>
                    <img src="/logo1.svg" alt=""/>
                    <p>
                        <span>BTC-WETH</span>
                        <span>Bitcoin</span>
                    </p>
                </div>
                <p><img src="/collect.svg" alt=""/></p>
            </div>
            {/*address*/}
            <div className={`address dis`}>
                <p><span>CA:</span><span>0x1234.....1234</span><img src="/copy.svg" alt=""/></p>
                <p><span>Pair:</span><span>0x1234.....1234</span><img src="/copy.svg" alt=""/></p>
            </div>
            <div className={`dis img`}>
                <div>
                    <img src="/website.svg" alt=""/>
                </div>
                <div>
                    <img src="/titter.svg" alt=""/>
                </div>
                <div>
                    <img src="/telegram.svg" alt=""/>
                </div>
                <div>
                    <img src="/information.svg" alt=""/>
                </div>
            </div>
            <div className={`price dis`}>
                <p>
                    $78,789,55
                </p>
                {/*<CaretDownOutlined />*/}
                <p><CaretUpOutlined style={{marginRight: '3px'}}/>8.48%(1d)</p>
            </div>
            <div className={'valume'}>
                {
                    [{name:'Valume', price:'$ 1000'},{name:'Liquidity', price:'$ 2378'},{name:'Market Cap', price:'$ 4384'},{name:'FDV', price:'$ 2323'},].map((i: any, ind: number) => {
                        return <div className={`dis butt`} key={ind} style={{marginBottom:'10px'}}>
                            <span>{i.name}</span>
                            <span>{i.price}</span>
                        </div>
                    })
                }
            </div>
            <div className={'swap'}>
                <p>Swap Count</p>
                <div className={`dis swapTop`} style={{margin: '1.5% 0'}}>
                    <span>Buys</span>
                    <span>Total</span>
                    <span>Sells</span>
                </div>
                <Progress percent={50} showInfo={false} strokeColor={'rgb(0,255,71)'}/>
                <div className={`dis swapTop`} style={{margin: '1.5% 0'}}>
                    <span>33</span>
                    <span>66</span>
                    <span>33</span>
                </div>
                <div className={`dis swapTop`}>
                    <span>$454</span>
                    <span>$887</span>
                    <span>$400</span>
                </div>
            </div>
            <div className={'valume'}>
                {
                    [{name:'Created Time', price:'2022-11-10 10:10:10'},{name:'Total Supply', price:'100023'},{name:'Initial Pool Amount', price:'1 ETH'},{name:'Pooled WETH', price:'1.3'},{name:'Pooled bTC', price:'13'},].map((i: any, ind: number) => {
                        return <div className={`dis butt`} key={ind} style={{marginBottom:'10px'}}>
                            <span>{i.name}</span>
                            <span>{i.price}</span>
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default Left;