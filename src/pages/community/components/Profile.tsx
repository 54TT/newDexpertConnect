import {useContext, useEffect, useMemo, useRef, useState} from "react";
import Copy from '../../../components/copy.tsx'
import TWeetHome from "../../../components/tweetHome.tsx";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Form, Input,} from 'antd'
import Request  from "../../../components/axios.tsx";
import Cookies from "js-cookie";
import {formatAddress, getQueryParams} from "../../../../utils/utils.ts";
import CommonModal from "../../../components/CommonModal/index.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {throttle} from "lodash";
import {MessageAll} from "../../../components/message.ts";
import {useTranslation} from "react-i18next";
import {CountContext} from "../../../Layout.tsx";
import cookie from "js-cookie";
function Profie() {
    const {getAll} = Request()
    const {t} = useTranslation();
    const history = useNavigate();
    const {user, setUserPar} = useContext(CountContext) as any;
    const topRef = useRef<any>()
    const [status, setStatus] = useState(false)
    const [options, setOptions] = useState('Community')
    const [hei, setHei] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<any>({});
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputType, setInputType] = useState<'avatar' | 'background'>('avatar');
    const [previewAvatar, setPreviewAvatar] = useState('');
    const [previewBG, setPreviewBG] = useState('');
    const [newAvatar, setNewAvatar] = useState();
    const [newBG, setNewBG] = useState();
    const [form] = Form.useForm();
    const {uid} = getQueryParams();
    const loginId = user?.uid || ''
    const {pathname} = useLocation();
    const [isFollowed, setIsFollowed] = useState(false);
    useEffect(() => {
        if (status) {
            setTimeout(() => {
                setStatus(false)
            }, 4000);
        }
    }, [status]);
    useEffect(() => {
        if (topRef && topRef.current) {
            const h = topRef.current.scrollHeight
            const w = window.innerHeight
            const o: any = w - h - 25 - 54
            setHei(o.toString())
        }
    }, []);
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const id = useMemo(() => {
        if (pathname.includes('/community/user')) {
            return uid;
        }
        return loginId
    }, [pathname])


    const getUserProfile = async (setCookise?: boolean) => {
        if (!id) {
            return MessageAll('warning', t('Market.line'))
        }
        const token = Cookies.get('token');
        if (!token) return;
        // const result: any = await Request('get', `/api/v1/userinfo/${id}`, {}, token);
        const result: any = await getAll({method: 'get', url: `/api/v1/userinfo/${id}`, data: '', token});
        if (result?.status === 200) {
            const data = result.data;
            setData(data.data);
            setIsFollowed(data.isFollowed)
            setPreviewAvatar(data.avatarUrl);
            setPreviewBG(data.coverUrl);
            if (setCookise) {
                setUserPar(data.data)
            }
        }

    }

    // 'comment', 'more', 'edit'
    const IMAGE_MAP = [
        {
            key: 'comment',
            show: () => true
        },
        {
            key: 'more',
            show: () => true
        },
        {
            key: 'edit',
            onClick: () => setIsModalOpen(true),
            show: (loginId: string, profileId: string) => {
                const fromUserpath = pathname.includes('/community/user');
                const isCurrentUser = loginId === profileId;
                if (fromUserpath) {
                    return isCurrentUser
                }
                return true
            },
        }
    ]

    useEffect(() => {
        getUserProfile()
    }, [])

    const handleuploadImage = (e: any,) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png']; // 允许的图片类型
        const uploadInput = inputRef?.current
        const fileType = file.type;
        if (!allowedTypes.includes(fileType)) {
            MessageAll('warning', t('Market.only'))
            if (uploadInput?.value) {
                // 清空输入框的值，防止上传无效文件
                uploadInput.value = ""
            }
        } else {
            const previewImg = URL.createObjectURL(file);
            if (inputType === 'avatar') {
                setPreviewAvatar(previewImg)
                setNewAvatar(file)
            } else {
                setPreviewBG(previewImg)
                setNewBG(file);
            }
        }
    }

    const handleSubmit = async (data: any) => {

        const token = Cookies.get('token');
        if (!token || !id) {

            return MessageAll('warning', t('Market.line'))
        }
        let avatarUrl = previewAvatar;
        let coverUrl = previewBG;

        if (newAvatar) {
            // const result: any = await Request('post', '/api/v1/upload/image', newAvatar, token);
            const result: any = await getAll({method: 'post', url: '/api/v1/upload/image', data: newAvatar, token});
            if (result?.status === 200) {
                avatarUrl = result?.data?.url;
            }
        }
        if (newBG) {
            // const result: any = await Request('post', '/api/v1/upload/image', newBG, token);
            const result: any = await getAll({method: 'post', url: '/api/v1/upload/image', data: newBG, token});
            if (result?.status === 200) {
                coverUrl = result?.data?.url;
            }
        }

        const params = {
            user: {
                ...data,
                uid: id,
                ...(avatarUrl ? {avatarUrl} : {}),
                ...(coverUrl ? {coverUrl} : {})
            }
        }
        // const result: any = await Request('post', '/api/v1/userinfo', params, token);
        const result: any = await getAll({method: 'post', url: '/api/v1/userinfo', data: params, token});
        if (result?.status === 200) {
            MessageAll('success', t('Market.update'))
            getUserProfile(true)
            handleCancel();
        }
    }


    const ModifyUserInfoForm = () => {
        useEffect(() => {
            const uploadInput = inputRef.current
            uploadInput?.addEventListener('input', handleuploadImage, false);
            return () => {
                uploadInput?.removeEventListener('input', handleuploadImage, false);
            }
        }, [])


        return <>
            <div className="profile-background">
                <img className="profile-background-cover" loading={'lazy'} src='/community/changeImg.svg'
                     onClick={
                         throttle(function () {
                             setInputType('background')
                             inputRef?.current?.click()
                         }, 1500, {'trailing': false})
                     } alt={''}/>
                <img loading={'lazy'} className="profile-background-img"
                     src={previewBG || data?.coverUrl || "/community/profileBackground.png"} alt=""/>
                <div className="profile-background-info">
                    <div className="profile-background-avatar">
                        <img loading={'lazy'} className="profile-background-avatar-img"
                             src={previewAvatar || data?.avatarUrl || '/logo.svg'} alt=""/>
                        <img loading={'lazy'} className="profile-background-avatar-cover" src='/community/changeImg.svg'
                             alt=""
                             onClick={
                                 throttle(function () {
                                     setInputType('avatar')
                                     inputRef?.current?.click()
                                 }, 1500, {'trailing': false})
                             }/>
                    </div>
                </div>
            </div>
            <div className="user-info-form" style={{padding: '10px 48px'}}>
                <Form form={form} initialValues={data} onFinish={(data: any) => handleSubmit(data)}>
                    <Form.Item name='username' label='Name'>
                        <Input autoComplete={'off'}/>
                    </Form.Item>
                    <Form.Item name='bio' label='Bio'>
                        <Input autoComplete={'off'}/>
                    </Form.Item>
                    <Form.Item name='twitter' label='Twitter'>
                        <Input autoComplete={'off'}/>
                    </Form.Item>
                    <Form.Item name='telegram' label='Telegram'>
                        <Input autoComplete={'off'}/>
                    </Form.Item>
                    <Form.Item name='discord' label='Discord'>
                        <Input autoComplete={'off'}/>
                    </Form.Item>
                </Form>
            </div>
            <div className="" style={{display: 'flex', justifyContent: 'center'}}>
                <Button className="modify-form-submit" onClick={
                    throttle(function () {
                        form.submit()
                    }, 1500, {'trailing': false})}>Submit</Button>
            </div>
        </>
    }

    const handleFollow = throttle(async function () {
        try {
            const token = cookie.get('token')
            if (token) {
                const result: any = await getAll({method: 'post', url: '/api/v1/follow', data: {userId: id}, token});
                if (result?.status === 200) {
                    MessageAll('success', t('Market.succ'))
                    setIsFollowed(true);
                } else {
                    return MessageAll('error', t('Market.unFo'))
                }
            }
        } catch (e) {
            return Promise.reject(e)
        }
    }, 1500, {'trailing': false})

    const handleUnfollow =
        throttle(async function () {
            try {
                const token = cookie.get('token')
                if (token) {
                    const result: any = await getAll({method: 'post', url: '/api/v1/unfollow', data: {uid: id}, token});
                    if (result?.status === 200) {
                        MessageAll('success', t('Market.unSucc'))
                        setIsFollowed(false);
                    } else {
                        return MessageAll('error', t('Market.unF'))
                    }
                }
            } catch (e) {
                return Promise.reject(e)
            }
        }, 1500, {'trailing': false})
    return (
        <div className={'username-page'}>
            <div ref={topRef}>
                <div className={`back`}>
                    <ArrowLeftOutlined onClick={() => {
                        history(-1)
                    }}
                                       style={{
                                           color: 'rgb(214,223,215)',
                                           fontSize: '20px',
                                           marginRight: '10px',
                                           cursor: 'pointer'
                                       }}/>
                    <div>
                        <p><span>{data?.username ? formatAddress(data.username) : ''}</span><img
                            src="/certification.svg" alt="" loading={'lazy'}/></p>
                        <p>{data?.address ? formatAddress(data.address) : ''}</p>
                    </div>
                </div>
                <div className="profile-background">
                    <img src={data?.coverUrl || "/community/profileBackground.png"} alt=""/>
                    <div className="profile-background-info">
                        <div className="profile-background-avatar">
                            <img loading={'lazy'} src={data?.avatarUrl || '/logo.svg'} alt=""/>
                        </div>
                        <div className="profile-background-button">
                            {

                                IMAGE_MAP.map((v, ind) =>
                                    v.show(loginId, uid) ? <img loading={'lazy'} key={ind} onClick={v.onClick} style={{
                                        width: '24px',
                                        height: '24px',
                                        padding: '5px',
                                        backgroundColor: 'grey',
                                        borderRadius: '10px',
                                        marginRight: '12px',
                                        background: '#181e1c',
                                        cursor: 'pointer'
                                    }} src={`/community/${v.key}.svg`} alt={''}/> : <></>
                                )
                            }
                            {
                                pathname.includes('/community/user') && (isFollowed ?
                                    <span className="unfollow-icon" onClick={() => handleUnfollow()}>Unfollow</span> :
                                    <span className="follow-icon" onClick={() => handleFollow()}>Follow</span>)
                            }
                        </div>
                    </div>
                </div>
                <div className={`information`}>
                    <div style={{zIndex: '20'}} className={'informationLeft'}>
                        <p className={'p'}><span>{data?.username ? formatAddress(data.username) : ''}</span><img
                            loading={'lazy'}
                            src="/certification.svg" alt=""/></p>
                        <p>{data?.address ? formatAddress(data.address) : ''} <Copy status={status}
                                                                                    setStatus={setStatus}
                                                                                    name={'0x3758...5478'}/></p>
                        <p className={'p'}>
                            {data?.twitter && <img loading={'lazy'} src="/titter.svg" alt=""/>}
                            <img loading={'lazy'} src="/facebook.svg" alt=""/>
                        </p>
                    </div>
                    <div style={{zIndex: '20'}} className={`informationRight `}>
                        {
                            [{
                                img: ["/btc.svg", "/eth1.svg", "/sol.svg"],
                                holding: 123,
                                following: data?.followeeCnt || 0,
                            }, {
                                img: ["/pepe.svg", "/uni.svg", "/blur.svg"],
                                holding: 33,
                                following: data?.followerCnt || 0
                            },].map((i: any, ind: number) => {
                                return <div className={`following dis`} key={ind}>
                                    <div>
                                        {
                                            i.img.map((it: string, index: number) => {
                                                return <img loading={'lazy'} src={it} key={index} alt=""/>
                                            })
                                        }
                                    </div>
                                    <div><span>{i.holding + ' '} </span>Holding</div>
                                    <div onClick={
                                        throttle(function () {
                                            if (uid) {
                                                history('/community/following?uid=' + uid)
                                            } else {
                                                history('/community/following')
                                            }
                                        }, 1500, {'trailing': false})
                                    }><span>{i?.following + ' '} </span>{ind === 0 ? 'Following' : 'Follower'}
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <p className={'hello'}>{data.bio || 'Nothing here'}</p>
                <div className={'tokenTop'}>
                    {
                        ['Community', 'Token'].map((i: string, ind: number) => {
                            return <p onClick={
                                throttle(function () {
                                    if (options !== i) {
                                        setOptions(i)
                                    }
                                }, 1500, {'trailing': false})
                            } key={ind}
                                      style={{color: options === i ? 'rgb(134,240,151 )' : 'rgb(214,223,215)'}}>{i}</p>
                        })
                    }
                </div>
            </div>
            <div id='profileScroll' style={{height: Number(hei) - 15 + 'px', overflowY: 'auto'}}
                 className={`scrollStyle community-content-post`}>
                <TWeetHome uid={id} scrollId='profileScroll' style={{overflowY: 'unset'}}/>
            </div>
            <CommonModal width='800px' className="modify-user-modal" footer={null} open={isModalOpen} onOk={handleOk}
                         onCancel={handleCancel}
            >
                <ModifyUserInfoForm/>
            </CommonModal>
            <input autoComplete={'off'} ref={inputRef} type="file" name="file" id='img-load' accept="image/*"
                   style={{display: 'none'}}/>
        </div>
    );
}

export default Profie;
