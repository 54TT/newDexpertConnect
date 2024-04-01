import { useContext, useEffect, useState } from 'react';
import { Collapse, Drawer, Dropdown, Modal } from 'antd'
import { CountContext } from '../Layout.tsx'
import { useLocation, useNavigate } from 'react-router-dom';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { simplify } from '../../utils/change.ts'
import Cookies from 'js-cookie';
function Header() {
    const router = useLocation()
    const { connect, getMoneyEnd, user, setLoad, load, clear, browser }: any = useContext(CountContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const history = useNavigate();
    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState('');

    const username: any = JSON.parse(Cookies.get('username') || '{}')
    console.log('123123', username.avatarUrl);
    useEffect(() => {
        if (router.pathname) {
            setSelect(router.pathname)
        }
    }, []);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
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
                history('/community/lastest')
                setSelect('/community/lastest')
                break;
            case 0:
                history('/')
                setSelect('/')
                break;
            case 1:
                history('/dapp')
                setSelect('/dapp')
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
    const loginModal = () => {
        if (!load) {
            if (!user) {
                setIsModalOpen(true)
            }
        }
    }

    const collapseItems: any = [
        {
            key: '0',
            label: 'Market',
        },
        {
            key: '1',
            label: 'Dapps & Tools',
            children: <div className={'collapseChildeen'}>
                {
                    [{ name: 'Token Creation Bot', img: "/token.svg" }, {
                        name: 'Sniper Bot',
                        img: '/sniper.svg'
                    }, { name: 'Air drop Bot', img: '/dropBot.svg' }, {
                        name: 'Market maker',
                        img: '/money.svg'
                    }, { name: 'New Buy notification', img: '/news.svg' }, {
                        name: 'Token Checker',
                        img: '/checker.svg'
                    }, { name: 'Trending', img: '/trending.svg' }].map((i: any, ind: number) => {
                        return <p key={ind} onClick={() => {
                            if (ind === 0) {
                                history('/dapp')
                                onClose()
                            }
                        }}><img src={i.img} alt="" /><span
                            style={{ color: ind > 0 ? 'gray' : 'rgb(200,200,200)' }}>{i.name}</span></p>
                    })
                }
            </div>,
        },
        {
            key: '2',
            label: 'Community',
            children: <div className={'collapseChildeen'}>
                {
                    [{ name: 'lastest', img: "/community/latest.svg" }, {
                        name: 'profile',
                        img: "/community/profile.svg"
                    }, { name: 'following', img: "/community/follow.svg" }].map((i: any, ind: number) => {
                        return <p key={ind} onClick={() => {
                            history(`/community/${i.name}`);
                            onClose()
                        }}>
                            <img src={i.img} alt="" />
                            <span>{i.name}</span>
                        </p>
                    })
                }
            </div>,
        },
    ];
    const onChange = (key: string | string[]) => {
        if (key.length > 0 && key[0] === '0') {
            history('/')
            onClose()
        }
    };
    const change = (ind: number) => {
        if (select === '/' || select === '/newpairDetails') {
            if (ind === 0) {
                return 'rgb(134,240,151)'
            } else {
                return 'rgb(214,223,215)'
            }
        } else if (select === '/community/lastest' || select === '/community/profile' || select === '/community/following') {
            if (ind === 2) {
                return 'rgb(134,240,151)'
            } else {
                return 'rgb(214,223,215)'
            }
        } else if (select === '/dapp') {
            if (ind === 1) {
                return 'rgb(134,240,151)'
            } else {
                return 'rgb(214,223,215)'
            }
        } else {
            return 'rgb(214,223,215)'
        }
    }
    return (
        <div className={'headerBox'}>
            <img src={"/topLogo.svg"} alt="" style={{ cursor: 'pointer' }} onClick={() => {
                history('/')
            }} />
            {
                browser && <p className={`headerCenter dis`}>
                    {
                        ['Market', 'DApp & Tools', 'Community'].map((i, ind) => {
                            return <span key={ind}
                                style={{ color: change(ind) }}
                                onClick={() => {
                                    historyChange(ind);
                                }}>{i}</span>
                        })
                    }
                </p>
            }
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                {
                    user?.uid ? <Dropdown
                        menu={{
                            items,
                        }}>
                        {
                            browser ? <div className={'disCen'} style={{ cursor: 'pointer' }}>
                                <img src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.svg"}
                                    style={{ width: '25px', display: 'block', marginRight: '4px', borderRadius: '100%' }} alt="" />
                                <p style={{ color: 'rgb(214,223,215)' }}> {simplify(user?.username)}</p>
                                <DownOutlined style={{ color: 'rgb(214,223,215)', marginTop: '3px' }} />
                            </div> : <img src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.svg"}
                                style={{ width: '13%', display: 'block' }} alt="" />
                        }
                    </Dropdown> : browser ? <div className={'headerConnect'} onClick={loginModal}>
                        <div className={'disCen'}><span>Connect Wallet</span> {load ?
                            <LoadingOutlined style={{ marginLeft: '4px' }} /> : ''}
                        </div>
                    </div> : <img src="/wallet.svg" onClick={loginModal} style={{ width: '13%' }} alt="" />
                }
                {
                    !browser && <img src="/side.svg" alt="" style={{ cursor: 'pointer', width: '13%', marginLeft: '8px' }}
                        onClick={() => {
                            showDrawer()
                        }} />
                }
            </div>
            <Modal destroyOnClose={true} centered title={null} footer={null} className={'walletModal'}
                maskClosable={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
            <Drawer width={'65vw'} className={'headerDrawerOpen'} destroyOnClose={true} onClose={onClose} open={open}>
                <Collapse items={collapseItems} accordion className={'headerCollapse'} onChange={onChange} ghost />
            </Drawer>
        </div>
    );
}

export default Header;