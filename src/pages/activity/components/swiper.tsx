import {CountContext} from "@/Layout.tsx";
import {useContext} from 'react'
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectCoverflow, Navigation, Pagination,} from "swiper/modules";
import 'swiper/css';
import {throttle} from "lodash";
import 'swiper/css/effect-coverflow';
function SwiperNow({data}:any) {
    const {browser,}: any = useContext(CountContext);
    return (
        <div className={`activeSwiper ${browser ? 'activeSwiperWeb' : 'activeSwiperActive'}`}>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    // depth: 50,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={true}
                // navigation
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                loop
                autoplay={{delay: 3500, disableOnInteraction: false}}
            >
                {
                    data.length > 0 && data[0]?.campaign?.noticeUrl?.length > 0 ?
                        data[0]?.campaign?.noticeUrl.concat(data[0]?.campaign?.noticeUrl).map((i: string, ind: number) => {
                            return <SwiperSlide key={ind} style={{
                                height: browser ? '72vh' : '215px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <img loading={'lazy'} className={'activeImgHover'} src={i}
                                     onClick={throttle(function () {
                                     }, 1500, {'trailing': false})} alt=""/></SwiperSlide>
                        }) : ''
                }
            </Swiper>
        </div>
    );
}

export default SwiperNow;