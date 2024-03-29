import {useState} from "react";
import TWeetHome from '../../../components/tweetHome.js'
import SendPost from "./SendPost";
import classNames from "classnames";
interface TabType {
    label: 'For you' | 'Following',
    key: '1' | '2',
}

function CommunityContent({name}: any) {
    const [activeTab, setActiveTab] = useState<TabType['key']>('1');
    const [status, setStatus] = useState<any>(false);
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
                <TWeetHome refresh={status} changeRefresh={changeRefresh}/>
            </div>
        </div>
    )
}

export default CommunityContent;