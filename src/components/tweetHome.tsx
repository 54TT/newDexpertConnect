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
                       refresh,
                       changeRefresh,
                       scrollId = 'scrollableDiv',
                       style = {},
                       uid = ''
                   }: TweetHomePropsType) {
    const { browser,isLogin, setIsLogin}: any = useContext(CountContext)
    const {getAll,} = Request()
    const [tableData, setData] = useState([])
    const [bol, setBol] = useState(false)
    const [status, setStatus] = useState(false)
    const [iconLoad, setIconLoad] = useState(false)
    const [page, setPage] = useState(1)
    const changePage = () => {
        if (!status) {
            getTweet(page + 1)
            setPage(page + 1)
            setIconLoad(true)
        }
    }
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
           setIsLogin(false)
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
        if(isLogin){
            setBol(false)
            getTweet(1)
        }
    }, [isLogin]);
    useEffect(() => {
        if (refresh) {
            setBol(false)
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
                                    return <Tweets key={index}  name={post}/>
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