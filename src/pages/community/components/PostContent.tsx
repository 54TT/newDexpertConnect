// import {request} from "../../../../utils/axios";
import {useState} from "react";
// import InfiniteScroll from 'react-infinite-scroll-component';
// import {Skeleton} from 'antd';
// import {LoadingOutlined} from '@ant-design/icons';
/* import { PostImteDataType } from './PostItem'; */
/* import Tweets from '../../../components/tweets' */
import TWeetHome from '../../../components/tweetHome.js'
import SendPost from "./SendPost";
import classNames from "classnames";
// import { useNavigate, useParams } from "react-router-dom";
// import { CountContext } from '../../../Layout.jsx'
// import Cookies from "js-cookie";
interface TabType {
    label: 'For you' | 'Following',
    key: '1' | '2',
}

function CommunityContent({name}: any) {
    // const [postData, setPostData] = useState([]);
    // const [bol, setBol] = useState(false);
    // const [iconLoad, setIconLoad] = useState(false);
    // const [status, setStatus] = useState(false);
    // const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<TabType['key']>('1');
    const [status, setStatus] = useState<any>(false);
    // const getTweet = async (page: number) => {
    //     const res: any = await request('post', '/api/v1/post/public', {page: page}, '')
    //     if (res && res?.status === 200) {
    //         const {data} = res
    //         const r = data && data?.posts?.length > 0 ? data.posts : []
    //         if (page !== 1) {
    //             if (r.length !== 10) {
    //                 setStatus(true)
    //             }
    //             const a = postData.concat(r)
    //             setPostData(a)
    //             console.log(a);
    //
    //             setIconLoad(false)
    //         } else {
    //             console.log(r);
    //
    //             setPostData(r)
    //         }
    //         setBol(true)
    //     }
    // }
    // const reload = () => {
    //   getTweet(1)
    // }
    //
    // useEffect(() => {
    //   getTweet(1);
    //   document.addEventListener('publish-post', reload);
    //   return () => {
    //     document.removeEventListener('publish-post', reload);
    //   }
    // }, [])
    // const changePage = () => {
    //     if (!status) {
    //         getTweet(page + 1)
    //         setPage(page + 1)
    //         setIconLoad(true)
    //     }
    // }

    const postTab: TabType[] = [{
        label: 'For you',
        key: '1'
    },
        {
            label: 'Following',
            key: '2'
        }];
    const changeRefresh = (name: boolean) => {
        setStatus(name)
    }
    return (
        <div className="community-content">
            {
                name === 'dappCenter' ? '' : <div className="community-content-post-tab">
                    {
                        postTab.map((tab: TabType) => <div
                            className={classNames("community-content-post-tab-item", {"post-tab-item-active": activeTab === tab.key})}
                            onClick={() => setActiveTab(tab.key)}><span>{tab.label}</span></div>)
                    }
                </div>
            }

            <div id='scrollableDiv' className="community-content-post"
                 style={{overflowY: 'auto', height: "calc(100vh - 129px)"}}>
                <SendPost changeRefresh={changeRefresh}/>
                {/*onPublish={() => {getTweet(1);}}*/}
                {/* {
          bol ? postData.length > 0 ?
            <div
              className={'rightTweetBox'}>
              <InfiniteScroll
                style={{
                  height: '100%',
                  overflow: "unset"
                }}
                hasMore={true}
                next={changePage}
                scrollableTarget="scrollableDiv"
                loader={null}
                dataLength={postData.length}>
                {postData.map((data: any, index: number) => {
                  return <Tweets user={user} type={'community'} key={index} name={data} onClick={() => {
                    localStorage.setItem('twetts', JSON.stringify(data));

                    history('/community/detail')
                  }} />
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
        } */}
                <TWeetHome refresh={status} changeRefresh={changeRefresh}/>
            </div>
        </div>
    )
}

export default CommunityContent;