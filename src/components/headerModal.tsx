import {Input, Modal} from "antd";
import {useContext, useState} from "react";
import {CountContext} from "../Layout.tsx";
import cookie from "js-cookie";
import Request from "./axios.tsx";
import {throttle} from "lodash";
import {MessageAll} from "./message.ts";
import {useTranslation} from "react-i18next";

function HeaderModal() {
    const {
        browser,
        isModalOpen,
        setIsModalOpen,
        isModalSet,
        setIsModalSet, connect, setLoad,
        getMoneyEnd,
        user,
        setUserPar
    }: any = useContext(CountContext);
    const {t} = useTranslation();
    const {getAll} = Request()
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
    const pushSet = throttle(async function () {
        if (value) {
            const token = cookie.get('token')
            if (user && token) {
                const users = {...user, username: value}
                const result: any = await getAll({method: 'post', url: '/api/v1/userinfo', data: {users}, token});
                if (result?.status === 200) {
                    setUserPar(users)
                    MessageAll('success', t('Market.update'))
                    handleCancel()
                }
            }
        }
    }, 1500, {'trailing': false})
    const connectWallet = throttle(async function () {
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
    const onConnect = throttle(function () {
        connect();
        setIsModalOpen(false)
    }, 1500, {'trailing': false})
    return (
        <Modal destroyOnClose={true} centered title={null} footer={null} className={'walletModal'}
               maskClosable={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {
                isModalSet ? <div className={'headerModalSetName'}>
                    <p>{t('Common.new')}</p>
                    <p>{t('Common.set')}</p>
                    <Input autoComplete={'off'} allowClear onChange={changeName} className={'input'}/>
                    <p onClick={pushSet}>OK</p>
                </div> : <div className={'headerModal'}>
                    <img src="/logo1.svg" loading={'lazy'} alt=""/>
                    <p>{t("Common.Connect to Dexpert")}</p>
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
        </Modal>
    );
}

export default HeaderModal;