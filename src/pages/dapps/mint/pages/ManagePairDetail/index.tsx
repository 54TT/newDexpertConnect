import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';

function ManagePairDetail() {
  return (
    <>
      <ToLaunchHeader />
      <PageHeader className="launch-manage-token-header" title={'123123'} />
      <InfoList
        className="manage-token-detail-info"
        data={[{ label: '!23123', value: '!23123' }]}
      />
      <BottomButton text="Renounce OwnerShip" onClick={() => {}} />
      <BottomButton text="Renounce OwnerShip" onClick={() => {}} />
    </>
  );
}

export default ManagePairDetail;
