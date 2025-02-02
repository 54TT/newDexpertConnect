import { useTokenInfo } from '@/hook/useTokenInfo';
import { CountContext } from '@/Layout';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import EditForm from '../LaunchFill/components/form';
import { useForm } from 'antd/es/form/Form';
import PageHeader from '../../component/PageHeader';
import { client } from '@/client';
import './index.less';
import { getContract } from 'thirdweb';
import { prepareContractCall } from 'thirdweb';
import BottomButton from '../../component/BottomButton';
import Loading from '@/components/allLoad/loading';
import Pass from '../LaunchFill/components/pass';
import { MintContext } from '../..';
import { StandardTokenFactoryAddress01Abi } from '@abis/StandardTokenFactoryAddress01Abi';
import { useSendTransaction } from 'thirdweb/react';

function ModifyForm() {
  const { t } = useTranslation();
  const history = useNavigate();
  const { address } = useParams();
  const { contractConfig, allChain } = useContext(CountContext);
  const [status, setStatus] = useState<'modify' | 'pass'>('modify');
  const [tokenInfo, tokenContract] = useTokenInfo(address);
  const { launchTokenPass, formData } = useContext(MintContext);
  const [form] = useForm();
  const [editLoading, setEditLoading] = useState(false);
  const { fees, level }: any = formData || {};
  const { standardTokenFactoryAddress01 } = contractConfig || {};
  const [updateData, setUpdateData] = useState();
  const contract = getContract({
    client,
    chain: allChain,
    address: standardTokenFactoryAddress01,
    abi: StandardTokenFactoryAddress01Abi as any,
  });

  const {
    mutate: sendTx,
    data: transactionResult,
    error: isError,
  } = useSendTransaction({
    payModal: false,
  });

  useEffect(() => {
    if (transactionResult?.transactionHash) {
      history(
        `/dapps/tokencreation/results/launch/${transactionResult?.transactionHash}`
      );
      setEditLoading(false);
    }
    if (isError) {
      setEditLoading(false);
    }
  }, [transactionResult, isError]);

  const handleSubmitForm = useCallback(async () => {
    setEditLoading(true);
    try {
      // 合约  tx
      const txsss: any = prepareContractCall({
        contract,
        method: 'updateTokenMetaData',
        params: [
          launchTokenPass === 'more' ? level : 0,
          tokenContract.address,
          updateData,
        ],
        value: launchTokenPass === 'more' ? fees : 0,
      });
      await sendTx(txsss);
    } catch (e) {
      setEditLoading(false);
    }
  }, [formData.fees, launchTokenPass]);

  return (
    <div className="mint-scroll scroll modify-form">
      <PageHeader
        className="launch-manage-token-header"
        title={t('mint.Smart')}
      />
      <div className="modify-form-content">
        <RenderContent
          tokenInfo={tokenInfo}
          status={status}
          form={form}
          setStatus={setStatus}
          setUpdateData={setUpdateData}
          handleSubmitForm={handleSubmitForm}
          editLoading={editLoading}
        />
      </div>
    </div>
  );
}

const RenderContent = ({
  tokenInfo,
  status,
  form,
  setUpdateData,
  setStatus,
  handleSubmitForm,
  editLoading,
}) => {
  const { t } = useTranslation();
  if (status === 'modify') {
    return tokenInfo ? (
      <>
        <EditForm
          form={form}
          formData={tokenInfo}
          onFinishForm={() => {}}
          update
        />
        <BottomButton
          text={t('mint.Amend')}
          onClick={async () => {
            const { name, symbol, totalSupply, ...metaData } =
              await form.getFieldsValue();
            setUpdateData(metaData);
            setStatus('pass');
          }}
        />
      </>
    ) : (
      <Loading></Loading>
    );
  }
  if (status === 'pass') {
    return (
      <div className="modify-form-content-pass">
        <Pass />
        <BottomButton
          text={t('mint.Amend ')}
          onClick={handleSubmitForm}
          loading={editLoading}
        />
      </div>
    );
  }
  return <></>;
};
export default ModifyForm;
