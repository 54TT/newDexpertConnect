

import classnames from 'classnames';
import './index.less'
import { Button } from 'antd';
import { useState } from 'react';
import PostSendModal from './PostModal';
export type UserActionKey = 'Profile' | 'Lastest' | 'Following'

enum UserActionKeyEnum {
  PROFILE = 'Profile',  // 个人资料
  LASTEST = 'Lastest',  // 最新
  FOLLOWING = 'Following' // 我关注的
}

interface UserActionType {
  img: string;
  key: string;
}

interface UserInfoPropsType {
  activeTab: string,
  onChange: (tab: string) => void;
}

const UserInfo = ({ activeTab, onChange }: UserInfoPropsType) => {
  const [visible, setVisible] = useState(false);
  const userAction: Record<UserActionKey, UserActionType> = {
    [UserActionKeyEnum.LASTEST]: {
      img: "/community/latest.svg",
      key: 'lastest'
    },
    [UserActionKeyEnum.PROFILE]: {
      img: "/community/profile.svg",
      key: 'profile'
    },
    [UserActionKeyEnum.FOLLOWING]: {
      img: "/community/follow.svg",
      key: 'following'
    }
  }
  return <div className='community-user-action'>
    {
      Object.keys(userAction).map((key: string) =>
        <div className={classnames('community-user-action-item', { 'community-user-action-item-active': activeTab === userAction[key as UserActionKey].key })} onClick={() => onChange(userAction[key as UserActionKey].key)}>
          <div >
            <div className='community-user-action-item-img'>
              <img src={userAction[key as UserActionKey].img} alt="" />
            </div>
            <span className='community-user-action-item-label'>{key}</span>
          </div>
        </div>
      )
    }
    <div style={{ display: 'flex', justifyContent: 'center' }} className='community-user-action-button'>
      <Button onClick={() => setVisible(true)} >Post</Button>
    </div>
    <PostSendModal open={visible} onPublish={() => console.log('123123')} onClose={() => setVisible(false)} />
  </div>
}

export default UserInfo;