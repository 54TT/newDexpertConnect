import { Popover } from 'antd'
import './index.less';
import { useContext, useState } from 'react'
import { CountContext } from "../Layout.tsx";
import { throttle } from "lodash";
import { chainParams } from '@/../utils/judgeStablecoin.ts'
function ChooseChain() {
    const { setSwitchChain }: any = useContext(CountContext);

    const [value, setValue] = useState<any>({ value: 'Ethereum', icon: '/EthereumChain.svg' })
    const [open, setOpen] = useState<any>(false)
    const click = throttle(function (i: any) {
        if (value !== i) {
            if (i?.value !== 'Avalanche' && i?.value !== 'Blast' && i?.value !== 'Celo') {
                setValue(i)
                setSwitchChain(i?.value)
                setOpen(false)
            }
        }
    }, 1500, { 'trailing': false })
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const chain = <div className={'headerChain dis'}>
        {
            chainParams.map((i: any, ind: number) => {
                return <div key={ind} className={'chain disDis'} onClick={() => click(i)}>
                    <img src={i?.icon} alt="" style={{ width: i?.value === 'Arbitrum' ? '20px' : '18px' }} />
                    <span style={{ color: i?.value !== 'Avalanche' && i?.value !== 'Blast' && i?.value !== 'Celo' ? 'white' : 'gray' }}>{i?.value === 'BSC' ? 'BNB Chain' : i?.value}</span>
                </div>
            })
        }
    </div>
    return (
        <Popover content={chain} title="" onOpenChange={handleOpenChange} open={open} trigger="click"
            overlayClassName={'headerPopoverShow'}>
            <div className={'boxPopover disDis'}>
                <img src={value?.icon} alt="" style={{ width: '22px' }} />
                <img src="/down.svg" alt="" style={{ width: '10px', marginLeft: "4px", }} />
            </div>
        </Popover>)
}

export default ChooseChain;