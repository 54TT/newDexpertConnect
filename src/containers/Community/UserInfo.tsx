

import classnames from 'classnames';
import './index.less'
export type UserActionKey = 'Profile' | 'Lastest' | 'Following'

enum UserActionKeyEnum {
  PROFILE = 'Profile',  // 个人资料
  LASTEST = 'Lastest',  // 最新
  FOLLOWING = 'Following' // 我关注的
}

interface UserActionType {
  img: string;
}

interface UserInfoPropsType {
  activeTab: UserActionKey,
  onChange: (tab: UserActionKey) => void;
}

const UserInfo = ({ activeTab, onChange }: UserInfoPropsType) => {
  const userAction: Record<UserActionKey, UserActionType> = {
    [UserActionKeyEnum.PROFILE]: {
      img: "/community/profile.svg"
    },
    [UserActionKeyEnum.LASTEST]: {
      img: "/community/latest.svg"
    },
    [UserActionKeyEnum.FOLLOWING]: {
      img: "/community/follow.svg"
    }
  }
  return <div className='community-user-action'>
    {
      Object.keys(userAction).map((key: string) =>
        <div className={classnames('community-user-action-item', { 'community-user-action-item-active': activeTab === key })} onClick={() => onChange(key as UserActionKey)}>
          <div className='community-user-action-item-img'>
            <img src={userAction[key as UserActionKey].img} alt="" />
          </div>
          <span className='community-user-action-item-label'>{key}</span>
        </div>
      )
    }
  </div>
}

export default UserInfo;