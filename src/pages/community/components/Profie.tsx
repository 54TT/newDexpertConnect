import { useEffect, useMemo, useRef, useState } from "react";
import Copy from '../../../components/copy.tsx'
import TWeetHome from "../../../components/tweetHome.tsx";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd'
import { request } from "../../../../utils/axios.ts";
import Cookies from "js-cookie";
import { formatAddress, getQueryParams } from "../../../../utils/utils.ts";
import CommonModal from "../../../components/CommonModal/index.tsx";
import { message } from 'antd';
import { useLocation } from "react-router-dom";
function Profie() {
    const topRef = useRef<any>()
    const [status, setStatus] = useState(false)
    const [options, setOptions] = useState('Community')
    const [hei, setHei] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<any>({});
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputType, setInputType] = useState<'avatar' | 'background'>('avatar');
    const [previewAvatar, setPreviewAvatar] = useState('');
    const [previewBG, setPreviewBG] = useState('');
    const [newAvatar, setNewAvatar] = useState();
    const [newBG, setNewBG] = useState();
    const [form] = Form.useForm();
    const { uid } = getQueryParams();
    const loginId = JSON.parse(Cookies.get('uid') || '{}').uid
    const { pathname } = useLocation();

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
    // const showModal = () => {
    //     setIsModalOpen(true);
    // };
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

    const getUserProfile = async () => {

        if (!id) {
            return messageApi.warning('please connect your wallet')
        }
        const token = Cookies.get('token');
        if (!token) return;
        const result: any = await request('get', `/api/v1/userinfo/${id}`, {}, token);
        if (result.status === 200) {
            const { data } = result.data;
            setData(data);
            setPreviewAvatar(data.avatarUrl);
            setPreviewBG(data.coverUrl);
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
            show: (loginId: string, profileId: string) => loginId === profileId
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
            messageApi.warning('Only images in JPEG and PNG formats can be uploaded');
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
            return messageApi.warning('please connect your wallet')
        }
        let avatarUrl = previewAvatar;
        let coverUrl = previewBG;

        if (newAvatar) {
            const result: any = await request('post', '/api/v1/upload/image', newAvatar, token);
            if (result.status === 200) {
                avatarUrl = result?.data?.url;
            }
        }
        if (newBG) {
            const result: any = await request('post', '/api/v1/upload/image', newBG, token);
            if (result.status === 200) {
                coverUrl = result?.data?.url;
            }
        }

        const params = {
            user: {
                ...data,
                uid: id,
                ...(avatarUrl ? { avatarUrl } : {}),
                ...(coverUrl ? { coverUrl } : {})
            }
        }
        const result: any = await request('post', '/api/v1/userinfo', params, token);
        if (result.status === 200) {
            messageApi.success('update success');
            getUserProfile()
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
                <img className="profile-background-cover" src='/community/changeImg.svg' onClick={() => {
                    setInputType('background')
                    inputRef?.current?.click()
                }} />
                <img className="profile-background-img" src={previewBG || data?.coverUrl || "/community/profileBackground.png"} alt="" />
                <div className="profile-background-info">
                    <div className="profile-background-avatar">
                        <img className="profile-background-avatar-img" src={previewAvatar || data?.avatarUrl || '/logo.svg'} alt="" />
                        <img className="profile-background-avatar-cover" src='/community/changeImg.svg' alt="" onClick={() => {
                            setInputType('avatar')
                            inputRef?.current?.click()
                        }} />
                    </div>
                </div>
            </div>
            {contextHolder}
            <div className="user-info-form" style={{ padding: '12px 48px' }}>
                <Form form={form} initialValues={data} layout="vertical" onFinish={(data: any) => handleSubmit(data)} >
                    <Form.Item name='username' label='Name'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='bio' label='Bio'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='twitter' label='Twitter'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='telegram' label='gelegram'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='discord' label='discord'>
                        <Input />
                    </Form.Item>
                </Form>
            </div >
            <div className="" style={{ display: 'flex', justifyContent: 'center' }}>
                <Button className="modify-form-submit" onClick={() => form.submit()} >Submit</Button>
            </div>
        </>
    }

    return (
        <div className={'username-page'}>
            <div ref={topRef}>
                <div className={`back`}>
                    <ArrowLeftOutlined style={{ color: 'rgb(214,223,215)', fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
                    <div>
                        <p><span>{data?.username ? formatAddress(data.username) : ''}</span><img src="/certification.svg" alt="" /></p>
                        <p>{data?.address ? formatAddress(data.address) : ''}</p>
                    </div>
                </div>
                <div className="profile-background">
                    <img src={data.coverUrl || "/community/profileBackground.png"} alt="" />
                    <div className="profile-background-info">
                        <div className="profile-background-avatar">
                            <img src={data?.avatarUrl || '/logo.svg'} alt="" />
                        </div>
                        <div className="profile-background-button">
                            {

                                IMAGE_MAP.map((v) => {
                                    if (pathname.includes('/community/user')) {
                                        return v.show(loginId, uid) ? <img onClick={v.onClick} style={{ width: '24px', height: '24px', padding: '5px', backgroundColor: 'grey', borderRadius: '10px', marginRight: '12px', background: '#181e1c' }} src={`/community/${v.key}.svg`} /> : <></>
                                    }
                                    return <img onClick={v.onClick} style={{ width: '24px', height: '24px', padding: '5px', backgroundColor: 'grey', borderRadius: '10px', marginRight: '12px', background: '#181e1c' }} src={`/community/${v.key}.svg`} />
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={`information`}>
                    <div className={'informationLeft'}>
                        <p className={'p'}><span>{data?.username ? formatAddress(data.username) : ''}</span><img src="/certification.svg" alt="" /></p>
                        <p>{data?.address ? formatAddress(data.address) : ''} <Copy status={status} setStatus={setStatus} name={'0x3758...5478'} /></p>
                        <p className={'p'}><img src="/titter.svg" alt="" /><img src="/facebook.svg" alt="" /></p>
                    </div>
                    <div className={`informationRight `}>
                        {
                            [{
                                img: ["/btc.svg", "/eth1.svg", "/sol.svg"],
                                holding: 123,
                                following: 2324
                            }, {
                                img: ["/pepe.svg", "/uni.svg", "/blur.svg"],
                                holding: 33,
                                following: 66
                            },].map((i: any, ind: number) => {
                                return <div className={`following dis`} key={ind}>
                                    <div>
                                        {
                                            i.img.map((it: string, index: number) => {
                                                return <img src={it} key={index} alt="" />
                                            })
                                        }
                                    </div>
                                    <div><span>{i.holding + ' '} </span>Holding</div>
                                    <div><span>{i.following + ' '} </span>Following</div>
                                </div>
                            })
                        }
                        {/*<div className={`following dis`}>*/}
                        {/*    <div>*/}
                        {/*        <img src="/btc.svg" alt=""/>*/}
                        {/*        <img src="/eth1.svg" alt=""/>*/}
                        {/*        <img src="/sol.svg" alt=""/>*/}
                        {/*    </div>*/}
                        {/*    <p><span>142 </span>Holding</p>*/}
                        {/*    <p><span>1345 </span>Following</p>*/}
                        {/*</div>*/}
                        {/*<div className={`following dis`}>*/}
                        {/*    <div>*/}
                        {/*        <img src="/btc.svg" alt=""/>*/}
                        {/*        <img src="/eth1.svg" alt=""/>*/}
                        {/*        <img src="/sol.svg" alt=""/>*/}
                        {/*    </div>*/}
                        {/*    <p><span>142 </span>Holding</p>*/}
                        {/*    <p><span>1345 </span>Following</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <p className={'hello'}>Hello players, DEXpert is a special exchange! I hope we can have fun here!</p>
                <div className={'tokenTop'}>
                    {
                        ['Community', 'Token'].map((i: string, ind: number) => {
                            return <p onClick={() => {
                                if (options !== i) {
                                    setOptions(i)
                                }
                            }} key={ind}
                                style={{ color: options === i ? 'rgb(134,240,151 )' : 'rgb(214,223,215)' }}>{i}</p>
                        })
                    }
                </div>
            </div>
            <div style={{ height: hei + 'px', overflowY: 'auto' }} className={`scrollStyle community-content-post`}
                id='scrollableDiv'>
                <TWeetHome uid={id} />
            </div>
            <CommonModal width='800px' className="modify-user-modal" footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ModifyUserInfoForm />
            </CommonModal>
            <input ref={inputRef} type="file" name="file" id='img-load' accept="image/*" style={{ display: 'none' }} />
        </div>
    );
}

export default Profie;