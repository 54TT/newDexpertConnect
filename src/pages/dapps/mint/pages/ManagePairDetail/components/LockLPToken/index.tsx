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
import { toEthWithDecimal, toWeiWithDecimal } from '@utils/convertEthUnit';
import getBalanceRpcEther from '@utils/getBalanceRpc';
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

function LockLpButton({ pairInfo }) {
  const { t } = useTranslation();
  const [openLockModal, setOpenModal] = useState(false);
  const [openUnLockModal, setOpenUnLockModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(true);
  const { contractConfig, signer } = useContext(CountContext);
  const [uncxContract, setUncxContract] = useState<ethers.Contract>();
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [locking, setLocking] = useState(false);
  const [lockDate, setLockDate] = useState<'1d' | '7d' | '1M' | '3M'>('1d');
  const router = useParams();
  const history = useNavigate();
  const [buttonState, setButtonState] = useState<
    'lock' | 'locking' | 'canUnlock'
  >('lock'); // lock: 可以锁定    locking: 正在锁定，未到期  canunlock: 锁定，但是到期可解锁
  const [lockInfo, setLockInfo] = useState();

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
    if (lockNum.eq(0)) {
      setButtonLoading(false);
    }
    const lockList = await uncxContract.getUserLockForTokenAtIndex(
      walletAddress,
      router?.pair,
      lockNum.sub(1)
    );
    const [lockDate, lockAmount, initialAmount, unlockDate, lockId, owner] =
      lockList;

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
    console.log(lockList);
    setButtonLoading(false);
  };

  const lockLp = async () => {
    try {
      setLocking(true);
      const { uncxAddress } = contractConfig;
      const walletAddress = await signer.getAddress();
      const pairContract = new ethers.Contract(
        router?.pair,
        UniswapV2PairAbi,
        signer
      );
      const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
      const fee = (await uncxContract.gFees()).ethFee;
      const decimals = await pairContract.decimals();
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
      console.log(isShow);
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
          const recipent = await tx.wait();
          if (recipent.status === 1) {
            history('/dapps/tokencreation/result/' + tx?.hash + '/lock');
          }
        } catch (e) {
          console.log(e);
          NotificationChange('warning', t('Dapps.Insufficient Fund'));
          return null;
        }
      }
      getLockList();
      setLockDate('1d');
      setLocking(false);
    } catch (e) {
      setLocking(false);
      console.error(e);
    }
  };

  useEffect(() => {
    getLockList();
  }, [signer]);

  return (
    <div className="lock-lp-button">
      <BottomButton
        loading={buttonLoading}
        text={t('token.LockLP')}
        onClick={() => {
          setOpenModal(true);
        }}
      />
      <CommonModal
        closeIcon={null}
        className="lock-lp-modal"
        open={openLockModal}
        width={380}
        footer={null}
      >
        <PairInfo data={pairInfo} />
        <p className="lock-lp-modal-content">
          Select the lock-up period of liquidity pool
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
          okText="确认"
          cancelText={'取消'}
          onOk={() => {
            lockLp();
          }}
          onCancel={() => {
            setOpenModal(false);
          }}
        />
        <p className="lock-lp-modal-tips">
          Lock-up liquidity pool can enhance the credibility of token
        </p>
      </CommonModal>
      <CommonModal
        closeIcon={null}
        className="lock-lp-modal"
        open={openUnLockModal}
        width={380}
        footer={null}
      >
        <PairInfo data={pairInfo} />
        <BottomActionButton
          okText="确认"
          cancelText={'取消'}
          onOk={() => {}}
          onCancel={() => {}}
        />
      </CommonModal>
      <CommonModal
        closeIcon={null}
        className="lock-lp-modal"
        open={openInfoModal}
        width={380}
        footer={null}
      >
        <PairInfo data={pairInfo} />
        <BottomActionButton
          okText="确认"
          cancelText={'取消'}
          onOk={() => {}}
          onCancel={() => {}}
        />
      </CommonModal>
    </div>
  );
}

export default LockLpButton;
