import { useSearchParams } from 'react-router-dom';
import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout';
import { BigNumber, ethers } from 'ethers';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import CommonModal from '@/components/CommonModal';
import { zeroAddress } from '@utils/constants';
import Decimal from 'decimal.js';
import { UniswapV2RouterAbi } from '@abis/UniswapV2RouterAbi';
import { UncxAbi } from '@abis/UncxAbi';
import dayjs from 'dayjs';
function ManagePairDetail() {
  const [search] = useSearchParams();
  const token0 = search.get('t0');
  const token1 = search.get('t1');
  const pairAddress = search.get('add');
  const { loginProvider, contractConfig } = useContext(CountContext);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [infoData, setInfoData] = useState([]);
  const [burnLpModal, setBurnLpModal] = useState(false);
  const [removeLpModal, setRemoveLpModal] = useState(false);
  const [pairContract, setPairContract] = useState<ethers.Contract>();

  const getPairInfo = async () => {
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const address = await signer.getAddress();
    //const v2FactoryAddress = contractConfig.uniswapV2FactoryAddress;
    const uniSwapV2Pair = new ethers.Contract(
      pairAddress,
      UniswapV2PairAbi,
      signer
    );
    setPairContract(uniSwapV2Pair);
    console.log(address);
    const lpTokenBalance = await uniSwapV2Pair.balanceOf(address);
    const decimals = await uniSwapV2Pair.decimals();
    setTokenBalance(lpTokenBalance.toString());

    const infoData = [
      {
        label: 'Pair address',
        value: pairAddress,
        show: `${pairAddress.slice(0, 3)}...${pairAddress.slice(pairAddress.length - 3)}`,
      },
      {
        label: 'Balance',
        value: lpTokenBalance,
        show: new Decimal(lpTokenBalance.toString())
          .div(new Decimal(10).pow(decimals))
          .toString(),
      },
    ];
    setInfoData(infoData);
    // const uniSwapV2Factory = new ethers.Contract(
    //   v2FactoryAddress,
    //   UniswapV2FactoryAbi,
    //   signer
    // );
  };

  useEffect(() => {
    getPairInfo();
  }, [loginProvider]);

  const burnLP = async () => {
    const tx = await pairContract.transfer(
      zeroAddress,
      BigNumber.from(tokenBalance)
    );
    await tx.wait();
    getPairInfo();
  };

  const removeLp = async () => {
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const v2RouterContract = new ethers.Contract(
      contractConfig.uniswapV2RouterAddress,
      UniswapV2RouterAbi,
      signer
    );
    const walletAddress = await signer.getAddress();
    console.log('walletAddress', walletAddress);
    const token0 = await pairContract.token0();
    const balance = await pairContract.balanceOf(walletAddress);
    const approveTx = await pairContract.approve(
      contractConfig.uniswapV2RouterAddress,
      balance
    );
    console.log(approveTx, balance);
    const { status } = await approveTx.wait();
    console.log(token0, balance.toString());

    if (status === 1) {
      const deadline = dayjs().add(10, 'm').unix();
      const removeLiquidityTx = await v2RouterContract.removeLiquidityETH(
        token0,
        balance,
        0,
        0,
        walletAddress,
        deadline
      );
      await removeLiquidityTx.wait();
      getPairInfo();
    }
  };

  const approve = async (
    contract: ethers.Contract,
    to: string,
    amount: BigNumber
  ) => {
    const tx = await contract.approve(to, amount);
    const recipent = await tx.wait();
    console.log(recipent);
    return recipent.status === 1;
  };

  const lockLpToken = async () => {
    const { uncxAddress } = contractConfig;
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const walletAddress = await signer.getAddress();
    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
    const fee = (await uncxContract.gFees()).ethFee;
    const lockAmount = BigNumber.from('1000000000000000000');
    const unlockDate = dayjs().add(10, 'day').unix();
    const referral = walletAddress;
    const feeInEth = true;
    const withdradwer = walletAddress;
    console.log(fee.toString());
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

  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={`${token0}/${token1}`}
      />
      <InfoList className="manage-token-detail-info" data={infoData} />
      <div className="pair-manage-button">
        <BottomButton text="LockLP" onClick={() => lockLpToken()} />
        <BottomButton
          className=""
          ghost
          danger
          text="RemoveLP"
          onClick={() => setRemoveLpModal(true)}
        />
        <BottomButton
          className=""
          ghost
          danger
          text="BurnLP"
          onClick={() => setBurnLpModal(true)}
        />
      </div>
      <CommonModal
        open={removeLpModal}
        title="Remove LP"
        footer={null}
        className="mint-common-modal"
        onCancel={() => setRemoveLpModal(false)}
      >
        <div style={{ color: '#fff' }}>
          Your LP token will be send to Zero Address
        </div>
        <BottomButton
          className=""
          ghost
          danger
          text="Confirm"
          onClick={async () => {
            await removeLp();
            setRemoveLpModal(true);
          }}
        />
      </CommonModal>
      <CommonModal
        className="mint-common-modal"
        open={burnLpModal}
        footer={null}
        title="Burn LP"
        onCancel={() => setBurnLpModal(false)}
      >
        <div style={{ color: '#fff' }}>
          Your LP token will be send to Zero Address
        </div>
        <BottomButton
          className=""
          ghost
          danger
          text="Confirm"
          onClick={() => burnLP()}
        />
      </CommonModal>
    </>
  );
}

export default ManagePairDetail;
