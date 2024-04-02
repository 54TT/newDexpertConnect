import Conyent from '../../community/components/PostContent.tsx'
import {useContext} from "react";
import {CountContext} from "../../../Layout.tsx";
function Center() {
    const {browser}: any = useContext(CountContext);
    return (
        <div className={'center'}>
            <div className={'centerTop'}>
                <img src="/bot.svg" alt="" loading={'lazy'}/>
                <div className={'centerTopRight'} style={{paddingRight: browser ? '10%' : '2%'}}>
                    <p style={{fontSize: browser ? '30px' : '22px'}}>Token Creation Bot</p>
                    <p>In the Uniswap protocol design, the development team does not extract fees from transactions, and
                        all fees in transactions are returned to the liquidity provider.</p>
                    <div className={'dis'}>
                        {
                            ['Video Guide', 'Start on Telegram', 'Start on Web'].map((i: string, ind: number) => {
                                return <div style={{
                                    width: browser ? '28%' : '30%',
                                    color:ind===2?'gray':'rgb(220, 220, 220)',
                                    fontSize: '14px',
                                }} key={ind}>{ind===2?'Coming soon':i}</div>
                            })
                        }
                    </div>
                </div>
            </div>
            <Conyent /* name={'dappCenter'} */ />
        </div>
    );
}

export default Center;