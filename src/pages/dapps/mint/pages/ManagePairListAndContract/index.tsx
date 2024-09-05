import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';

import TokenItem from '../../component/TokenItem';
import { CountContext } from '@/Layout';
import './index.less';
import InfiniteScrollPage from '@/components/InfiniteScroll';
import Loading from '@/components/allLoad/loading';
import { useTranslation } from 'react-i18next';
// import { ethers } from 'ethers';
// import getPairByV2Factory from '@utils/getPairByV2Factory';
function ManagePairListAndContract() {
  const { t } = useTranslation();
  const router = useParams();
  // loginProvider
  const { chainId, browser, contractConfig } = useContext(CountContext);
  // const { getAll } = Request();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isNext, _] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const [page, setPage] = useState(1);
  // const token = Cookies.get('token');
  const [data, setData] = useState([]);
  console.log(data);
  const getTokenPairList = async () => {
    // const { uniswapV2FactoryAddress, wethAddress } = contractConfig;
    // const provider = new ethers.providers.Web3Provider(loginProvider);
    // const signer = await provider.getSigner();
    // const pairAddress = await getPairByV2Factory({
    //   factoryAddress: uniswapV2FactoryAddress,
    //   token0: router?.address,
    //   token1: wethAddress,
    //   signer,
    // });
    const pairAddress = 0;
    if (pairAddress) {
      setData([]);
      // setData([
      //   {
      //     pairAddress,
      //     token0: router.name,
      //     token1: 'W' + contractConfig.tokenSymbol,
      //   },
      // ]);
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
    getTokenPairList();
    setLoading(false);
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
            style={{
              height: '330px',
              overflow: 'overlay',
              overflowX: 'hidden',
            }}
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
