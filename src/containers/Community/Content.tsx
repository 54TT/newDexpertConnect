import { useEffect, useState } from "react";
import { request } from "../../../utils/axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
/* import { PostImteDataType } from './PostItem'; */
import Tweets from '../../components/tweets'


function CommunityContent() {
  const [postData, setPostData] = useState([]);
  const [bol, setBol] = useState(false);
  const [iconLoad, setIconLoad] = useState(false);
  const [status, setStatus] = useState(false);
  const [page, setPage] = useState(1);

  const getTweet = async (page: number) => {
    const res: any = await request('post', '/api/v1/post/public', { page: page }, '')
    if (res && res?.status === 200) {
      const { data } = res
      const r = data && data?.posts?.length > 0 ? data.posts : []
      if (page !== 1) {
        if (r.length !== 10) {
          setStatus(true)
        }
        const a = postData.concat(r)
        setPostData(a)
        console.log(a);

        setIconLoad(false)
      } else {
        console.log(r);

        setPostData(r)
      }
      setBol(true)
    }
  }

  useEffect(() => {
    getTweet(1);
  }, [])

  const changePage = () => {
    if (!status) {
      getTweet(page + 1)
      setPage(page + 1)
      setIconLoad(true)
    }
  }

  return (
    <div className="community-content">
      <div id='scrollableDiv' className="community-content-post" style={{ overflowY: 'auto', height: "92vh" }}>
        <div className="community-content-post-send">

        </div>
        {
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
                  return <Tweets type={'community'} key={index} name={data} />
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
    </div>
  )
}

export default CommunityContent;