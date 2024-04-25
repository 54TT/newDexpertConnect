import './index.less';
import {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Autoplay, EffectCoverflow, Pagination} from "swiper/modules";
import {throttle} from "lodash";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import Request from "../../components/axios.tsx";
import cookie from "js-cookie";
import {Modal} from 'antd'
import Loading from '../../components/loading.tsx'
import {LoadingOutlined} from '@ant-design/icons'

function Index() {
    const {getAll,} = Request()
    const [select, setSelect] = useState(0)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [point, setPoint] = useState('0')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [link, setLink] = useState('');
    const [load, setLoad] = useState(false)
    const getParams = async (token: string) => {
        const res = await getAll({
            method: 'post', url: '/api/v1/campaign/home', data: {}, token
        })
        if (res?.status === 200) {
            setData(res?.data?.campaignHome)
            setPoint(res?.data?.totalPoint)
            setLoad(true)
        } else {
            setLoad(true)
        }
    }


    const getT = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: select === 1 ? 'post' : 'get',
                url: select === 0 ? '/api/v1/oauth/twitter/link' : select === 1 ? '/api/v1/oauth/telegram/chat/link' : '/api/v1/oauth/discord/link',
                data: select === 1 ? {botId: '6579122627', taskId: id} : {taskId: id},
                token
            })
            if (res?.data?.url) {
                window.open(res?.data?.url, '_self')
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        const token = cookie.get('token')
        if (token) {
            getParams(token)
        }
    }, []);
    const change = (name: string) => {
        if (name.length > 0) {
            const data = name.split(' ')
            return data[0]
        } else {
            return ''
        }
    }
    const follow = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: select === 1 ? 'post' : 'get',
                url: select === 0 ? '/api/v1/oauth/twitter/follow' : select === 1 ? '/api/v1/oauth/telegram/chat/follow' : '/api/v1/oauth/discord/follow',
                data: select === 1 ? {chatId: '-1002120873901', taskId: id} : {taskId: id},
                token
            })
            if (res?.data?.url) {
                window.open(res?.data?.url)
                getParams(token)
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
    }
    const verify = async (id: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post',
                url: select === 0 ? '/api/v1/oauth/twitter/verify' : select === 1 ? '/api/v1/oauth/telegram/chat/verify' : '/api/v1/oauth/discord/verify',
                data: select === 1 ? {
                    taskId: id,
                    chatId: '-1002120873901'
                } : select === 0 ? {taskId: id} : {groupId: '1218109860999204904', botName: 'dis_bot', taskId: id},
                token
            })
            if (res?.status === 200 && res.data?.exist) {
                setLoading(false)
                getParams(token)
            } else {
                if (res?.data?.url) {
                    setLink(res?.data?.url)
                    setIsModalOpen(true);
                }
                setLoading(false)
            }
        }
    }
    const operate = (tasks: any) => {
        if (tasks?.length > 0) {
            if (Number(tasks[select]?.isCompleted)) {
                if (Number(tasks[select]?.isCompleted) === 1) {
                    return change(tasks[select]?.title)
                } else if (Number(tasks[select]?.isCompleted) === 2) {
                    return 'Verify'
                } else {
                    return 'Completed'
                }
            } else {
                return 'Authorize'
            }
        }
    }
    const param = (tasks: any) => {
        if (Number(tasks[select]?.isCompleted)) {
            if (Number(tasks[select]?.isCompleted) === 1) {
                follow(tasks[select]?.taskId)
                setLoading(true)
            }
            if (Number(tasks[select]?.isCompleted) === 2) {
                verify(tasks[select]?.taskId)
                setLoading(true)
            }
        } else {
            setLoading(true)
            getT(tasks[select]?.taskId)
        }
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }
    const openLink = () => {
        if (link) {
            window.open(link)
            setIsModalOpen(false);
        }
    }

    return (
        <>
            {
                load ? <div className={'activityBox'} style={{marginBottom: '50px'}}>
                    <div className={'top'}>
                        <div>
                            <p>{point}</p>
                            <p>POINTS</p>
                        </div>
                        <p>Redeem</p>
                    </div>
                    <p className={'p2'}>Events</p>
                    <p className={'p3'}>View activities here</p>
                    <div className={'activeSwiper'}>
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={"auto"}
                            coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }}
                            pagination={true}
                            modules={[EffectCoverflow, Autoplay, Pagination, A11y]}
                            loop
                            autoplay={{delay: 2000, disableOnInteraction: false}}>
                            {
                                data.length > 0 && data[0]?.campaign?.noticeUrl?.length > 0 ?
                                    data[0]?.campaign?.noticeUrl.map((i: string, ind: number) => {
                                        return <SwiperSlide key={ind}><img loading={'lazy'} src={i} onClick={
                                            throttle(function () {
                                            }, 1500, {'trailing': false})
                                        }
                                                                           style={{borderRadius: '15px'}}
                                                                           alt=""/></SwiperSlide>
                                    }) : ''
                            }
                        </Swiper>
                    </div>
                    {/*活动*/}
                    {
                        data.length > 0 ? data.map((i: any, ind: number) => {
                            return <div key={ind} className={'active'}>
                                <p className={'p2'}>{i?.campaign?.title || ''}</p>
                                <p className={'p3'}>{i?.campaign?.startTime || ''} -- {i?.campaign?.endTime}</p>
                                {
                                    i?.tasks?.length > 0 && <div className={'box'}>
                                        <div>
                                            {
                                                i?.tasks.map((it: any, ind: number) => {
                                                    return <p style={{
                                                        background: select === ind ? 'rgb(52,62,53)' : '',
                                                        color: select === ind ? 'rgb(134,240,151)' : 'white'
                                                    }} onClick={() => {
                                                        if (select !== ind && !loading) {
                                                            setSelect(ind)
                                                        }
                                                    }} key={ind}>{it?.title}
                                                        {
                                                            Number(it?.isCompleted) && Number(it?.isCompleted) === 3 ?
                                                                <img src="/finish.svg" alt=""/> : ''
                                                        }</p>
                                                })
                                            }
                                        </div>
                                        <div>
                                            <p>{i?.tasks[select]?.title || ''}</p>
                                            <p>{i?.tasks[select]?.description || ''}</p>
                                            <p onClick={() => {
                                                param(i?.tasks)
                                            }}
                                               style={{color: i?.tasks[select]?.isCompleted === '3' ? 'gray' : 'black'}}>{operate(i?.tasks)}
                                                {loading ? <LoadingOutlined/> : ''}</p>
                                        </div>
                                    </div>
                                }
                                <p style={{
                                    marginTop: '20px',
                                    color: 'rgb(200,200,200)',
                                    lineHeight: '1.1'
                                }}>{i?.campaign?.description}</p>
                            </div>
                        }) : <p style={{textAlign: 'center', marginTop: '20px'}}>暂无活动</p>
                    }
                </div> : <Loading status={'20'}/>
            }
            <Modal title={`Verification failed, please ${select === 0 ? 'follow' : 'join'} again`}
                   className={'activeModal'} open={isModalOpen}
                   footer={null} onCancel={handleCancel}>
                <p>{select === 0 ? 'Follow the following Twitter users' : select === 1 ? 'Join the following Telegram group' : 'Join the following Discord group'}:</p>
                <div>
                    <div>
                        <img src="/img_3.png" alt="" onClick={openLink}/>
                        <div>
                            <p onClick={openLink}>Dexpert</p>
                            <p>{select === 0 ? '@DexpertOfficial' : select === 1 ? '@DexpertCommunity' : '@Dexpert'}---<span
                                onClick={openLink}>{select === 0 ? 'Follow' : 'Join'}</span></p>
                        </div>
                    </div>
                    <img src={select === 0 ? "/x.svg" : select === 1 ? '/telegram1.svg' : '/discord.svg'} alt=""
                         onClick={openLink}/>
                </div>
                <p onClick={openLink}>
                    <img src={select === 0 ? "/x.svg" : select === 1 ? '/telegram1.svg' : '/discord.svg'} alt=""/>
                    <span>{select === 0 ? 'Follow @Dexpertofficial' : select === 1 ? 'Join @DexpertCommunity' : 'Join @Dexpert'}</span>
                </p>
            </Modal>

        </>
    );
}

export default Index;