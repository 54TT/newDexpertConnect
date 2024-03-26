import { useContext, useState, useRef, useEffect } from 'react';
import { Modal } from 'antd'
import { CountContext } from '../../Layout.tsx'
import { useNavigate } from 'react-router-dom';

function Index({ setHeadHeight }: any) {
    const hei = useRef<any>()
    const { connect, getMoneyEnd }: any = useContext(CountContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState('Market')
    const history = useNavigate();
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onConnect = () => {
        connect();
        setIsModalOpen(false)
    };
    const connectWallet = async () => {
        try {
            if (window.innerWidth > 768) {
                getMoneyEnd()
            } else {
                window.open('metamask:https://dexpert.io/', '_blank');
            }
            setIsModalOpen(false)
        } catch (e) {
            return null
        }
    }
    // 改变路由方法
    const historyChange = (i: string) => {
        switch (i) {
            case 'Community':
                history('/community')
                break;
        }
    }

    useEffect(() => {
        if (hei && hei.current) {
            setHeadHeight(hei.current.scrollHeight)
        }
    }, [])

    return (
        <div className={'headerBox'} ref={hei}>
            <img src="/topLogo.svg" alt="" />
            <p className={`headerCenter dis`}>
                {
                    ['Market', 'DApp & Tools', 'Community'].map((i, ind) => {
                        return <span key={ind} style={{ color: page === i ? 'rgb(134,240,151)' : 'rgb(214,223,215)' }}
                            onClick={() => {
                                setPage(i);
                                historyChange(i);
                            }}>{i}</span>
                    })
                }
            </p>
            <p className={'headerConnect'} onClick={() => setIsModalOpen(true)}>Connect Wallet</p>


            <Modal destroyOnClose={true} centered title={null} footer={null} className={'walletModal'}
                maskClosable={false}
                open={isModalOpen}
                onOk={handleOk} onCancel={handleCancel}>
                <div className={'headerModal'}>
                    <img src="/logo1.svg" alt="" />
                    <p>Connect to Dexpert</p>
                    {
                        // window.innerWidth > 768 &&
                        <button onClick={connectWallet} className={'walletButton'} style={{ margin: '10px 0' }}>
                            <img
                                src="/metamask.svg" style={{ width: '25px' }}
                                alt="" /><span>MetaMask</span></button>
                    }
                    <button onClick={onConnect} className={'walletButton'}><img
                        src="/webAll.svg"
                        style={{
                            width: '25px',
                        }}
                        alt="" /><span>WlletConnect</span>
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Index;