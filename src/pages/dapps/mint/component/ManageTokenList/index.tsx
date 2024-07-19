import PageHeader from '../PageHeader';
import ToLaunchHeader from '../ToLaunchHeader';
import TokenItem, { ItemDataType } from '../TokenItem';
import './index.less';

function ManageTokenList() {
  const data = [
    {
      title: '123',
      desc: '123',
      tips: '123',
      remark: '123',
    },
    {
      title: '123',
      desc: '123',
      tips: '123',
      remark: '123',
    },
    {
      title: '123',
      desc: '123',
      tips: '123',
      remark: '123',
    },
    {
      title: '123',
      desc: '123',
      tips: '123',
      remark: '123',
    },
  ];
  return (
    <>
      <ToLaunchHeader />
      <PageHeader className="launch-manage-token-header" title={'代币管理'} />
      <div className="mint-scroll scroll">
        {data.map((item: ItemDataType) => (
          <TokenItem data={item} onClick={() => console.log('0')} />
        ))}
      </div>
    </>
  );
}

export default ManageTokenList;
