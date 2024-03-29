import {Spin} from "antd";

function Loading({status}: any) {
    return (
        <div className={'disCen'} style={status === 'none' ? {} : {marginTop: '50%'}}>
            <Spin size="large"/>
        </div>
    );
}

export default Loading;