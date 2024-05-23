import { Spin } from "antd";
import { useContext } from "react";
import { CountContext } from "../Layout.tsx";

function Loading({ status, }: any) {
    const { browser }: any = useContext(CountContext);
    const changeWidth = () => {
        if (status === 'none') {
            if (browser) {
                return 'auto'
            } else {
                return window.innerWidth + 'px'
            }
        } else {
            if (browser) {
                return 'auto'
            } else {
                return window.innerWidth + 'px'
            }
        }
    }
    return (
        <div className={'disCen'} style={{
            marginTop: status === 'none' ? '0' : status === '20' ? '10%' : '50%',
            width: changeWidth()
        }}>
            <Spin size="large" />
        </div>
    );
}

export default Loading;