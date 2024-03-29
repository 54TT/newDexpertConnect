
import { useState } from 'react';
import Tweets from '../../../components/tweets';
import SendPost from './SendPost';
import { request } from '../../../../utils/axios';

const PostDetail = () => {
  const postDetail = JSON.parse(localStorage.getItem('post-detail') || '{}');

  const [localDetail] = useState(postDetail);
  /*   const [commentData, setCommentData] = useState([]); */

  /*   const getComment = () => {
      const token = Cookies.get('token');
      const data = {
        postId: localDetail.
      }
          const result = request('post', '/api/v1/post/comment/list')
    } */

  /*   useEffect(() => {
  
    }, []) */

  return <div className='community-post-detail'>
    <Tweets name={localDetail} />
    <SendPost type="comment" changeRefresh={() => { }} postData={localDetail} />
  </div>

}

export default PostDetail;