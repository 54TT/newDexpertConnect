import {useContext, useEffect, useState} from 'react';
import {Collapse, Drawer, Dropdown, } from 'antd'
import {CountContext} from '../Layout.tsx'
import {useLocation, useNavigate} from 'react-router-dom';
import {DownOutlined, LoadingOutlined} from '@ant-design/icons';
import {simplify} from '../../utils/change.ts';
import HeaderModal from "./headerModal.tsx";

function Header() {
    const router = useLocation()
    const {
        user,
        load,
        clear,
        browser,
        setIsModalOpen,
    }: any = useContext(CountContext);
    const history = useNavigate();
    const [open, setOpen] = useState(false);
    const [, setSelect] = useState('')
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
    // 改变路由方法
    const historyChange = (i: number) => {
        switch (i) {
            case 2:
                history('/community/lastest')
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
                    [{name: 'Token Creation Bot', img: "/token.svg"}, {
                        name: 'Sniper Bot',
                        img: '/sniper.svg'
                    }, {name: 'Air drop Bot', img: '/dropBot.svg'}, {
                        name: 'Market maker',
                        img: '/money.svg'
                    }, {name: 'New Buy notification', img: '/news.svg'}, {
                        name: 'Token Checker',
                        img: '/checker.svg'
                    }, {name: 'Trending', img: '/trending.svg'}].map((i: any, ind: number) => {
                        return <p key={ind} onClick={() => {
                            if (ind === 0) {
                                history('/dapp')
                                onClose()
                            }
                        }}><img src={i.img} alt=""/><span
                            style={{color: ind > 0 ? 'gray' : 'rgb(200,200,200)'}}>{i.name}</span></p>
                    })
                }
            </div>,
        },
        {
            key: '2',
            label: 'Community',
            children: <div className={'collapseChildeen'}>
                {
                    [{name: 'lastest', img: "/community/latest.svg"}, {
                        name: 'profile',
                        img: "/community/profile.svg"
                    }, {name: 'following', img: "/community/follow.svg"}].map((i: any, ind: number) => {
                        return <p key={ind} onClick={() => {
                            history(`/community/${i.name}`);
                            onClose()
                        }}>
                            <img src={i.img} alt=""/>
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
        if (router.pathname === '/' || router.pathname === '/newpairDetails') {
            if (ind === 0) {
                return 'rgb(134,240,151)'
            } else {
                return 'rgb(214,223,215)'
            }
        } else if (router.pathname === '/community/lastest' || router.pathname === '/community/profile' || router.pathname === '/community/following') {
            if (ind === 2) {
                return 'rgb(134,240,151)'
            } else {
                return 'rgb(214,223,215)'
            }
        } else if (router.pathname === '/dapp') {
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
            <img src={"/topLogo.svg"} alt="" style={{cursor: 'pointer'}} onClick={() => {
                history('/')
            }}/>
            {
                browser && <p className={`headerCenter dis`}>
                    {
                        ['Market', 'DApp & Tools', 'Community'].map((i, ind) => {
                            return <span key={ind}
                                         style={{color: change(ind)}}
                                         onClick={() => {
                                             historyChange(ind);
                                         }}>{i}</span>
                        })
                    }
                </p>
            }
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                {
                    user?.uid ? <Dropdown
                        menu={{
                            items,
                        }}>
                        {
                            browser ? <div className={'disCen'} style={{cursor: 'pointer'}}>
                                <img src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.svg"}
                                     style={{width: '25px', display: 'block', marginRight: '4px', borderRadius: '100%'}}
                                     alt=""/>
                                <p style={{color: 'rgb(214,223,215)'}}> {simplify(user?.username)}</p>
                                <DownOutlined style={{color: 'rgb(214,223,215)', marginTop: '3px'}}/>
                            </div> : <img src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.svg"}
                                          style={{
                                              width: '28px',
                                              display: 'block',
                                              cursor: 'pointer',
                                              borderRadius: '100%'
                                          }} alt=""/>
                        }
                    </Dropdown> : browser ? <div className={'headerConnect'} onClick={loginModal}>
                        <div className={'disCen'}><span>Connect Wallet</span> {load ?
                            <LoadingOutlined style={{marginLeft: '4px'}}/> : ''}
                        </div>
                    </div> : <img src="/wallet.svg" onClick={loginModal} style={{width: '13%'}} alt=""/>
                }
                {
                    !browser &&
                    <img src="/side.svg" alt="" style={{cursor: 'pointer', width: '28px', marginLeft: '8px'}}
                         onClick={() => {
                             showDrawer()
                         }}/>
                }
            </div>
            <HeaderModal/>
            <Drawer width={'65vw'} className={'headerDrawerOpen'} destroyOnClose={true} onClose={onClose} open={open}>
                <Collapse items={collapseItems} accordion className={'headerCollapse'} onChange={onChange} ghost/>
            </Drawer>
        </div>
    );
}

export default Header;