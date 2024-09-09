import { Button, InputNumber } from 'antd';
import { useContext, useEffect, useState } from 'react';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@/components/allLoad/loading';
import { tokenFactoryERC20Abi } from '@abis/tokenFactoryERC20Abi';
import { CountContext } from '@/Layout';
import NotificationChange from '@/components/message';
import CommonModal from '@/components/CommonModal';
import { useTranslation } from 'react-i18next';
import ActionButton from './component/button';
import { useTokenInfo } from '@/hook/useTokenInfo';
import PairInfo, { PairInfoPropsType } from '@/components/PairInfo';
import { client } from '@/client';
import { toEthWithDecimal } from '@utils/convertEthUnit';
import {
  sendAndConfirmTransaction,
  prepareContractCall,
  toWei,
} from 'thirdweb';
import Decimal from 'decimal.js';
import { useReadContract } from 'thirdweb/react';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { getContract } from 'thirdweb';

function ManageTokenDetail() {
  const { t } = useTranslation();
  const router = useParams();
  const { browser, contractConfig, signer } = useContext(CountContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerify, setIsVerify] = useState(false);
  const [isOpenTrade, setIsOpenTrade] = useState(false);
  const [isRemoveLimit, setIsRemoveLimit] = useState(false);
  const [isOwn, setIsOwn] = useState(true);
  const [openTradeModal, setOpenTradeModal] = useState(false);
  const [ethBalance, setEthBalance] = useState('0');
  const [ethAmount, setEthAmount] = useState('0');
  const [tokenInfo, tokenContract] = useTokenInfo(router.address);
  const [pairAddress, setPairAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  // 按钮正在执行状态
  const [openTradeLoading, setOpenTradeLoading] = useState(false);
  const [removeOwnShipLoading, setRemoveOwnShipLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const [removeOwnShipModal, setRemoveOwnShipModal] = useState(false);
  const history = useNavigate();
  // 生成合约
  const contract = getContract({
    client,
    chain: activeChain,
    address: router?.address,
    abi: tokenFactoryERC20Abi as any,
  });
  // 获取balance
  const { data: balanceOf, isLoading: isBalanceOf } = useReadContract({
    contract,
    method: 'balanceOf',
    params: [activeAccount?.address],
  });
  // 获取decimals
  const { data: decimalsOf, isLoading: isDecimals } = useReadContract({
    contract,
    method: 'decimals',
    params: [],
  });
  useEffect(() => {
    if (tokenInfo) {
      initData();
    }
  }, [tokenInfo, signer]);

  const initData = async () => {
    // @ts-ignore
    const { isOpenTrade, owner, pair } = tokenInfo;

    const address: string = await signer.getAddress();
    const ethBalance = await signer.getBalance();
    console.log(address);
    console.log(tokenInfo);
    if (address.toLowerCase() === owner.toLowerCase()) {
      setIsOwn(true);
    } else {
      setIsOwn(false);
    }
    const balance = await tokenContract.balanceOf(address);
    setEthBalance(toEthWithDecimal(ethBalance, contractConfig.decimals));
    setTokenBalance(toEthWithDecimal(balance, tokenInfo.decimals));
    setIsOpenTrade(isOpenTrade);
    setPairAddress(pair);
    setIsLoading(false);
  };

  const openTrade = async () => {
    if (!isOwn) return;
    if (isOpenTrade) return;
    if (ethAmount === '0' || ethAmount === null) {
      return;
    }
    setOpenTradeLoading(true);
    const ttt = new Decimal(balanceOf?.toString()).div(
      new Decimal(10).pow(decimalsOf?.toString())
    );
    try {
      if (!isBalanceOf && !isDecimals) {
        // 合约 授权   approve
        const tx: any = prepareContractCall({
          contract,
          method: 'approve',
          params: [router?.address, toWei(ttt?.toString())],
        });
        const transactionReceipt = await sendAndConfirmTransaction({
          account: activeAccount,
          transaction: tx,
        });
        if (transactionReceipt?.status === 'success') {
          // 合约   opentrad
          const openTradingTx: any = prepareContractCall({
            contract,
            method: 'openTrading',
            params: [Number(ttt?.toString())],
            value: toWei(ethAmount.toString()),
          });
          const openTradingts: any = await sendAndConfirmTransaction({
            account: activeAccount,
            transaction: openTradingTx,
          });
          console.log(openTradingts);
          history(
            `/dapps/tokencreation/results/opentrade?tx=${openTradingts?.hash}&status=pending`
          );
        }
      }
    } catch (e) {
      setOpenTradeLoading(false);
      NotificationChange('warning', t('Dapps.Insufficient Fund'));
      return null;
    }
  };
  const renounceOwnerShip = async () => {
    if (!isOwn) return;
    setRemoveOwnShipLoading(true);
    setRemoveOwnShipModal(false);
    try {
      const tx = await tokenContract.renounceOwnership();
      history(
        `/dapps/tokencreation/results/renounce?tx=${tx?.hash}&status=pending`
      );
    } catch (e) {
      setRemoveOwnShipLoading(false);
      NotificationChange('error', t('token.renounceOwnershipfailed'));
      return null;
    }
  };

  const pairInfoData: PairInfoPropsType = {
    token0: {
      logo: tokenInfo?.logoLink,
      symbol: tokenInfo?.symbol,
    },
    token1: {
      logo: contractConfig?.wethLogo,
      symbol: contractConfig?.tokenSymbol,
    },
  };

  const buttonParams = {
    isVerify,
    setIsVerify,
    router,
    isOwn,
    tokenContract,
    isRemoveLimit,
    setIsRemoveLimit,
    setOpenTradeModal,
    openTradeLoading,
    isOpenTrade,
    setIsOwn,
    setRemoveOwnShipModal,
    pairInfoData,
    removeOwnShipLoading,
  };

  return (
    <div className="manage-tokenBox">
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={t('mint.Management')}
      />
      {!isLoading ? (
        <InfoList className="manage-token-detail-info" data={tokenInfo} />
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      {isLoading && <div style={{ width: '100%', height: '20px' }}></div>}
      {!isLoading && (
        <ActionButton
          {...buttonParams}
          clickToPair={() =>
            history(
              `/dapps/tokencreation/pairDetail/${pairAddress}/${tokenInfo.symbol}/${contractConfig.tokenSymbol}`
            )
          }
        />
      )}
      <CommonModal
        width={380}
        className="mint-common-modal"
        open={openTradeModal}
        footer={null}
        closeIcon={null}
        title={<div className="disCen">{t('mint.Open')}</div>}
        onCancel={() => setOpenTradeModal(false)}
      >
        <PairInfo data={pairInfoData} />
        <div className="pair-info-token" style={{ marginBottom: '0' }}>
          <span>{pairInfoData.token0.symbol}</span>
          <span>{tokenBalance || '-'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img style={{ width: '28px' }} src="/pair-arrow.svg" alt="" />
        </div>
        <div className="pair-info-token">
          <span>{pairInfoData.token1.symbol}</span>
          <span>{ethAmount || '-'}</span>
        </div>
        <div className="open-trade-input">
          <div
            style={{
              textAlign: 'end',
              marginBottom: '12px',
              fontSize: '18px',
              color: 'rgba(139, 139, 139, 1)',
            }}
          >
            Balance: {ethBalance}
          </div>
          <InputNumber
            value={ethAmount}
            addonAfter={
              <div>
                <span>{contractConfig?.tokenSymbol || 'ETH'}</span>
                <Button
                  className="action-button piar-input-button"
                  ghost
                  onClick={() => setEthAmount(ethBalance)}
                >
                  Max
                </Button>
              </div>
            }
            controls={false}
            stringMode={true}
            onChange={(v) => {
              setEthAmount(v);
            }}
          />
        </div>
        <div className="open-trade-button">
          <Button
            className="action-button cancel-button"
            ghost
            onClick={() => setOpenTradeModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="action-button confirm-button"
            loading={openTradeLoading}
            onClick={() => openTrade()}
          >
            Confirm
          </Button>
        </div>
      </CommonModal>
      <CommonModal
        width={380}
        centered={true}
        className="remove-own-ship-modal"
        footer={null}
        open={removeOwnShipModal}
        closeIcon={null}
        title={
          <div style={{ textAlign: 'center', color: 'rgba(234, 110, 110, 1)' }}>
            Remove Ownership
          </div>
        }
      >
        <p>
          This action will remove your ownership for the token. This means you
          will not:
        </p>
        <p>●Change the token logo</p>
        <p>●Change the token's the link of social media</p>
        <p>●Change the token's description</p>
        <p>Please remove ownership only after the token data is finalized</p>
        <div>
          <Button
            className="action-button"
            ghost
            onClick={() => setRemoveOwnShipModal(false)}
          >
            Cancel
          </Button>
          <Button className="action-button" onClick={() => renounceOwnerShip()}>
            Confirm
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}

export default ManageTokenDetail;
