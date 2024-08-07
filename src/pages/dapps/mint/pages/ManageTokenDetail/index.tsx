import { Button, ConfigProvider, InputNumber } from 'antd';
import React,{ useContext, useEffect, useMemo, useState } from 'react';
const BottomButton = React.lazy(() => import('../../component/BottomButton'));

const InfoList = React.lazy(() => import('../../component/InfoList'));

const PageHeader = React.lazy(() => import('../../component/PageHeader'));

const ToLaunchHeader = React.lazy(() => import('../../component/ToLaunchHeader'));

import './index.less';
import { useParams } from 'react-router-dom';
import Request from '@/components/axios';
const Loading = React.lazy(() => import('@/components/allLoad/loading'));
import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
import { LaunchERC20Abi } from '@abis/LaunchERC20Abi';
import { ethers } from 'ethers';
import NotificationChange from '@/components/message';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
const CommonModal = React.lazy(() => import('@/components/CommonModal'));
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
function ManageTokenDetail() {
  const history = useNavigate();
  const { t } = useTranslation();
  const router = useParams();
  const { chainId, loginProvider, browser } = useContext(CountContext);
  const [tokenData, setTokenData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    setIsLoading(false);
    if (router?.address && loginProvider) {
      initData();
    }
  }, [chainId,router?.address]);

  const initData = async () => {
    setLoadingPage(true);
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = web3Provider.getSigner();
    const walletAddress = await signer.getAddress();
    const tokenContract = new ethers.Contract(
      router?.address,
      LaunchERC20Abi,
      signer
    );
    setErc20Contract(tokenContract);
    const data = await Promise.all([
      tokenContract.owner(),
      tokenContract.balanceOf(walletAddress),
      tokenContract.IsRemoveLimits(),
      tokenContract.tradingOpen(),
      signer.getBalance(),getAll({
        method: 'get',
        url: `/api/v1/launch-bot/contract/${router?.id}`,
        data: {},
        token,
        chainId,
      })
    ]);
    setIsOwn(data[0] === walletAddress);
    setTokenBalance(data[1]);
    setIsRemoveLimit(data[2]);
    setIsOpenTrade(data[3]);
    const ethWei = (data[4]).toString();
    if (data[5]?.data?.isVerify === '1') {
      setIsVerify(true);
    }
    setEthBalance(ethers.utils.formatEther(ethWei));
    setTokenData(data[5]?.data);
    setIsLoading(true);
    setLoadingPage(true);
  };
  const tokenInfoData = useMemo(() => {
    if (!tokenData) return [];
    return [
      {
        label: 'Address',
        value: tokenData.tokenAddress,
      },
      {
        label: 'symbol',
        value: tokenData.tokenSymbol,
      },
      {
        label: 'name',
        value: tokenData.tokenName,
      },
      {
        label: 'totalSupply',
        value: tokenData.TotalSupply,
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
        data: { contractId: router?.id },
        token,
        chainId,
      });
      if (data?.data?.tx) {
        setVerifyLoading(false);
        setIsVerify(true);
      }
    } catch (e) {
      setVerifyLoading(false);
      return null;
    }
    setVerifyLoading(false);
  };

  const removeLimit = async () => {
    if (!isOwn) return;
    if (isRemoveLimit) return;
    try {
      const tx = await erc20Contract.removeLimits();
      const recipent = await tx.wait();
      if (tx?.hash && recipent) {
        history('/dapps/tokencreation/result/' + tx?.hash + '/removeLimits');
      }
    } catch (e) {
      setRemoveLimitLoading(false);
      return null;
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
    if (ethAmount === 0 || ethAmount === null) {
      return;
    }
    setOpenTradeLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = web3Provider.getSigner();
    const walletAddress = await signer.getAddress();
    // const decimals = await erc20Contract.decimals();
    const tokenBalance = await erc20Contract.balanceOf(walletAddress);
    const tt = await approve(erc20Contract.address, tokenBalance);
    try {
      if (tt) {
        const tx = await erc20Contract.openTrading(tokenBalance, {
          value: ethers.utils.parseEther(ethAmount.toString()),
        });
        setOpenTradeModal(false);
        await getAll({
          method: 'post',
          url: '/api/v1/launch-bot/tx/status/check',
          data: {
            tx: tx.hash,
            txType: '7',
            txTableId: router?.id,
          },
          token,
          chainId,
        });
        const recipent = await tx.wait();
        if (recipent.status === 1) {
          setOpenTradeLoading(false);
          setIsOpenTrade(true);
        }
        setOpenTradeLoading(false);
      }
    } catch (e) {
      setOpenTradeLoading(false);
      NotificationChange('warning', t('Dapps.Insufficient Fund'));
      return null;
    }
  };

  const renounceOwnerShip = async () => {
    if (!isOwn) return;
    try {
      const tx = await erc20Contract.renounceOwnership();
      const recipent = await tx.wait();
      if (tx?.hash && recipent) {
        history(
          '/dapps/tokencreation/result/' + tx?.hash + '/renounceOwnership'
        );
      }
    } catch (e) {
      setRenounceLoading(false);
      return null;
    }
  };
  return (
    <div className="manage-tokenBox">
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={tokenData?.tokenSymbol || '-'}
      />
      {isLoading ? (
        <InfoList className="manage-token-detail-info" data={tokenInfoData} />
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      {!isLoading && <div style={{ width: '100%', height: '20px' }}></div>}
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
            iconPosition={'end'}
            className={isVerify ? 'buttonBackActi' : 'buttonBack'}
            ghost
            icon={
              isVerify ? (
                <CheckCircleOutlined style={{ marginLeft: '8px' }} />
              ) : (
                <RightOutlined style={{ marginLeft: '8px' }} />
              )
            }
            loading={verifyLoading}
            onClick={() => verifyingContract()}
          >
            {t('token.Verify')}
          </Button>
          <Button
            iconPosition={'end'}
            className={!isOwn ? 'buttonBackActi' : 'buttonBack'}
            ghost
            icon={
              !isOwn ? (
                <CheckCircleOutlined style={{ marginLeft: '8px' }} />
              ) : (
                <RightOutlined style={{ marginLeft: '8px' }} />
              )
            }
            loading={renounceLoading}
            onClick={() => {
              setRenounceLoading(true);
              renounceOwnerShip();
            }}
          >
            {t('token.Renounce')}
          </Button>
          <Button
            iconPosition={'end'}
            className={isRemoveLimit ? 'buttonBackActi' : 'buttonBack'}
            ghost
            icon={
              isRemoveLimit ? (
                <CheckCircleOutlined style={{ marginLeft: '8px' }} />
              ) : (
                <RightOutlined style={{ marginLeft: '8px' }} />
              )
            }
            loading={removeLimitLoading}
            onClick={() => {
              setRemoveLimitLoading(true);
              removeLimit();
            }}
          >
            {t('token.Remove')}
          </Button>
        </div>
      </ConfigProvider>
      <BottomButton
        ghost
        bottom
        classname={isOpenTrade ? 'openTradeSelect' : 'openTrade'}
        loading={openTradeLoading}
        icon={
          isOpenTrade ? (
            <CheckCircleOutlined style={{ marginLeft: '8px' }} />
          ) : (
            <RightOutlined style={{ marginLeft: '8px' }} />
          )
        }
        text={<div>{t('token.Open')}</div>}
        onClick={() => {
          if (!isOwn) return;
          if (isOpenTrade) return;
          setOpenTradeModal(true);
        }}
      />
      <CommonModal
        className="mint-common-modal"
        open={openTradeModal}
        footer={null}
        title={t('token.Open')}
        onCancel={() => setOpenTradeModal(false)}
      >
        <div>
          <InputNumber
            value={ethAmount}
            addonAfter="ETH"
            controls={false}
            stringMode={true}
            onChange={(v) => {
              setEthAmount(v);
            }}
          />
          <div
            style={{ color: '#fff', marginTop: '6px' }}
          >{`ETH ${t('token.Banlance')}: ${ethBalance}`}</div>
        </div>
        <BottomButton
          text={t('token.Open')}
          loading={openTradeLoading}
          onClick={() => {
            openTrade();
          }}
        />
      </CommonModal>
      <p className="hint">{t('token.note')}</p>
    </div>
  );
}

export default ManageTokenDetail;
