import {useState} from "react";

function Left() {
    const [value, setValue] = useState('Token Creation Bot')
    return (
        <div className={'left'}>
            {
                [['Token Creation Bot', 'Sniper Bot', 'Air drop Bot', 'Market maker'], ['New Buy notification', 'Token Checker', 'Trending']].map((i: any, ind: number) => {
                    return <div className={'top'} key={ind}>
                        {
                            ind === 0 ? <p>DApps</p> : <p>Telegram Suite</p>
                        }
                        {
                            i.map((item: string, it: number) => {
                                return <p key={it} className={'list'} onClick={() => {
                                    if (value !== item) {
                                        if (ind === 0) {
                                            if (it !== 2 && it !== 3) {
                                                setValue(item)
                                            }
                                        } else {
                                            if (it !== 2 && it !== 1) {
                                                setValue(item)
                                            }
                                        }
                                    }
                                }}
                                          style={{color: ind === 0 ? value === item ? 'rgb(134,240,151)' : it === 2 || it === 3 ? 'rgb(104,124,105)' : 'rgb(214, 223, 215)' : value === item ? 'rgb(134,240,151)' : it === 0 ? 'rgb(214, 223, 215)' : 'rgb(104,124,105)'}}>
                                    <img
                                        src={ind === 0 ? it === 0 ? "/token.svg" : it === 1 ? '/sniper.svg' : it === 2 ? '/dropBot.svg' : '/money.svg' : it === 0 ? '/news.svg' : it === 1 ? '/checker.svg' : '/trending.svg'}
                                        alt=""/><span>{item}</span></p>
                            })
                        }
                    </div>
                })
            }
        </div>
    );
}

export default Left;