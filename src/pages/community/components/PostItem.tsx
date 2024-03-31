export interface PostImteDataType {
  user?: {
    address: string
    avatar: string;
    uid: string;
    username: string;
  }
  CreatedAt: string;
  commentNum: string;
  content: string;
  imageList: string[];
  likeNum: string;
  likeStatus: boolean;
  postId: string;
}

interface PostImtePropsType {
  data: PostImteDataType
}

function PostItem({
  data
}: PostImtePropsType) {
  const { user,
    CreatedAt,
    commentNum,
    content,
    likeNum,
    /*     likeStatus,
        postId, */
    imageList
  } = data

  return <div className="post-item" style={{ maxHeight: '300px' }}>
    <div className="post-item-avatar">
      <img src="https://s3-alpha-sig.figma.com/img/39ec/e99b/97b3c19ea6be60fc958e30af51f5e01f?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BDISJb~QfQqcdrLR4lr56Nce1hLxham8q3I9oO-sBeMoImNrcqwRBRORrlLFg0qt3BdTzIxhavhcllnjUCJ3RJ~3vApDNHFFexnSGB8dxwbqVyKf0cb2s-etAKQyyI9rH1R8HO1W5C806QQpQlHNumsTpck-bM16UbXD3IbAuWUjGisxEhYFeR-hnrMUpzfOTZ2DB7JVM24778y2xLkwmlvPnGiyQHFntOT9P~IU3EwERfl0kED-FkyzU~i0cpxfW3WAwiilHYayC7YtbQdS0BSd99-5RNfcDGGspi0d3JsrPtGPEfwE5B4r3LvcUpffacEX2N7CX25d8Ieoxuc7BA__" alt="" />
    </div>
    <div className="post-item-info">
      <div className="post-item-info-user">
        <span className="post-item-info-user-nickName">{user?.username}</span>
        <span className="post-item-info-user-icon">

        </span>
        <span className="post-item-info-user-date">{CreatedAt}</span>
      </div>
      <div className="post-item-info-content">
        <span>{content}</span>
        <div>
          {imageList.map((src: string,ind:number) => <img key={ind} alt={''} style={{ height: '100%' }} src={src} />)}
        </div>
      </div>
      <div className="post-item-info-tag">{['#ETH', '#BTC'].map((tag: string,ind:number) => <span key={ind}>{tag}</span>)}</div>
      <div className="post-item-info-action">
        <div className="post-item-info-action-comment">
          <img src="/community/comment.svg" alt="" />
          <span>{commentNum}</span>
        </div>
        <div className="post-item-info-action-like">
          <img src="/community/like.svg" alt="" />
          <span>{likeNum}</span>
        </div>
        <div className="post-item-info-action-share">
          <img src="/community/share.svg" alt="" />
          <span>42</span>
        </div>
        <div className="post-item-info-action-watch">
          <img src="/community/watch.svg" alt="" />
          <span>1200k</span>
        </div>
      </div>
    </div>
  </div>
}
export default PostItem