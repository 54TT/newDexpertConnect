import { throttle } from 'lodash';
import { setMany,  } from '@/../utils/change.ts';
export default function content({localData,text,setOpenComment,clickLike}) {
  return (
    <>
        {localData?.content && (
          <div
            className={'tweetsText'}
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          ></div>
        )}
        <>
          {localData?.imageList?.length > 0 && localData?.imageList[0] &&(
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
          )}
        </>
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
          </div>
          <p className={'tweetsIn share-icon'}>
            <img
              loading={'lazy'}
              src="/share.svg"
              style={{ width: '19px' }}
              alt=""
            />
            <span>
              {setMany(Math.ceil(Math.random() * 10 + Math.random() * 100))}
            </span>
          </p>
          <p className={'tweetsIn look-icon'}>
            <img loading={'lazy'} src="/look.svg" alt="" />
            <span style={{ whiteSpace: 'nowrap' }}>
              {setMany(Math.ceil(Math.random() * 1000 + Math.random() * 1000))}
            </span>
          </p>
        </div>
    </>
  )
}
