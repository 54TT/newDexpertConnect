import { useContext, useState } from 'react';
import BottomButton from '../../component/BottomButton';
import PageHeader from '../../component/PageHeader';
import './index.less';
import { MintContext } from '../..';
import Request from '@/components/axios';
import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
import { ethers } from 'ethers';
import InfoList from '../../component/InfoList';
import { useNavigate } from 'react-router-dom';
import { toWeiWithDecimal } from '@utils/convertEthUnit';
function ConfirmPage() {
  const { formData } = useContext(MintContext);
  const { loginProvider, chainId, contractConfig } = useContext(CountContext);
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getAll } = Request();
  const token = Cookies.get('token');
  const getByteCode = async () =>
    await getAll({
      method: 'post',
      url: '/api/v1/launch-bot/contract',
      data: formData,
      token,
      chainId,
    });

  const reportDeploy = async (data: {
    contractId: string;
    contractAddress: string;
    deployTx: string;
  }) => {
    await getAll({
      method: 'post',
      url: '/api/v1/launch-bot/contract/deploy',
      data,
      token,
      chainId,
    });
  };

  const deployContract = async () => {
    setLoading(true);
    try {
      const { data } = await getByteCode();
      const { decimals, launchFee } = contractConfig;
      const { bytecode, metadataJson, contractId } = data;
      const ethersProvider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await ethersProvider.getSigner();
      const abi = JSON.parse(metadataJson).output.abi;
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
      // 先默认使用手续费版本
      const { deployTransaction, address } = await contractFactory.deploy(0, {
        value: toWeiWithDecimal(launchFee, decimals),
      });
      reportDeploy({
        contractAddress: address,
        contractId,
        deployTx: deployTransaction.hash,
      });
      await deployTransaction.wait();
      history('/dapps/mint/manageToken');
    } catch (e) {
      console.log(e);
      return null;
    }
    setLoading(false);
  };

  return (
    <div className="mint-confirm">
      <PageHeader title="Launch" desc="确认" />
      <InfoList
        data={Object.keys(formData).map((key) => ({
          label: key,
          value: formData[key],
        }))}
      />
      {/* <div className="confirm-info mint-scroll">
        {Object.keys(formData).map((key) => (
          <div key={key} className="confirm-info-item">
            <span>{key}：</span>
            <span>{formData[key]}</span>
          </div>
        ))}
      </div> */}
      <BottomButton
        loading={loading}
        text="创建代币"
        bottom
        onClick={deployContract}
      />
    </div>
  );
}

export default ConfirmPage;
