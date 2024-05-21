import { CheckCircleOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { Popover } from "antd";
import { throttle } from "lodash";
import { useContext } from 'react'
import { CountContext } from "../Layout.tsx";

import { useEffect } from 'react'
function Copy({ name }: any) {
    const { isCopy, setIsCopy }: any = useContext(CountContext);
    useEffect(() => {
        if (isCopy) {
            setTimeout(() => {
                setIsCopy(false)
            }, 4000);
        }
    }, [isCopy]);
    return (
        <Popover placement="top" title={''} overlayClassName={'newPairLeftPopover'}
            content={isCopy ? 'Pair Copied successfully' : 'copy to clipboard'}>
            {
                isCopy ? <CheckCircleOutlined style={{ fontSize: '15px', marginLeft: '5px' }} /> :
                    <img src="/copy.svg" alt="" loading={'lazy'} style={{ width: '15px', cursor: 'pointer', marginLeft: '5px' }}
                        onClick={
                            throttle(function () {
                                copy(name)
                                setIsCopy(true)
                            }, 1500, { 'trailing': false })
                        } />
            }
        </Popover>
    );
}

export default Copy;