import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import TokenItem from '../../component/TokenItem';
import Request from '@/components/axios';
import { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout';
import Cookies from 'js-cookie';
import './index.less';
import InfiniteScrollPage from '@/components/InfiniteScroll';
import Loading from '@/components/allLoad/loading';
import { useTranslation } from 'react-i18next';
function ManagePairListAndContract() {
  const { t } = useTranslation();
  const { chainId, browser } = useContext(CountContext);
  const { getAll } = Request();
  const [search] = useSearchParams();
  const history = useNavigate();
  const tokenSymbol = search.get('t');
  const address = search.get('add');
  const [loading, setLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const [page, setPage] = useState(1);

  const contractId = search.get('cId');
  const token = Cookies.get('token');
  const [data, setData] = useState([]);
  const getTokenPairList = async () => {
    const res = await getAll({
      method: 'get',
      url: '/api/v1/launch-bot/pairs',
      data: {
        contractId,
      },
      token,
      chainId,
    });
    if (res?.status === 200) {
      setLoading(true);
      setData(res?.data?.list);
      if (res?.data?.list?.length !== 10) {
        setIsNext(true);
      }
    } else {
      setLoading(true);
    }
  };

  const changePage = () => {
    if (!isNext) {
      getTokenPairList();
      setPage(page + 1);
      setNextLoad(true);
    }
  };

  useEffect(() => {
    getTokenPairList();
  }, [chainId]);

  const items = (item: any) => {
    return (
      <TokenItem
        key={item?.pairAddress}
        data={{
          title: `${item.token0}/${item.token1}`,
          ...item,
        }}
        onClick={(data) => {
          history(
            `/dapps/tokencreation/pairDetail?add=${data.pairAddress}&t0=${data.token0}&t1=${data.token1}`
          );
        }}
      />
    );
  };
  return (
    <div className="launch-manage-pair">
      <ToLaunchHeader />
      <PageHeader className="launch-manage-token-header" title={tokenSymbol} />
      <TokenItem
        data={{ title: t('token.can'), address }}
        onClick={() => {
          history(
            `/dapps/tokencreation/tokenDetail?add=${address}&cId=${contractId}`
          );
        }}
      />
      <div style={{ height: '330px', overflow: 'overlay' }}>
        {loading ? (
          <InfiniteScrollPage
            data={data}
            next={changePage}
            items={items}
            nextLoad={nextLoad}
            no={t('token.noPair')}
            scrollableTarget={'launchTokenList'}
          />
        ) : (
          <Loading status={'20'} browser={browser} />
        )}
      </div>
    </div>
  );
}

export default ManagePairListAndContract;
