import {useContext, useEffect, useState} from 'react';
import UserInfo from './components/UserInfo'
import "./index.less"
import PostContent from './components/PostContent';
import CommunityRight from './components/RightSider';
import {useNavigate, useParams} from 'react-router-dom';
import PostDetail from './components/PostDetail';
import Profile from "./components/Profile.tsx";
import ContactList from './components/ContactList.tsx';
import {CountContext} from '../../Layout.tsx';
import {message} from 'antd';
import {getTkAndUserName} from '../../components/axios.tsx';
type ActiveTabType = 'lastest' | 'profile' | 'following' | 'detail' | 'comment' | 'user'
function Community() {
    // 左侧选中的Tab
    const [activeUserTab, setActiveUserTab] = useState<string>("lastest");
    const {browser} = useContext(CountContext) as any;
    const history = useNavigate();
    const onActiveUserTabChange = (tab: string) => {
        const [token, username] = getTkAndUserName()
        if (!token || !username) return message.warning('please connect your wallet')
        setActiveUserTab(tab as ActiveTabType);
        history(`/community/${tab}`);
    }
    const {tab} = useParams()
    useEffect(() => {
        setActiveUserTab(tab || 'Lastest')
        if (tab !== 'Comment') {
            localStorage.removeItem('reply-detail')
        }

    }, [tab])

    const ComponentMap = {
        'lastest': <PostContent/>,
        'profile': <Profile/>,
        'following': <ContactList/>,
        'detail': <PostDetail/>,
        'comment': <PostDetail/>,
        'user': <Profile/>,
    }
    return (
        <div className='community-page'>
            {
                <div className='community-page-left' style={{width: !browser ? '0px' : '18%'}}>
                    <UserInfo activeTab={activeUserTab} onChange={onActiveUserTabChange}/>
                </div>
            }
            <div className='community-page-content'>
                {ComponentMap[activeUserTab as ActiveTabType]}
            </div>
            {
                browser && <div className='community-page-right'>
                    <CommunityRight/>
                </div>
            }
        </div>

    )
}

export default Community;