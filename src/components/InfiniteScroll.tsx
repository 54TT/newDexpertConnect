import InfiniteScroll from 'react-infinite-scroll-component';
import Load from '@/components/allLoad/load';
import Nodata from '@/components/Nodata';
export default function InfiniteScrollPage({
  data,
  next,
  scrollableTarget,
  items,
  nextLoad,
  no,
  style,
  show,
}: any) {
  return (
    <>
      <InfiniteScroll
        hasMore={true}
        next={next}
        scrollableTarget={scrollableTarget}
        loader={null}
        dataLength={data.length}
        style={style || null}
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
          <Nodata name={no} />
        )}
      </InfiniteScroll>
      {nextLoad && <Load />}
    </>
  );
}
