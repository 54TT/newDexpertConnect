import InfiniteScroll from "react-infinite-scroll-component";
import Tweets from "./tweets.tsx";
import { useContext, useEffect, useState } from "react";
import Request from "./axios.tsx";
import cookie from "js-cookie";
import Loading from './allLoad/loading.tsx'
import Load from './allLoad/load.tsx'
import { CountContext } from "../Layout.tsx";
import { unionBy } from 'lodash'
import Nodata from '../components/Nodata.tsx'

interface TweetHomePropsType {
    uid?: string

    [key: string]: any
}

function TweetHome({
    hei,
    refresh,
    changeRefresh,
    scrollId = 'scrollableDiv',
    style = {},
    uid = ''
}: TweetHomePropsType) {
    const { browser, user, }: any = useContext(CountContext)
    const { getAll, } = Request()
    const [tableData, setData] = useState([])
    const [bol, setBol] = useState(false)
    const [status, setStatus] = useState(false)
    const [iconLoad, setIconLoad] = useState(false)
    const [page, setPage] = useState(1)
    const [del, setDel] = useState('')
    useEffect(() => {
        if (del && Number(del)) {
            const abc = tableData.filter((res: any) => res?.postId !== del)
            setData([...abc])
        }
    }, [del]);

    const changePage = () => {
        if (!status) {
            getTweet(page + 1)
            setPage(page + 1)
            setIconLoad(true)
        }
    }
    const tweetPar = (res: any, page: number) => {
        if (res && res?.status === 200) {
            const { data } = res
            const r: any = data && data?.posts?.length > 0 ? data.posts : []
            if (page !== 1) {
                setIconLoad(false)
                if (r.length !== 10) {
                    setStatus(true)
                }
                const a = tableData.concat(r)
                setData(a)
            } else {
                if (r.length !== 10) {
                    setStatus(true)
                }
                if (refresh) {
                    changeRefresh?.(false)
                    const abc = r.concat(tableData)
                    const at = unionBy(abc, 'postId')
                    // @ts-ignore
                    setData([...at])
                } else {
                    setData(r)
                }
            }
            setBol(true)
        }
    }
    const getTweet = async (page: number) => {
        const token = cookie.get('token')
        let url = '/api/v1/post/public'
        let data: any = { page }
        if (uid) {
            url = '/api/v1/post/list'
            data = {
                uid,
                page
            }
        }
        const at = await getAll({ method: 'post', url, data, token: token ? token : '' })
        tweetPar(at, page)
    }
    useEffect(() => {
        getTweet(1)
    }, [user]);
    useEffect(() => {
        if (refresh) {
            getTweet(1)
        }
    }, [refresh]);
    useEffect(() => {
        getTweet(1)
    }, []);
    return (
        <>
            {
                bol ? tableData.length > 0 ?
                    <div id={'scrollableDiv'} style={{ overflow: 'hidden auto', height: hei, ...style }}
                        className={`${browser ? 'rightTweetBox' : 'mobile'} scrollStyle`}>
                        <InfiniteScroll
                            hasMore={true}
                            next={changePage}
                            scrollableTarget={scrollId}
                            loader={null}
                            dataLength={tableData.length}>
                            {tableData.map((post: any) => {
                                return <Tweets
                                    key={post?.postId + (Math.floor(Math.random() * (Math.floor(100) - Math.ceil(1))) + Math.ceil(1))}
                                    name={post} setDel={setDel} />
                            })}
                        </InfiniteScroll>
                        {
                            iconLoad &&
                            <div style={{ textAlign: 'center', color: 'white', fontSize: '16px' }}><Load />
                            </div>
                        }
                    </div> :
                    <Nodata /> :
                    <Loading status={'20'} browser={browser} />
            }
        </>
    );
}

export default TweetHome;