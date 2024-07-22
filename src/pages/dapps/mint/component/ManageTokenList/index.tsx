import { Input } from 'antd';
// import BottomButton from '../BottomButton';
import PageHeader from '../PageHeader';
import ToLaunchHeader from '../ToLaunchHeader';
// import TokenItem, { ItemDataType } from '../TokenItem';
import './index.less';
import Request from '@/components/axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
function ManageTokenList() {
  const { getAll } = Request();
  // const history = useNavigate();
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
  const getTokenList = async ({ page = 1, key = '0', search = null }) => {
    const token = Cookies.get('token');
    const { data } = await getAll({
      method: 'get',
      url: '/api/v1/launch-bot/contract/list',
      data: {
        page,
        pageSize: 5,
        key,
        search,
      },
      token,
    });
    console.log(data);
  };

  useEffect(() => {
    getTokenList({});
  }, []);

  return (
    <div className="launch-manage-token">
      <ToLaunchHeader />
      <PageHeader className="launch-manage-token-header" title={'代币管理'} />
      <Input />
      <div className="mint-scroll scroll">
        {/* {data.map((item: ItemDataType) => (
          <TokenItem
            data={item}
            onClick={({ contractId, address }) =>
              history(`/dapps/mint/managePair?cId=${contractId}&add=${address}`)
            }
          />
        ))} */}
      </div>
    </div>
  );
}

export default ManageTokenList;
