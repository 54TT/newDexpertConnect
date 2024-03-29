import Conyent from '../../community/components/Content.tsx'

function Center() {
    return (
        <div className={'center'}>
            <div className={'centerTop'}>
                <img src="/bot.svg" alt=""/>
                <div className={'centerTopRight'}>
                    <p>Token Creation Bot</p>
                    <p>In the Uniswap protocol design, the development team does not extract fees from transactions, and
                        all fees in transactions are returned to the liquidity provider.</p>
                    <div className={'dis'}>
                        <p> Video Guide</p>
                        <p>Start on Telegram</p>
                        <p>Start on Web</p>
                    </div>
                </div>
            </div>
            <Conyent name={'dappCenter'}/>
        </div>
    );
}

export default Center;