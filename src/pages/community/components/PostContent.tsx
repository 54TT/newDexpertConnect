import { useEffect, useState } from "react";
import { handlePublish } from "../../../../utils/axios";
/* import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'; */
/* import { PostImteDataType } from './PostItem'; */
/* import Tweets from '../../../components/tweets' */
import TWeetHome from '../../../components/tweetHome.js'
import SendPost from "./SendPost";
import classNames from "classnames";
interface TabType {
  label: 'For you' | 'Following',
  key: '1' | '2',
}

function CommunityContent() {
  const [activeTab, setActiveTab] = useState<TabType['key']>('1');
  const [refreshKey, setRefreshKey] = useState('1');

  const reload = () => {
    // 通过更改key触发diff, hack行为。
    setRefreshKey(new Date().toTimeString())
  }

  useEffect(() => {
    document.addEventListener('publish-post', reload);
    return () => {
      document.removeEventListener('publish-post', reload);
    }
  }, [])


  const postTab: TabType[] = [{
    label: 'For you',
    key: '1'
  },
  {
    label: 'Following',
    key: '2'
  }];

  const onPublish = async (data) => {
    try {
      const result = await handlePublish(data);
      if (result === 200) {
        const event = new CustomEvent("publish-post");
        document.dispatchEvent(event);
        return result
      }
    } catch (e) {
      console.error(e);
      return Promise.reject('e');

    }
  }

  return (
    <div className="community-content">
      <div className="community-content-post-tab">
        {
          postTab.map((tab: TabType) => <div className={classNames("community-content-post-tab-item", { "post-tab-item-active": activeTab === tab.key })} onClick={() => setActiveTab(tab.key)}><span>{tab.label}</span></div>)
        }
      </div>
      <div id='scrollableDiv' className="community-content-post" style={{ overflowY: 'auto', height: "calc(100vh - 129px)" }}>
        <SendPost onPublish={(data) => onPublish(data)} />
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
        <TWeetHome key={refreshKey} />
      </div>
    </div>
  )
}

export default CommunityContent;