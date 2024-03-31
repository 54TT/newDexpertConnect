import { useEffect, useState } from "react";
import SendPost from '../components/SendPost.tsx'
import TWeetHome from '../../../components/tweetHome.js'
/* import classNames from "classnames"; */
/* interface TabType {
  label: 'For you' | 'Following',
  key: '1' | '2',
} */
function CommunityContent({ name }: any) {
  /*   const [activeTab, setActiveTab] = useState<TabType['key']>('1'); */
  const [status, setStatus] = useState<any>(false);

  /*  const postTab: TabType[] = [{
     label: 'For you',
     key: '1'
   },
   {
     label: 'Following',
     key: '2'
   }]; */
  const changeRefresh = (name: boolean) => {
    setStatus(name)
  }


  useEffect(() => {
    document.addEventListener('publish-post', () => changeRefresh(true))
    return () => {
      document.removeEventListener('publish-post', () => changeRefresh(true))
    }
  }, [])
  return (
    <div className="community-content">
      {/* {
        name === 'dappCenter' ? '' : <div className="community-content-post-tab">
          {
            postTab.map((tab: TabType) => <div
              className={classNames("community-content-post-tab-item", { "post-tab-item-active": activeTab === tab.key })}
              onClick={() => setActiveTab(tab.key)}><span>{tab.label}</span></div>)
          }
        </div>
      } */}
      <div id="community-content-scroll" className="community-content-post"
        style={{
          overflowY: 'auto',
          height: "calc(100vh - 79px)"
        }}>
        <SendPost changeRefresh={changeRefresh} />
        <TWeetHome scrollId='community-content-scroll' hei={'auto'} changeHei={() => { }} refresh={status} changeRefresh={changeRefresh} style={{ overflowY: 'none' }} />
      </div>
    </div>
  )
}

export default CommunityContent;