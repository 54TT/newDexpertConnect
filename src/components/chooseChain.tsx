import {Popover} from 'antd'
import './index.less';
import {useContext, useState} from 'react'
import {CountContext} from "../Layout.tsx";
import {throttle} from "lodash";

function ChooseChain() {
    const {setSwitchChain}: any = useContext(CountContext);
    const data = [{value: 'Ethereum', icon: '/EthereumChain.svg'}, {
        value: 'Arbitrum',
        icon: '/Arbitrum.svg'
    }, {value: 'Avalanche', icon: '/AvalancheCoin.svg'}, {value: 'BNB', icon: '/BNBChain.svg'}, {
        value: 'Polygon',
        icon: '/PolygonCoin.svg'
    }, {value: 'Optimism', icon: '/Optimism.svg'}, {value: 'Blast', icon: '/Blast.svg'}, {
        value: 'BASE',
        icon: '/BASE.svg'
    }, {value: 'Celo', icon: '/Celo.svg'},]
    const [value, setValue] = useState<any>({value: 'Ethereum', icon: '/EthereumChain.svg'})
    const [open, setOpen] = useState<any>(false)
    const click = throttle(function (i: any) {
        if (value !== i) {
            if (i?.value === 'Ethereum' || i?.value === 'BASE' || i?.value === 'Arbitrum') {
                setValue(i)
                setSwitchChain(i?.value)
                setOpen(false)
            }
        }
    }, 1500, {'trailing': false})
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const chain = <div className={'headerChain'}>
        {
            data.map((i: any, ind: number) => {
                return <div key={ind} className={'chain'} onClick={() => click(i)}>
                    <img src={i?.icon} alt="" style={{width: i?.value === 'Arbitrum' ? '20px' : '18px'}}/>
                    <span
                        style={{color: i?.value === 'Ethereum' || i?.value === 'BASE' || i?.value === 'Arbitrum' ? 'white' : 'gray'}}>{i?.value}</span>
                </div>
            })
        }
    </div>
    return (
        <Popover content={chain} title="" onOpenChange={handleOpenChange} open={open} trigger="click"
                 overlayClassName={'headerPopoverShow'}>
            <div className={'boxPopover'}>
                <img src={value?.icon} alt="" style={{width: '22px'}}/>
                <span style={{
                    color: 'white',
                    marginLeft: "4px",
                    fontSize: '15px',
                    margin: '0 4px 0 2px'
                }}>{value?.value}</span>
                <img src="/down.svg" alt="" style={{width: '10px'}}/>
            </div>
        </Popover>
    );
}

export default ChooseChain;