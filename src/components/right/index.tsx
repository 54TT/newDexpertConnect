import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import Tweets from '../tweets.tsx'
import { useContext, useEffect, useRef, useState } from 'react'
import {request} from '../../../utils/axios.ts';
import InfiniteScroll from 'react-infinite-scroll-component'
import { Skeleton } from 'antd'
import { CountContext } from "../../Layout.tsx";
import { LoadingOutlined } from '@ant-design/icons'
function Index() {
    const { headHeight, botHeight, clear }: any = useContext(CountContext)
    const swiperRef: any = useRef()
    const topRef: any = useRef()
    const [hei, setHei] = useState('')
    const [page, setPage] = useState(1)
    const [tableData, setData] = useState([])
    const [select, setSelect] = useState('one')
    const [bol, setBol] = useState(false)
    const [status, setStatus] = useState(false)
    const [iconLoad, setIconLoad] = useState(false)
    useEffect(() => {
        if (swiperRef && swiperRef.current && botHeight && headHeight) {
            const h = swiperRef.current.scrollHeight
            const t = topRef.current.scrollHeight
            const w = window.innerHeight
            const remain = w - h - t - headHeight - 12 - botHeight
            setHei(remain.toString())
        }
    }, [headHeight, botHeight]);
    const selectTweet = (name: string) => {
        if (select !== name) {
            setSelect(name)
        }
    }
    const getTweet = async (page: number) => {
        const res: any = await request('post', '/api/v1/post/public', { page: page }, '')
        if (res === 'please') {
            clear()
        } else if (res && res?.status === 200) {
            const { data } = res
            const r = data && data?.posts?.length > 0 ? data.posts : []
            if (page !== 1) {
                if (r.length !== 10) {
                    setStatus(true)
                }
                const a = tableData.concat(r)
                setData(a)
                setIconLoad(false)
            } else {
                setData(r)
            }
            setBol(true)
        }
    }

    useEffect(() => {
        getTweet(1)
    }, []);
    const changePage = () => {
        if (!status) {
            getTweet(page + 1)
            setPage(page + 1)
            setIconLoad(true)
        }
    }

    return (
        <div className={'rightBox'}>
            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                modules={[EffectFade, Autoplay, Pagination, A11y]}
                pagination={{
                    "clickable": true
                }}
                loop
                autoplay={{ delay: 2000, disableOnInteraction: false }}>
                {
                    ['/swiper.svg', '/swiper.svg', '/swiper.svg', '/swiper.svg',].map((i, ind) => {
                        return <SwiperSlide key={ind}><img src={i} onClick={() => {
                            if (ind === 0) {
                                window.open('https://info.dexpert.io/pointsDetail')
                            }
                        }} style={{ width: '100%', borderRadius: "20px", cursor: "pointer" }}
                            alt="" /></SwiperSlide>
                    })
                }
            </Swiper>
            <div className={'rightBoxTweet'}>
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
                {
                    bol ? tableData.length > 0 ?
                        <div id={'scrollableDiv'} style={{ overflowY: 'auto', height: hei + "px" }}
                            className={'rightTweetBox'}>
                            <InfiniteScroll
                                hasMore={true}
                                next={changePage}
                                scrollableTarget="scrollableDiv"
                                loader={null}
                                dataLength={tableData.length}>
                                {tableData.map((post: any, index: number) => {
                                    return <Tweets key={index} name={post} />
                                })}
                            </InfiniteScroll>
                            {
                                iconLoad && <p style={{ textAlign: 'center', color: 'white', fontSize: '16px' }}><LoadingOutlined /> </p>
                            }
                        </div> :
                        <p style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>No data</p> : <Skeleton
                        avatar active
                        paragraph={{ rows: 4 }}
                    />
                }


            </div>
            {/*<div className={styles.homeRightTop}>*/}
            {/*    <p className={`${styles.homeRightTopName} ${changeAllTheme('darknessFont', 'brightFont')}`}>{home.social}</p>*/}
            {/*    <p onClick={pushSocial}*/}
            {/*       style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>{home.more}></p>*/}
            {/*</div>*/}
            {/*{*/}
            {/*    socialLoad ? <Skeleton*/}
            {/*        avatar active*/}
            {/*        paragraph={{rows: 4}}*/}
            {/*    /> : postsData?.length > 0 ? <InfiniteScroll*/}
            {/*        hasMore={true}*/}
            {/*        next={changePage}*/}
            {/*        scrollableTarget="scrollableDiv"*/}
            {/*        endMessage={*/}
            {/*            <p style={{textAlign: 'center'}}>*/}
            {/*                <b>Yay! You have seen it all</b>*/}
            {/*            </p>*/}
            {/*        }*/}
            {/*        loader={null}*/}
            {/*        dataLength={postsData.length}>*/}
            {/*        {postsData && postsData?.length > 0 ? postsData.map((post, index) => {*/}
            {/*            return <PostCard*/}
            {/*                change={change}*/}
            {/*                liked={false}*/}
            {/*                key={index}*/}
            {/*                post={post}*/}
            {/*                user={userPa}*/}
            {/*            />*/}
            {/*        }) : ''}*/}
            {/*    </InfiniteScroll> : <div style={{textAlign: 'center', fontSize: '20px'}}*/}
            {/*                             className={changeAllTheme('darknessFont', 'brightFont')}>{home.noData}</div>*/}
            {/*}*/}
        </div>
    );
}

export default Index;