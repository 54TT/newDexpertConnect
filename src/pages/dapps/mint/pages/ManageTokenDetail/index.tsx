import { Button, ConfigProvider, Modal } from 'antd';
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
import { BigNumber, ethers } from 'ethers';
import { CheckOutlined } from '@ant-design/icons';

function ManageTokenDetail() {
  const { chainId, loginProvider, contractAddress } = useContext(CountContext);
  const [search] = useSearchParams();
  const contractId = search.get('cId');
  const [tokenData, setTokenData] = useState<any>();
  const address = search.get('add');
  const { getAll } = Request();
  const token = Cookies.get('token');
  const [erc20Contract, setErc20Contract] = useState<ethers.Contract>();
  const [isVerify, setIsVerify] = useState(false);
  const [isOpenTrade, setIsOpenTrade] = useState(false);
  const [isRemoveLimit, setIsRemoveLimit] = useState(false);
  const [isOwn, setIsOwn] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [ethAmount, setEthAmount] = useState('0');
  const [tokenAmount, setTokenAmoun] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const getContractDetail = async () => {
    const { data } = await getAll({
      method: 'get',
      url: `/api/v1/launch-bot/contract/${contractId}`,
      data: {},
      token,
      chainId,
    });
    setTokenData(data);
  };

  useEffect(() => {
    getContractDetail();
  }, [chainId]);

  const initData = async () => {
    setLoadingPage(true);
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = web3Provider.getSigner();
    const walletAddress = signer.getAddress();
    const tokenContract = new ethers.Contract(address, LaunchERC20Abi, signer);
    setErc20Contract(tokenContract);

    const isOwn = (await tokenContract.owner()) === walletAddress;
    setIsOwn(isOwn);

    const balance = await tokenContract.balanceOf(walletAddress);
    setTokenBalance(balance);

    const IsRemoveLimits = await tokenContract.IsRemoveLimits();
    setIsRemoveLimit(IsRemoveLimits);

    const IsTradeOpen = await tokenContract.tradingOpen();
    setIsOpenTrade(IsTradeOpen);
    setLoadingPage(true);
  };

  useEffect(() => {
    if (address && loginProvider) {
      initData();
    }
  }, [address, loginProvider]);

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

  const verifyingContract = async () => {
    if (!isOwn) return;
    if (isVerify) return;
    await getAll({
      method: 'post',
      url: '/api/v1/launch-bot/contract/verify',
      data: { contractId },
      token,
      chainId,
    });
  };

  const removeLimit = async () => {
    if (!isOwn) return;
    if (isRemoveLimit) return;
    try {
      // const web3Provider = new ethers.providers.Web3Provider(loginProvider);
      // const signer = web3Provider.getSigner();
      // const tokenContract = new ethers.Contract(
      //   address,
      //   LaunchERC20Abi,
      //   signer
      // );
      const tx = await erc20Contract.removeLimits();
      console.log(tx);
    } catch (e) {
      console.log(e);
    }
  };

  const approve = async (spender, amount) => {
    const tx = await erc20Contract.approve(spender, amount);
    const recipent = await tx.wait();
    // 1成功 2失败
    return recipent.status === 1;
  };

  const openTrade = async () => {
    if (!isOwn) return;
    if (isOpenTrade) return;
    const decimals = await erc20Contract.decimals();
    const totalSupply = await erc20Contract.totalSupply();
    const maxCount = BigNumber.from(totalSupply).mul(
      BigNumber.from(10).pow(decimals)
    );
    if (await approve(erc20Contract.address, maxCount)) {
      const tx = await erc20Contract.openTrading(BigNumber.from(10).pow(20), {
        value: ethers.utils.parseEther('0.01'),
      });
      await getAll({
        method: 'post',
        url: '/api/v1/launch-bot/tx/status/check',
        data: {
          tx: tx.hash,
          txType: '7',
          txTableId: contractId,
        },
        token,
        chainId,
      });
    }
  };

  const renounceOwnerShip = async () => {
    if (!isOwn) return;
    const tx = await erc20Contract.renounceOwnership();
    console.log(tx);
  };

  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={tokenData?.tokenSymbol || '-'}
      />
      <InfoList className="manage-token-detail-info" data={tokenInfoData} />
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultGhostBorderColor: 'rgba(255, 255, 255, 0.55)',
              defaultGhostColor: 'rgba(255, 255, 255, 0.55)',
            },
          },
        }}
      >
        <div className={`manage-token-button_box ${isOwn ? '' : 'not-owner'}`}>
          <Button
            type={isVerify ? 'primary' : 'default'}
            ghost
            onClick={() => verifyingContract()}
          >
            Verify Contract {isVerify ? <CheckOutlined /> : ''}
          </Button>
          <Button
            type={isOpenTrade ? 'primary' : 'default'}
            ghost
            onClick={() => openTrade()}
          >
            Open Trade {isOpenTrade ? <CheckOutlined /> : ''}
          </Button>
          <Button
            type={isRemoveLimit ? 'primary' : 'default'}
            ghost
            onClick={() => removeLimit()}
          >
            Remove Limits {isRemoveLimit ? <CheckOutlined /> : ''}
          </Button>
        </div>
      </ConfigProvider>
      {isOwn ? (
        <BottomButton
          ghost
          danger
          bottom
          text="Renounce OwnerShip"
          className=""
          onClick={() => {
            renounceOwnerShip();
          }}
        />
      ) : (
        <></>
      )}
      <Modal></Modal>
    </>
  );
}

export default ManageTokenDetail;
