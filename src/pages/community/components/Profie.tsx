import {useEffect, useRef, useState} from "react";
import Copy from '../../../components/copy.tsx'
import TWeetHome from "../../../components/tweetHome.tsx";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {Modal} from 'antd'
function Profie() {
    const topRef = useRef<any>()
    const [status, setStatus] = useState(false)
    const [options, setOptions] = useState('Community')
    const [hei, setHei] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        if (status) {
            setTimeout(() => {
                setStatus(false)
            }, 4000);
        }
    }, [status]);
    useEffect(() => {
        if (topRef && topRef.current) {
            const h = topRef.current.scrollHeight
            const w = window.innerHeight
            const o: any = w - h - 25 - 54
            setHei(o.toString())
        }
    }, []);
    // const showModal = () => {
    //     setIsModalOpen(true);
    // };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={'username-page'}>
            <div ref={topRef}>
                <div className={`back`}>
                    <ArrowLeftOutlined style={{color:'rgb(214,223,215)',fontSize:'20px',marginRight:'10px',cursor:'pointer'}}/>
                    <div>
                        <p><span>DSADADAS ADA</span><img src="/certification.svg" alt=""/></p>
                        <p>0x3758...5478</p>
                    </div>
                </div>
                <div className={`information`}>
                    <div className={'informationLeft'}>
                        <p className={'p'}><span>DSADADASADA</span><img src="/certification.svg" alt=""/></p>
                        <p>0x3758...5478 <Copy status={status} setStatus={setStatus} name={'0x3758...5478'}/></p>
                        <p className={'p'}><img src="/titter.svg" alt=""/><img src="/facebook.svg" alt=""/></p>
                    </div>
                    <div className={`informationRight `}>
                        {
                            [{
                                img: ["/btc.svg", "/eth1.svg", "/sol.svg"],
                                holding: 123,
                                following: 2324
                            }, {
                                img: ["/pepe.svg", "/uni.svg", "/blur.svg"],
                                holding: 33,
                                following: 66
                            },].map((i: any, ind: number) => {
                                return <div className={`following dis`} key={ind}>
                                    <div>
                                        {
                                            i.img.map((it: string, index: number) => {
                                                return <img src={it} key={index} alt=""/>
                                            })
                                        }
                                    </div>
                                    <div><span>{i.holding + ' '} </span>Holding</div>
                                    <div><span>{i.following + ' '} </span>Following</div>
                                </div>
                            })
                        }
                        {/*<div className={`following dis`}>*/}
                        {/*    <div>*/}
                        {/*        <img src="/btc.svg" alt=""/>*/}
                        {/*        <img src="/eth1.svg" alt=""/>*/}
                        {/*        <img src="/sol.svg" alt=""/>*/}
                        {/*    </div>*/}
                        {/*    <p><span>142 </span>Holding</p>*/}
                        {/*    <p><span>1345 </span>Following</p>*/}
                        {/*</div>*/}
                        {/*<div className={`following dis`}>*/}
                        {/*    <div>*/}
                        {/*        <img src="/btc.svg" alt=""/>*/}
                        {/*        <img src="/eth1.svg" alt=""/>*/}
                        {/*        <img src="/sol.svg" alt=""/>*/}
                        {/*    </div>*/}
                        {/*    <p><span>142 </span>Holding</p>*/}
                        {/*    <p><span>1345 </span>Following</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <p className={'hello'}>Hello players, DEXpert is a special exchange! I hope we can have fun here!</p>
                <div className={'tokenTop'}>
                    {
                        ['Community', 'Token'].map((i: string, ind: number) => {
                            return <p onClick={() => {
                                if (options !== i) {
                                    setOptions(i)
                                }
                            }} key={ind}
                                      style={{color: options === i ? 'rgb(134,240,151 )' : 'rgb(214,223,215)'}}>{i}</p>
                        })
                    }
                </div>
            </div>
            <div style={{height: hei + 'px', overflowY: 'auto'}} className={`scrollStyle community-content-post`}
                 id='scrollableDiv'>
                <TWeetHome/>
            </div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
            </Modal>
        </div>
    );
}

export default Profie;