import { TokenItemData } from "@/components/SelectToken"
import SelectTokenModal from "@/components/SelectTokenModal"
import DefaultTokenImg from "@/components/DefaultTokenImg"
import { useContext, useEffect, useRef, useState,useCallback} from "react"
import { CountContext } from '@/Layout';
// import Cookies from 'js-cookie';
import checkConnection from "@utils/checkConnect";
import { ethers,Wallet } from "ethers";
import getBalanceRpc from "@utils/getBalanceRpc";
import Decimal from "decimal.js";
import { InputNumber,Skeleton,Select  } from "antd";
import { debounce } from "lodash";
import { getAmountOut } from "@utils/swap/v2/getAmountOut";
import { getUniswapV2RouterContract } from "@utils/contracts";
import { getSwapFee } from '@utils/getSwapFee';
import Permit2ABI from "@utils/limit/Permit2ABI.json"
// import { ERC20Abi } from '@abis/ERC20Abi';
import { createOrder } from "@utils/limit/createOrder";
import { PermitSingle, getPermitSignature } from '@utils/permit2';
import { expandToDecimalsBN } from '@utils/utils';

// interface CreateOrderType{
//   initChainId?:string;
//   initToken?:[tokenIn:TokenItemData,tokenOut:TokenItemData];
// }
export default function CreateOrder() {
  const {
    provider,
    contractConfig,
    loginPrivider,
    chainId,
    // setChainId,
    transactionFee,
    setTransactionFee,
    // user,
    isLogin,
  } = useContext(CountContext)
  // const { getAll } = Request();
  const [showSelectModal, setShowSelectModal] = useState(false)
  // const [buttonLoading,setButtonLoading]=useState(false)
  const currentSetToken=useRef<'in'|'out'>('in')
  const currentInputToken=useRef<'pay'|'receive'>('pay')
  const [payTokenBalance,setPayTokenBalance]=useState<Decimal>(new Decimal(0))
  const [receiveTokenBalance,setReceiveTokenBalance]=useState<Decimal>(new Decimal(0))
  const [payToken,setPayToken]=useState<TokenItemData>()
  const [payTokenAmount,setPayTokenAmount]=useState<number | null>(0)
  const [receiveTokenAmount,setReceiveTokenAmount]=useState<number | null>(0)
  const [receiveToken,setReceiveToken]=useState<TokenItemData>()
  // const [ratename,setRatename]=useState('ETH')
  const [isExchangeRate,setIsExchangeRate]=useState(false)
  const [tokenRate,setTokenRate]=useState(0)
  const [payRate,setPayRate]=useState(0)
  const [rateLoading,setRateLoading]=useState(true)
  const [isShowUnitPrice,setIsShowUnitPrice]=useState(false)
  // paytoken的单位价格，U
  const [payTokenUnitPrice,setPayTokenUnitPrice]=useState<number>(0)
  // receivetoken的单位价格，U
  const [receiveTokenUnitPrice,setReceiveTokenUnitPrice]=useState<number>(0)
  // 过期时间
  const [expires,setExpires]=useState(3600)
  // 过期时间数组
  const expiresList=[
    {
      name:'1h',
      label:'1h',
      value:3600
    },
    {
      name:'1d',
      label:'1d',
      value:86400
    },
    {
      name:'1w',
      label:'1w',
      value:604800
    },
    {
      name:'1m',
      label:'1m',
      value:2592000
    }
  ]

  

  // 提交订单
  async function submitOrder() {
    const provider = new ethers.providers.Web3Provider(loginPrivider);
    const wallet = provider.getSigner();
    console.log(wallet);
    console.log(await wallet.getAddress());
    console.log(wallet.provider);
    
    
    // try{
    //   const token = Cookies.get('token');
    //   const res=await getAll({
    //     method:'post',
    //     url:'/api/v1/limit/createOrder',
    //     data:{orderParams},
    //     token,
    //     chainId
    //   })
    //   if(res.status===200){
    //     console.log(res.data);
    //   }
    // }catch(err){
    //   console.log(err);
    // }
  }
  // 获取授权签名
  const signPermit=async ({
    signerAddress,
    token,
    amount,
    permit2Contract,
    signer
  })=>{
    const { universalRouterAddress } = contractConfig;
    const dateTimeStamp=Number(String(Date.now()).slice(0, 10)) + 3600;
    const permitSingle:PermitSingle = {
      sigDeadline: dateTimeStamp,
      spender: universalRouterAddress,
      details: {
        token,
        amount,
        expiration: 0,
        nonce: 0,
      },
    };
    let signatureData;;
    try {
      const { eip712Domain, PERMIT2_PERMIT_TYPE, permit } =
        await getPermitSignature(
          Number(chainId),
          permitSingle,
          permit2Contract,
          signerAddress
        );

      const signature = await signer._signTypedData(
        eip712Domain,
        PERMIT2_PERMIT_TYPE,
        permit
      );
      signatureData = { permit, signature };
    } catch (e) {
      console.log(e)
    }
    return signatureData
  }
  // 创建订单
  const approveOder=async ()=>{
    console.log('createOrder:');
    const permit2Address='0x000000000022d473030f116ddee9f6b43ac78ba3'
    const web3Provider = new ethers.providers.Web3Provider(loginPrivider);
    const signer = await web3Provider.getSigner();
    const signerAddress = await signer.getAddress();
    const permit2Contract=new ethers.Contract(
      permit2Address,
      Permit2ABI,
      signer
    )
    const decimals =payToken.decimals;
    const signature=await signPermit({
      signerAddress,
      token:payToken.contractAddress,
      amount: expandToDecimalsBN(new Decimal(payTokenAmount), Number(decimals)),
      permit2Contract,
      signer
    })
    console.log('signature:',signature);
    if(signature){

    
    // const successApprove = recipent===1
    // 获取签名
    const priviteKey='140773e922cca018749e89c02f0943486796ffc124bc88bba7b28e9f6aa16c6c'
    const sepoliaProvider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
    const orderCreator=new Wallet(priviteKey,sepoliaProvider)
    // const provider = new ethers.providers.Web3Provider(loginPrivider);
    // const wallet = provider.getSigner();
    console.log(orderCreator);
    // console.log(wallet);
    const receipt: string = "0x0000000000000000000000000000000000000000";

    if(payTokenAmount!==0&&receiveTokenAmount!==0){
      const payTokenAmountInWei = ethers.utils.parseUnits(payTokenAmount.toString(), 18);
      const receiveTokenAmountInWei = ethers.utils.parseUnits(receiveTokenAmount.toString(), 18);
      // 发起创建订单请求
      try {
        const orderReponse=await createOrder(
          chainId,orderCreator,payToken.contractAddress,receiveToken.contractAddress,receipt,payTokenAmountInWei,receiveTokenAmountInWei,expires
        )
        console.log(orderReponse);
        // submitOrder(orderReponse)
        submitOrder()
      } catch (error) {
        console.log(error);
        throw(error)
      }
    }
  }
  }
  // 当前token的余额
  const getTokenBalance=useCallback(
    async (token,dispatch)=>{
      const {wethAddress}=contractConfig
      if(checkConnection()&&token){
        const injectProvider=new ethers.providers.Web3Provider(loginPrivider)
        const balance=await getBalanceRpc(injectProvider,token,wethAddress)
        dispatch(balance)
        console.log('balance:'+Number(balance));
        
      }
    },
    [contractConfig,loginPrivider]
  )
  // 计算手续费
  const getTransactionFee = async (data) => {
    // 未解决：传swaptype：2不返回值
    const fee = await getSwapFee({ ...data, swapType: 2 });
    setTransactionFee({
      ...transactionFee,
      limit: fee,
    });
    console.log('fee:'+Number(fee))
  };
  // 计算输入Token的单位价格，U单位
  const getToeknUnitPrice=async(token:TokenItemData,type:'pay'|'receive')=>{
    if(!payToken?.contractAddress){
      return Promise.resolve('');
    }
    // USDT
    const { defaultTokenOut,uniswapV2RouterAddress } = contractConfig
    const params=[
      chainId,
      provider,
      await getUniswapV2RouterContract(provider,uniswapV2RouterAddress),
      [token.contractAddress,Number(token.decimals)],
      [defaultTokenOut.contractAddress,Number(defaultTokenOut.decimals)],
      new Decimal(1),
      new Decimal(0),
      // 暂定5%
      // transactionFee.limit
      new Decimal(0),
    ].filter((item)=>item!==null)
    let amount:Decimal;
    amount=await getAmountOut.apply(null,params)
    console.log(token.symbol,' Unit price:'+Number(amount.toFixed(6)));
    if(type==='pay') setPayTokenUnitPrice(Number(amount.toFixed(6)))
    if(type==='receive') setReceiveTokenUnitPrice(Number(amount.toFixed(6)))
  }
  // 计算paytoken与recevicetoken的汇率
  const getExchangeRate=async()=>{
    setRateLoading(true)
    setIsExchangeRate(false)
    if(!payToken?.contractAddress&&!receiveToken?.contractAddress){
      return Promise.resolve('');
    }
    const { uniswapV2RouterAddress } = contractConfig;
    const params=[
      chainId,
      provider,
      await getUniswapV2RouterContract (provider,uniswapV2RouterAddress),
      [payToken.contractAddress,Number(payToken.decimals)],
      [receiveToken.contractAddress,Number(receiveToken.decimals)],
      new Decimal(1),
      new Decimal(0),
      // 暂定5%
      transactionFee.limit
      // 0
    ].filter((item)=>item!==null)
    let amount:Decimal;
    amount=await getAmountOut.apply(null,params)
    console.log('paytoken-receivetoken:'+Number(amount.toFixed(6)));
    setPayRate(Number(amount.toFixed(6)))
    setRateLoading(false)
    setTokenRate(Number(amount.toFixed(6)))
  }
  // 计算receice的token数量
  const getAmount=async(
    type: 'pay' | 'receive',
    value: number | null,
    // quotePath: string[]
  ) => {
    if(value==null||value===0) return;
    if(((type==='pay' || type==='receive')&& !payToken?.contractAddress) || !receiveToken?.contractAddress){
      return;
    }
    // setButtonLoading(true)
      if(type==='pay'){
        console.log('pay')
        try {
          console.log(payTokenAmount);
          console.log(tokenRate);
          console.log(payTokenAmount*tokenRate)
          // setTokenRate(Number(amount.toString()))
        } catch (error) {
          console.log(error);
          
          return null
        }
      }
    
    // 其他设置，
  }
  // 获取汇率
  const getTokenRateDebounce=useCallback(debounce(getExchangeRate,500),[payToken,receiveToken,provider])
  // 防抖获取数据
  const getAmountDebounce=useCallback(debounce(getAmount,500),[
    payToken,
    receiveToken,
    provider
  ])
  // paytoken与receivetoken发生改变，重新计算汇率，然后算一个paytoken值多少receivetoken
  useEffect(()=>{
    setPayRate(tokenRate)
  },[tokenRate])
  // 自动计算手续费
  useEffect(() => {
    getTransactionFee({ chainId, provider, payType:0 });
  }, [chainId, provider]);
  // 监听变化，自动计算pay余额，paytoken的市价
  useEffect(()=>{
    if(isLogin){
      getTokenBalance(payToken?.contractAddress,setPayTokenBalance)
      console.log(payToken?.symbol);
    }
    getToeknUnitPrice(payToken,'pay')
  },[payToken,isLogin,loginPrivider,chainId])
  // receiveToken改变，自动获取receivetoken的单位价格
  useEffect(()=>{
    getToeknUnitPrice(receiveToken,'receive')
  },[receiveToken])

  useEffect(()=>{
    if(isLogin){
      getTokenBalance(receiveToken?.contractAddress,setReceiveTokenBalance)
      console.log(receiveToken?.symbol);
    }
  },[receiveToken,isLogin,loginPrivider,chainId])
  useEffect(()=>{
    console.log('payTokenBalance:'+payTokenBalance)
    console.log('receiveTokenBalance:'+receiveTokenBalance)
  },[payTokenBalance,receiveTokenBalance])
  useEffect(()=>{
    console.log(tokenRate);
    if(tokenRate!==0){
      setRateLoading(false)
      setReceiveTokenAmount(Number(payTokenAmount*tokenRate))
    }
    if(tokenRate===0){
      setRateLoading(true)
      getTokenRateDebounce()
    }
  },[tokenRate])
  // const initData=()=>{
  //   if(initToken?.length){
  //     const [initTokenIn, initTokenOut] = initToken;
  //     setPayToken(initTokenIn)
  //     setReceiveToken(initTokenOut)
  //   }
  //   if(initChainId){
  //     setChainId(initChainId)
  //   }
  // }
  // useEffect(()=>{
  //   initData()
  // },[initToken])
  // 过期时间
  useEffect(() => {
    console.log('exprie in:'+expires);
  },[expires])
  useEffect(()=>{
    setReceiveTokenAmount(Number(payTokenAmount*tokenRate))
    getToeknUnitPrice(receiveToken,'receive')
  },[payTokenAmount])
  // receivetoken的数量改变，获取单位价格，计算receivetoken的市价
  useEffect(()=>{
    // if(receiveTokenAmount){
    //   setReceiveTokenUnitPrice(Number(receiveTokenAmount/payTokenAmount))
    // }
    getToeknUnitPrice(receiveToken,'receive')
  },[receiveTokenAmount])
  useEffect(()=>{
    const { defaultTokenIn, defaultTokenOut } = contractConfig;
    setPayToken(defaultTokenIn);
    setReceiveToken(defaultTokenOut);
  },[contractConfig])
  // toekn发生改变
  useEffect(()=>{
    console.log(payToken);
    console.log(receiveToken);
    getExchangeRate()
    setRateLoading(true)
    setTokenRate(0)
  },[payToken,receiveToken])
  return (
  <div className="createOrder">
    <div className="wrapper">
      <div className="pay token-card">
        <div className="token-card-header dis-between">
          <span className="token-card-header-left">
            Pay
          </span>
          { isLogin?(
            <span className="token-card-header-right">
              Balance:{payTokenBalance?.toFixed(4).toString?.()||'0'}
            </span>
          ):(<></>)
          }
        </div>
        <div className="token-card-body dis-between">
          <div className="token-card-body-left">
            <div 
              className="limit-select-token" 
              onClick={()=>{
                currentSetToken.current='in'
                setShowSelectModal(true)
                }}>
              <DefaultTokenImg
                name={payToken?.symbol}
                icon={payToken?.logoUrl}
              />
              <span className="token-symbol">{payToken?.symbol}</span>
              <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
            </div>
          </div>
          <InputNumber
            className="token-input"
            variant="borderless"
            controls={false}
            value={payTokenAmount}
            onChange={(v)=>{
              setPayTokenAmount(v<Number(payTokenBalance)?v || 0:Number(payTokenBalance))
              if(currentInputToken.current!=='pay')
                currentInputToken.current='pay'
              getAmountDebounce('pay',v)
            }}
          />
        </div>
        <div className="token-card-footer dis-between">
          <span className="token-card-footer-left">
            {payToken?.symbol}
          </span>
          <span className="token-card-footer-right">
            ~${(payTokenAmount*payTokenUnitPrice)?.toFixed(6)||0}
          </span>
        </div>
      </div>
      <div className="receive token-card">
      <div className="token-card-header dis-between">
          <span className="token-card-header-left">
            Receive
          </span>
          { isLogin?(
            <span className="token-card-header-right">
              Balance:{receiveTokenBalance?.toFixed(4).toString?.()||'0'}
            </span>
          ):(<></>)
          }
        </div>
        <div className="token-card-body dis-between">
          <div className="token-card-body-left">
            <div
              className="limit-select-token"
              onClick={()=>{
                currentSetToken.current='out'
                setShowSelectModal(true)
              }}
            >
              <DefaultTokenImg
                name={receiveToken?.symbol}
                icon={receiveToken?.logoUrl}
              />
              <span className="token-symbol">{receiveToken?.symbol}</span>
              <img className="arrow-down-img" src="/arrowDown.svg" alt="" />
            </div>
          </div>
          <InputNumber
            className="token-input"
            variant="borderless"
            controls={false}
            value={receiveTokenAmount}
            onChange={(v)=>{
              setReceiveTokenAmount(v || 0)
              setPayTokenAmount(Number(v/tokenRate)<Number(payTokenBalance)?Number(v/tokenRate):Number(payTokenBalance))
              if(currentInputToken.current!=='receive')
                currentInputToken.current='receive'
              getAmountDebounce('receive',v)
            }}
          />
        </div>
        <div className="token-card-footer dis-between">
          <span className="token-card-footer-left">
            {receiveToken?.symbol}
          </span>
          <span className="token-card-footer-right">
            ~${(receiveTokenAmount*receiveTokenUnitPrice)?.toFixed(6)||0}
          </span>
        </div>
      </div>
    </div>
    <div className="wrapper choose-card">
      <div className="choose-card-left dis-col">
        <span>Pay {isExchangeRate?receiveToken?.symbol:payToken?.symbol} at rate</span>
        {
          rateLoading ? ( <Skeleton.Button active size="small" />
          ):(
            <InputNumber
              className="rate-input"
              variant="borderless"
              controls={false}
              value={payRate}
              onChange={(v)=>{
                setTokenRate(v)
                setPayRate(v)
              }}
            />
          )
        }
        
      </div>
      <div className="choose-card-middle dis-col">
        <span className="market-price" onClick={()=>getTokenRateDebounce()}>Set to market</span>
        <div className="exchange-rate" onClick={()=>{
          setIsExchangeRate(!isExchangeRate)
          setPayRate(1/payRate)
        }}>
          <span>{isExchangeRate?payToken?.symbol:receiveToken?.symbol}</span>
          <img src="/exchange-icon.svg" alt="" />
        </div>
      </div>
      <div className="col-hr"></div>
      <div className="choose-card-right dis-col">
        <span>Expires in</span>
        <Select
          rootClassName="expires-select"
          popupClassName="expires-list"
          defaultValue={{value:3600,label:'1h'}}
          variant="borderless"
          onChange={(v) => {
            setExpires(Number(v))
          }}
          options={expiresList}
        />
      </div>
    </div>
    {/* <span className="approve-btn">Approve</span> */}
    <span
      className={`place-btn ${payToken&&receiveToken&&payTokenAmount!==0 && receiveTokenAmount!==0 ? 'order-active' : ''} ` }
      onClick={() => {
        approveOder()
        // submitOrder()
      }
}
    >{isLogin?'Place an order':'Connect Wallet'}</span>
    <div className="unit-price">
      <div className="unit-price-row">
        <div
          className="unit-price-row-left"
          onClick={()=>{setIsShowUnitPrice(!isShowUnitPrice)}}
        >
          <span>{receiveToken?.symbol} price</span>
          <img style={{width:'14px',transform:`rotate(${isShowUnitPrice?'180deg':'0deg'})`}} src="/arrowDown.svg" />
        </div>
        <div className="unit-price-row-right">
          <span>{(1/tokenRate).toFixed(8)}{payToken?.symbol} ~ </span>
          <span style={{color:'#86f097'}}>${((1/tokenRate)*payTokenUnitPrice).toFixed(8)}</span>
          {/* <span style={{color:'#86f097'}}>${}</span> */}
        </div>
      </div>
      <div className="unit-price-row" style={{opacity:isShowUnitPrice?'1':'0'}}>
        <div className="">
          <span>{payToken?.symbol} price</span>
        </div>
        <div>
          <span>{tokenRate.toFixed(4)} {receiveToken?.symbol} ~ </span>
          <span style={{color:'#86f097'}}>$ {(tokenRate*receiveTokenUnitPrice).toFixed(8)}</span>
        </div>
      </div>
    </div>
    <SelectTokenModal
      open={showSelectModal} 
      onChange={(data)=>{
        if(currentSetToken.current==='in'){
          setPayToken(data)
        }else{
          setReceiveToken(data)
        }
        setShowSelectModal(false)
      }} 
      chainId={chainId} 
      onCancel={()=>{setShowSelectModal(false)}} 
    />
  </div>
  )
}