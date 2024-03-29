import Left from './compontent/left.tsx'
import Center from './compontent/center.tsx'
import Right from './compontent/right.tsx'
import './compontent/all.less'
import {useEffect, useState} from "react";
import cookie from "js-cookie";

function Index() {
    const [par, setPar] = useState<any>(null)
    const [load, setLoad] = useState<boolean>(false)
    useEffect(() => {
        const data = cookie.get('newpair')
        if (data) {
            const ab = JSON.parse(data)
            setPar(ab)
            setLoad(true)
        }

    }, [])

    return (
        <>
            {
                load ? <div className={'NewpairDetails'}>
                    <Left par={par}/>
                    <Center par={par}/>
                    <Right/>
                </div> : ''
            }
        </>

    );
}

export default Index;