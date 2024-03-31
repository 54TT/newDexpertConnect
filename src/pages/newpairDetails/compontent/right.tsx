import { Select } from 'antd'
import { ArrowLeftOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from "react";
import TweetHome from "../../../components/tweetHome.tsx";
import BuyCoin from './buyCoin.tsx'

function Right() {
    const [value, setValue] = useState('com')
    const [hei, setHei] = useState<any>('')
    const [sta, setSta] = useState<any>(false)
    const topRef = useRef<any>()
    const handleChange = (e: string) => {
        setValue(e)
    }

    useEffect(() => {
        if (topRef && topRef.current) {
            const a = topRef.current.scrollHeight
            const w = window.innerHeight
            const n = w - a - 25 - 54
            setHei(n)
        }
    }, []);

    const changStatus = (name: boolean) => {
        setSta(name)
    }

    return (
        <div className={'right'}>
            <div ref={topRef}>
                <Select
                    className={'rightSelect'}
                    popupClassName={'rightPop'}
                    style={{
                        width: '100%',
                    }}
                    value={value}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'com',
                            label: <p className={'rightSelectRow'}><span>Community</span> <CaretDownOutlined /></p>,
                        },
                        {
                            value: 'fast',
                            label: <p className={'rightSelectRow'}><span>Fast Trade</span> <CaretDownOutlined /></p>,
                        },
                    ]}
                />
            </div>
            {
                value === 'com' ? <TweetHome hei={`${hei}px`} /> : sta ? <div className={`buyCoinBorder success`}>
                    <div>
                        <p>Transaction successful</p>
                        <img src="/right.svg" alt="" />
                    </div>
                    <p onClick={() => setSta(false)}><ArrowLeftOutlined />Return to the previous step</p>
                </div> : <BuyCoin changStatus={changStatus} />
            }
        </div>
    );
}

export default Right;