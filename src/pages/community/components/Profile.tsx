import {useContext, useEffect, useMemo, useRef, useState} from "react";
import Copy from '../../../components/copy.tsx'
import TWeetHome from "../../../components/tweetHome.tsx";
import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Form, Input,} from 'antd'
import Request from "../../../components/axios.tsx";
import Cookies from "js-cookie";
import cookie from "js-cookie";
import {formatAddress, getQueryParams} from "../../../../utils/utils.ts";
import CommonModal from "../../../components/CommonModal/index.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {throttle} from "lodash";
import {MessageAll} from "../../../components/message.ts";
import {useTranslation} from "react-i18next";
import {CountContext} from "../../../Layout.tsx";

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
    console.log(data)
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
                             src={previewAvatar || data?.avatarUrl || '/topLogo.png'} alt=""/>
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
                            <img loading={'lazy'} src={data?.avatarUrl || '/topLogo.png'} alt=""/>
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
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            {data?.twitter &&
                                <p className={'p'} style={{cursor: 'pointer'}} onClick={() => {
                                    window.open(data?.twitter)
                                }}>
                                    <svg d="1715004243380" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="4252" width="20" height="20">
                                        <path
                                            d="M778.41 96h141.142L611.2 448.427 973.952 928H689.92L467.456 637.141 212.906 928H71.68l329.813-376.96L53.504 96h291.243l201.088 265.856z m-49.535 747.52h78.208L302.25 176.043h-83.926z"
                                            fill="#e6e6e6" p-id="4253"></path>
                                    </svg>
                                </p>
                            }
                            {data?.telegram &&
                                <p className={'p'} style={{cursor: 'pointer'}} onClick={() => {
                                    window.open(data?.telegram)
                                }}>
                                    <svg d="1715004419988" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="5301" width="22" height="22">
                                        <path
                                            d="M679.424 746.861714l84.004571-395.995428c7.424-34.852571-12.580571-48.566857-35.437714-40.009143l-493.714286 190.281143c-33.718857 13.129143-33.133714 32-5.705142 40.557714l126.281142 39.424 293.156572-184.576c13.714286-9.142857 26.294857-3.986286 16.018286 5.156571l-237.129143 214.272-9.142857 130.304c13.129143 0 18.870857-5.705143 25.709714-12.580571l61.696-59.428571 128 94.281142c23.442286 13.129143 40.009143 6.290286 46.299428-21.723428zM1024 512c0 282.843429-229.156571 512-512 512S0 794.843429 0 512 229.156571 0 512 0s512 229.156571 512 512z"
                                            fill="#e6e6e6" p-id="5302"></path>
                                    </svg>
                                </p>
                            }
                            {data?.websiteLink &&
                                <p className={'p'} style={{cursor: 'pointer'}} onClick={() => {
                                    window.open(data?.websiteLink)
                                }}>
                                    <svg d="1715004488796" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="7606" width="22" height="22">
                                        <path
                                            d="M53.312 512a458.688 458.688 0 1 1 917.376 0A458.688 458.688 0 0 1 53.312 512z m339.52-376.32a394.048 394.048 0 0 0-138.88 77.632c25.6 22.08 53.952 40.96 84.48 55.936 6.784-25.408 14.528-49.152 23.168-70.848 9.216-22.912 19.584-44.16 31.232-62.72zM209.024 258.944A392.896 392.896 0 0 0 118.592 480h191.232c1.472-51.584 6.528-100.992 14.656-146.688a459.136 459.136 0 0 1-115.456-74.24z m422.144 629.376a394.176 394.176 0 0 0 138.88-77.696 395.328 395.328 0 0 0-84.48-55.936 610.752 610.752 0 0 1-23.168 70.848c-9.152 22.912-19.584 44.096-31.232 62.72z m183.808-123.456A392.832 392.832 0 0 0 905.408 544H714.24a1008.704 1008.704 0 0 1-14.72 146.624c42.24 19.008 81.152 44.16 115.456 74.304zM905.408 480a392.96 392.96 0 0 0-90.432-220.928 459.2 459.2 0 0 1-115.392 74.24c8.064 45.696 13.12 95.104 14.656 146.688h191.168zM769.92 213.312a394.112 394.112 0 0 0-138.88-77.696c11.712 18.688 22.144 39.872 31.296 62.784 8.704 21.76 16.448 45.44 23.104 70.848a395.328 395.328 0 0 0 84.48-55.936zM392.832 888.384a399.04 399.04 0 0 1-31.232-62.784 610.624 610.624 0 0 1-23.104-70.848 395.264 395.264 0 0 0-84.48 55.936 394.048 394.048 0 0 0 138.88 77.696z m-183.744-123.456a459.136 459.136 0 0 1 115.392-74.24A1008.448 1008.448 0 0 1 309.76 544H118.656a392.896 392.896 0 0 0 90.496 220.928zM512 117.312c-11.904 0-26.496 5.952-43.2 23.552-16.64 17.664-33.216 44.928-47.744 81.28-8.448 21.12-16 44.8-22.528 70.656A394.752 394.752 0 0 0 512 309.312c39.488 0 77.568-5.76 113.536-16.512a557.824 557.824 0 0 0-22.528-70.592c-14.592-36.416-31.104-63.68-47.808-81.344-16.64-17.6-31.232-23.552-43.2-23.552zM373.824 480h276.352a953.28 953.28 0 0 0-11.712-124.352A458.88 458.88 0 0 1 512 373.312a458.88 458.88 0 0 1-126.4-17.664A953.216 953.216 0 0 0 373.76 480z m11.776 188.352A458.944 458.944 0 0 1 512 650.688c43.84 0 86.272 6.144 126.464 17.664 6.272-38.656 10.368-80.448 11.712-124.352H373.824c1.344 43.904 5.44 85.76 11.776 124.352zM512 714.688c-39.424 0-77.568 5.76-113.472 16.512 6.464 25.792 14.08 49.472 22.528 70.592 14.528 36.416 31.04 63.68 47.744 81.344 16.64 17.6 31.296 23.552 43.2 23.552 11.968 0 26.56-5.952 43.2-23.552 16.704-17.664 33.28-44.928 47.808-81.28 8.448-21.184 16-44.8 22.464-70.656A394.752 394.752 0 0 0 512 714.688z"
                                            p-id="7607" fill="#e6e6e6"></path>
                                    </svg>
                                </p>
                            }
                            {data?.youtube &&
                                <p className={'p'} style={{cursor: 'pointer'}} onClick={() => {
                                    window.open(data?.youtube)
                                }}>
                                    <svg d="1715004528275" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="8705" width="22" height="22">
                                        <path
                                            d="M941.3 296.1c-10.3-38.6-40.7-69-79.2-79.3C792.2 198 512 198 512 198s-280.2 0-350.1 18.7C123.3 227 93 257.4 82.7 296 64 366 64 512 64 512s0 146 18.7 215.9c10.3 38.6 40.7 69 79.2 79.3C231.8 826 512 826 512 826s280.2 0 350.1-18.8c38.6-10.3 68.9-40.7 79.2-79.3C960 658 960 512 960 512s0-146-18.7-215.9zM423 646V378l232 133-232 135z"
                                            p-id="8706" fill="#e6e6e6"></path>
                                    </svg>
                                </p>
                            }
                        </div>

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
