import InfiniteScroll from 'react-infinite-scroll-component';
import React from 'react'
const Load = React.lazy(() => import('@/components/allLoad/load'));
const Nodata = React.lazy(() => import('@/components/Nodata'));
export default function InfiniteScrollPage({
  data,
  next,
  scrollableTarget,
  items,
  nextLoad,
  no,
  style,
  show,
  setAddLink,
}: any) {
  return (
    <>
      <InfiniteScroll
        hasMore={true}
        next={next}
        scrollableTarget={scrollableTarget}
        loader={null}
        dataLength={data.length}
        style={style || { overflow: 'hidden' }}
      >
        {data.length > 0 ? (
          show === 'show' ? (
            items
          ) : (
            data.map((item: any, index: number) => {
              return items(item, index);
            })
          )
        ) : (
          <Nodata name={no} setAddLink={setAddLink} />
        )}
      </InfiniteScroll>
      {nextLoad && <Load />}
    </>
  );
}
