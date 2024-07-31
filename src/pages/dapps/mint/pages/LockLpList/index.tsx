import { useContext, useEffect, useState } from 'react';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import { CountContext } from '@/Layout';
import { useSearchParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { UncxAbi } from '@abis/UncxAbi';
import TokenItem from '../../component/TokenItem';
import dayjs, { Dayjs } from 'dayjs';
import { toEthWithDecimal, toWeiWithDecimal } from '@utils/convertEthUnit';
import BottomButton from '../../component/BottomButton';
import CommonModal from '@/components/CommonModal';
import { DatePicker } from 'antd';
import './index.less';
import getBalanceRpcEther from '@utils/getBalanceRpc';
import InputNumberWithString from '@/components/InputNumberWithString';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import { zeroAddress } from '@utils/constants';
import approve from '@utils/approve';

function LockLpList() {
  const { contractConfig, loginProvider, chainId } = useContext(CountContext);
  const [search] = useSearchParams();
  const pairAddress = search.get('add');
  // pair展示
  const [infoData, setInfoData] = useState([]);
  // 锁定流动性弹窗相关参数
  const [openModal, setOpenModal] = useState(false);
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [lockDate, setLockDate] = useState<Dayjs>(null);
  const [toLockAmount, setToLockAmount] = useState('0');
  const [uncxContract, setUncxContract] = useState<ethers.Contract>();
  const getLockList = async () => {
    const { uncxAddress, wethAddress } = contractConfig;
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const address = await signer.getAddress();
    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
    setUncxContract(uncxContract);
    const lockNum = await uncxContract.getUserNumLocksForToken(
      address,
      pairAddress
    );
    const lpTokenBalance = await getBalanceRpcEther(
      web3Provider,
      pairAddress,
      wethAddress
    );
    setLpTokenBalance(lpTokenBalance.toString());
    const getUncxLockList = async () => {
      const promiseList = [];
      for (let i = 0; i <= lockNum - 1; i++) {
        promiseList.push(
          uncxContract.getUserLockForTokenAtIndex(address, pairAddress, i)
        );
      }
      return Promise.all(promiseList);
    };
    const lockList = await getUncxLockList();
    const data = lockList.map((item) => {
      const [lockDate, lockAmount, initialAmount, unlockDate, lockId, owner] =
        item;
      return {
        title: (
          <div>
            <div>解锁时间</div>
            <div>
              {dayjs.unix(unlockDate.toString()).format('YYYY/MM/DD HH:mm:ss')}
            </div>
          </div>
        ),
        remark: (
          <div>
            <div>锁定LP数量</div>
            <div>{toEthWithDecimal(lockAmount, 18)}</div>
          </div>
        ),
        unlockDate,
        lockAmount,
        lockDate,
        initialAmount,
        lockId,
        owner,
      };
    });
    setInfoData(data);
  };

  const lockLp = async () => {
    const { uncxAddress } = contractConfig;
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const walletAddress = await signer.getAddress();
    const pairContract = new ethers.Contract(
      pairAddress,
      UniswapV2PairAbi,
      signer
    );
    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
    const fee = (await uncxContract.gFees()).ethFee;
    const decimals = await pairContract.decimals();
    const lockAmount = toWeiWithDecimal(toLockAmount, decimals);
    const unlockDate = lockDate.unix();
    const feeInEth = true;
    const withdradwer = walletAddress;

    if (await approve(pairContract, uncxAddress, lockAmount)) {
      const tx = await uncxContract.lockLPToken(
        pairAddress,
        lockAmount,
        unlockDate,
        zeroAddress,
        feeInEth,
        withdradwer,
        {
          value: fee,
        }
      );
      console.log(tx);
    }
  };
  useEffect(() => {
    if (loginProvider && contractConfig?.chainId === Number(chainId)) {
      getLockList();
    }
  }, [chainId, loginProvider, contractConfig]);
  const withdraw = async (index, lockId, amount) => {
    await uncxContract.withdraw(pairAddress, index, lockId, amount);
  };
  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        disabled={false}
        className="launch-manage-token-header"
        title={'锁定流动性'}
      />
      {infoData?.map?.((item, index) => (
        <TokenItem
          key={item?.owner}
          data={{
            ...item,
            desc: (
              <BottomButton
                text="Unlock"
                isBack={dayjs(dayjs.unix(1722452400)).isAfter(dayjs())}
                onClick={() => {
                  if (dayjs(dayjs.unix(1722452400)).isAfter(dayjs())) {
                    withdraw(index, item.lockId, item.lockAmount);
                  }
                }}
              />
            ),
          }}
        />
      ))}
      <BottomButton
        text="Lock LP"
        bottom
        onClick={() => {
          setOpenModal(true);
        }}
      />
      <CommonModal
        className="mint-common-modal"
        open={openModal}
        footer={null}
        title="Lock LP"
        onCancel={() => setOpenModal(false)}
      >
        <div>
          <div className="locklp-list-title">Lock Amount</div>
          <div>
            <InputNumberWithString
              value={toLockAmount}
              onChange={(v) => {
                setToLockAmount(v);
              }}
            />
            <div className="locklp-list-title">balance: {lpTokenBalance}</div>
          </div>
        </div>
        <div className="locklp-list-title">
          <div>UnLock Date</div>
          <DatePicker
            value={lockDate}
            showHour
            showMinute
            showTime
            onChange={(date: Dayjs) => {
              setLockDate(date);
            }}
          />
        </div>
        <BottomButton
          text="Confirm"
          onClick={() => {
            lockLp();
          }}
        />
      </CommonModal>
    </>
  );
}

export default LockLpList;
