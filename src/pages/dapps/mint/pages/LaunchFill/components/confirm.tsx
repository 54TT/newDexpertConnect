import React,{ useContext } from 'react';
import './index.less';
import { MintContext } from '../../../index';
const InfoList = React.lazy(() => import('../../../component/InfoList'));
function ConfirmPage() {
  const { formData } = useContext(MintContext);
  return (
    <div className="mint-confirm">
      <InfoList
        data={Object.keys(formData).map((key) => ({
          label: key,
          value: formData[key],
        }))}
      />
    </div>
  );
}

export default ConfirmPage;
