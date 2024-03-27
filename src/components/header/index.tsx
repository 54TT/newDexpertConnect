import {useContext, useEffect, useRef, useState} from 'react';
import {Modal} from 'antd'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {CountContext} from '../../Layout.jsx'
import {useNavigate} from 'react-router-dom';
import {LoadingOutlined} from '@ant-design/icons'
function Index({setHeadHeight}: any) {
    const hei = useRef<any>()
    const {connect, getMoneyEnd, user, setLoad, load}: any = useContext(CountContext);
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
    const historyChange = (i: string) => {
        switch (i) {
            case 'Community':
                history('/community')
                break;
            case 'Market':
                history('/')
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
            <img src="/topLogo.svg" alt="" style={{cursor: 'pointer'}} onClick={()=>{
                history('/')
            }}/>
            <p className={`headerCenter dis`}>
                {
                    ['Market', 'DApp & Tools', 'Community'].map((i, ind) => {
                        return <span key={ind} style={{color: page === i ? 'rgb(134,240,151)' : 'rgb(214,223,215)'}}
                                     onClick={() => {
                                         setPage(i);
                                         historyChange(i);
                                     }}>{i}</span>
                    })
                }
            </p>
            <div className={'headerConnect'} onClick={() => {
                if (!load) {
                    if (!user) {
                        setIsModalOpen(true)
                    }
                }
            }}>
                {
                    user?.uid ? <div className={'disCen'}>
                            <img src={user?.avatarlrl ? user?.avatarlrl : "/topLogo.svg"}
                                 style={{width: '25px', display: 'block', marginRight: '4px'}} alt=""/>
                            <p> {user?.username ? user.username.length > 15 ? user.username.slice(0, 5) + '...' + user.username.slice(-4) : user.username : user.address.slice(0, 5) + '...' + user.address.slice(-4)}</p>
                        </div> :
                        <div className={'disCen'}><span>Connect Wallet</span> {load ?
                            <LoadingOutlined style={{marginLeft: '4px'}}/> : ''}
                        </div>
                }
            </div>
            <Modal destroyOnClose={true} centered title={null} footer={null} className={'walletModal'}
                   maskClosable={false}
                   open={isModalOpen}
                   onOk={handleOk} onCancel={handleCancel}>
                <div className={'headerModal'}>
                    <img src="/logo1.svg" alt=""/>
                    <p>Connect to Dexpert</p>
                    {
                        // window.innerWidth > 768 &&
                        <button onClick={connectWallet} className={'walletButton'} style={{margin: '10px 0'}}>
                            <img
                                src="/metamask.svg" style={{width: '25px'}}
                                alt=""/><span>MetaMask</span></button>
                    }
                    <button onClick={onConnect} className={'walletButton'}><img
                        src="/webAll.svg"
                        style={{
                            width: '25px',
                        }}
                        alt=""/><span>WlletConnect</span>
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Index;