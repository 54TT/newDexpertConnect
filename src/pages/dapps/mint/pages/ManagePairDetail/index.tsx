import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import BottomButton from '../../component/BottomButton';
import InfoList from '../../component/InfoList';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
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
import { useTranslation } from 'react-i18next';
import NotificationChange from '@/components/message';
import PairInfo, { PairInfoPropsType } from '@/components/PairInfo';
import { useTokenInfo } from '@/hook/useTokenInfo';
import { InputNumber } from 'antd';
import getBalanceRpc from '@utils/getBalanceRpc';
import { ERC20Abi } from '@abis/ERC20Abi';
import InputNumberWithString from '@/components/InputNumberWithString';

function ManagePairDetail() {
  const { t } = useTranslation();
  const router = useParams();
  const history = useNavigate();
  const { loginProvider, contractConfig, chainId, browser,openTradeModal,signer } =
    useContext(CountContext);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [infoData, setInfoData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState('');
  const [isButton, setIsButton] = useState(false);
  //  loading
  const [loading, setLoading] = useState(false);
  const [pairContract, setPairContract] = useState<ethers.Contract>();
  // 池子token余额
  const [resever0balance,setResever0balance]=useState<string>('0')
  const [resever1balance,setResever1balance]=useState<string>('0')
  // 用户对应token余额,
  const [tokenETH,setTokenETH]=useState<string>('0')
  const [erc20Token,setErc20Token]=useState<string>('0')
  const [erc20TokenAddress,setErc20TokenAddress]=useState<string>('')
  // modal输入框数据
  const [WETHAmount, setWETHAmount]=useState('')
  const [erc20Amount, setErc20Amount]=useState('')
  const [burnAmount, setBurnAmount]=useState('')
  // 按钮状态
  const [approveLoading, setApproveLoading]=useState(false)
  const [burnLoading, setBurnLoading]=useState(false)
  const [tokenInfo] = useTokenInfo(erc20TokenAddress);
  const pairInfoData: PairInfoPropsType  = {
    token0: {
      logo: tokenInfo?.logoLink,
      symbol: router?.t0
    },
    token1: {
      logo: contractConfig?.defaultTokenIn?.logoUrl,
      symbol: contractConfig?.defaultTokenIn?.symbol
    }
  }
  const getPairInfo = async () => {
    const { uncxAddress, wethAddress } = contractConfig;
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const address = await signer.getAddress();
    const lpTokenBalance = await getBalanceRpcEther(
      web3Provider,
      router?.pair,
      wethAddress
    );
    console.log(lpTokenBalance.toString());
    
    const uniSwapV2Pair = new ethers.Contract(
      router?.pair,
      UniswapV2PairAbi,
      signer
    );
    setPairContract(uniSwapV2Pair);
    console.log(uniSwapV2Pair)
    
    const reserves=await uniSwapV2Pair?.getReserves();
    console.log(reserves);
    console.log(reserves._reserve0);
    console.log(reserves._reserve1);
    // console.log(await uniSwapV2Pair?.token0())
    const token0address=await uniSwapV2Pair?.token0()
    const token1address=await uniSwapV2Pair?.token1()
    console.log(token0address)
    console.log(token1address)
    const token0Contract= new ethers.Contract(
      token0address,
      ERC20Abi,
      signer
    )
    const token1Contract= new ethers.Contract(
      token1address,
      ERC20Abi,
      signer
    )
    const token0balance=await token0Contract.balanceOf(signer.getAddress())
    const token1balance=await token1Contract.balanceOf(signer.getAddress())
    console.log(ethers.utils.formatEther(token0balance));
    console.log(ethers.utils.formatEther(token1balance));
    
    if(token0address?.toLowerCase() < token1address?.toLowerCase()){
      setResever0balance(formatDecimalString(ethers.utils.formatEther(reserves._reserve0)))
      setResever1balance(formatDecimalString(ethers.utils.formatEther(reserves._reserve1)))
    }else{
      setResever1balance(formatDecimalString(ethers.utils.formatEther(reserves._reserve0)))
      setResever0balance(formatDecimalString(ethers.utils.formatEther(reserves._reserve1)))
    }
    if(token0address?.toLowerCase()=== wethAddress?.toLowerCase()){
      console.log('token0address is WETH')
      setErc20TokenAddress(token1address)
      setTokenETH(formatDecimalString(ethers.utils.formatEther(await signer.getBalance())))
      setErc20Token(formatDecimalString(ethers.utils.formatEther(token1balance)))

    }else if(token1address?.toLowerCase()=== wethAddress?.toLowerCase()){
      console.log('token1address is WETH')
      setErc20TokenAddress(token0address)
      setTokenETH(formatDecimalString(ethers.utils.formatEther(await signer.getBalance())))
      setErc20Token(formatDecimalString(ethers.utils.formatEther(token0balance)))
    }

    const decimals = await uniSwapV2Pair.decimals();
    setTokenBalance(lpTokenBalance.toString());
    const uncxContract = new ethers.Contract(uncxAddress, UncxAbi, signer);
    const lockNum = await uncxContract.getUserNumLocksForToken(
      address,
      router?.pair
    );

    const calcLockAmount = async () => {
      let lockAmount = BigNumber.from(0);
      for (let i = 0; i <= lockNum - 1; i++) {
        const amount = (
          await uncxContract.getUserLockForTokenAtIndex(
            address,
            router?.pair,
            i
          )
        )[1];
        lockAmount = lockAmount.add(amount);
      }
      return lockAmount;
    };
    const lockAmount = await calcLockAmount();
    const infoData = {
      paidAddress: {
        label: 'Pair address',
        value: router?.pair,
        show: `${router?.pair?.slice(0, 4)}...${router?.pair?.slice(router?.pair?.length - 4)}`,
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
  // 格式化
  function formatDecimalString(str) {
    // 移除末尾的 .0
    let formattedStr = str.replace(/\.0+$/, '');
  
    // 如果字符串以 . 结尾，也移除 .
    formattedStr = formattedStr.replace(/\.$/, '');
    // 分离整数部分和小数部分
    const parts = formattedStr.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';

    // 对整数部分进行每三位加逗号的格式化
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // 重新组合整数部分和小数部分
    formattedStr = `${integerPart}${decimalPart ? '.' + decimalPart : ''}`;
    return formattedStr;
  }
  useEffect(() => {
    if (Number(chainId) === contractConfig?.chainId && router?.pair) {
      getPairInfo();
    }
  }, [loginProvider, chainId, contractConfig, router?.pair]);
  // 烧流动性
  const burnLP = async () => {
    try {
      const tx = await pairContract.transfer(
        zeroAddress,
        BigNumber.from(toWeiWithDecimal(tokenBalance, 18))
      );
      setBurnLoading(true)
      const data = await tx.wait();
      if (data.status === 1) {
        if (tx?.hash && data) {
          history('/dapps/tokencreation/result/' + tx?.hash + '/burnLP');
        }
        setBurnLoading(false)
      } else {
        NotificationChange('error', 'pair.burnfail');
        setBurnLoading(false)
      }
      setIsOpenStatus('');
      setOpen(false);
      setIsButton(false);
    } catch (e) {
      setIsButton(false);
      setBurnLoading(false)
      NotificationChange('error', 'pair.burnfail');
    }
  };

  // 查询额度，获取授权
  const Allowance = async () => {
    const erc20TokenContract= new ethers.Contract(
      erc20TokenAddress,
      ERC20Abi,
      signer
    )
    const address = await signer.getAddress();
    const ecr20Allowance = await erc20TokenContract.allowance(
      address,
      contractConfig?.uniswapV2RouterAddress,
    );
    console.log('ecr20Allowance', ecr20Allowance.toString());
    if(ecr20Allowance.lt(BigNumber.from(toWeiWithDecimal(erc20Amount, 18)))){
      setApproveLoading(true)
      const approveTx= await erc20TokenContract.approve(contractConfig?.uniswapV2RouterAddress, BigNumber.from(toWeiWithDecimal(erc20Amount, 18)));
      const tx= await approveTx.wait();
      if(tx?.status===1){
        setApproveLoading(false)
        return true;
      }else{
        NotificationChange('error', 'Approve failed')
        setApproveLoading(false)
        setIsButton(false)
        return false;
      }
    }
    if(ecr20Allowance.gte(BigNumber.from(toWeiWithDecimal(erc20Amount, 18)))) return true;

    
  };
  // 增加流动性
  const addLp = async () => {
    console.log('addLp');
    console.log('erc20Amount',erc20Amount)
    console.log('WETHAmount',WETHAmount)
    const isAllowance=await Allowance()
    console.log('isAllowance', isAllowance)

    if(isAllowance){
    try {
      setApproveLoading(false)
      const web3Provider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await web3Provider.getSigner();
      const v2RouterContract = new ethers.Contract(
        contractConfig?.uniswapV2RouterAddress,
        UniswapV2RouterAbi,
        signer
      );
      const walletAddress = await signer.getAddress();
      console.log('walletAddress',walletAddress)
      console.log('erc20TokenAddress',erc20TokenAddress)
      console.log(router?.pair)


      const addLqTx= await v2RouterContract.addLiquidityETH(
        erc20TokenAddress,
        BigNumber.from(toWeiWithDecimal(erc20Amount, 18)),
        0,
        0,
        router?.pair,
        Math.floor(Date.now() / 1000) + 60 *10,
        {gasLimit:3000000,value:BigNumber.from(toWeiWithDecimal(WETHAmount, 18))}
      )
      const tx = await addLqTx.wait()
      if(tx?.status===1){
        NotificationChange('success', 'Add Liquidity Success')
        setErc20Amount('')
        setWETHAmount('')
        await getPairInfo()
      }
      console.log(tx);
      setApproveLoading(false)
      setIsButton(false)
    } catch (error) {
      setApproveLoading(false)
      setIsButton(false)
      console.log(error)
    }
  }else{
    setApproveLoading(false)
    setIsButton(false)
  }
  };
  const removeLp = async () => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(loginProvider);
      const signer = await web3Provider.getSigner();
      const v2RouterContract = new ethers.Contract(
        contractConfig?.uniswapV2RouterAddress,
        UniswapV2RouterAbi,
        signer
      );
      const walletAddress = await signer.getAddress();
      let token: string = await pairContract.token0();
      if (token.toLowerCase() === contractConfig.wethAddress.toLowerCase()) {
        token = await pairContract.token1();
      }
      const balance = await pairContract.balanceOf(walletAddress);
      const approveTx = await pairContract.approve(
        contractConfig?.uniswapV2RouterAddress,
        balance
      );
      const tx = await approveTx.wait();
      if (tx?.status === 1) {
        const deadline = dayjs().add(10, 'm').unix();
        const removeLiquidityTx = await v2RouterContract.removeLiquidityETH(
          token,
          balance,
          0,
          0,
          walletAddress,
          deadline
        );
        const data = await removeLiquidityTx.wait();
        if (data.status === 1) {
          if (removeLiquidityTx?.hash && data) {
            history(
              '/dapps/tokencreation/result/' +
                removeLiquidityTx?.hash +
                '/removeLP'
            );
          }
        } else {
          NotificationChange('error', 'pair.removeLpfail');
        }
      }
      setIsOpenStatus('');
      setOpen(false);
      setIsButton(false);
    } catch (e) {
      NotificationChange('error', 'pair.removeLpfail');
      setIsButton(false);
      return null
    }
  };

  const lockLpToken = async () => {
    history(`/dapps/tokencreation/lockLpList/${router?.pair}`);
  };
  const data = useMemo(
    () => Object?.keys?.(infoData || {})?.map?.((key) => infoData[key]) ?? [],
    [infoData]
  );

  const item = (name?: string) => {
    return (
      <div style={{ color: '#fff', marginBottom: '6px' }}>
        <PairInfo data={pairInfoData} />
          {/* <div className='pair-manage-content'>
              <span className='pair-manage-trad-title'>Liquidity Pool</span>
              <div className='pair-manage-trad-content'>
                <span>{router?.t0}</span>
                <span>{resever0balance}</span>
              </div>
              <div className='pair-manage-trad-content'>
                <span>{router?.t1}</span>
                <span>{resever1balance}</span>
              </div>
            </div> */}
        {/* erc20Token */}
        {name==='Add'&&(
          <InputNumberWithString 
            value={erc20Amount}
            onChange={(value)=>{
              setErc20Amount(value)
            }}
            balance={erc20Token}
            clickMax={()=>{
              setErc20Amount(erc20Token)
            }}
            addonUnit = {router?.t0}
          />
        )}
        {/* {name==='Add'&&<p style={{height:'12px'}}></p>} */}
        {name==='Add'&&(

          // WETH
          <InputNumberWithString 
            value={WETHAmount}
            onChange={(value)=>{
              setWETHAmount(value)
            }}
            balance={tokenETH}
            clickMax={()=>{
              setWETHAmount(tokenETH)
            }}
            addonUnit = {'ETH'}
          />
        )}
        {name==='Burn'&&(
          <p>
            Once a token is burned, it becomes permanently inaccessible, thereby enhancing the token's credibility
          </p>
          // <InputNumberWithString 
          // value={burnAmount}
          // onChange={(value)=>{
          //   setBurnAmount(value)
          // }}
          // balance={tokenBalance}
          // clickMax={()=>{
          //   setBurnAmount(tokenBalance)
          // }}
          // addonUnit = {'LP'}
        // />
        )}
      </div>
    );
  };

  return (
    <>
      <ToLaunchHeader />
      <PageHeader
        className="launch-manage-token-header"
        // title={`${router?.t0} / ${router?.t1}`}
        title={!openTradeModal?'Trading Pair Management':`${router?.t0} / ${router?.t1}`}
      />
      {loading ? (
        <>
          {/* <InfoList className="manage-token-detail-info" data={data} /> */}
          <div className="pair-manage-trad">
            <div className='pair-manage-header'>
              <PairInfo data={pairInfoData}  />
            </div>
            <div className='pair-manage-content'>
              <span className='pair-manage-trad-title'>Liquidity Pool Reserves</span>
              <div className='pair-manage-trad-content'>
                <span>{router?.t0}</span>
                <span>{resever0balance}</span>
              </div>
              <div className='pair-manage-trad-content'>
                <span>{router?.t1}</span>
                <span>{resever1balance}</span>
              </div>
            </div>
            <div className='pair-manage-content' style={{margin:'32px auto'}}>
              <span className='pair-manage-trad-title'>Liquidity Lock / Burn</span>
              <div className='pair-manage-trad-content'>
                <span>WETH</span>
                <span>-</span>
              </div>
              <div className='pair-manage-trad-content'>
                <span>Maturity Date</span>
                <span>-</span>
              </div>
            </div>
          </div>
          <div className="pair-manage-button">
            <BottomButton
              text={t('token.LockLP')}
              onClick={() => {
                setIsOpenStatus('Lock');
                setOpen(true);
              }}
            />
            {/* <BottomButton
              // text={t('token.AddLQ')}
              text={'Add Liquidity'}
              onClick={() => {
                setIsOpenStatus('Add');
                setOpen(true);
              }}
            /> */}
            <BottomButton
              className='burn-lp-button'
              text={t('token.BurnLP')}
              onClick={() => {
                setIsOpenStatus('Burn');
                setOpen(true);
              }}
              danger
            />
            {/* {['remove', 'burn'].map((item: string) => {
              return (
                <BottomButton
                  key={item}
                  className=""
                  ghost
                  danger
                  text={
                    item === 'burn' ? t('token.BurnLP') : t('token.RemoveLP')
                  }
                  onClick={() => {
                    setIsOpenStatus(item);
                    setOpen(true);
                  }}
                />
              );
            })} */}
          </div>
        </>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <CommonModal
        open={open}
        title={
          isOpenStatus === 'Add' ? 'Add Liquidity' : t('token.BurnLP')
        }
        footer={null}
        className="mint-common-modal pari-LP-modal"
        onCancel={() => {
          if (!isButton) {
            setOpen(false);
            setIsOpenStatus('');
          }
        }}
      >
        {isOpenStatus === 'Add' && item('Add')}
        {isOpenStatus === 'Burn' && item('Burn')}
        {/* <p style={{ height: '20px' }}></p> */}
        <div
          style={{display:'flex',justifyContent:'space-around'}}
        >
        {/* <span
          className='cancel-button'
          onClick={() => {
            if (!isButton) {
              setOpen(false);
              setIsOpenStatus('');
            }
          }}
        >
          Cancel
        </span> */}
        <BottomButton
          className={'cancel-button'}
          ghost
          isBack={false}
          // loading={isButton}
          text={'Cancel'}
          onClick={() => {
            if (!isButton) {
              setOpen(false);
              setIsOpenStatus('');
            }
          }}
        />
        <BottomButton
          // ghost
          className={'confirm-button'}
          isBack={false}
          loading={isButton}
          text={approveLoading?
                'Approving':burnLoading?
                  'burning':isOpenStatus}
          onClick={() => {
            
            if (isOpenStatus === 'Add'&& erc20Amount &&WETHAmount) {
              // removeLp();
              setIsButton(true);
              addLp()
            } else if(isOpenStatus==='Burn'){
              setIsButton(true);
              burnLP();
            }
          }}
        />
        </div>
        {/* <BottomButton
          ghost
          isBack={false}
          loading={isButton}
          text={t('Slider.Confirm')}
          onClick={() => {
            setIsButton(true);
            if (isOpenStatus === 'remove') {
              removeLp();
            } else {
              burnLP();
            }
          }}
        /> */}
      </CommonModal>
    </>
  );
}

export default ManagePairDetail;
