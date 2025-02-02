import classnames from 'classnames';
import './index.less';
import { Button, FloatButton } from 'antd';
import { useContext, useState } from 'react';
import PostSendModal from './PostModal';
import { CountContext } from '@/Layout';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export type UserActionKey = 'Profile' | 'Lastest' | 'Following';

enum UserActionKeyEnum {
  PROFILE = 'Profile', // 个人资料
  LASTEST = 'Lastest', // 最新
  FOLLOWING = 'Following', // 我关注的
}

interface UserActionType {
  img: string;
  label: string;
  key: string;
}

interface UserInfoPropsType {
  activeTab: string;
  onChange: (tab: string) => void;
}

const UserInfo = ({ activeTab, onChange }: UserInfoPropsType) => {
  const { browser } = useContext(CountContext) as any;
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const userAction: Record<UserActionKey, UserActionType> = {
    [UserActionKeyEnum.LASTEST]: {
      img: activeTab === 'lastest' ? '/lastMore.png' : '/lastAc.png',
      label: t('Community.Lastest'),
      key: 'lastest',
    },
    [UserActionKeyEnum.PROFILE]: {
      img: activeTab === 'profile' ? '/pro.png  ' : '/proAc.png',
      label: t('Community.Profile'),
      key: 'profile',
    },
    [UserActionKeyEnum.FOLLOWING]: {
      img: activeTab === 'following' ? '/flo.png ' : '/folAc.png',
      label: t('Community.Following'),
      key: 'following',
    },
  };
  const onPublish = async () => {
    try {
      const event = new CustomEvent('publish-post');
      document.dispatchEvent(event);
    } catch (e: any) {
      return null;
    }
    setVisible(false);
  };
  return (
    <div className="community-user-action">
      {browser &&
        Object.keys(userAction).map((key: string, ind: number) => (
          <div
            key={ind}
            className={classnames('community-user-action-item', {
              'community-user-action-item-active':
                activeTab === userAction[key as UserActionKey].key,
            })}
            onClick={() => onChange(userAction[key as UserActionKey].key)}
          >
            <div>
              <img
                loading={'lazy'}
                src={userAction[key as UserActionKey].img}
                alt=""
              />
              <span className="community-user-action-item-label">
                {userAction[key as UserActionKey].label}
              </span>
            </div>
          </div>
        ))}
      {browser ? (
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className="community-user-action-button"
        >
          <Button onClick={() => setVisible(true)}>
            {t('Community.Post')}
          </Button>
        </div>
      ) : (
        <FloatButton
          className="community-user-action-floatButton"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
        ></FloatButton>
      )}
      <PostSendModal
        open={visible}
        onPublish={onPublish}
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export default UserInfo;
