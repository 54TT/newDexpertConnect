import { useEffect, useState } from 'react';
import UserInfo from './components/UserInfo'
import "./index.less"
import PostContent from './components/PostContent';
import CommunityRight from './components/RightSider';
import { useNavigate, useParams } from 'react-router-dom';
function Community() {
  // 左侧选中的Tab
  const [activeUserTab, setActiveUserTab] = useState<string>("lastest");
  const history = useNavigate();
  const onActiveUserTabChange = (tab: string) => {
    setActiveUserTab(tab);
    history(`/community/${tab}`);
  }
  const { tab } = useParams()
  useEffect(() => {
    setActiveUserTab(tab || 'lastest')
  }, [tab])


  return (
    <div style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
      <div className='community-page' >
        <div className='community-page-left'>
          <UserInfo activeTab={activeUserTab} onChange={onActiveUserTabChange} />
        </div>
        <div className='community-page-content'>
          <PostContent />
        </div>
        <div className='community-page-right'>
          <CommunityRight />
        </div>
      </div>
    </div>
  )
}
export default Community;