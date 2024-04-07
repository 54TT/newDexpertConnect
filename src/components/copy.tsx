import {CheckCircleOutlined} from "@ant-design/icons";
import copy from "copy-to-clipboard";
import {Popover} from "antd";
import {throttle} from "lodash";

function Copy({status, setStatus, name}: any) {
    return (
        <Popover placement="top" title={''} overlayClassName={'newPairLeftPopover'}
                 content={status ? 'Pair Copied successfully' : 'copy to clipboard'}>
            {
                status ? <CheckCircleOutlined style={{fontSize: '15px', marginLeft: '5px'}}/> :
                    <img src="/copy.svg" alt="" loading={'lazy'} style={{width: '15px', cursor: 'pointer', marginLeft: '5px'}}
                         onClick={
                             throttle( function () {
                                 copy(name)
                                 setStatus(true)
                             }, 1500, {'trailing': false})
                         }/>
            }
        </Popover>
    );
}

export default Copy;