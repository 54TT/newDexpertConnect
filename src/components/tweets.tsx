import { useContext, useEffect, useState } from 'react';
import Request from './axios.tsx';
import cookie from 'js-cookie';
import PostSendModal from '../pages/community/components/PostModal';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DeleteOutlined } from '@ant-design/icons';
import { simplify } from '@/../utils/change.ts';
import { throttle } from 'lodash';
import { Popconfirm } from 'antd';
import NotificationChange from './message';
import { useTranslation } from 'react-i18next';
import { CountContext } from '../Layout.tsx';

dayjs.extend(relativeTime);

interface TweetsPropsType {
  user?: any;
  name: any;
  type?: 'comment' | 'post' | 'reply';
  onPublish?: any;
  setDel?: any;
  status?: any;
}

function Tweets({
  name,
  type = 'post',
  status,
  setDel,
  onPublish,
}: TweetsPropsType) {
  const { getAll } = Request();
  const { t } = useTranslation();
  const [clickAnimate, setClickAnimate] = useState(false);
  const [localData, setLocalData] = useState<any>(name);
  const [text, setText] = useState('');
  const [openComment, setOpenComment] = useState(false);
  const history = useNavigate();
  const { user } = useContext(CountContext) as any;
  useEffect(() => {
    if (clickAnimate) {
      setTimeout(() => {
        setClickAnimate(false);
      }, 1000);
    }
  }, [clickAnimate]);

  useEffect(() => {
    let data = name?.content?.replace(/\n/g, '<br>');
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let urls = data.match(urlRegex);
    if (urls?.length) {
      urls.map((i: string) => {
        data?.replace(i, '<a href=' + i + '></a>');
      });
      setText(data);
    } else {
      setText(data);
    }
  }, [name]);
  // 是否是comment 而非reply，用于调用不同的like接口, parentId为0则为comment
  const isComment = localData?.parentId === '0';
  // const animationVariants = {
  //     hidden: { y: '100%', opacity: 0 },
  //     visible: { y: '-100%', opacity: 1 },
  // };
  const clickLike = throttle(
    async function (e: any) {
      e.stopPropagation();
      const token = cookie.get('token');
      const jwt = cookie.get('jwt');
      if (token && jwt) {
        const token = cookie.get('token');
        let url = '';
        let data;
        if (type === 'post') {
          url = '/api/v1/post/like';
          data = { postId: localData?.postId };
        }
        if (type === 'comment' || isComment) {
          url = '/api/v1/post/comment/like';
          data = { commentId: localData?.id };
        }
        if (type === 'reply' && !isComment) {
          url = '/api/v1//reply/like';
          data = { replyId: localData?.id };
        }
        try {
          if (localData?.likeStatus === false) {
            setClickAnimate(true);
            const result: any = await getAll({
              method: 'post',
              url,
              data,
              token,
            });
            if (result?.status === 200) {
              setLocalData({
                ...localData,
                likeStatus: true,
                likeNum: Number(localData?.likeNum) + 1,
              });
            }
          } else {
            if (type === 'post') {
              url = '/api/v1/post/like/cancel';
              data = { postId: localData?.postId };
            }
            if (type === 'comment' || isComment) {
              url = '/api/v1/post/comment/like/cancel';
              data = { commentId: localData?.id };
            }
            if (type === 'reply' && !isComment) {
              url = '/api/v1//reply/like/cancel';
              data = { replyId: localData?.id };
            }
            const result: any = await getAll({
              method: 'post',
              url,
              data,
              token,
            });
            if (result?.status === 200) {
              setLocalData({
                ...localData,
                likeStatus: false,
                likeNum: Number(localData?.likeNum) - 1,
              });
            }
          }
        } catch (e) {
          return null;
        }
      }
    },
    1500,
    { trailing: false }
  );
  const handleAddComment = () => {
    // 设置评论数量
    setLocalData({
      ...localData,
      commentNum: localData?.commentNum ? Number(localData?.commentNum) + 1 : 1,
    });
    if (onPublish) {
      onPublish?.();
    }
    setOpenComment(false);
  };
  const handleToDetail = throttle(
    function () {
      const token = cookie.get('token');
      const jwt = cookie.get('jwt');
      if (!jwt && !token) {
        NotificationChange('warning', t('Market.line'));
        return;
      }
      if (type === 'reply' || type === 'comment') {
        if (type === 'reply' && user?.uid === localData?.user?.uid) return;
        localStorage.setItem('reply-detail', JSON.stringify(localData));
        history(`/community/comment?reply=${localData?.id}`);
        return;
      }
      localStorage.setItem('post-detail', JSON.stringify(localData));
      history('/community/detail');
    },
    1500,
    { trailing: false }
  );
  const handleClickAvatar = throttle(
    function (e: any) {
      e.stopPropagation();
      const token = cookie.get('token');
      const jwt = cookie.get('jwt');
      if (!token && !jwt) {
        return NotificationChange('warning', t('Market.line'));
      }
      history(`/community/user?uid=${localData?.user?.uid}`);
    },
    1500,
    { trailing: false }
  );

  const confirm = throttle(
    async function (e: any) {
      e.stopPropagation();
      const token = cookie.get('token');
      if (token) {
        const data: any = await getAll({
          method: 'delete',
          url: '/api/v1/post/' + localData?.postId,
          data: '',
          token,
        });
        if (data?.status === 200 && data?.data?.code === 200) {
          setDel(localData?.postId);
        }
      }
    },
    1500,
    { trailing: false }
  );

  const handleShare = async () => {
    const token = cookie.get('token');
    const jwt = cookie.get('jwt');
    if (!token && !jwt) {
      return NotificationChange('warning', t('Market.line'));
    }
    const { data } = await getAll({
      method: 'post',
      url: '/api/v1/post/share/add',
      data: {
        postId: localData.postId,
      },
      token,
    });
    setLocalData({
      ...localData,
      SharesCnt: data.shareCnt,
    });
  };

  return (
    <>
      <div
        className={classNames('tweetsBox', {
          'tweets-comment': type === 'comment',
        })}
        onClick={handleToDetail}
      >
        {/*  top*/}
        <div className={`dis`}>
          {/* left*/}
          <div className={'tweetsLeft'} style={{ flex: '1' }}>
            <img
              loading={'lazy'}
              onClick={(e) => handleClickAvatar(e)}
              src={
                localData?.user?.avatar
                  ? localData?.user?.avatar
                  : '/topLogo.png'
              }
              alt=""
              style={{
                width: '36px',
                marginRight: '12px',
                borderRadius: '50%',
              }}
            />
            <div>
              <div
                className="disDis"
                style={{ flexDirection: 'row', fontSize: '18px' }}
              >
                <span>
                  {simplify(
                    localData?.user?.username
                      ? localData?.user?.username
                      : localData?.user?.address
                  )}
                </span>
                {Number(localData?.user?.level) ? (
                  <img
                    style={{ marginLeft: '4px' }}
                    src={
                      Number(localData?.user?.level) === 2
                        ? '/goldLogo.svg'
                        : '/solverLogo.svg'
                    }
                    alt=""
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
            <p
              style={{
                margin: '3px 0 0 8px',
                color: 'rgb(83, 100, 113)',
                fontSize: '12px',
                display: 'block',
              }}
            >
              {dayjs().to(dayjs(localData?.CreatedAt))}
            </p>
          </div>
          {status !== 'detail' && user?.uid === localData?.user?.uid && (
            <div
              onClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              <Popconfirm
                title={t('Common.del')}
                description={t('Common.This')}
                okText="Yes"
                cancelText="No"
                onConfirm={confirm}
              >
                <DeleteOutlined
                  style={{ fontSize: '20px', color: 'white' }}
                  onClick={(e: any) => {
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>
            </div>
          )}
        </div>
        {localData?.content ? (
          <div
            className={'tweetsText'}
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          ></div>
        ) : (
          ''
        )}
        <>
          {localData?.imageList?.length > 0 && localData?.imageList[0] ? (
            <img
              loading={'lazy'}
              className="post-item-img"
              src={localData?.imageList[0]}
              alt=""
              style={{
                maxWidth: '50%',
                maxHeight: '200px',
                borderRadius: '5px',
                display: 'block',
              }}
            />
          ) : (
            <></>
          )}
        </>
        {/*   标识*/}
        {/*             <div className={'tweetsMark'}>
                <p>#btc</p>
                <p>#eth</p>
            </div> */}
        <div className={'tweetsOperate'}>
          <p className={'tweetsIn'}>
            <img
              loading={'lazy'}
              src="/comment.svg"
              alt=""
              onClick={throttle(
                function (e: any) {
                  e.stopPropagation();
                  setOpenComment(true);
                },
                1500,
                { trailing: false }
              )}
            />
            <span>{localData?.commentNum ? localData.commentNum : 0}</span>
          </p>
          <div className={'tweetsIn like-icon'} onClick={clickLike}>
            <img
              loading={'lazy'}
              src={localData?.likeStatus ? '/loveClick.svg' : '/love.svg'}
              alt=""
            />
            <span>{localData?.likeNum ? localData.likeNum : 0}</span>
            {/*<motion.div*/}
            {/*    initial="hidden"*/}
            {/*    className={`tweetsLick`}*/}
            {/*    animate={!clickAnimate ? 'hidden' : 'visible'}*/}
            {/*    variants={animationVariants}*/}
            {/*    exit="hidden"*/}
            {/*    transition={{ duration: 1, ease: 'easeInOut' }}>*/}
            {/*    <span style={{ color: 'rgb(0,170,255)' }}>+1500</span>*/}
            {/*</motion.div>*/}
          </div>
          <p className={'tweetsIn share-icon'}>
            <img
              loading={'lazy'}
              src="/share.svg"
              style={{ width: '19px' }}
              alt=""
              onClick={handleShare}
            />
            <span>{localData?.SharesCnt || '0'}</span>
          </p>
          <p className={'tweetsIn look-icon'}>
            <img loading={'lazy'} src="/look.svg" alt="" />
            <span style={{ whiteSpace: 'nowrap' }}>{localData.ViewsCnt}</span>
          </p>
        </div>
      </div>
      <PostSendModal
        type={type === 'post' ? 'comment' : 'reply'}
        postData={localData}
        className="comment-send-model"
        open={openComment}
        onClose={() => setOpenComment(false)}
        onPublish={handleAddComment}
      />
    </>
  );
}

export default Tweets;
