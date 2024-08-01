import { useNavigate, useSearchParams } from 'react-router-dom';
import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import { useContext, useEffect, useMemo, useState } from 'react';
import { CountContext } from '@/Layout';
import { BigNumber, ethers } from 'ethers';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import CommonModal from '@/components/CommonModal';
import { zeroAddress } from '@utils/constants';
import Decimal from 'decimal.js';
import { UniswapV2RouterAbi } from '@abis/UniswapV2RouterAbi';
import dayjs from 'dayjs';
import { UncxAbi } from '@abis/UncxAbi';
import Loading from '@/components/allLoad/loading';
import getBalanceRpcEther from '@utils/getBalanceRpc';
import { toWeiWithDecimal } from '@utils/convertEthUnit';
function ManagePairDetail() {
  const [search] = useSearchParams();
  const token0 = search.get('t0');
  const token1 = search.get('t1');
  const pairAddress = search.get('add');
  const history = useNavigate();
  const { loginProvider, contractConfig, chainId, browser } =
    useContext(CountContext);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [infoData, setInfoData] = useState<any>();
  const [burnLpModal, setBurnLpModal] = useState(false);
  const [removeLpModal, setRemoveLpModal] = useState(false);
  const [isButton, setIsButton] = useState(false);
  //  loading
  const [loading, setLoading] = useState(false);
  const [pairContract, setPairContract] = useState<ethers.Contract>();
  const getPairInfo = async () => {
    const { uncxAddress, wethAddress } = contractConfig;
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const address = await signer.getAddress();
    const lpTokenBalance = await getBalanceRpcEther(
      web3Provider,
      pairAddress,
      wethAddress
    );
    //const v2FactoryAddress = contractConfig.uniswapV2FactoryAddress;
    const uniSwapV2Pair = new ethers.Contract(
      pairAddress,
      UniswapV2PairAbi,
      signer
    );
    setPairContract(uniSwapV2Pair);
    const decimals = await uniSwapV2Pair.decimals();
    setTokenBalance(lpTokenBalance.toString());
    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);

    const lockNum = await uncxContract.getUserNumLocksForToken(
      address,
      pairAddress
    );

    const calcLockAmount = async () => {
      let lockAmount = BigNumber.from(0);
      for (let i = 0; i <= lockNum - 1; i++) {
        const amount = (
          await uncxContract.getUserLockForTokenAtIndex(address, pairAddress, i)
        )[1];
        lockAmount = lockAmount.add(amount);
      }
      return lockAmount;
    };

    const lockAmount = await calcLockAmount();
    const infoData = {
      paidAddress: {
        label: 'Pair address',
        value: pairAddress,
        show: `${pairAddress.slice(0, 4)}...${pairAddress.slice(pairAddress.length - 4)}`,
      },
      balance: {
        label: 'Balance',
        value: lpTokenBalance,
        show: lpTokenBalance.toString(),
      },
      lockAmount: {
        label: 'Lock amount',
        value: lockAmount,
        show: new Decimal(lockAmount.toString())
          .div(new Decimal(10).pow(decimals))
          .toString(),
      },
    };
    setInfoData(infoData);
    setLoading(true);
  };
  console.log(chainId);
  console.log(contractConfig);
  useEffect(() => {
    if (Number(chainId) === contractConfig?.chainId) {
      getPairInfo();
    }
  }, [loginProvider, chainId, contractConfig]);
  const burnLP = async () => {
    try {
      const tx = await pairContract.transfer(
        zeroAddress,
        BigNumber.from(toWeiWithDecimal(tokenBalance, 18))
      );
      await tx.wait();
      getPairInfo();
      setIsButton(false);
    } catch (e) {
      setIsButton(false);
    }
  };

  const removeLp = async () => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await web3Provider.getSigner();
      const v2RouterContract = new ethers.Contract(
        contractConfig.uniswapV2RouterAddress,
        UniswapV2RouterAbi,
        signer
      );
      const walletAddress = await signer.getAddress();
      const token0 = await pairContract.token0();
      const balance = await pairContract.balanceOf(walletAddress);
      const approveTx = await pairContract.approve(
        contractConfig.uniswapV2RouterAddress,
        balance
      );
      const { status } = await approveTx.wait();
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
      setIsButton(false);
    } catch (e) {
      setIsButton(false);
    }
  };

  const lockLpToken = async () => {
    history(`/dapps/tokencreation/lockLpList?add=${pairAddress}`);
  };

  const data = useMemo(
    () => Object?.keys?.(infoData || {})?.map?.((key) => infoData[key]) ?? [],
    [infoData]
  );

  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={`${token0}/${token1}`}
      />
      {loading ? (
        <>
          <InfoList className="manage-token-detail-info" data={data} />
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
        </>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <CommonModal
        open={removeLpModal}
        title="Remove LP"
        footer={null}
        className="mint-common-modal"
        onCancel={() => {
          if (!isButton) {
            setRemoveLpModal(false);
          }
        }}
      >
        <div style={{ color: '#fff' }}>
          Your LP token will be send to Zero Address
        </div>
        <BottomButton
          className=""
          ghost
          danger
          loading={isButton}
          text="Confirm"
          onClick={async () => {
            setIsButton(true);
            removeLp();
            setRemoveLpModal(true);
          }}
        />
      </CommonModal>
      <CommonModal
        className="mint-common-modal"
        open={burnLpModal}
        footer={null}
        title="Burn LP"
        onCancel={() => {
          if (!isButton) {
            setBurnLpModal(false);
          }
        }}
      >
        <div style={{ color: '#fff' }}>
          Your LP token will be send to Zero Address
        </div>
        <BottomButton
          className=""
          ghost
          danger
          loading={isButton}
          text="Confirm"
          onClick={() => {
            setIsButton(true);
            burnLP();
          }}
        />
      </CommonModal>
    </>
  );
}

export default ManagePairDetail;
