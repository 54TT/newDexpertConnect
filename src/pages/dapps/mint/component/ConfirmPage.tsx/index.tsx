import { useContext, useState } from 'react';
import BottomButton from '../BottomButton';
import PageHeader from '../PageHeader';
import './index.less';
import { MintContext } from '../..';
import Request from '@/components/axios';
import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
import { BigNumber, ethers } from 'ethers';
function ConfirmPage() {
  const { formData } = useContext(MintContext);
  const { loginProvider } = useContext(CountContext);
  const [loading, setLoading] = useState(false);
  const { getAll } = Request();
  const token = Cookies.get('token');
  const getByteCode = async () =>
    await getAll({
      method: 'post',
      url: '/api/v1/launch-bot/contract',
      data: formData,
      token,
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
    });
  };

  const deployContract = async () => {
    setLoading(true);
    try {
      const { data } = await getByteCode();
      const { bytecode, metadataJson, contractId } = data;
      const ethersProvider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await ethersProvider.getSigner();
      const abi = JSON.parse(metadataJson).output.abi;
      const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
      // 先默认使用手续费版本
      const { deployTransaction, address } = await contractFactory.deploy(0, {
        value: BigNumber.from(0.08 * 10 ** 2).mul(BigNumber.from(10).pow(16)),
      });
      reportDeploy({
        contractAddress: address,
        contractId,
        deployTx: deployTransaction.hash,
      });
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="mint-confirm">
      <PageHeader title="Launch" desc="确认" />
      <div className="confirm-info mint-scroll">
        {Object.keys(formData).map((key) => (
          <div key={key} className="confirm-info-item">
            <span>{key}：</span>
            <span>{formData[key]}</span>
          </div>
        ))}
      </div>
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
