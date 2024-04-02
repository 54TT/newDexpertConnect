import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, Autoplay, EffectFade, Pagination} from 'swiper/modules';
import {useContext, useEffect, useRef, useState} from 'react'
import TweetHome from "../../../components/tweetHome.tsx";
import {CountContext} from "../../../Layout.tsx";
function Right() {
    const swiperRef: any = useRef()
    const topRef: any = useRef()
    const {browser}: any = useContext(CountContext);
    const [hei, setHei] = useState('')
    const [select, setSelect] = useState('one')
    const [heiol, setHeiBol] = useState(false)
    useEffect(() => {
        if (swiperRef && swiperRef.current) {
            const h = swiperRef.current.scrollHeight
            const t = topRef.current.scrollHeight
            const w = window.innerHeight
            const remain = w - h - t - 25 - 54
            setHei(remain.toString())
        }
    }, []);
    const selectTweet = (name: string) => {
        if (select !== name) {
            setSelect(name)
        }
    }
    const changeHei = (name: boolean) => {
        setHeiBol(name)
    }
    return (
        <div className={'rightBox'} style={{width: browser ? '24%' : '100%', marginBottom: browser ? '0' : '40px'}}>
            <div ref={swiperRef} style={{margin: browser ? '0' : '40px 0'}}>
                <Swiper
                    slidesPerView={1}
                    modules={[EffectFade, Autoplay, Pagination, A11y]}
                    pagination={{
                        "clickable": true
                    }}
                    loop
                    autoplay={{delay: 2000, disableOnInteraction: false}}>
                    {
                        ['/poster1.jpg','/poster2.jpg', '/poster3.jpg',].map((i, ind) => {
                            return <SwiperSlide key={ind}><img loading={'lazy'} src={i} onClick={() => {
                                if (ind === 0) {
                                    window.open('https://info.dexpert.io/pointsDetail')
                                }
                            }} style={{width: '100%',borderRadius: "20px", cursor: "pointer"}}
                                                               alt=""/></SwiperSlide>
                        })
                    }
                </Swiper>
            </div>
            <div className={'rightBoxTweet'} style={heiol ? {} : {height: browser ? '100vh' : '50vh'}}>
                <div ref={topRef} className={'rightBoxTweetTop'}>
                    <div style={{
                        color: select === 'one' ? 'rgb(104,124,105)' : 'rgb(134,240,151)',
                        backgroundColor: select === 'one' ? 'rgb(24,30,28)' : ''
                    }}
                         onClick={() => selectTweet('one')}>Recommand
                    </div>
                    <div style={{
                        color: select !== 'one' ? 'rgb(104,124,105)' : 'rgb(134,240,151)',
                        backgroundColor: select !== 'one' ? 'rgb(24,30,28)' : ''
                    }}
                         onClick={() => selectTweet('two')}>Lastest
                    </div>
                </div>
                <TweetHome hei={`${hei}px`} changeHei={changeHei}/>
            </div>
        </div>
    );
}

export default Right;