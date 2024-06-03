import './index.less'
function Loading({ status,browser }: any) {
    const changeWidth = () => {
        if (status === 'none') {
            if (browser) {
                return 'auto'
            } else {
                return window.innerWidth + 'px'
            }
        } else {
            if (browser) {
                return 'auto'
            } else {
                return window.innerWidth + 'px'
            }
        }
    }
    return (
        <div className={'disCen'} style={{
            marginTop: status === 'none' ? '0' : status === '20' ? '10%' : '50%',
            width: changeWidth()
        }}>
            <div className="animationDex">
                <div>
                    <img src="/Union.svg" alt="" className="bigImg" style={{ width: '50px' }} />
                    <img src="/Groupo.svg" alt="" className="smallImg" style={{ width: '22px' }} />
                </div>
            </div>
        </div>
    );
}

export default Loading;