import { Input, Select } from 'antd';
// import BottomButton from '../BottomButton';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
// import TokenItem, { ItemDataType } from '../TokenItem';
import './index.less';
import Request from '@/components/axios';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout';
import TokenItem from '../../component/TokenItem';
import { useNavigate } from 'react-router-dom';
const { Search } = Input;
interface TokenItemDataType {
  address: string;
  contractId: string;
  name: string;
  symbol: string;
}
function ManageTokenList() {
  const { chainId } = useContext(CountContext);
  const { getAll } = Request();
  const [data, setData] = useState([]);
  const history = useNavigate();
  // const data = [
  //   {
  //     title: '123',
  //     desc: '123',
  //     tips: '123',
  //     remark: '123',
  //   },
  //   {
  //     title: '123',
  //     desc: '123',
  //     tips: '123',
  //     remark: '123',
  //   },
  //   {
  //     title: '123',
  //     desc: '123',
  //     tips: '123',
  //     remark: '123',
  //   },
  //   {
  //     title: '123',
  //     desc: '123',
  //     tips: '123',
  //     remark: '123',
  //   },
  //   {
  //     title: '123',
  //     desc: '123',
  //     tips: '123',
  //     remark: '123',
  //   },
  // ];
  const getTokenList = async ({ page = 1, search = null }) => {
    const token = Cookies.get('token');
    const { data } = await getAll({
      method: 'get',
      url: '/api/v1/launch-bot/contract/list',
      data: {
        page,
        pageSize: 5,
        search,
      },
      token,
      chainId,
    });
    setData(data.data);
  };

  useEffect(() => {
    getTokenList({});
  }, [chainId]);

  return (
    <div className="launch-manage-token">
      <ToLaunchHeader />
      <PageHeader
        disabled={false}
        name={'tokenList'}
        className="launch-manage-token-header"
        title={'代币管理'}
      />
      <div className="launch-manage-token-search">
        <Search />
        <Select />
      </div>
      <div className="mint-scroll scroll">
        {data.map((item: TokenItemDataType) => (
          <TokenItem
            data={{
              title: item.symbol,
              desc: item.name,
              id: item.contractId,
              address: item.address,
            }}
            onClick={({ id, address, title }) =>
              history(
                `/dapps/mint/managePair?cId=${id}&add=${address}&t=${title}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ManageTokenList;
