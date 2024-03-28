import InfiniteScroll from "react-infinite-scroll-component";
import Tweets from "./tweets.tsx";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import {useEffect, useState} from "react";
import {request} from "../../utils/axios.ts";

function TweetHome({hei, changeHei}: any) {
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
    useEffect(() => {
        if (page === 3) {
            changeHei(true)
        }
    }, [page])
    const getTweet = async (page: number) => {
        const res: any = await request('post', '/api/v1/post/public', {page: page}, '')
        if (res && res?.status === 200) {
            const {data} = res
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
    return (
        <>
            {
                bol ? tableData.length > 0 ?
                        <div id={'scrollableDiv'} style={{overflowY: 'auto', height: hei + "px"}}
                             className={`rightTweetBox scrollStyle`}>
                            <InfiniteScroll
                                hasMore={true}
                                next={changePage}
                                scrollableTarget="scrollableDiv"
                                loader={null}
                                dataLength={tableData.length}>
                                {tableData.map((post: any, index: number) => {
                                    return <Tweets key={index} name={post}/>
                                })}
                            </InfiniteScroll>
                            {
                                iconLoad &&
                                <p style={{textAlign: 'center', color: 'white', fontSize: '16px'}}><LoadingOutlined/>
                                </p>
                            }
                        </div> :
                        <p style={{textAlign: 'center', color: 'white', marginTop: '20px'}}>No data</p> :
                    <div className={'disCen'} style={{marginTop: '50%'}}>
                        <Spin size="large"/>
                    </div>
            }
        </>
    );
}

export default TweetHome;