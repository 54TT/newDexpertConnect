import BottomActionButton from '@/components/BottomActionButton';
import CommonModal from '@/components/CommonModal';
import NotificationChange from '@/components/message';
import PairInfo from '@/components/PairInfo';
import { CountContext } from '@/Layout';
import BottomButton from '@/pages/dapps/mint/component/BottomButton';
import { UncxAbi } from '@abis/UncxAbi';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import approve from '@utils/approve';
import { zeroAddress } from '@utils/constants';
// import { toEthWithDecimal, toWeiWithDecimal } from '@utils/convertEthUnit';
// import getBalanceRpcEther from '@utils/getBalanceRpc';
import { BigNumber, ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import './index.less';
import dayjs, { ManipulateType } from 'dayjs';

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
  const { contractConfig, signer } = useContext(CountContext);
  const [uncxContract, setUncxContract] = useState<ethers.Contract>();
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [lockLoading, setLockLoading] = useState(false);
  const [lockDate, setLockDate] = useState<'1d' | '7d' | '1M' | '3M'>('1d');
  const router = useParams();
  const history = useNavigate();
  const [buttonState, setButtonState] = useState<
    'lock' | 'locking' | 'canUnlock'
  >('lock'); // lock: 可以锁定    locking: 正在锁定，未到期  canunlock: 锁定，但是到期可解锁

  const getLockList = async () => {
    setButtonLoading(true);
    const { uncxAddress } = contractConfig;
    const walletAddress = await signer.getAddress();

    const pairContract = new ethers.Contract(
      router?.pair,
      UniswapV2PairAbi,
      signer
    );
    const lpTokenBalance = await pairContract.balanceOf(walletAddress);
    console.log(lpTokenBalance);
    setLpTokenBalance(lpTokenBalance.toString());
    /*     const getUncxLockList = async () => {
      const promiseList = [];
      for (let i = 0; i <= lockNum - 1; i++) {
        promiseList.push(
          uncxContract.getUserLockForTokenAtIndex(
            walletAddress,
            router?.address,
            i
          )
        );
      }
      return Promise.all(promiseList);
    }; */

    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
    setUncxContract(uncxContract);
    const lockNum: BigNumber = await uncxContract.getUserNumLocksForToken(
      walletAddress,
      router?.pair
    );
    console.log('lockNum: ', lockNum);
    if (lockNum.eq(0)) {
      setButtonLoading(false);
      setButtonState('lock');
    }
    const lockList = await uncxContract.getUserLockForTokenAtIndex(
      walletAddress,
      router?.pair,
      lockNum.sub(1)
    );
    const [lockDate, , , unlockDate, lockId, owner] = lockList;

    // lockList.map((item) => {
    //   const [lockDate, lockAmount, initialAmount, unlockDate, lockId, owner] =
    //     item;
    //   return {
    //     remark: toEthWithDecimal(lockAmount, 18),
    //     unlockDate,
    //     lockAmount,
    //     lockDate,
    //     initialAmount,
    //     lockId,
    //     owner,
    //   };
    // });
    console.log(unlockDate);
    if (dayjs(unlockDate).isBefore(dayjs())) {
      setButtonState('canUnlock');
    } else {
      setButtonState('locking');
    }
    setLockLpData({ unlockDate, lockId, owner, lockDate });
    setButtonLoading(false);
  };

  const lockLp = async () => {
    try {
      setLockLoading(true);
      const { uncxAddress } = contractConfig;
      const walletAddress = await signer.getAddress();
      const pairContract = new ethers.Contract(
        router?.pair,
        UniswapV2PairAbi,
        signer
      );
      const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
      const fee = (await uncxContract.gFees()).ethFee;
      // const decimals = await pairContract.decimals();
      const lockAmountWitDecimal = lpTokenBalance;
      const [addCount, uint] = [lockDate.slice(0, -1), lockDate.slice(-1)];
      const unlockDate = dayjs()
        .add(Number(addCount), uint as ManipulateType)
        .unix();
      const isShow = await approve(
        pairContract,
        uncxAddress,
        lockAmountWitDecimal
      );
      if (isShow) {
        try {
          const tx = await uncxContract.lockLPToken(
            router?.pair,
            lockAmountWitDecimal,
            unlockDate,
            zeroAddress,
            true,
            walletAddress,
            {
              value: fee,
            }
          );
          history(`/dapps/tokencreation/result/lockliquidity?tx=${tx?.hash}&status=pending`);
          // const recipent = await tx.wait();
          // if (recipent.status === 1) {
          //   history('/dapps/tokencreation/result/' + tx?.hash + '/lock');
          // }
        } catch (e) {
          console.log(e);
          NotificationChange('warning', t('Dapps.Insufficient Fund'));
          return null;
        }
      }
      getLockList();
      setLockDate('1d');
      setLockLoading(false);
    } catch (e) {
      setLockLoading(false);
      console.error(e);
    }
  };

  const withdraw = async (lockId, amount) => {
    try {
      const data = await uncxContract.withdraw(router?.pair, 0, lockId, amount);
      // 和opentrade走同一个result页面
      history(`/dapps/tokencreation/result/opentrade?tx=${data?.hash}&status=pending`);
      // const recipent = await data.wait();
      // if (recipent.status === 1) {
      //   setOpenUnLockModal(false);
      //   history('/dapps/tokencreation/result/' + data?.hash + '/unlock');
      // }
    } catch (e) {
      NotificationChange('error', 'pair.unlockfail');
    }
  };

  useEffect(() => {
    getLockList();
  }, [signer]);

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
        <p className="lock-lp-modal-content">
          {t("mint.Select")}
        </p>
        <div className="lock-lp-modal-date">
          {Object.keys(LockDateMap).map((key: any) => {
            return (
              <div
                className={lockDate === key ? 'is-select-date' : ''}
                onClick={() => setLockDate(key as '1d' | '7d' | '1M' | '3M')}
              >
                <span>{LockDateMap[key]}</span>
              </div>
            );
          })}
        </div>
        <BottomActionButton
          okText={t("mint.Confirm")}
          loading={lockLoading}
          cancelText={t("mint.Cancel")}
          onOk={() => {
            lockLp();
          }}
          onCancel={() => {
            setOpenModal(false);
          }}
        />
        <p className="lock-lp-modal-tips">
          {t("mint.can")}
        </p>
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
          okText={t("mint.UnLock Button")}
          cancelText={t("mint.Cancel")}
          onOk={() => {
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
          <p>{t("mint.Maturity")}</p>
          <p style={{ color: 'rgba(139, 139, 139, 1)' }}>
            {' '}
            {lockLpData?.unlockDate
              ? dayjs
                  .unix(lockLpData.unlockDate.toString())
                  .format('YYYY-MM-DD HH:mm')
              : '-'}
          </p>
          <p>{t("mint.UnLock content")}</p>
        </div>
        <BottomActionButton
          okText=""
          cancelText={t("mint.Cancel")}
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
