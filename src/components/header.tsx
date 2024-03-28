import {useContext, useState} from 'react';
import {Dropdown, Modal} from 'antd'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {CountContext} from '../Layout.jsx'
import {useNavigate} from 'react-router-dom';
import {DownOutlined, LoadingOutlined} from '@ant-design/icons'

function Header() {
    const {connect, getMoneyEnd, user, setLoad, load, clear}: any = useContext(CountContext);
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
    // 改变路由方法
    const historyChange = (i: number) => {
        switch (i) {
            case 2:
                history('/community')
                break;
            case 0:
                history('/')
                break;
            case 1:
                history('/dapp')
                break;
        }
    }
    const logout = () => {
        clear()
    }
    const items: any = [
        {
            key: '1',
            label: (
                <p onClick={logout}>logout</p>
            ),
        },
    ];

    return (
        <div className={'headerBox'}>
            <img src="/topLogo.svg" alt="" style={{cursor: 'pointer'}} onClick={() => {
                history('/')
            }} />
            <p className={`headerCenter dis`}>
                {
                    ['Market', 'DApp & Tools', 'Community'].map((i, ind) => {
                        return <span key={ind} style={{color: page === i ? 'rgb(134,240,151)' : 'rgb(214,223,215)'}}
                                     onClick={() => {
                                         setPage(i);
                                         historyChange(ind);
                                     }}>{i}</span>
                    })
                }
            </p>

            {
                user?.uid ? <Dropdown
                    menu={{
                        items,
                    }}>
                    <div className={'disCen'} style={{cursor: 'pointer'}}>
                        <img src={user?.avatarlrl ? user?.avatarlrl : "/topLogo.svg"}
                             style={{width: '25px', display: 'block', marginRight: '4px'}} alt=""/>
                        <p style={{color: 'rgb(214,223,215)'}}> {user?.username ? user.username.length > 12 ? user.username.slice(0, 5) + '...' + user.username.slice(-4) : user.username : user.address.slice(0, 5) + '...' + user.address.slice(-4)}</p>
                        <DownOutlined style={{color: 'rgb(214,223,215)', marginTop: '3px'}}/>
                    </div>
                </Dropdown> : <div className={'headerConnect'} onClick={() => {
                    if (!load) {
                        if (!user) {
                            setIsModalOpen(true)
                        }
                    }
                }}>
                    <div className={'disCen'}><span>Connect Wallet</span> {load ?
                        <LoadingOutlined style={{marginLeft: '4px'}}/> : ''}
                    </div>
                </div>
            }
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

export default Header;