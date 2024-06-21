import { useContext, useEffect, useState } from 'react';
import UserInfo from './components/UserInfo';
import './index.less';
import PostContent from './components/PostContent';
import CommunityRight from './components/RightSider';
import { useNavigate, useParams } from 'react-router-dom';
import PostDetail from './components/PostDetail';
import Profile from './components/Profile.tsx';
import ContactList from './components/ContactList.tsx';
import { CountContext } from '@/Layout.tsx';
import { MessageAll } from '@/components/message.ts';
import { useTranslation } from 'react-i18next';
import cookie from 'js-cookie';
type ActiveTabType =
  | 'lastest'
  | 'profile'
  | 'following'
  | 'detail'
  | 'comment'
  | 'user';
function Community() {
  const { t } = useTranslation();
  // 左侧选中的Tab
  const [activeUserTab, setActiveUserTab] = useState<string>('lastest');
  //@ts-ignore
  const { browser, user } = useContext(CountContext || {}) as any;
  const history = useNavigate();
  const onActiveUserTabChange = (tab: string) => {
    const token = cookie.get('token');
    if (!token || !user) return MessageAll('warning', t('Market.line'));
    setActiveUserTab(tab as ActiveTabType);
    history(`/community/${tab}`);
  };
  const { tab } = useParams();
  useEffect(() => {
    setActiveUserTab(tab || 'Lastest');
    if (tab !== 'Comment') {
      localStorage.removeItem('reply-detail');
    }
  }, [tab]);

  const ComponentMap = {
    lastest: <PostContent />,
    profile: <Profile />,
    following: <ContactList />,
    detail: <PostDetail />,
    comment: <PostDetail />,
    user: <Profile />,
  };
  return (
    <div className="community-page" style={{width:browser?'90%':'98%'}}>
      {
        <div
          className="community-page-left"
          style={{ display: browser ? 'block' : 'none', }}
        >
          <UserInfo
            activeTab={activeUserTab}
            onChange={onActiveUserTabChange}
          />
        </div>
      }
      <div
        className="community-page-content" 
        style={{ width: browser ? '56%' : '100%' ,borderRadius:browser?" 0 10px 0 0":'15px'}}
      >
        {ComponentMap[activeUserTab as ActiveTabType]}
      </div>
      {browser && (
        <div className="community-page-right">
          <CommunityRight />
        </div>
      )}
    </div>
  );
}

export default Community;
