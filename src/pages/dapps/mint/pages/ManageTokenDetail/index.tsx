import { InputNumber } from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';

import './index.less';
import { useParams } from 'react-router-dom';
import Request from '@/components/axios';
import Loading from '@/components/allLoad/loading';
import Cookies from 'js-cookie';
import { CountContext } from '@/Layout';
import { LaunchERC20Abi } from '@abis/LaunchERC20Abi';
import { ethers } from 'ethers';
import NotificationChange from '@/components/message';
import CommonModal from '@/components/CommonModal';
import { useTranslation } from 'react-i18next';
import Button from './component/button';
function ManageTokenDetail() {
  const { t } = useTranslation();
  const router = useParams();
  const { chainId, loginProvider, browser, contractConfig } =
    useContext(CountContext);
  const [tokenData, setTokenData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { getAll } = Request();
  const token = Cookies.get('token');
  const [erc20Contract, setErc20Contract] = useState<ethers.Contract>();
  const [isVerify, setIsVerify] = useState(false);
  const [isOpenTrade, setIsOpenTrade] = useState(false);
  const [isRemoveLimit, setIsRemoveLimit] = useState(false);
  const [isOwn, setIsOwn] = useState(true);
  const [openTradeModal, setOpenTradeModal] = useState(false);
  const [ethBalance, setEthBalance] = useState('0');
  const [ethAmount, setEthAmount] = useState(0);
  // 按钮正在执行状态
  const [openTradeLoading, setOpenTradeLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    if (
      router?.address &&
      loginProvider &&
      contractConfig?.chainId === Number(chainId)
    ) {
      initData();
    }
  }, [chainId, router?.address, contractConfig]);

  const initData = async () => {
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
      signer.getBalance(),
      await getAll({
        method: 'get',
        url: `/api/v1/launch-bot/contract/${router?.id}`,
        data: {},
        token,
        chainId,
      }),
    ]);
    setIsOwn(data[0] === walletAddress);
    setIsRemoveLimit(data[2]);
    setIsOpenTrade(data[3]);
    const ethWei = data[4].toString();
    if (data[5]?.data?.isVerify === '1') {
      setIsVerify(true);
    }
    setEthBalance(ethers.utils.formatEther(ethWei));
    setTokenData(data[5]?.data);
    setIsLoading(true);
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

  const buttonParams = {
    isVerify,
    setIsVerify,
    router,
    isOwn,
    erc20Contract,
    isRemoveLimit,
    setIsRemoveLimit,
    setOpenTradeModal,
    openTradeLoading,
    isOpenTrade,
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
      <Button {...buttonParams} />
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
            addonAfter={contractConfig?.tokenSymbol || 'ETH'}
            controls={false}
            stringMode={true}
            onChange={(v) => {
              setEthAmount(v);
            }}
          />
          <div
            style={{ color: '#fff', marginTop: '6px' }}
          >{`${contractConfig?.tokenSymbol || 'ETH'} ${t('token.Banlance')}: ${ethBalance}`}</div>
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
