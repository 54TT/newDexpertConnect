import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
const PageHeader = React.lazy(() => import('../../component/PageHeader'));

const ToLaunchHeader = React.lazy(
  () => import('../../component/ToLaunchHeader')
);
const TokenItem = React.lazy(() => import('../../component/TokenItem'));
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import Cookies from 'js-cookie';
import './index.less';
const InfiniteScrollPage = React.lazy(
  () => import('@/components/InfiniteScroll')
);
const Loading = React.lazy(() => import('@/components/allLoad/loading'));
import { useTranslation } from 'react-i18next';
function ManagePairListAndContract() {
  const { t } = useTranslation();
  const router = useParams();
  const { chainId, browser, contractConfig } =
    useContext(CountContext);
  const { getAll } = Request();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const [page, setPage] = useState(1);
  const token = Cookies.get('token');
  const [data, setData] = useState([]);
  const getTokenPairList = async () => {
    const res = await getAll({
      method: 'get',
      url: '/api/v1/launch-bot/pairs',
      data: {
        contractId: router?.id,
      },
      token,
      chainId,
    });
    if (res?.status === 200) {
      setData(res?.data?.list);
      if (res?.data?.list?.length !== 10) {
        setIsNext(true);
      }
      setLoading(true);
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
    if (router?.id && contractConfig?.chainId === Number(chainId)) {
      getTokenPairList();
      setLoading(false);
    }
  }, [contractConfig, chainId]);
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
            `/dapps/tokencreation/pairDetail/${data.pairAddress}/${data.token0}/${data.token1}`
          );
        }}
      />
    );
  };
  return (
    <div className="launch-manage-pair">
      {loading ? (
        <>
          <ToLaunchHeader />
          <PageHeader
            className="launch-manage-token-header"
            title={router?.name}
          />
          <TokenItem
            data={{ title: t('token.can'), address: router?.address }}
            onClick={() => {
              history(
                `/dapps/tokencreation/tokenDetail/${router?.address}/${router?.id}`
              );
            }}
          />
          <div
            style={{ height: '330px', overflow: 'overlay',overflowX:'hidden' }}
            className="mint-scroll"
          >
            <InfiniteScrollPage
              data={data}
              next={changePage}
              items={items}
              nextLoad={nextLoad}
              no={t('token.noPair')}
              scrollableTarget={'launchTokenList'}
            />
          </div>
        </>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
    </div>
  );
}

export default ManagePairListAndContract;
