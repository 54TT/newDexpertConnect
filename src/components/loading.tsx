import {Spin} from "antd";

function Loading({status}: any) {
    return (
        <div className={'disCen'} style={{marginTop: status === 'none' ? '0' : status === '20' ? '20%' : '50%'}}>
            <Spin size="large"/>
        </div>
    );
}

export default Loading;