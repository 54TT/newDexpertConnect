import { useSearchParams } from 'react-router-dom';
import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import { useContext, useEffect, useMemo, useState } from 'react';
import { CountContext } from '@/Layout';
import { BigNumber, ethers } from 'ethers';
import { UniswapV2FactoryAbi } from '@abis/UniswapV2FactoryAbi';
import { UniswapV2PairAbi } from '@abis/UniswapV2PairAbi';
import CommonModal from '@/components/CommonModal';
import { zeroAddress } from '@utils/constants';
import Decimal from 'decimal.js';
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

  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        title={`${token0}/${token1}`}
      />
      <InfoList className="manage-token-detail-info" data={infoData} />
      <div className="pair-manage-button">
        <BottomButton text="LockLP" onClick={() => {}} />
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
          onClick={() => setRemoveLpModal(true)}
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
