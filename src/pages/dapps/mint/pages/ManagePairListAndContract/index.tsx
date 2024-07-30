import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import TokenItem from '../../component/TokenItem';
import Request from '@/components/axios';
import { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout';
import Cookies from 'js-cookie';

function ManagePairListAndContract() {
  const { chainId } = useContext(CountContext);
  const { getAll } = Request();
  const [search] = useSearchParams();
  const history = useNavigate();
  const tokenSymbol = search.get('t');
  const address = search.get('add');
  const contractId = search.get('cId');
  const token = Cookies.get('token');
  const [data, setData] = useState([]);

  const getTokenPairList = async () => {
    const { data } = await getAll({
      method: 'get',
      url: '/api/v1/launch-bot/pairs',
      data: {
        contractId,
      },
      token,
      chainId,
    });
    if (data.list) {
      setData(data.list);
    }
  };

  useEffect(() => {
    // getContractDetail();
    getTokenPairList();
  }, [chainId]);

  return (
    <>
      <ToLaunchHeader />
      <PageHeader className="launch-manage-token-header" title={tokenSymbol} />
      <TokenItem
        data={{ title: '合约', address }}
        onClick={() => {
          history(`/dapps/mint/tokenDetail?add=${address}&cId=${contractId}`);
        }}
      />
      {data?.map?.((item) => (
        <TokenItem
          data={{
            title: `${item.token0}/${item.token1}`,
            ...item,
          }}
          onClick={(data) => {
            history(
              `/dapps/mint/pairDetail?add=${data.pairAddress}&t0=${data.token0}&t1=${data.token1}`
            );
          }}
        />
      ))}
    </>
  );
}

export default ManagePairListAndContract;
