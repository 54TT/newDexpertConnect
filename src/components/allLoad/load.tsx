import { useState, useEffect } from 'react'
import './index.less'
export default function load() {
    const [status, setStatus] = useState<any>(['deep', 'Shallow', 'light'])
    const change = () => {
        let abc: any = [...status]
        setInterval(function () {
            const at = [...abc.slice(0, -1)]
            const end = abc.pop()
            const now = [end].concat(at)
            abc = now
            setStatus(now)
        }, 500);
    }
    useEffect(() => {
        change()
    }, [])
    return (
        <div className="Ellipsis">
            <p className={status[0]}></p>
            <p className={status[1]}></p>
            <p className={status[2]}></p>
        </div>
    )
}
