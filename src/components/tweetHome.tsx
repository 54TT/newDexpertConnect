import InfiniteScroll from "react-infinite-scroll-component";
import Tweets from "./tweets.tsx";
import {LoadingOutlined} from "@ant-design/icons";
import {useContext, useEffect, useState} from "react";
import Request from "./axios.tsx";
import cookie from "js-cookie";
import Loading from '../components/loading.tsx'
import {CountContext} from "../Layout.tsx";

interface TweetHomePropsType {
    uid?: string
    [key: string]: any
}

function TweetHome({
                       hei,
                       changeHei,
                       refresh,
                       changeRefresh,
                       scrollId = 'scrollableDiv',
                       style = {},
                       uid = ''
                   }: TweetHomePropsType) {
    const { browser}: any = useContext(CountContext)
    const {getAll,} = Request()
    const [tableData, setData] = useState([])
    const [bol, setBol] = useState(false)
    const [status, setStatus] = useState(false)
    const [iconLoad, setIconLoad] = useState(false)
    const [page, setPage] = useState(1)
    const [isLogin, setIsLogin] = useState(false)
    const changePage = () => {
        if (!status) {
            getTweet(page + 1)
            setPage(page + 1)
            setIconLoad(true)
        }
    }
    useEffect(() => {
        if (page === 3) {
            if (changeHei) {
                changeHei(true)
            }
        }
    }, [page])

    const tweetPar = (res: any) => {
       if (res && res?.status === 200) {
            const {data} = res
            const r: any = data && data?.posts?.length > 0 ? data.posts : []
            if (page !== 1) {
                if (r.length !== 10) {
                    setStatus(true)
                }
                const a = tableData.concat(r)
                setData(a)
                setIconLoad(false)
            } else {
                if (r.length !== 10) {
                    setStatus(true)
                }
                if (refresh) {
                    changeRefresh?.(false)
                }
                // @ts-ignore
                setData([...r])
            }
            setBol(true)
        }
    }
    const getTweet = async (page: number) => {
        const token = cookie.get('token')
        let url = '/api/v1/post/public'
        let data: any = {page}
        if (uid) {
            url = '/api/v1/post/list'
            data = {
                uid,
                page
            }
        }
        const at = await getAll({method: 'post', url, data, token: token ? token : ''})
        tweetPar(at)
    }
    useEffect(() => {
        const abc = cookie.get('token')
        if (abc) {
            setIsLogin(true)
        }
        setBol(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookie.get('token')]);
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
                refresh ? <Loading/> : bol ? tableData.length > 0 ?
                        <div id={'scrollableDiv'} style={{overflowY: 'auto', height: hei, ...style}}
                             className={`${browser ? 'rightTweetBox' : 'mobile'} scrollStyle`}>
                            <InfiniteScroll
                                hasMore={true}
                                next={changePage}
                                scrollableTarget={scrollId}
                                loader={null}
                                dataLength={tableData.length}>
                                {tableData.map((post: any, index: number) => {
                                    return <Tweets key={index} isLogin={isLogin} name={post}/>
                                })}
                            </InfiniteScroll>
                            {
                                iconLoad &&
                                <p style={{textAlign: 'center', color: 'white', fontSize: '16px'}}><LoadingOutlined/>
                                </p>
                            }
                        </div> :
                        <p style={{textAlign: 'center', color: 'white', marginTop: '20px'}}>No data</p> :
                    <Loading/>
            }
        </>
    );
}

export default TweetHome;