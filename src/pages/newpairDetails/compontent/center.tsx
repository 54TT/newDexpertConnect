// import {useEffect, useRef, useState} from "react";

function Center({id}: any) {
    // const [more, setMore] = useState('Chart')
    // const topRef = useRef<any>()
    // const [hei, setHei] = useState<any>('')
    // useEffect(() => {
    //     if (topRef && topRef.current) {
    //         const a = topRef.current.scrollHeight
    //         const w = window.innerHeight
    //         const n = w - a - 25 - 54
    //         setHei(n)
    //     }
    // }, []);
    return (
        <div className={'center'}>
            {/*<div className={'top'} ref={topRef}>*/}
            {/*{*/}
            {/*    ['Chart', 'Markets', 'News', 'About', 'Analytics'].map((i: string, ind: number) => {*/}
            {/*        return <p key={ind} onClick={() => {*/}
            {/*            if (more !== i) {*/}
            {/*                setMore(i)*/}
            {/*            }*/}
            {/*        }} className={more === i ? 'selectMore' : ''}>{i}</p>*/}
            {/*    })*/}
            {/*}*/}
            {/*</div>*/}
            <div style={{height: '94vh', overflowY: 'auto'}} className={'scrollStyle'}>
                <iframe
                    src={`https://dexscreener.com/ethereum/${id}?embed=1&theme=dark&info=0`}
                    style={{width: '100%', height: '100%', overflowY: 'auto'}}></iframe>
            </div>
        </div>
    );
}

export default Center;