function Left() {
    return (
        <div className={'NewpairDetailsOne'}>
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
                <p><span>CA:</span><span>0x1234.....1234</span><img src="/copy.svg" alt=""/></p>
            </div>
        </div>
    );
}

export default Left;