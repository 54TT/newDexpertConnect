import { useContext } from 'react';
import './index.less';
import { MintContext } from '../../../index';
import InfoList from '../../../component/InfoList';
function ConfirmPage() {
  const { formData } = useContext(MintContext);
  return (
    <div className="mint-confirm">
      <InfoList data={formData} />
    </div>
  );
}

export default ConfirmPage;
