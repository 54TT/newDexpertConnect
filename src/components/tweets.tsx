import {useContext, useEffect, useState} from 'react'
import {CountContext} from "../Layout.tsx";
import {motion} from 'framer-motion';
import {request} from '../../utils/axios';
import Cookies from 'js-cookie';
import PostSendModal from '../pages/community/components/PostModal';
import {useNavigate} from 'react-router-dom';
import classNames from 'classnames';
import {message} from 'antd';
import {setMany} from "../../utils/change.ts";

interface TweetsPropsType {
    user?: any;
    name: any;
    isLogin?: boolean;
    type?: 'comment' | 'post' | 'reply';
    onPublish?: () => void;
}

function Tweets({
                    name, isLogin, type = 'post', onPublish = () => {
    }
                }: TweetsPropsType) {
    const {clear}: any = useContext(CountContext)
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
    // 是否是comment 而非reply，用于调用不同的like接口, parentId为0则为comment
    const isComment = localData.parentId === "0"

    const animationVariants = {
        hidden: {y: '100%', opacity: 0},
        visible: {y: '-100%', opacity: 1},
    };

    const clickLike = async (e: any) => {
        e.stopPropagation();
        if (isLogin) {
            const token = Cookies.get('token');
            let url = '';
            let data;
            if (type === 'post') {
                url = '/api/v1/post/like';
                data = {postId: localData.postId}
            }
            if (type === 'comment' || isComment) {
                url = '/api/v1/post/comment/like';
                data = {commentId: localData.id}
            }
            if (type === 'reply' && !isComment) {

                url = '/api/v1//reply/like';
                data = {replyId: localData.id}
            }
            try {
                if (localData?.likeStatus === false) {
                    setClickAnimate(true)


                    const result: any = await request('post', url, data, token);
                    result?.status === 200 ? setLocalData({...localData, likeStatus: true}) : null;
                    if (result === 'please') {
                        clear()
                    } else if (result && result?.status === 200) {
                        setLocalData({...localData, likeStatus: true, likeNum: Number(localData.likeNum) + 1})
                    }
                } else {
                    if (type === 'post') {
                        url = '/api/v1/post/like/cancel';
                        data = {postId: localData.postId}
                    }
                    if (type === 'comment' || isComment) {
                        url = '/api/v1/post/comment/like/cancel';
                        data = {commentId: localData.id}
                    }
                    if (type === 'reply' && !isComment) {
                        url = '/api/v1//reply/like/cancel';
                        data = {replyId: localData.id}
                    }
                    const result: any = await request('post', url, data, token);
                    if (result === 'please') {
                        clear()
                    } else if (result && result?.status === 200) {
                        setLocalData({...localData, likeStatus: false, likeNum: Number(localData.likeNum) - 1})
                    }
                }
            } catch (e) {
                return null
            }
        }
    }

    const handleAddComment = () => {
        // 设置评论数量
        console.log('call');

        setLocalData({...localData, commentNum: localData?.commentNum ? Number(localData?.commentNum) + 1 : 1});
        onPublish?.()
        setOpenComment(false);
    }

    const handleToDetail = () => {
        if (!isLogin) {
            message.warning('pleast connect your wallet');
            return;
        }
        if (type === 'reply' || type === 'comment') {
            const user = JSON.parse(Cookies.get('username') || '{}');

            if (type === 'reply' && user.uid === localData.user.uid) return;

            localStorage.setItem('reply-detail', JSON.stringify(localData))
            history(`/community/comment?reply=${localData.id}`, {replace: true})
            return;
        }
        localStorage.setItem('post-detail', JSON.stringify(localData))
        history('/community/detail')
    }

    const handleClickAvatar = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation()
        if (!isLogin) {
            message.warning('please login')
        }
        history(`/community/user?uid=${localData.user.uid}`)
    }

    return (
        <>
            <div className={classNames('tweetsBox', {'tweets-comment': type === 'comment'})} onClick={() => {
                handleToDetail()
            }}>
                {/*  top*/}
                <div className={`dis`}>
                    {/* left*/}
                    <div className={'tweetsLeft'}>
                        <img onClick={(e) => handleClickAvatar(e)}
                             src={localData?.user?.avatar ? localData?.user?.avatar : "/logo.svg"} alt=""
                             style={{width: '36px', marginRight: '5%', borderRadius: '50%'}}/>
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
                                              dangerouslySetInnerHTML={{__html: localData.content.replace(/\n/g, '<br>')}}></div> : ''
                }
                <>
                    {
                        localData?.imageList?.length > 0 && localData?.imageList[0] ?
                            <img className='post-item-img' src={localData?.imageList[0]} alt=""
                                 style={{
                                     maxWidth: '50%',
                                     maxHeight: '200px',
                                     borderRadius: '5px',
                                     display: 'block'
                                 }}/> : <></>
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
                        }}/>
                        <span>{localData?.commentNum ? localData.commentNum : 0}</span>
                    </p>
                    <div className={'tweetsIn like-icon'} onClick={clickLike}>
                        <img src={localData?.likeStatus ? '/loveClick.svg' : "/love.svg"} alt=""/>
                        <span>{localData?.likeNum ? localData.likeNum : 0}</span>
                        <motion.div
                            initial="hidden"
                            className={`tweetsLick`}
                            animate={!clickAnimate ? 'hidden' : 'visible'}
                            variants={animationVariants}
                            exit="hidden"
                            transition={{duration: 1, ease: 'easeInOut'}}>
                            <span style={{color: 'rgb(0,170,255)'}}>+1500</span>
                        </motion.div>
                    </div>
                    <p className={'tweetsIn share-icon'}>
                        <img src="/share.svg" style={{width: '22px'}} alt=""/>
                        <span>{setMany(Math.ceil(Math.random() * 10 + Math.random() * 100))}</span>
                    </p>
                    <p className={'tweetsIn look-icon'}>
                        <img src="/look.svg" alt=""/>
                        <span>{setMany(Math.ceil(Math.random() * 1000 + Math.random() * 1000))}</span>
                    </p>
                </div>

            </div>
            <PostSendModal type={type === "post" ? "comment" : "reply"} postData={localData}
                           className='comment-send-model' open={openComment}
                           onClose={() => setOpenComment(false)} onPublish={() => handleAddComment()}/>
        </>

    );
}

export default Tweets;