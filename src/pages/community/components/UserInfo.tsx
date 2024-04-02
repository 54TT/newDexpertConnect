

import classnames from 'classnames';
import './index.less'
import { Button } from 'antd';
import { useContext, useState } from 'react';
import PostSendModal from './PostModal';
import { CountContext } from '../../../Layout';
import { FloatButton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
export type UserActionKey = 'Profile' | 'Lastest' | 'Following';
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
  const { browser } = useContext(CountContext) as any;
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

  const onPublish = async () => {
    try {
      const event = new CustomEvent("publish-post");
      document.dispatchEvent(event);
    } catch (e) {
      console.error(e);
    }
    setVisible(false)
  }
  return <div className='community-user-action'>
    {
      browser && Object.keys(userAction).map((key: string, ind: number) =>
        <div key={ind} className={classnames('community-user-action-item', { 'community-user-action-item-active': activeTab === userAction[key as UserActionKey].key })} onClick={() => onChange(userAction[key as UserActionKey].key)}>
          <div >
            <div className='community-user-action-item-img'>
              <img src={userAction[key as UserActionKey].img} alt="" />
            </div>
            <span className='community-user-action-item-label'>{key}</span>
          </div>
        </div>
      )
    }
    {browser ? <div style={{ display: 'flex', justifyContent: 'center' }} className='community-user-action-button'>
      <Button onClick={() => setVisible(true)} >Post</Button>
    </div> : <FloatButton className='community-user-action-floatButton' icon={<PlusOutlined />} onClick={() => setVisible(true)}></FloatButton>
    }
    <PostSendModal open={visible} onPublish={onPublish} onClose={() => setVisible(false)} />
  </div >
}

export default UserInfo;