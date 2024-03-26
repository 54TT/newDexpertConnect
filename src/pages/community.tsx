import { useState } from 'react';
import UserInfo, { UserActionKey } from '../containers/Community/UserInfo'
import "../style/community.less"
function Community() {
  // 左侧选中的Tab
  const [activeUserTab, setActiveUserTab] = useState<UserActionKey>("Profile");

  const onActiveUserTabChange = (tab: UserActionKey) => {
    setActiveUserTab(tab);
  }


  return (
    <div className='community-page' >
      <div className='community-page-left'>
        <UserInfo activeTab={activeUserTab} onChange={onActiveUserTabChange} />
      </div>
      <div className='community-page-content'></div>
      <div className='community-page-right'></div>
    </div>
  )
}
export default Community;