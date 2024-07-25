import { Button, ConfigProvider, Input, InputNumber, Modal } from 'antd';
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
import CommonModal from '@/components/CommonModal';

function ManageTokenDetail() {
  const { chainId, loginProvider } = useContext(CountContext);
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
  const [, setLoadingPage] = useState(false);
  const [openTradeModal, setOpenTradeModal] = useState(false);
  const [ethBalance, setEthBalance] = useState('0');
  const [ethAmount, setEthAmount] = useState(0);
  const [, setTokenBalance] = useState('0');

  // 按钮正在执行状态
  const [openTradeLoading, setOpenTradeLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [removeLimitLoading, setRemoveLimitLoading] = useState(false);
  const [renounceLoading, setRenounceLoading] = useState(false);
  const getContractDetail = async () => {
    const { data } = await getAll({
      method: 'get',
      url: `/api/v1/launch-bot/contract/${contractId}`,
      data: {},
      token,
      chainId,
    });
    if (data.isVerify === '1') {
      setIsVerify(true);
    }
    setTokenData(data);
  };

  useEffect(() => {
    getContractDetail();
  }, [chainId]);

  const initData = async () => {
    setLoadingPage(true);
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = web3Provider.getSigner();
    const walletAddress = await signer.getAddress();
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

    const ethWei = (await signer.getBalance()).toString();
    setEthBalance(ethers.utils.formatEther(ethWei));
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
    setVerifyLoading(true);
    try {
      const data = await getAll({
        method: 'post',
        url: '/api/v1/launch-bot/contract/verify',
        data: { contractId },
        token,
        chainId,
      });
      if (data.data.tx) {
        setVerifyLoading(false);
        setIsVerify(true);
      }
    } catch (e) {
      console.log(e);
    }
    setVerifyLoading(false);
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
      setRemoveLimitLoading(true);
      const tx = await erc20Contract.removeLimits();
      const recipent = await tx.wait();
      setRemoveLimitLoading(false);
      if (recipent === 1) {
        setIsRemoveLimit(true);
      }

      console.log(tx);
    } catch (e) {
      console.log(e);
    }
    setRemoveLimitLoading(false);
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
    if (ethAmount === 0 || ethAmount === null) {
      return;
    }
    setOpenTradeLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = web3Provider.getSigner();
    const walletAddress = await signer.getAddress();
    // const decimals = await erc20Contract.decimals();
    const tokenBalance = await erc20Contract.balanceOf(walletAddress);
    try {
      if (await approve(erc20Contract.address, tokenBalance)) {
        const tx = await erc20Contract.openTrading(BigNumber.from(10).pow(20), {
          value: ethers.utils.parseEther(ethAmount.toString()),
        });
        setOpenTradeModal(false);
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
        const recipent = await tx.wait();
        if (recipent === 1) {
          setOpenTradeLoading(false);
          setIsOpenTrade(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setOpenTradeLoading(false);
  };

  const renounceOwnerShip = async () => {
    if (!isOwn) return;
    try {
      const tx = await erc20Contract.renounceOwnership();
      const recipent = tx.wait();
      if (recipent === 1) {
        setRenounceLoading(false);
        setIsOwn(false);
      }
    } catch (e) {
      console.log(e);
    }
    setRenounceLoading(false);
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
            loading={verifyLoading}
            onClick={() => verifyingContract()}
          >
            Verify Contract {isVerify ? <CheckOutlined /> : ''}
          </Button>
          <Button
            type={isOpenTrade ? 'primary' : 'default'}
            ghost
            loading={openTradeLoading}
            onClick={() => {
              if (!isOwn) return;
              if (isOpenTrade) return;
              setOpenTradeModal(true);
            }}
          >
            Open Trade {isOpenTrade ? <CheckOutlined /> : ''}
          </Button>
          <Button
            type={isRemoveLimit ? 'primary' : 'default'}
            ghost
            loading={removeLimitLoading}
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
          loading={renounceLoading}
          text="Renounce OwnerShip"
          className=""
          onClick={() => {
            renounceOwnerShip();
          }}
        />
      ) : (
        <></>
      )}
      <CommonModal
        className="open-trade-modal"
        open={openTradeModal}
        footer={null}
        title="Open Trade"
        onCancel={() => setOpenTradeModal(false)}
      >
        <div>
          <InputNumber
            value={ethAmount}
            addonAfter="ETH"
            onChange={(v) => {
              setEthAmount(v);
            }}
          />
          <div
            style={{ color: '#fff', marginTop: '6px' }}
          >{`ETH Balance: ${ethBalance}`}</div>
        </div>
        <BottomButton
          text="Open Trade"
          loading={openTradeLoading}
          onClick={() => {
            openTrade();
          }}
        />
      </CommonModal>
    </>
  );
}

export default ManageTokenDetail;
