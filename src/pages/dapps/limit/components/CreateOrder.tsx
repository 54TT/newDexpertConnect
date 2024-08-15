import { TokenItemData } from "@/components/SelectToken"
import SelectTokenModal from "@/components/SelectTokenModal"
import DefaultTokenImg from "@/components/DefaultTokenImg"
import { useContext, useEffect, useRef, useState,useCallback} from "react"
import { CountContext } from '@/Layout';
import Cookies from 'js-cookie';
import checkConnection from "@utils/checkConnect";
import {  ethers } from "ethers";
import getBalanceRpc from "@utils/getBalanceRpc";
import Decimal from "decimal.js";
import BigNumber from 'bignumber.js';
import { Skeleton,Select ,Button, Input } from "antd";
import { debounce } from "lodash";
import { getAmountOut } from "@utils/swap/v2/getAmountOut";
import { getUniswapV2RouterContract } from "@utils/contracts";
import { getSwapFee } from '@utils/getSwapFee';
// import { ERC20Abi } from '@abis/ERC20Abi';
import { createOrder } from "@utils/limit/createOrder";
import Request from '@/components/axios';
import { useTranslation } from "react-i18next";
import NotificationChange from "@/components/message";
// interface CreateOrderType{
//   initChainId?:string;
//   initToken?:[tokenIn:TokenItemData,tokenOut:TokenItemData];
// }
export default function CreateOrder() {
  const {
    provider,
    contractConfig,
    loginProvider,
    chainId,
    // setChainId,
    transactionFee,
    setTransactionFee,
    user,
    isLogin,
  } = useContext(CountContext)
  const { getAll } = Request();
  const {t}=useTranslation()
  const [showSelectModal, setShowSelectModal] = useState(false)
  // const [buttonLoading,setButtonLoading]=useState(false)
  const currentSetToken=useRef<'in'|'out'>('in')
  const currentInputToken=useRef<'pay'|'receive'>('pay')
  const [payTokenBalance,setPayTokenBalance]=useState<Decimal>(new Decimal(0))
  const [receiveTokenBalance,setReceiveTokenBalance]=useState<Decimal>(new Decimal(0))
  const [payToken,setPayToken]=useState<TokenItemData>()
  const [payTokenAmount,setPayTokenAmount]=useState<string | null>('')
  const [receiveTokenAmount,setReceiveTokenAmount]=useState<string | null>('')
  const [receiveToken,setReceiveToken]=useState<TokenItemData>()
  // const [ratename,setRatename]=useState('ETH')
  const [isExchangeRate,setIsExchangeRate]=useState(false)
  // pay/receive token汇率
  const [tokenRate,setTokenRate]=useState(0)
  const [tokenRateBN,setToeknRateBN]=useState<BigNumber>()
  // const [tokenRateDE,setToeknRateDE]=useState<Decimal>()
  const [payRate,setPayRate]=useState(0)
  const [rateLoading,setRateLoading]=useState(true)
  const [createLoading,setCreateLoading]=useState(false)
  // 底部单位price展示
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
      name:'5m',
      label:'5m',
      value:5*60
    },
    {
      name:'1h',
      label:'1h',
      value:3600
    },
    {
      name:'12h',
      label:'12h',
      value:12*60*60,
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
      name:'1mo',
      label:'1mo',
      value:2592000
    }
  ]
  
  // number去零
  const numberToFixed=(num:number)=>{
    // 检查是否有小数部分
    if (num % 1 === 0) {
      // 如果是整数，直接返回整数部分
      return num?.toString();
    } else {
    // 如果有小数部分，使用 toFixed 并移除尾部的无意义零
    let numStr = num.toFixed(6);
    numStr = numStr.replace(/(\.\d*?[1-9])0+$/, '$1'); // 移除小数点后的无意义零
    numStr = numStr.replace(/\.$/, ''); // 移除末尾的小数点
    return numStr;
  }
  }
  // 提交订单
  async function submitOrder(order) {
    console.log('---send order---');
    console.log(order);
    try{
      const token = Cookies.get('token');
      const res=await getAll({
        method:'post',
        url:'/api/v1/limit/createOrder',
        data:{
          "order": {
            ...order,
            // "decayStartTime": "1721049887",
            // "decayEndTime": "1721136287",
            // "deadline": "1721136287",
            // "fillerAt": "1721136287",
            // price:tokenRateBN,
            uid:user.uid,
            inputTokenLogo:payToken.logoUrl,
            outputTokenLogo:receiveToken.logoUrl,
          }
        },
        token,
        chainId
      })
      console.log(res);
      
      if(res?.status===200){
        console.log('oreder submit success');
        // getOrderList(1,chainId)
        setCreateLoading(false)
        NotificationChange('success',t('limit.createOrderSuccess'))
      }
    }catch(err){
      console.log(err);
      NotificationChange('warning',t('limit.createOrderError'))
      setCreateLoading(false)
    }finally{
      setCreateLoading(false)
    }
  }

  // 创建订单
  const approveOder=async ()=>{
    console.log('createOrder:');
    console.log('---now time---')
    console.log(Number(payTokenAmount)/Number(receiveTokenAmount));
    const web3Provider = new ethers.providers.Web3Provider(loginProvider);
    const signer = await web3Provider.getSigner();
    const receipt: string = await signer.getAddress();
    console.log('receipt:',receipt);

    if(payTokenAmount && receiveTokenAmount){
      console.log('---createOrder---')
      const payTokenAmountInWei = ethers.utils.parseUnits(payTokenAmount, payToken.decimals);
      const receiveTokenAmountInwei =ethers.utils.parseUnits(Number(receiveTokenAmount).toFixed(Number(receiveToken.decimals)).toString(), receiveToken.decimals);

      // 发起创建订单请求
      try {
        const orderParams=await createOrder(
          chainId,
          signer,
          payToken.contractAddress,
          receiveToken.contractAddress,
          receipt,
          payTokenAmountInWei,
          receiveTokenAmountInwei,
          expires,
          tokenRateBN.toString()
        )
        console.log('return orderParams')
        console.log(orderParams);
        if(orderParams){
          submitOrder(orderParams)
          setPayTokenAmount('')
          setReceiveTokenAmount('')
        }else{
          NotificationChange('warning',t('limit.createOrderError'))
          setCreateLoading(false)
        }
      } catch (error) {
        console.log(error);
        setCreateLoading(false)
        throw(error)
      }
    }
  // }
  }
  // 当前token的余额
  const getTokenBalance=useCallback(
    async (token,dispatch)=>{
      const {wethAddress}=contractConfig
      if(checkConnection()&&token&&loginProvider){
        // console.log(loginProvider)
        const injectProvider=new ethers.providers.Web3Provider(loginProvider)
        try {
          const balance=await getBalanceRpc(injectProvider,token,wethAddress)
          dispatch(balance)
        } catch (error) {
          // console.log(error);

        }
      }
    },
    [contractConfig,loginProvider,user]
  )
  // 计算手续费
  const getTransactionFee = async (data) => {
    // 未解决：传swaptype：2不返回值
    try{
      const fee = await getSwapFee({ ...data, swapType: 2 });
      setTransactionFee({
        ...transactionFee,
        limit: fee,
      });
    }catch(e){
      // console.log('getSwapFee error');
      // console.log(e);
    }
    // console.log('fee:'+Number(fee))
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
    try {
      amount=await getAmountOut.apply(null,params)
      if(type==='pay') setPayTokenUnitPrice(Number(amount.toFixed(6)))
        if(type==='receive') setReceiveTokenUnitPrice(Number(amount.toFixed(6)))
    } catch (error) {
      // console.log(error);
      
    }
    // console.log(token.symbol,' Unit price:'+Number(amount.toFixed(6)));
    // 展示只截取6位
    
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
      // amountIn
      new Decimal(1),
      // slippage
      new Decimal(0),
      // fee,暂定5%
      transactionFee.limit
      // new Decimal(0),
      // 0
    ].filter((item)=>item!==null)
    let amount:Decimal
    try {
      amount=await getAmountOut.apply(null,params)
    } catch (error) {
      console.log(error);
    }
    // console.log(payToken.symbol,'----',receiveToken.symbol+amount.toString());
    // console.log(amount);
    // console.log(amount.toString());
    const amountValue=new Decimal(amount)
    // console.log(new BigNumber(amountValue.toString()));
    setToeknRateBN(new BigNumber(amountValue.toString()))
    // setToeknRateDE(amount)
    setPayRate(Number(amount.toFixed(6)))
    setRateLoading(false)
    setTokenRate(Number(amount.toFixed(6)))
  }
  // 计算receice的token数量
  const getAmount=async(
    type: 'pay' | 'receive',
    value: string | null,
    // quotePath: string[]
  ) => {
    if(value==null||value==='0'||value==='') return;
    if(((type==='pay' || type==='receive')&& !payToken?.contractAddress) || !receiveToken?.contractAddress){
      return;
    }
    // setButtonLoading(true)
      if(type==='pay'){
        // console.log('pay')
        try {
          // console.log(payTokenAmount);
          // console.log(tokenRate);
          // console.log(payTokenAmount*tokenRate)
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
    // console.log(payToken?.symbol,'---',receiveToken?.symbol,'tokenRate:',tokenRate);
    // console.log(tokenRateBN);
    setToeknRateBN(new BigNumber(tokenRate))
  },[tokenRate])
  // 自动计算手续费
  useEffect(() => {
    getTransactionFee({ chainId, provider, payType:0 });
  }, [chainId, provider]);

  // 监听变化，自动计算token余额，token的市价
  useEffect(()=>{
    if(loginProvider){
      getTokenBalance(receiveToken?.contractAddress,setReceiveTokenBalance)
      getTokenBalance(payToken?.contractAddress,setPayTokenBalance)
    }
    getToeknUnitPrice(payToken,'pay')
    getToeknUnitPrice(receiveToken,'receive')
    // console.log(payToken);
    // console.log(receiveToken);
  },[payToken,receiveToken,isLogin,loginProvider,chainId,user])

  useEffect(()=>{
    // console.log(tokenRate);
    if(Number(payTokenAmount)<=Number(payTokenBalance)){
      if(tokenRate!==0&&payTokenAmount){
        setRateLoading(false)
        setReceiveTokenAmount((Number(payTokenAmount)*tokenRate).toString())
      }
    }else{
      setPayTokenAmount(String(payTokenBalance))
      setRateLoading(false)
      setReceiveTokenAmount((Number(payTokenAmount)*tokenRate).toString())
    }
    // if(tokenRate===0||tokenRate===undefined){
    if(tokenRate===undefined){
      setTokenRate(0)
      setRateLoading(true)
      getTokenRateDebounce()
    }
  },[tokenRate])

  useEffect(()=>{
    if(payTokenAmount){
      setReceiveTokenAmount((Number(payTokenAmount)*tokenRate).toString())
      // console.log(tokenRateDE.mul(payTokenAmount).toString())
    }
    getToeknUnitPrice(receiveToken,'receive')
  },[payTokenAmount])

  // receivetoken的数量改变，获取单位价格，计算receivetoken的市价
  useEffect(()=>{
    getToeknUnitPrice(receiveToken,'receive')
  },[receiveTokenAmount])

  useEffect(()=>{
    if(contractConfig?.defaultTokenIn){
    const { defaultTokenIn, defaultTokenOut } = contractConfig;
    if(defaultTokenIn) setPayToken(defaultTokenIn);
    if(defaultTokenOut) setReceiveToken(defaultTokenOut);
    }
  },[contractConfig])
  // toekn发生改变
  useEffect(()=>{
    getExchangeRate()
    setRateLoading(true)

    setTokenRate(0)
  },[payToken,receiveToken])
  useEffect(()=>{
    setReceiveTokenAmount('')
    setPayTokenAmount('')
  },[receiveToken,payToken])

  return (
  <div className="createOrder">
    <div className="wrapper">
      <div className="pay token-card">
        <div className="token-card-header dis-between">
          <span className="token-card-header-left">
          {t("limit.pay")}
          </span>
          { isLogin?(
            <span className="token-card-header-right">
              {t("limit.balance")}:{rateLoading? (
                <Skeleton.Button active size="small" />
              ):(
                payTokenBalance?.toString?.()||'0'
                )}
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
          <Input 
            rootClassName="amount-input"
            variant="borderless"
            value={payTokenAmount}
            placeholder="0"
            disabled={!isLogin}
            style={{cursor:isLogin?'':'not-allowed'}}
            onChange={(e)=>{
              if(Number(e.target.value)<=Number(payTokenBalance)) setPayTokenAmount(e.target.value)
              if(Number(e.target.value)>Number(payTokenBalance)) setPayTokenAmount(payTokenBalance.toString())
              if(currentInputToken.current!=='pay')
                currentInputToken.current='pay'
            }}
          />
          {/* <InputNumber
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
          /> */}
        </div>
        <div className="token-card-footer dis-between">
          <span className="token-card-footer-left">
            {payToken?.symbol}
          </span>
          <span className="token-card-footer-right">
            {isLogin ? (
              <>
                ~${(Number(payTokenAmount)*payTokenUnitPrice)===0?0:(Number(payTokenAmount)*payTokenUnitPrice)?.toFixed(6)}
              </>
            ):(
              <></>
            )}
          </span>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'0px',margin:'4px 0'}}>
        <span className="limit-icon">
          <img src="/down-icon-black.svg" />
        </span>
      </div>
      <div className="receive token-card">
      <div className="token-card-header dis-between">
          <span className="token-card-header-left">
          {t("limit.receive")}
          </span>
          { isLogin?(
            <span className="token-card-header-right text-easy-in">
              {t("limit.balance")}:{rateLoading? (
                <Skeleton.Button active size="small" />
              ):(
                receiveTokenBalance?.toFixed(4).toString?.()||'0'
              )}
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
          <Input 
            rootClassName="amount-input"
            variant="borderless"
            placeholder="0"
            value={receiveTokenAmount}
            disabled={!isLogin}
            style={{cursor:isLogin?'':'not-allowed'}}
            onChange={(e)=>{
              if (/^\d*\.?\d*$/.test(e.target.value)) {
                setReceiveTokenAmount(e.target.value);
              }
              // setReceiveTokenAmount(e.target.value)
              if(currentInputToken.current!=='receive')
                currentInputToken.current='receive'
              getAmountDebounce('receive',e.target.value)
            }}
          />
          {/* <InputNumber
            className="token-input"
            variant="borderless"
            controls={false}
            value={receiveTokenAmount}
            onChange={(v)=>{
              setReceiveTokenAmount(v || 0)
              // setPayTokenAmount(Number(v/tokenRate)<Number(payTokenBalance)?Number(v/tokenRate):Number(payTokenBalance))
              if(currentInputToken.current!=='receive')
                currentInputToken.current='receive'
              getAmountDebounce('receive',v)
            }}
          /> */}
        </div>
        <div className="token-card-footer dis-between">
          <span className="token-card-footer-left">
            {receiveToken?.symbol}
          </span>
          <span className="token-card-footer-right">
            {isLogin ? (
              <>
                ~${(Number(receiveTokenAmount)*receiveTokenUnitPrice)===0?0:(Number(receiveTokenAmount)*receiveTokenUnitPrice)?.toFixed(6)}
              </>
              ):(
                <></>
              )}
          </span>
        </div>
      </div>
    </div>
    <div className="wrapper choose-card">
      <div className="choose-card-left dis-col">
        <span>{t("limit.pay")} {isExchangeRate?receiveToken?.symbol:payToken?.symbol} {t("limit.at rate")}</span>
        {
          rateLoading ? ( <Skeleton.Button active size="small" />
          ):(
            <Input
              className="rate-input"
              variant="borderless"
              // controls={false}
              value={payRate}
              disabled={!isLogin}
              onChange={(e)=>{
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                  setTokenRate(Number(e.target.value));
                  setPayRate(Number(e.target.value));
                }
              }}
            />
          )
        }
        
      </div>
      <div className="choose-card-middle dis-col">
        <span className="market-price" onClick={()=>getTokenRateDebounce()}>{t("limit.market")}</span>
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
        <span style={{textAlign:'center'}}>{t("limit.expires")}</span>
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
    {/* <span
      className={`place-btn ${payToken&&receiveToken&&payTokenAmount && receiveTokenAmount ? 'order-active' : ''} ` }
      onClick={() => {
        approveOder()
        // submitOrder()
      }
    }
    >{isLogin?'Place an order':'Connect Wallet'}</span> */}
    <Button
      rootClassName="create-order-btn"
      className={`${payToken&&receiveToken&&payTokenAmount && receiveTokenAmount ? 'order-active' : ''} ` }
      loading={createLoading}
      disabled={!payTokenAmount && !receiveTokenAmount}
      onClick={() => {
        approveOder()
        setCreateLoading(true)
      }}
    >
      {isLogin?t("limit.place an order"):t("limit.connect")}
    </Button>
    <div className="unit-price">
      <div className="unit-price-row">
        <div
          className="unit-price-row-left"
          onClick={()=>{setIsShowUnitPrice(!isShowUnitPrice)}}
        >
          <span>{receiveToken?.symbol} {t("limit.price")}</span>
          <img style={{width:'14px',transform:`rotate(${isShowUnitPrice?'180deg':'0deg'})`}} src="/arrowDown.svg" />
        </div>
        <div className="unit-price-row-right">
          {
            rateLoading?(
              <Skeleton.Button active size="small" />
            ):(
              <span>{numberToFixed(1/tokenRate)} </span>
            )
          }
          <span>{payToken?.symbol} ~ </span>
          <span style={{color:'#86f097'}}> $</span>
          {
            rateLoading?(
              <Skeleton.Button active size="small" />
            ):(
              <span style={{color:'#86f097'}}>{numberToFixed(((1/tokenRate)*payTokenUnitPrice))}</span>
            )
          }
          
          {/* <span style={{color:'#86f097'}}>${}</span> */}
        </div>
      </div>
      <div className="unit-price-row" style={{opacity:isShowUnitPrice?'1':'0'}}>
        <div className="">
          <span>{payToken?.symbol} {t("limit.price")}</span>
        </div>
        <div>
          {
            rateLoading?(
              <Skeleton.Button active size="small" />
            ):(
              <span>{numberToFixed(tokenRate)} </span>
            )
          }
          <span>{receiveToken?.symbol} ~ </span>
          <span style={{color:'#86f097'}}>
            $ 
          </span>
          {
            rateLoading?(
              <Skeleton.Button active size="small" />
            ):(
              <span style={{color:'#86f097'}}>{numberToFixed(tokenRate*receiveTokenUnitPrice)}</span>
            )
          }
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
