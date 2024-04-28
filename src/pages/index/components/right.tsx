import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, Autoplay, EffectFade, Pagination} from 'swiper/modules';
import {useContext, useRef, useState} from 'react'
import TweetHome from "../../../components/tweetHome.tsx";
import {CountContext} from "../../../Layout.tsx";
import {throttle} from "lodash";
import {useNavigate} from "react-router-dom";

function Right() {
    const swiperRef: any = useRef()
    const topRef: any = useRef()
    const history = useNavigate()
    const {browser,}: any = useContext(CountContext);
    const [select, setSelect] = useState('one')
    const hei = window?.innerHeight - swiperRef?.current?.clientHeight - topRef?.current?.clientHeight - 80
    const selectTweet = throttle(function (name: string) {
        if (select !== name) {
            setSelect(name)
        }
    }, 1500, {'trailing': false})

    return (
        <div className={'rightBox'} style={{width: browser ? '24%' : '100%', marginBottom: browser ? '0' : '40px'}}>
            <div ref={swiperRef} style={{margin: browser ? '0' : '40px 0', width: '100%'}}>
                <Swiper
                    slidesPerView={1}
                    modules={[EffectFade, Autoplay, Pagination, A11y]}
                    pagination={{
                        "clickable": true
                    }}
                    loop
                    autoplay={{delay: 2000, disableOnInteraction: false}}>
                    {
                        ['/abc1.jpg','/abc2.jpg','/abc3.jpg'].map((i, ind) => {
                        // ["https://dex-pert-pic.sgp1.cdn.digitaloceanspaces.com/dexpert-compaign.jpg", "https://dex-pert-pic.sgp1.cdn.digitaloceanspaces.com/dexpert-compaign2.jpg", "https://dex-pert-pic.sgp1.cdn.digitaloceanspaces.com/dexpert-compaign1.jpg"].map((i, ind) => {
                            return <SwiperSlide key={ind}><img loading={'lazy'} src={i} onClick={
                                throttle(function () {
                                    history('/activity')
                                }, 1500, {'trailing': false})
                            } style={{width: '100%', borderRadius: "20px", cursor: "pointer", display: 'block'}}
                                                               alt=""/></SwiperSlide>
                        })
                    }
                </Swiper>
            </div>
            <div className={'rightBoxTweet'} style={{height: browser ? hei + 15 + 'px' : '50vh'}}>
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
                <TweetHome hei={`${hei-53}px`}/>
            </div>
        </div>
    );
}

export default Right;