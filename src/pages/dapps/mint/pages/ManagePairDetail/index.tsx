import { useSearchParams } from 'react-router-dom';
import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
function ManagePairDetail() {
  const [search] = useSearchParams();
  const token0 = search.get('t0');
  const token1 = search.get('t1');
  // const pairAddress = search.get('add');
  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={`${token0}/${token1}`}
      />
      <InfoList
        className="manage-token-detail-info"
        data={[{ label: '!23123', value: '!23123' }]}
      />
      <div className="pair-manage-button">
        <BottomButton text="LockLP" onClick={() => {}} />
        <BottomButton
          className=""
          ghost
          danger
          text="RemoveLP"
          onClick={() => {}}
        />
        <BottomButton
          className=""
          ghost
          danger
          text="BurnLP"
          onClick={() => {}}
        />
      </div>
    </>
  );
}

export default ManagePairDetail;
