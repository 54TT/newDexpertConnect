import {Spin} from "antd";
import {useContext} from "react";
import {CountContext} from "../Layout.tsx";

function Loading({status}: any) {
    const {browser}: any = useContext(CountContext);

    return (
        <div className={'disCen'} style={{
            marginTop: status === 'none' ? '0' : status === '20' ? '20%' : '50%',
            width: status === 'none' ? browser ? 'auto' : window.innerWidth + 'px':'auto'
        }}>
            <Spin size="large"/>
        </div>
    );
}

export default Loading;