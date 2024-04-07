import {Input, message, Modal} from "antd";
import {useContext, useState} from "react";
import {CountContext} from "../Layout.tsx";
import cookie from "js-cookie";
import Request from "./axios.tsx";
import {throttle} from "lodash";
function HeaderModal() {
    const {
        browser,
        isModalOpen,
        setIsModalOpen,
        isModalSet,
        setIsModalSet, connect, setLoad,
        getMoneyEnd,
    }: any = useContext(CountContext);
    const {getAll} = Request()
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
    const pushSet = throttle( async function () {
        if (value) {
            const username = cookie.get('username')
            const token = cookie.get('token')
            if (username && token) {
                const ab = JSON.parse(username)
                const user = {...ab, username: value}
                // const result: any = await Request('post', '/api/v1/userinfo', {user}, token);
                const result: any = await getAll({method:'post',url: '/api/v1/userinfo',data:{user},token});
                if (result?.status === 200) {
                    cookie.set('username', JSON.stringify(user))
                    messageApi.success('update success');
                    handleCancel()
                }
            }
        }
    }, 1500, {'trailing': false})
    const connectWallet = throttle( async function () {
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
    }, 1500, {'trailing': false})
    const onConnect = throttle( function () {
        connect();
        setIsModalOpen(false)
        }, 1500, {'trailing': false})
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
                        alt=""/><span>WalletConnect</span>
                    </button>
                </div>
            }
            {contextHolder}
        </Modal>
    );
}

export default HeaderModal;