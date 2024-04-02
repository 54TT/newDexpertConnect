import {Input, message, Modal} from "antd";
import {useContext, useState} from "react";
import {CountContext} from "../Layout.tsx";
import cookie from "js-cookie";
import {request} from "../../utils/axios.ts";
function HeaderModal() {
    const {
        browser,
        isModalOpen,
        setIsModalOpen,
        isModalSet,
        setIsModalSet, connect, setLoad,
        getMoneyEnd
    }: any = useContext(CountContext);
    const [messageApi, contextHolder] = message.useMessage();
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalSet(false)
    };
    const [value, setValue] = useState('')
    const changeName = (e: any) => {
        setValue(e.target.value)
    }
    const pushSet = async () => {
        if (value) {
            const username = cookie.get('username')
            const token = cookie.get('token')
            if (username && token) {
                const ab = JSON.parse(username)
                const user = {...ab, username: value}
                const result: any = await request('post', '/api/v1/userinfo', {user}, token);
                if (result?.status === 200) {
                    cookie.set('username', JSON.stringify(user))
                    messageApi.success('update success');
                    handleCancel()
                }
            }
        }
    }
    const connectWallet = async () => {
        try {
            if (window.innerWidth > 768) {
                setLoad(true)
                getMoneyEnd()
            } else {
                window.open('metamask:https://dexpert.io/', '_blank');
            }
            setIsModalOpen(false)
        } catch (e) {
            return null
        }
    }
    const onConnect = () => {
        connect();
        setIsModalOpen(false)
    };
    return (
        <Modal destroyOnClose={true} centered title={null} footer={null} className={'walletModal'}
               maskClosable={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {
                isModalSet ? <div className={'headerModalSetName'}>
                    <p>Welcome new user</p>
                    <p>Set up name</p>
                    <Input allowClear onChange={changeName} className={'input'}/>
                    <p onClick={pushSet}>OK</p>
                </div> : <div className={'headerModal'}>
                    <img src="/logo1.svg" loading={'lazy'} alt=""/>
                    <p>Connect to Dexpert</p>
                    {
                        browser &&
                        <button onClick={connectWallet} className={'walletButton'} style={{margin: '10px 0'}}>
                            <img loading={'lazy'}
                                src="/metamask.svg" style={{width: '25px'}}
                                alt=""/><span>MetaMask</span></button>
                    }
                    <button onClick={onConnect} className={'walletButton'}><img
                        src="/webAll.svg" loading={'lazy'}
                        style={{
                            width: '25px',
                        }}
                        alt=""/><span>WlletConnect</span>
                    </button>
                </div>
            }
            {contextHolder}
        </Modal>
    );
}

export default HeaderModal;