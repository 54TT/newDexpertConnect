import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'
import { request } from '../../utils/axios';
import Cookies from 'js-cookie';
import PostSendModal from '../pages/community/components/PostModal';
interface TweetsPropsType {
    user?: any;
    name: any;
}

function Tweets({ name }: TweetsPropsType) {
    const [clickAnimate, setClickAnimate] = useState(false);
    const [localData, setLocalData] = useState(name);
    const [openComment, setOpenComment] = useState(false);
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

    const clickLike = async () => {
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
        } catch (e) {
            console.log(e);
        }
    }

    const handleAddComment = (data: any) => {
        console.log(data);
        console.log(name);
    }

    return (
        <div className={'tweetsBox'}>
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
                    <p>1112 Follow</p>
                    <p className={'tweetsRight'}>Follow</p>
                </div>
            </div>
            {
                localData?.content ? <div className={'tweetsText'}
                    dangerouslySetInnerHTML={{ __html: localData.content.replace(/\n/g, '<br>') }}></div> : ''
            }
            <img src={localData?.imageList?.length > 0 ? localData?.imageList[0] : null} alt=""
                style={{ maxWidth: '50%', margin: '0 auto', maxHeight: '200px', borderRadius: '5px', display: 'block' }} />
            {/*   标识*/}
            <div className={'tweetsMark'}>
                <p>#btc</p>
                <p>#eth</p>
            </div>
            <div className={'tweetsOperate'}>
                <p className={'tweetsIn'}>
                    <img src="/comment.svg" alt="" onClick={() => setOpenComment(true)} />
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
            <PostSendModal className='comment-send-model' open={openComment} onClose={() => setOpenComment(false)} onPublish={(data) => handleAddComment(data)} />
        </div>

    );
}

export default Tweets;