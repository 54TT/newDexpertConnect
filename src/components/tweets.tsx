import { useContext, useEffect, useState } from 'react'
import { CountContext } from "../Layout.tsx";
import { simplify } from '../../utils/change.ts'
import { motion } from 'framer-motion';
import { request } from '../../utils/axios';
import Cookies from 'js-cookie';
import PostSendModal from '../pages/community/components/PostModal';
import { useNavigate } from 'react-router-dom';
interface TweetsPropsType {
    user?: any;
    name: any;
    isLogin?: boolean
}

function Tweets({ name, isLogin }: TweetsPropsType) {
    const { clear }: any = useContext(CountContext)
    const [clickAnimate, setClickAnimate] = useState(false);
    const [localData, setLocalData] = useState(name);
    const [openComment, setOpenComment] = useState(false);
    const history = useNavigate();
    useEffect(() => {
        if (clickAnimate) {
            setTimeout(() => {
                setClickAnimate(false)
            }, 1000);

        }
    }, [clickAnimate])
    const animationVariants = {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: '-100%', opacity: 1 },
    };

    const clickLike = async (e: any) => {
        e.stopPropagation();
        const token = Cookies.get('token');
        try {
            if (localData?.likeStatus === false) {
                setClickAnimate(true)
                const result: any = await request('post', '/api/v1/post/like', { postId: localData.postId }, token);
                result?.status === 200 ? setLocalData({ ...localData, likeStatus: true }) : null;
                if (result && result?.status === 200) {
                    setLocalData({ ...localData, likeStatus: true, likeNum: Number(localData.likeNum) + 1 })
                }
            } else {
                const result: any = await request('post', '/api/v1/post/like/cancel', { postId: localData.postId }, token);
                if (result && result?.status === 200) {
                    setLocalData({ ...localData, likeStatus: false, likeNum: Number(localData.likeNum) - 1 })
                }
            }

        }
        catch (e) {
            return null
        }
    }

    const handleAddComment = () => {
        // 设置评论数量
        setLocalData({ ...localData, commentNum: localData?.commentNum ? Number(localData?.commentNum) + 1 : 1 });
        setOpenComment(false);
    }

    const handleToDetail = () => {
        localStorage.setItem('post-detail', JSON.stringify(localData))
        history('/community/detail')
    }

    return (
        <>
            <div className={'tweetsBox'} onClick={() => { handleToDetail() }}>
                {/*  top*/}
                <div className={`dis`}>
                    {/* left*/}
                    <div className={'tweetsLeft'}>
                        <img src={localData?.user?.avatar ? localData?.user?.avatar : "/logo.svg"} alt=""
                            style={{ width: '42px', marginRight: '5%', borderRadius: '50%' }} />
                        <p>
                            <span>{localData?.user?.username ? localData?.user?.username.length > 12 ? localData?.user?.username.slice(0, 5) + '...' + name?.user?.username.slice(-4) : name?.user?.username : 'Not yet registor'}</span>
                            <span>{localData?.user?.address ? localData?.user.address.slice(0, 5) + '...' + localData?.user.address.slice(-4) : ''}</span>
                        </p>
                    </div>
                    <div className={'tweetsFollow'}>
                        <p className={'tweetsRight'}>Follow</p>
                    </div>
                </div>
                {
                    localData?.content ? <div className={'tweetsText'}
                        dangerouslySetInnerHTML={{ __html: localData.content.replace(/\n/g, '<br>') }}></div> : ''
                }
                <>
                    {
                        localData?.imageList?.length > 0 && localData?.imageList[0] ?
                            <img className='post-item-img' src={localData?.imageList[0]} alt=""
                                style={{ maxWidth: '50%', maxHeight: '200px', borderRadius: '5px', display: 'block' }} /> : <></>
                    }
                </>
                {/*   标识*/}
                {/*             <div className={'tweetsMark'}>
                <p>#btc</p>
                <p>#eth</p>
            </div> */}
                <div className={'tweetsOperate'}>
                    <p className={'tweetsIn'}>
                        <img src="/comment.svg" alt="" onClick={(e) => {
                            setOpenComment(true);
                            e.stopPropagation();
                        }} />
                        <span>{localData?.commentNum ? localData.commentNum : 0}</span>
                    </p>
                    <div className={'tweetsIn'} onClick={clickLike}>
                        <img src={localData?.likeStatus ? '/loveClick.svg' : "/love.svg"} alt="" />
                        <span>{localData?.likeNum ? localData.likeNum : 0}</span>
                        <motion.div
                            initial="hidden"
                            className={`tweetsLick`}
                            animate={!clickAnimate ? 'hidden' : 'visible'}
                            variants={animationVariants}
                            exit="hidden"
                            transition={{ duration: 1, ease: 'easeInOut' }}>
                            <span style={{ color: 'rgb(0,170,255)' }}>+1500</span>
                        </motion.div>
                    </div>
                    <p className={'tweetsIn'}>
                        <img src="/share.svg " alt="" />
                        <span>111</span>
                    </p>
                    <p className={'tweetsIn'}>
                        <img src="/look.svg" alt="" />
                        <span>111</span>
                    </p>
                </div>

            </div>
            <PostSendModal type="comment" postData={localData} className='comment-send-model' open={openComment} onClose={() => setOpenComment(false)} onPublish={() => handleAddComment()} />
        </>

    );
}

export default Tweets;