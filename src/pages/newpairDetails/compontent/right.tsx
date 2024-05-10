import {Select} from 'antd'
import {ArrowLeftOutlined, CaretDownOutlined} from '@ant-design/icons'
import {useContext, useEffect, useRef, useState} from "react";
import TweetHome from "../../../components/tweetHome.tsx";
import BuyCoin from './buyCoin.tsx'
import {CountContext} from "../../../Layout.tsx";
import CommingSoon from "../../../components/commingSoon.tsx";
import { useTranslation } from 'react-i18next';

function Right() {
    const {browser}: any = useContext(CountContext);
    const [value, setValue] = useState('com')
    const [hei, setHei] = useState<any>('')
    const [sta, setSta] = useState<any>(false)
    const {t} = useTranslation();
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
        <div className={'right'} style={{width: browser ? '21%' : '100%'}}>
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
                            label: <p className={'rightSelectRow'}><span>{t("Common.Community")}</span> <CaretDownOutlined/></p>,
                        },
                        {
                            value: 'fast',
                            label: <p className={'rightSelectRow'}><span>{t("Common.Fast Trade")}</span>  <span style={{color:'gray',fontSize:'12px',padding:'2px 3px',borderRadius:'5px',backgroundColor:'rgb(100,100,100)'}}>{t('Common.Coming soon')}</span> <CaretDownOutlined/></p>,
                            disabled:true
                        },
                    ]}
                />
            </div>
            {
                value === 'com' ? <TweetHome hei={`${hei}px`}/> : sta ? <div className={`buyCoinBorder success`}>
                    <div>
                        <p>Transaction successful</p>
                        <img loading={'lazy'} src="/right.svg" alt=""/>
                    </div>
                    <p onClick={() => setSta(false)}><ArrowLeftOutlined/>Return to the previous step</p>
                </div> : <div style={{position: 'relative'}}><BuyCoin changStatus={changStatus}/>
                    <CommingSoon hei={'90vh'}/>
                </div>
            }

        </div>
    );
}

export default Right;