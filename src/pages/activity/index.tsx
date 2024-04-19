import './index.less';
import {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Autoplay, EffectCoverflow, Pagination} from "swiper/modules";
import {throttle} from "lodash";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import Request from "../../components/axios.tsx";
import cookie from "js-cookie";
import Loading from '../../components/loading.tsx'
import {LoadingOutlined} from '@ant-design/icons'

function Index() {
    const {getAll,} = Request()
    const [select, setSelect] = useState(0)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[]>([])
    console.log(data)
    const [point, setPoint] = useState('0')
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
    const getT = async () => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'get', url: '/api/v1/oauth/twitter/link', data: {}, token
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

    const a = async () => {
        const aa = 'Follow @Dexpertofficial on Twitte!'
        const ao = aa.split(' ')
        console.log(ao)
        console.log(aa)
    }
    const change = (name: string) => {
        const data = name.split(' ')
        return data[0]
    }
    return (
        <>
            {
                load ? <div className={'activityBox'} style={{marginBottom: '50px'}}>
                    <p style={{color: 'white'}} onClick={a}>aaaaaaaaaaaaaaaa</p>
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
                                                                           alt=""/></SwiperSlide>
                                    }) : ''
                            }
                        </Swiper>
                    </div>
                    {/*活动*/}
                    {
                        data.length > 0 ? data.map((i: any, ind) => {
                            return <div key={ind} className={'active'}>
                                <p className={'p2'}>{i?.campaign?.title || ''}</p>
                                <p className={'p3'}>{i?.campaign?.createdAt || ''} -- {i?.campaign?.endTime}</p>
                                <div className={'box'}>
                                    <div>
                                        {
                                            i?.tasks?.length > 0 ? i?.tasks.map((it: any, ind: number) => {
                                                return <p style={{
                                                    background: select === ind ? 'rgb(52,62,53)' : '',
                                                    color: select === ind ? 'rgb(134,240,151)' : 'white'
                                                }} onClick={() => {
                                                    if (select !== ind && !loading) {
                                                        setSelect(ind)
                                                    }
                                                }} key={ind}>{it?.title}
                                                    {
                                                        Number(it?.isCompleted) ? <img src="/finish.svg" alt=""/> : ''
                                                    }</p>
                                            }) : <p>No active tasks yet</p>
                                        }
                                    </div>
                                    <div>
                                        <p>{i?.tasks?.length > 0 ? i?.tasks[select]?.title : ''}</p>
                                        <p>{i?.tasks?.length > 0 ? i?.tasks[select]?.description : ''}</p>
                                        <p onClick={() => {
                                            setLoading(true)
                                            getT()
                                        }}>{i?.tasks?.length > 0 ? Number(i?.tasks[select]?.isCompleted) ? '' : i?.tasks[select]?.title?.length > 0 ? change(i?.tasks[select]?.title) : '' : ''} {
                                            loading ? <LoadingOutlined/> : ''
                                        }</p>
                                    </div>
                                </div>
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
        </>
    );
}

export default Index;