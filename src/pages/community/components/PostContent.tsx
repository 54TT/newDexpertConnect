import {useEffect, useState} from "react";
import SendPost from '../components/SendPost.tsx'
import TWeetHome from '@/components/Tweets/index.tsx'

/* import classNames from "classnames"; */
export interface TabType {
    label: 'For you' | 'Following',
    key: '1' | '2',
}

/* interface CommunityContentTypeProps {
  name?: string
} */

function CommunityContent() {
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
            <div id="community-content-scroll" className="community-content-post"
                 style={{
                     overflowY: 'auto',
                     height: "calc(91vh)"
                 }}>
                <SendPost changeRefresh={changeRefresh}/>
                <TWeetHome scrollId='community-content-scroll' hei={'auto'} changeHei={() => {
                }} refresh={status} changeRefresh={changeRefresh} style={{overflowY: 'none'}}/>
            </div>
        </div>
    )
}

export default CommunityContent;