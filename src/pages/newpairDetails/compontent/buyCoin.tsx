import {Input, Select} from 'antd'
import {CaretDownOutlined} from "@ant-design/icons";
import {useState} from "react";

function BuyCoin({changStatus}: any) {
    const [value, setValue] = useState('')
    const [one, setOne] = useState('')
    const [two, setTwo] = useState('')
    const handleChange = (e: string) => {
        setValue(e)
    }
    const change = (e: any, name: string) => {
        if (name === 'one') {
            setOne(e.target.value)
        } else {
            setTwo(e.target.value)
        }
    }
    const result = () => {
        if (value && one && two) {
            changStatus(true)
        }
    }
    return (
        <div className={`buyCoin buyCoinBorder`}>
            <Select
                className={'rightSelect'}
                popupClassName={'buyCoinPop'}
                allowClear
                placeholder={'Select Wallet'}
                style={{
                    width: '100%'
                }}
                value={value ? value : undefined}
                onChange={handleChange}
                options={[
                    {
                        value: 'com',
                        label: <p className={'rightSelectRow'}><span>Community</span> <CaretDownOutlined/></p>,
                    },
                    {
                        value: 'fast',
                        label: <p className={'rightSelectRow'}><span>Fast Trade</span> <CaretDownOutlined/></p>,
                    },
                ]}
            />
            <div className={`pay buyCoinBorder`}>
                <p>Pay</p>
                <Input className={'input'} onChange={(e: any) => change(e, 'one')} suffix="WETH" allowClear/>
                <p className={'num'}>~ $34322</p>
                <p>Receive</p>
                <Input className={'input'} onChange={(e: any) => change(e, 'two')} style={{marginBottom: '11%'}}
                       suffix="BTC" allowClear/>
                <div className={'but'} onClick={result}>
                    Trade
                </div>

            </div>
            {
                [{name: 'Price impact', price: '~ 0.468%'}, {name: 'Max. slippage', price: '0.5%'}, {name: 'Network cost', price: '$ 17.7'}, {name: 'DEX', price: 'Uniswap V2'}].map((i: any, ind: number) => {
                    return <div className={`dis butt`} key={ind} style={{marginBottom: '10px'}}>
                        <span>{i.name}</span>
                        {
                            ind === 1 ? <div>
                                <p>Auto</p>
                                <p>{i.price}</p>
                            </div> : ind === 2 ? <p><img loading={'lazy'} src="/gas.svg" alt=""/><span>{i.price}</span></p> :
                                <span>{i.price}</span>
                        }
                    </div>

                })
            }

        </div>
    );
}

export default BuyCoin;