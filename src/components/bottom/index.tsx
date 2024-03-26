import {useEffect, useRef} from "react";
function Index({setBotHeight}: any) {
    const hei = useRef<any>()
    useEffect(() => {
        if (hei && hei.current) {
            const h = hei.current.scrollHeight
            setBotHeight(h)
        }
    }, [])
    return (
        <div className={'bottomBox'} ref={hei}>
            <div>
                <p></p>
                <p>Live Chat</p>
            </div>
        </div>
    );
}

export default Index;