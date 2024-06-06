import { Input, Modal } from "antd";
import { useContext, useState, useEffect } from "react";
import { CountContext } from "../Layout.tsx";
import cookie from "js-cookie";
import Request from "./axios.tsx";
import { throttle } from "lodash";
import { MessageAll } from "./message.ts";
import { DoubleLeftOutlined } from '@ant-design/icons'
import { useTranslation } from "react-i18next";
import { QRCode, } from 'antd';
function HeaderModal() {
    const {
        browser,
        isModalOpen,
        setIsModalOpen,
        isModalSet,
        setIsModalSet, connect, setLoad, setQRCodeLink,
        getMoneyEnd,
        user, QRCodeLink,
        setUserPar, tonConnect
    }: any = useContext(CountContext);
    const [list, setList] = useState<any>([])
    
    function onAnnouncement(event?: any) {
        list.push(event?.detail)
        setList([...list])
    }
    useEffect(() => {
        window.addEventListener("eip6963:announceProvider", onAnnouncement);
        window.dispatchEvent(new Event("eip6963:requestProvider"));
        return () => window.removeEventListener("eip6963:announceProvider", onAnnouncement)
    }, [])

    const { t } = useTranslation();
    const { getAll } = Request()
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalSet(false)
        setQRCodeLink('')
    };
    const [value, setValue] = useState('')
    const changeName = (e: any) => {
        setValue(e.target.value)
    }
    const pushSet = throttle(async function () {
        if (value) {
            const token = cookie.get('token')
            if (user && token) {
                const param = { ...user, username: value }
                const result: any = await getAll({ method: 'post', url: '/api/v1/userinfo', data: { user: param }, token });
                if (result?.status === 200) {
                    setUserPar(param)
                    MessageAll('success', t('Market.update'))
                    handleCancel()
                }
            }
        }
    }, 1500, { 'trailing': false })
    const connectWallet = throttle(async function (i: any) {
        setLoad(true)
        getMoneyEnd(i)
        setIsModalOpen(false)
    }, 1500, { 'trailing': false })
    const onConnect = throttle(function () {
        connect();
        setIsModalOpen(false)
    }, 1500, { 'trailing': false })
    return (
        <Modal destroyOnClose={true} centered title={null} footer={null} className={`walletModal ${browser ? 'walletModalBig' : 'walletModalSmall'}`}
            maskClosable={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {/* 判断是否 为二维码 */}
            {QRCodeLink ? <>
                <DoubleLeftOutlined style={{ fontSize: '20px', cursor: 'pointer', color: 'white', marginBottom: '10px' }} onClick={() => setQRCodeLink('')} />
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                    <QRCode value={QRCodeLink} icon='/ton.webp' color="white" size={400} />
                </div>
            </> : isModalSet ? <div className={'headerModalSetName'}>
                <p>{t('Common.new')}</p>
                <p>{t('Common.set')}</p>
                <Input autoComplete={'off'} allowClear onChange={changeName} className={'input'} />
                <p onClick={pushSet}>OK</p>
            </div> : <div className={'headerModal'}>
                <img src="/logo1.svg" loading={'lazy'} alt="" style={{ width: '120px' }} />
                <p>{t("Common.Connect to Dexpert")}</p>
                {
                    browser && list.length > 0 && list.map((i: any, ind: number) => {
                        return i?.info?.name !== "Backpack" && <button key={ind} onClick={() => connectWallet(i)} className={'walletButton disCen'} style={{ marginBottom: "7px" }}>
                            <img loading={'lazy'}
                                src={i?.info?.icon} style={{ width: '25px', height: '25px' }}
                                alt="" /><span>{i?.info?.name}</span></button>
                    })
                }
                <button style={{ display: 'none' }} onClick={tonConnect} className={'walletButton disCen'}><img
                    src='/ton.webp' loading={'lazy'}
                    style={{
                        width: '25px', height: '25px',
                    }}
                    alt="" /><span>Ton</span>
                </button>
                <button onClick={onConnect} className={'walletButton disCen'}><img
                    src="/webAll.svg" loading={'lazy'}
                    style={{
                        width: '25px', height: '25px'
                    }}
                    alt="" /><span>WalletConnect</span>
                </button>
            </div>}
        </Modal>
    );
}

export default HeaderModal;