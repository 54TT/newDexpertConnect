import {useCallback, useEffect, useState} from 'react';
import Tweets from '../../../components/tweets';
import SendPost from './SendPost';
import Request from '../../../components/axios.tsx';
import Cookies from 'js-cookie';
import {Spin} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getQueryParams} from '../../../../utils/utils'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {useNavigate} from "react-router-dom";
import {throttle} from "lodash";

// 渲染单条评论
const RenderCommentTweet = ({data = {}, type}: any) => {
    const renderData = {
        ...data,
        CreatedAt: data.createdAt,
        commentNum: data.replyCnt,
        user: {
            uid: data.replyUserId,
            username: data.replyUsername,
            avatar: data.replyUserAvatar,
            address: data.replyUserAddress,
        }

    }

    /* const getCommentReply = async (page = 1) => {
      const params = {
        commentId: data.id,
        page
      }
      const result: any = await Request('post', '/api/v1/reply/list', params, token);
      if (result.status === 200) {
        const { data } = result;
      }
    } */

    /*  useEffect(() => {
       getCommentReply();
     }, []) */
    return data ? <Tweets name={renderData} type={type} onPublish={() => console.log('123123')
    }/> : <></>
}
const PostDetail = () => {
    const {getAll} = Request()
    const history = useNavigate();
    const postDetail = JSON.parse(localStorage.getItem('post-detail') || '{}');
    const [localDetail] = useState(postDetail);
    const [localReplyDetail, setLocalReplyDetail] = useState({})
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [getPageStatus, setPageStatus] = useState(true);
    const token = Cookies.get('token');
    const {reply} = getQueryParams() as any;
    const getCommentOrReplyData = async (page = 1) => {
        setPage(page);
        let params = {};
        let url = '';
        if (reply) {
            params = {
                commentId: reply,
                page,
            }
            url = '/api/v1/reply/list'
        } else {
            params = {
                page,
                postId: localDetail.postId
            }
            url = '/api/v1/post/comment/list'
        }
        setPageStatus(true)
        // const result: any = await Request('post', url, params, token);
        const result: any = await getAll({method: 'post', url, data: params, token});
        if (result?.status === 200) {
            const comments: never[] = reply ? result.data.replyList : result.data.comments
            if (page === 1) {
                setData(comments)
            } else {
                setData([...data, ...comments || []])
            }
        }
        setPageStatus(false)
    }
    useEffect(() => {
        getCommentOrReplyData()
        const replyDetail = JSON.parse(localStorage.getItem('reply-detail') || '{}')
        setLocalReplyDetail({...replyDetail});

    }, [reply])
    const CommentTweets = useCallback(() => reply ?
        <Tweets type={reply ? 'reply' : 'comment'} name={localReplyDetail} onPublish={() => getCommentOrReplyData()
        }/> : <></>, [localReplyDetail, reply])
    return <div id='scrollabelDetail' style={{height: 'calc(100vh - 54px )', overflow: 'auto'}}>
        <p style={{padding: '20px 20px 0'}}><ArrowLeftOutlined
            style={{fontSize: '20px', color: 'white', cursor: 'pointer'}} onClick={
            throttle( function () {
            history(-1)
            }, 1500, {'trailing': false})}/></p>
        <InfiniteScroll style={{overflow: 'unset'}} dataLength={data?.length || 0} hasMore={true}
                        scrollableTarget='scrollabelDetail' next={() => {
            getCommentOrReplyData(page + 1);
        }} loader={<></>}>
            <div className='community-post-detail'>
                <Tweets type='post' name={localDetail} status={'detail'} onPublish={() => getCommentOrReplyData()}/>
                <CommentTweets/>
                <SendPost type={reply ? 'reply' : "comment"} changeRefresh={() => {
                }} postData={reply ? localReplyDetail : localDetail} onPublish={() => getCommentOrReplyData()}/>
                {
                    getPageStatus && page === 1 ?
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '48px'}}>
                            <Spin size='large'/>
                        </div> : data.length > 0 ? data?.map?.((data, ind) =>
                            <RenderCommentTweet data={data} key={ind} type={reply ? 'reply' : "comment"}/>
                        ) : <p style={{marginTop: '48px', color: '#d6dfd7', textAlign: 'center'}}>
                            No Data
                        </p>
                }
            </div>
        </InfiniteScroll>
    </div>

}

export default PostDetail;