import { useTokenInfo } from '@/hook/useTokenInfo';
import { CountContext } from '@/Layout';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditForm from '../LaunchFill/components/form';
import { useForm } from 'antd/es/form/Form';
import PageHeader from '../../component/PageHeader';

import './index.less';
import { Button } from 'antd';
import BottomButton from '../../component/BottomButton';
import NotificationChange from '@/components/message';
import Loading from '@/components/allLoad/loading';

function ModifyForm() {
  const { address } = useParams();
  const { signer } = useContext(CountContext);
  const [tokenInfo, tokenContract, reset] = useTokenInfo(address);
  const [form] = useForm();
  const [editLoading, setEditLoading] = useState(false);

  const handleSubmitForm = async () => {
    setEditLoading(true);
    console.log(tokenInfo);
    try {
      const { name, symbol, totalSupply, ...metaData } =
        await form.getFieldsValue();
      console.log(metaData);
      const tx = await tokenContract.updateTokenMetaData(metaData);
      const recipent = tx.wait();
      if (recipent.status === 1) {
        reset();
        setEditLoading(false);
        NotificationChange('success,', '修改成功');
      }
    } catch (e) {
      console.error(e);
      setEditLoading(false);
    }
  };

  return (
    <div className="mint-scroll scroll modify-form">
      <PageHeader className="launch-manage-token-header" title="代币信息" />
      {tokenInfo ? (
        <>
          <EditForm
            form={form}
            formData={tokenInfo}
            onFinishForm={() => {}}
            update
          />
          <BottomButton text={'修改'} onClick={handleSubmitForm} />
        </>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
}

export default ModifyForm;
