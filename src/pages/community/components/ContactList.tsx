import classNames from "classnames";
import { useEffect, useState} from "react";
import Cookies from "js-cookie";
import Request from "../../../components/axios.tsx";
// ,{followUser, unfollowUser}
import {formatAddress, getQueryParams} from "../../../../utils/utils";
import {Spin} from "antd";
import {useNavigate} from "react-router";
import {throttle} from "lodash";
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
    const {
        uid,
        avatar,
        username,
    } = data

    const [follow, setFollow] = useState(true);
    const history = useNavigate();

    return <div className="post-item follow-list" style={{maxHeight: '300px'}}
                onClick={throttle(  function (){  history(`/community/user?uid=${uid}`)  }, 1500, {'trailing': false})
    }>
        <div className="post-item-avatar">
            <img loading={'lazy'} src={avatar || '/logo.svg'} style={{display:'block',cursor:'pointer'}} alt=""/>
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
            {tab === '1' && follow ? <div className="follow-list-action-unfollow follow-icon" onClick={
                throttle(  async function (e){
                    e.stopPropagation()
                    // await unfollowUser(uid);
                    setFollow(false);
                }, 1500, {'trailing': false})
            }>Unfollow</div> : <div className="follow-list-action-unfollow unfollow-icon" onClick={
                throttle(  async function (e){
                    e.stopPropagation()
                    // await unfollowUser(uid);
                    setFollow(false);
                }, 1500, {'trailing': false})
            }>Follow</div>}
        </div>
    </div>
}

export default function ContactList() {
    const {getAll} =Request()
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
    const {uid} = getQueryParams();
    useEffect(() => {
        getContactList(1)
    }, [activeTab])
    const getContactList = async (page: number) => {
        const url = activeTab === '1' ? "/api/v1/followee/list" : "/api/v1/follower/list";
        const token = Cookies.get('token');
        const username = Cookies.get('username');
        if (token && username) {
            const at = JSON.parse(username)
            setLoading(true)
            // const result: any = await Request('post', url, {uid: uid ? uid : at?.uid, page}, token);
            const result: any =await  getAll({method:'post',url,data:{uid: uid ? uid : at?.uid, page},token});
            if (result?.status === 200) {
                const {
                    followeeList, followerList
                } = result?.data;
                if (page === 1) {
                    setData(followeeList || followerList)
                } else {
                    setData([...data, ...(followeeList || followerList)])
                }
                setLoading(false);
            }
        }
    }

    return <>
        {
            <div className="community-content-post-tab">
                {
                    postTab.map((tab: FollowTabType, ind: number) => <div key={ind}
                                                                          className={classNames("community-content-post-tab-item", {"post-tab-item-active": activeTab === tab.key})}
                                                                          onClick={() => setActiveTab(tab.key)}>
                        <span>{tab.label}</span></div>)
                }
            </div>
        }
        {
            loading ? <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    marginTop: '20px'
                }}><Spin/></div> :
                data.length === 0 ? <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    marginTop: '20px'
                }}>Not data</div> : data.map((v,ind) => <UserItem data={v} key={ind} tab={activeTab}/>)
        }
    </>
}