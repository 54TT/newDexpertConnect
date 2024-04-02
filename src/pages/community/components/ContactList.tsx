import classNames from "classnames";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { followUser, request, unfollowUser } from "../../../../utils/axios";
import { formatAddress } from "../../../../utils/utils";
import { Spin } from "antd";
import { useNavigate } from "react-router";


export interface FollowTabType {
  label: 'Following' | 'Follower',
  key: '1' | '2',
}

export interface PostImteDataType {
  user?: {
    address: string
    avatar: string;
    uid: string;
    username: string;
  }
  CreatedAt: string;
  commentNum: string;
  content: string;
  imageList: string[];
  likeNum: string;
  likeStatus: boolean;
  postId: string;
}

interface PostImtePropsType {
  data: any
  tab: string;
}

function UserItem({
  data,
  tab
}: PostImtePropsType) {
  const { uid,
    avatar,
    username,

  } = data

  const [follow, setFollow] = useState(true);
  const history = useNavigate();

  return <div className="post-item follow-list" style={{ maxHeight: '300px' }} onClick={() => history(`/community/user?uid=${uid}`)}>
    <div className="post-item-avatar">
      <img src={avatar || '/logo.svg'} alt="" />
    </div>
    <div className="post-item-info">
      <div className="post-item-info-user">
        <span className="post-item-info-user-nickName">{formatAddress(username)}</span>
        <span className="post-item-info-user-icon">

        </span>
        {/*         <span className="post-item-info-user-date">{CreatedAt}</span> */}
      </div>
      {/*   <div className="post-item-info-content">
        <span>{content}</span>
        <div>
          {imageList.map((src: string) => <img style={{ height: '100%' }} src={src} />)}
        </div>
      </div> */}
      {/*     <div className="post-item-info-tag">{['#ETH', '#BTC'].map((tag: string) => <span>{tag}</span>)}</div> */}
      {/*       <div className="post-item-info-action">
        <div className="post-item-info-action-comment">
          <img src="/community/comment.svg" alt="" />
          <span>{commentNum}</span>
        </div>
        <div className="post-item-info-action-like">
          <img src="/community/like.svg" alt="" />
          <span>{likeNum}</span>
        </div>
        <div className="post-item-info-action-share">
          <img src="/community/share.svg" alt="" />
          <span>42</span>
        </div>
        <div className="post-item-info-action-watch">
          <img src="/community/watch.svg" alt="" />
          <span>1200k</span>
        </div>
      </div> */}
    </div>
    <div className="follow-list-action">
      {tab === '1' && follow ? <div className="follow-list-action-unfollow follow-icon" onClick={async () => {
        await unfollowUser(uid);
        setFollow(false);
      }}>Unfollow</div> : <div className="follow-list-action-unfollow unfollow-icon" onClick={async () => {
        await followUser(uid);
        setFollow(false);
      }}>Follow</div>}
    </div>
  </div>
}

export default function ContactList() {
  const { uid } = JSON.parse(Cookies.get('username') || '{}')
  const [activeTab, setActiveTab] = useState<FollowTabType['key']>('1');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const postTab: FollowTabType[] = [{
    label: 'Following',
    key: '1'
  },
  {
    label: 'Follower',
    key: '2'
  }];

  useEffect(() => {
    getContactList(1)
  }, [activeTab])


  const getContactList = async (page: number) => {
    const url = activeTab === '1' ? "/api/v1/followee/list" : "/api/v1/follower/list";
    const token = Cookies.get('token');
    setLoading(true)
    const result: any = await request('post', url, { uid, page }, token);
    if (result.status === 200) {
      const { followeeList, followerList
      } = result.data;
      if (page === 1) {
        setData(followeeList || followerList)
      } else {
        setData([...data, ...(followeeList || followerList)])
      }

      setLoading(false);
    }
  }

  return <>
    {
      <div className="community-content-post-tab">
        {
          postTab.map((tab: FollowTabType, ind: number) => <div key={ind}
            className={classNames("community-content-post-tab-item", { "post-tab-item-active": activeTab === tab.key })}
            onClick={() => setActiveTab(tab.key)}><span>{tab.label}</span></div>)
        }
      </div>
    }
    {
      loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', marginTop: '20px' }}><Spin /></div> :
        data.length === 0 ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', marginTop: '20px' }}>Not data</div> : data.map((v) => <UserItem data={v} tab={activeTab} />)
    }
  </>
}