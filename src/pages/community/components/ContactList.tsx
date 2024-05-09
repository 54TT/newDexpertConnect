import classNames from "classnames";
import {useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import cookie from "js-cookie";
import Request from "../../../components/axios.tsx";
import {formatAddress, getQueryParams} from "../../../../utils/utils";
import {Spin} from "antd";
import {useNavigate} from "react-router";
import {throttle} from "lodash";
import {MessageAll} from "../../../components/message.ts";
import {useTranslation} from "react-i18next";
import {CountContext} from "../../../Layout.tsx";
import {CaretDownOutlined, LoadingOutlined} from '@ant-design/icons'

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
    getAll: any
}

function UserItem({
                      data,
                      tab, getAll
                  }: PostImtePropsType) {
    const {
        uid,
        avatar,
        username,
    } = data
    const {t} = useTranslation();

    const [follow, setFollow] = useState(true);
    const history = useNavigate();

    return <div className="post-item follow-list" style={{maxHeight: '300px'}}
                onClick={throttle(function () {
                    history(`/community/user?uid=${uid}`)
                }, 1500, {'trailing': false})
                }>
        <div className="post-item-avatar">
            <img loading={'lazy'} src={avatar || '/topLogo.png'} style={{display: 'block', cursor: 'pointer'}} alt=""/>
        </div>
        <div className="post-item-info">
            <div className="post-item-info-user">
                <span className="post-item-info-user-nickName">{formatAddress(username)}</span>
                <span className="post-item-info-user-icon">
        </span>
            </div>
        </div>
        <div className="follow-list-action">
            {tab === '1' && follow ? <div className="follow-list-action-unfollow follow-icon" onClick={
                throttle(async function (e) {
                    e.stopPropagation()
                    try {
                        const token = cookie.get('token')
                        if (token) {
                            const result: any = await getAll({
                                method: 'post',
                                url: '/api/v1/unfollow',
                                data: {uid: uid},
                                token
                            });
                            if (result?.status === 200) {
                                setFollow(false);
                            } else {
                                return MessageAll('warning', t('Market.unF'))
                            }
                        }
                    } catch (e) {
                        return Promise.reject(e)
                    }
                }, 1500, {'trailing': false})
            }>Unfollow</div> : <div className="follow-list-action-unfollow unfollow-icon" onClick={
                throttle(async function (e) {
                    e.stopPropagation()
                    try {
                        const token = cookie.get('token')
                        if (token) {
                            const result: any = await getAll({
                                method: 'post',
                                url: '/api/v1/follow',
                                data: {userId: uid},
                                token
                            });
                            if (result?.status === 200) {
                                setFollow(true);
                            } else {
                                return MessageAll('error', t('Market.unFo'))
                            }
                        }

                    } catch (e) {
                        return Promise.reject(e)
                    }
                }, 1500, {'trailing': false})
            }>Follow</div>}
        </div>
    </div>
}

export default function ContactList() {
    const {getAll} = Request()
    const {t} = useTranslation();
    const {user,} = useContext(CountContext) as any;
    const [activeTab, setActiveTab] = useState<FollowTabType['key']>('1');
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [isNext, setIsNext] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const postTab: FollowTabType[] = [{
        label: t('Dpass.Following'),
        key: '1'
    },
        {
            label: t('Dpass.Follower'),
            key: '2'
        }];
    const {uid} = getQueryParams();
    useEffect(() => {
        getContactList(1)
    }, [activeTab])
    const getContactList = async (page: number) => {
        const url = activeTab === '1' ? "/api/v1/followee/list" : "/api/v1/follower/list";
        const token = Cookies.get('token');
        if (token && user) {
            const result: any = await getAll({method: 'post', url, data: {uid: uid ? uid : user?.uid, page}, token});
            if (result?.status === 200) {
                const {
                    followeeList, followerList
                } = result?.data;
                if (activeTab === '1') {
                    if (followeeList.length === 10) {
                        setIsShow(true)
                    }
                } else {
                    if (followerList.length === 10) {
                        setIsShow(true)
                    }
                }
                if (page === 1) {
                    if (activeTab === '1') {
                        setData(followeeList)
                    } else {
                        setData(followerList)
                    }
                } else {
                    if (activeTab === '1') {
                        const at = data.concat(followeeList)
                        setData([...at])
                    } else {
                        const at = data.concat(followerList)
                        setData([...at])
                    }
                }
                setLoading(false);
                setIsNext(false)
            }
        }
    }
    return <>
        {
            <div className="community-content-post-tab">
                {
                    postTab.map((tab: FollowTabType, ind: number) => <div key={ind}
                                                                          className={classNames("community-content-post-tab-item", {"post-tab-item-active": activeTab === tab.key})}
                                                                          onClick={() => {
                                                                              setActiveTab(tab.key)
                                                                          }}>
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
                }}>Not data</div> : data.map((v) => <UserItem data={v} getAll={getAll} key={v?.uid} tab={activeTab}/>)
        }
        {
            isShow && <p style={{
                color: 'white',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} onClick={() => {
                getContactList(page + 1)
                setPage(page + 1)
                setIsNext(true)
            }}><span style={{cursor: 'pointer'}}>{t('Common.Next')}</span>
                {
                    isNext ? <LoadingOutlined/> : <CaretDownOutlined/>
                }
            </p>
        }
    </>
}