import { useState } from 'react';
import UserInfo, { UserActionKey } from './components/UserInfo'
import "./index.less"
import CommunityContent from './components/Content';
import CommunityRight from './components/RightSider';
function Community() {
  // 左侧选中的Tab
  const [activeUserTab, setActiveUserTab] = useState<UserActionKey>("Profile");

  const onActiveUserTabChange = (tab: UserActionKey) => {
    setActiveUserTab(tab);
  }


  return (
    <div style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
      <div className='community-page' >
        <div className='community-page-left'>
          <UserInfo activeTab={activeUserTab} onChange={onActiveUserTabChange} />
        </div>
        <div className='community-page-content'>
          <CommunityContent />
        </div>
        <div className='community-page-right'>
          <CommunityRight />
        </div>
      </div>
    </div>
  )
}
export default Community;