import { Button } from 'antd';
import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import { useSearchParams } from 'react-router-dom';
import Request from '@/components/axios';
import Cookies from 'js-cookie';
import { useContext, useEffect, useMemo, useState } from 'react';
import { CountContext } from '@/Layout';
import { LaunchERC20Abi } from '@abis/LaunchERC20Abi';
import { ethers } from 'ethers';

function ManageTokenDetail() {
  const { chainId, loginProvider } = useContext(CountContext);
  const [search] = useSearchParams();
  const contractId = search.get('cId');
  const [tokenData, setTokenData] = useState<any>();
  const address = search.get('add');
  const { getAll } = Request();
  const token = Cookies.get('token');
  const getContractDetail = async () => {
    const { data } = await getAll({
      method: 'get',
      url: `/api/v1/launch-bot/contract/${contractId}`,
      data: {},
      token,
      chainId,
    });
    console.log(data);
    setTokenData(data);
  };

  useEffect(() => {
    getContractDetail();
  }, [chainId]);

  const tokenInfoData = useMemo(() => {
    if (!tokenData) return [];
    return [
      {
        label: 'Address',
        value: tokenData.tokenAddress,
      },
      {
        label: 'Symbol',
        value: tokenData.tokenSymbol,
      },
      {
        label: 'Name',
        value: tokenData.tokenName,
      },
    ];
  }, [tokenData]);

  const verifyingContract = () => {
    getAll({
      method: 'post',
      url: '/api/v1/launch-bot/contract/verify',
      data: { contractId },
      token,
      chainId,
    });
  };

  const removeLimit = async () => {
    try {
      console.log();
      const web3Provider = new ethers.providers.Web3Provider(loginProvider);
      const signer = web3Provider.getSigner();
      const tokenContract = new ethers.Contract(
        address,
        LaunchERC20Abi,
        signer
      );
      const tx = await tokenContract.removeLimits();
      console.log(tx);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={tokenData?.tokenSymbol || ''}
      />
      <InfoList className="manage-token-detail-info" data={tokenInfoData} />
      <div className="manage-token-button_box">
        <Button onClick={() => verifyingContract()}>Verify Contract</Button>
        <Button>Open Trade</Button>
        <Button onClick={() => removeLimit()}>Remove Limits</Button>
      </div>
      <BottomButton bottom text="Renounce OwnerShip" onClick={() => {}} />
    </>
  );
}

export default ManageTokenDetail;
