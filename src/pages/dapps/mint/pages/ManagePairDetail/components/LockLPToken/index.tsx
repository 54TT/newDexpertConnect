import BottomActionButton from '@/components/BottomActionButton';
import CommonModal from '@/components/CommonModal';
import NotificationChange from '@/components/message';
import PairInfo from '@/components/PairInfo';
import { CountContext } from '@/Layout';
import BottomButton from '@/pages/dapps/mint/component/BottomButton';
import { UncxAbi } from '@abis/UncxAbi';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import { zeroAddress } from '@utils/constants';
import { useActiveAccount } from 'thirdweb/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getContract } from 'thirdweb';
import { useNavigate, useParams } from 'react-router-dom';
import './index.less';
import dayjs, { ManipulateType } from 'dayjs';
import { client } from '@/client';
import { useReadContract } from 'thirdweb/react';
import { useSendTransaction } from 'thirdweb/react';
import { prepareContractCall, sendAndConfirmTransaction } from 'thirdweb';

const LockDateMap = {
  '1d': '1D',
  '7d': '7D',
  '1M': '1M',
  '3M': '3M',
};

function LockLpButton({ pairInfo, lockLpData, setLockLpData }) {
  const { t } = useTranslation();
  const [openLockModal, setOpenModal] = useState(false);
  const [openUnLockModal, setOpenUnLockModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(true);
  const { contractConfig, allChain } = useContext(CountContext);
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [lockLoading, setLockLoading] = useState(false);
  const [lockDate, setLockDate] = useState<'1d' | '7d' | '1M' | '3M'>('1d');
  const router = useParams();
  const activeAccount = useActiveAccount();
  const history = useNavigate();
  const [buttonState, setButtonState] = useState<
    'lock' | 'locking' | 'canUnlock'
  >('lock'); // lock: 可以锁定    locking: 正在锁定，未到期  canunlock: 锁定，但是到期可解锁
  const [isSendTx, setIsSendTx] = useState('');
  const {
    mutate: sendTx,
    data: transactionResult,
    error: UUUUU,
  } = useSendTransaction({
    payModal: false,
  });
  useEffect(() => {
    if (transactionResult?.transactionHash) {
      if (isSendTx === 'withdraw') {
        history(
          `/dapps/tokencreation/results/opentrade/${transactionResult?.transactionHash}`
        );
        setLockLoading(false);
      }
      if (isSendTx === 'lockLp') {
        setLockLoading(false);
        history(
          `/dapps/tokencreation/results/lockliquidity/${transactionResult?.transactionHash}`
        );
      }
    }
    if (UUUUU) {
      setLockLoading(false);
    }
  }, [transactionResult, UUUUU]);

  const pairContract = getContract({
    client,
    chain: allChain,
    address: router?.pair,
    abi: UniswapV2PairAbi as any,
  });
  // 获取  balanceOf
  const { data: balanceOf, isLoading: isBalanceOf }: any = useReadContract({
    contract: pairContract,
    method: 'balanceOf',
    params: [activeAccount?.address],
  });
  const UncxContract = getContract({
    client,
    chain: allChain,
    address: contractConfig?.uncxAddress,
    abi: UncxAbi as any,
  });

  // 获取  gFees
  const { data: gFees, isLoading: isGFees }: any = useReadContract({
    contract: UncxContract,
    method: 'gFees',
    params: [],
  });

  const UniswapV2PairContract = getContract({
    client,
    chain: allChain,
    address: router?.pair,
    abi: UniswapV2PairAbi as any,
  });

  // 获取  getUserNumLocksForToken
  const {
    data: getUserNumLocksForToken,
    isLoading: isGetUserNumLocksForToken,
  }: any = useReadContract({
    contract: UncxContract,
    method: 'getUserNumLocksForToken',
    params: [activeAccount?.address, router?.pair],
  });

  // 获取  getUserLockForTokenAtIndex  解析值------[lockDate, lockAmount, initialAmount, unlockDate, lockId, owner]
  const {
    data: getUserLockForTokenAtIndex,
    isLoading: isGetUserLockForTokenAtIndex,
  }: any = useReadContract({
    contract: UncxContract,
    method: 'getUserLockForTokenAtIndex',
    params: [
      activeAccount?.address,
      router?.pair,
      getUserNumLocksForToken?.toString()
        ? Number(getUserNumLocksForToken?.toString()) - 1
        : '',
    ],
  });
  const getLockList = async () => {
    setButtonLoading(true);
    // balanceOf
    setLpTokenBalance(balanceOf.toString());
    // 是否等于0
    if (getUserNumLocksForToken?.toString() === '0') {
      setButtonLoading(false);
      setButtonState('lock');
    }
    if (getUserLockForTokenAtIndex?.length === 6) {
      if (
        dayjs(getUserLockForTokenAtIndex?.[3]?.toString()).isBefore(dayjs())
      ) {
        setButtonState('canUnlock');
      } else {
        setButtonState('locking');
      }
      setLockLpData({
        unlockDate: getUserLockForTokenAtIndex?.[3]?.toString(),
        lockId: getUserLockForTokenAtIndex?.[4]?.toString(),
        owner: getUserLockForTokenAtIndex?.[5]?.toString(),
        lockDate: getUserLockForTokenAtIndex?.[0]?.toString(),
      });
      setButtonLoading(false);
    }
  };
  const lockLp = async () => {
    try {
      setLockLoading(true);
      const { uncxAddress } = contractConfig;
      const [addCount, uint] = [lockDate.slice(0, -1), lockDate.slice(-1)];
      const unlockDate = dayjs()
        .add(Number(addCount), uint as ManipulateType)
        .unix();
      const tx: any = prepareContractCall({
        contract: UniswapV2PairContract,
        method: 'approve',
        params: [uncxAddress, lpTokenBalance],
      });
      const transactionReceipt = await sendAndConfirmTransaction({
        account: activeAccount,
        transaction: tx,
      });
      if (transactionReceipt?.status === 'success') {
        try {
          setIsSendTx('lockLp');
          const sendTxAll: any = prepareContractCall({
            contract: UncxContract,
            method: 'lockLPToken',
            params: [
              router?.pair,
              lpTokenBalance,
              unlockDate,
              zeroAddress,
              true,
              activeAccount?.address,
            ],
            value: gFees?.[0]?.toString(),
          });
          await sendTx(sendTxAll);
        } catch (e) {
          setLockLoading(false);
          NotificationChange('warning', t('Dapps.Insufficient Fund'));
          return null;
        }
      }
      getLockList();
      setLockDate('1d');
      setLockLoading(false);
    } catch (e) {
      setLockLoading(false);
      return null
    }
  };

  const withdraw = async (lockId, amount) => {
    try {
      // 合约  tx
      const txsss: any = prepareContractCall({
        contract: pairContract,
        method: 'withdraw',
        params: [router?.pair, 0, lockId, amount],
      });
      setIsSendTx('withdraw');
      await sendTx(txsss);
    } catch (e) {
      NotificationChange('error', 'pair.unlockfail');
    }
  };

  useEffect(() => {
    if (
      activeAccount?.address &&
      !isBalanceOf &&
      !isGetUserNumLocksForToken &&
      !isGetUserLockForTokenAtIndex &&
      !isGFees
    ) {
      getLockList();
    }
  }, [
    activeAccount,
    isBalanceOf,
    isGetUserNumLocksForToken,
    isGetUserLockForTokenAtIndex,
    isGFees,
  ]);

  return (
    <div className="lock-lp-button">
      <BottomButton
        loading={buttonLoading}
        text={buttonState === 'lock' ? t('mint.Lock') : t('mint.UnLock')}
        onClick={() => {
          switch (buttonState) {
            case 'canUnlock':
              setOpenUnLockModal(true);
              break;
            case 'lock':
              setOpenModal(true);
              break;
            case 'locking':
              setOpenInfoModal(true);
              break;
          }
        }}
      />
      <CommonModal
        closeIcon={null}
        className="lock-lp-modal"
        open={openLockModal}
        width={380}
        footer={null}
        title={t('mint.Lock')}
      >
        <PairInfo data={pairInfo} />
        <p className="lock-lp-modal-content">{t('mint.Select')}</p>
        <div className="lock-lp-modal-date">
          {Object.keys(LockDateMap).map((key: any) => {
            return (
              <div
                key={key}
                className={lockDate === key ? 'is-select-date' : ''}
                onClick={() => setLockDate(key as '1d' | '7d' | '1M' | '3M')}
              >
                <span>{LockDateMap[key]}</span>
              </div>
            );
          })}
        </div>
        <BottomActionButton
          okText={t('mint.Confirm')}
          loading={lockLoading}
          cancelText={t('mint.Cancel')}
          onOk={() => {
            lockLp();
          }}
          onCancel={() => {
            setOpenModal(false);
          }}
        />
        <p className="lock-lp-modal-tips">{t('mint.can')}</p>
      </CommonModal>
      <CommonModal
        closeIcon={null}
        className="lock-lp-modal"
        open={openUnLockModal}
        // open={true}
        width={380}
        footer={null}
        title={t('mint.UnLock')}
      >
        <PairInfo data={pairInfo} />
        <BottomActionButton
          okText={t('mint.UnLock Button')}
          loading={lockLoading}
          cancelText={t('mint.Cancel')}
          onOk={() => {
            setLockLoading(true);
            withdraw(lockLpData.lockId, lockLpData.lockAmount);
          }}
          onCancel={() => {
            setOpenUnLockModal(false);
          }}
        />
      </CommonModal>
      <CommonModal
        closeIcon={null}
        className="lock-lp-modal"
        open={openInfoModal}
        width={380}
        footer={null}
        title={t('mint.UnLock')}
      >
        <PairInfo data={pairInfo} />
        <div className="lock-lp-modal-content">
          <p>{t('mint.Maturity')}</p>
          <p style={{ color: 'rgba(139, 139, 139, 1)' }}>
            {' '}
            {lockLpData?.unlockDate
              ? dayjs
                  .unix(lockLpData.unlockDate.toString())
                  .format('YYYY-MM-DD HH:mm')
              : '-'}
          </p>
          <p>{t('mint.UnLock content')}</p>
        </div>
        <BottomActionButton
          okText=""
          cancelText={t('mint.Cancel')}
          onOk={() => {
            setOpenInfoModal(false);
          }}
          onCancel={() => {
            setOpenInfoModal(false);
          }}
        />
      </CommonModal>
    </div>
  );
}

export default LockLpButton;
