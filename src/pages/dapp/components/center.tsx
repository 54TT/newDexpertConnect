import Conyent from '../../community/components/PostContent.tsx'
import {useContext} from "react";
import {CountContext} from "../../../Layout.tsx";
import {useLocation} from "react-router-dom";
function Center() {
    const {browser}: any = useContext(CountContext);
    const router = useLocation()
    return (
        <div className={'center'}>
            {
                <div className={'centerTop'}>
                    <img src="/bot.svg" alt="" loading={'lazy'}/>
                    <div className={'centerTopRight'} style={{paddingRight: browser ? '10%' : '2%'}}>
                        <p style={{fontSize: browser ? '30px' : '22px'}}>Token Creation Bot (Thor)</p>
                        <p>{router.pathname === '/app'  ? 'Thor is a user-friendly DApp that automates the ERC-20 token creation process. By providing an intuitive interface and simplifying complex tasks, Thor empowers users to efficiently create and deploy their tokens.' : 'In the Uniswap protocol design, the development team does not extract fees from transactions, and all fees in transactions are returned to the liquidity provider.'}</p>
                        <div className={'dis'}>
                            {
                                ['Video Guide', 'Start on Telegram', 'Start on Web'].map((i: string, ind: number) => {
                                    return <div style={{
                                        width: browser ? '28%' : '30%',
                                        color: ind === 2 ? 'gray' : 'rgb(220, 220, 220)',
                                        fontSize: '14px',
                                        display:'flex',
                                        alignItems:'center',justifyContent:'center'
                                    }} key={ind}>{i}{ind === 2 ? <span style={{fontSize:'10px',backgroundColor:'rgb(40,40,40)',borderRadius:'6px',padding:'4px'}}>Coming soon</span> : ''}</div>
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            <Conyent /* name={'dappCenter'} */ />
        </div>
    );
}

export default Center;