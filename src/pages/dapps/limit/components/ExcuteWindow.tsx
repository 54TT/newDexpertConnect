import {  useState,useContext, useEffect, useCallback } from "react";
import { Button,Skeleton } from "antd";
import { CountContext } from '@/Layout';
import DefaultTokenImg from "@/components/DefaultTokenImg";
import checkConnection from "@utils/checkConnect";
import {BigNumber} from 'bignumber.js';
import executeOrder from '@utils/limit/executeOrder'
import { ethers,BigNumber as BNtype } from "ethers";
import {useTranslation} from 'react-i18next';
import { getUniswapV2RouterContract } from "@utils/contracts";
import Decimal from "decimal.js";
import { getAmountOut } from "@utils/swap/v2/getAmountOut";
import getBalanceRpc from "@utils/getBalanceRpc";
import {setMany} from "@utils/change";
const ExecuteWindow = ({
  order,
  setShowDetailsWindow,
  setShowExecuteWindow,
}) => {
  const {
    chainId,
    loginProvider,
    contractConfig,
    provider
  } = useContext(CountContext)
  const {t}=useTranslation()
  // 滑动条的值，百分比
  const [silderValue,setSliderValue]=useState(100)
  // 选择支付的token
  // const [payToken,setPayToken]=useState()
  // const [showSelect,setShowSelect]=useState(false)
  const [buttonLoading,setButtonLoading]=useState(false)
  // const [buttonDisable,setButtonDisable]=useState(true)
  const [tokenInputAmount,setTokenInputAmount]=useState('')
  const [tokenOutputAmount,setTokenOutputAmount]=useState('')
  const [inputToken,setInputToken]=useState()
  // 想要兑换多少数量的token0
  // const [exchangeAmount,setExchangeAmount]=useState(0)
  // 选择支付token1的数量
  const [payTokenAmount,setPayTokenAmount]=useState('')
  // 市场当前汇率
  const [tokenRate,setTokenRate]=useState('')
  // 涨幅跌幅
  const [rateRelation,setRateRelation]=useState('equality')
  const [diffRate,setDiffRate]=useState('0')
  const [balanceLoading,setBalanceLoading]=useState(true)
  const [rateLoading,setRateLoading]=useState(true)
  // 支付token余额
  const [payTokenBalance,setPayTokenBalance]
  =useState<Decimal>(new Decimal(0))
  // const marks= {
  //   0: '0%',
  //   20: '20%',
  //   40: '40%',
  //   60: '60%',
  //   80: '80%',
  //   100: '100%',
  // };
  // 执行限价兑换订单
  const selcetExecuteOrder=async ()=>{
    console.log('---execute order---');
    setButtonLoading(true)
    const output=JSON.parse(order.outputs)[0]
    const web3Provider=new ethers.providers.Web3Provider(loginProvider)
    const value: BNtype = output.token === ethers.constants.AddressZero ? output.amount : BNtype.from(0);
    const signer=await web3Provider.getSigner()

    try {
      console.log('---executing---');
      const res=await executeOrder(
        chainId,
        signer,
        order.encodedOrder,
        order.signature,
        value
      )
      console.log(res);
      if(res){
        setButtonLoading(false)
        setShowExecuteWindow(false)
      }
    } catch (error) {
      console.log(error);
      setButtonLoading(false)
    }
  }
  
  // 获取订单用于兑换的token信息
  const getInputToken=(token,decimals)=>{
    console.log('selected token');
    if(token){
      const jsonString=token
      try{
        const tokenObj=JSON.parse(jsonString)
        console.log(tokenObj.token);
        setInputToken(tokenObj)
        const startAmount=BigNumber(tokenObj.startAmount.hex)
        const startAmountNum=startAmount.dividedBy(new BigNumber(10).pow(decimals))
        console.log('inputtoken startAmountNum',startAmountNum.toString());
        setTokenInputAmount(startAmountNum.toString())
      }catch(error){
        console.log(error);
      }
    }
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
          if(balance) setBalanceLoading(false)
        dispatch(balance)
        } catch (error) {
          // console.log(error);
        }
      }
    },
    [contractConfig,loginProvider]
  )
  // 获取订单想要兑换的token信息
  const getOutputToken=(outputToken:string,decimals:number)=>{
    console.log('output token');
    // console.log(JSON.parse(outputToken)[0]);
    // console.log(decimals);
    // setPayToken(JSON.parse(outputToken)[0])
    const startAmount=BigNumber(JSON.parse(outputToken)[0].startAmount.hex)
    const startAmountNum=startAmount.dividedBy(new BigNumber(10).pow(decimals))
    console.log('outputtoken startAmountNum',startAmountNum.toString());
    console.log(JSON.parse(outputToken)[0].token);
    
    setTokenOutputAmount(startAmountNum.toString())
    // const outputTokenAddress=order.outputToken
    // console.log(outputTokenAddress);
    
  }
  // 获取当前汇率与订单汇率的比值
  const getRateRelation=()=>{
    if(tokenRate&&order.orderPrice){
      console.log('---getRateRelation---');
      const result = new Decimal(tokenRate).dividedBy(new Decimal(order.orderPrice));
      console.log(result.toNumber());
      if(result) setRateLoading(false)
      if(result.toNumber()>1){
        setRateRelation('incre')
        console.log('incre',result.toNumber()-1);
        setDiffRate(((result.toNumber()-1)*100).toFixed(2))
        // return result.toFixed(3)
      }else if(result.toNumber()<1){
        setRateRelation('decre')
        console.log('decre',1-result.toNumber());
        setDiffRate(((1-result.toNumber())*100).toFixed(2))
      }
      // console.log(rateNum-orderRate);
      // console.log(Number(tokenRate)-Number(order.orderPrice));
    }
  }
  // 获取两个token当前的汇率
  const getTokenRate=async(inputTokenAddress:string,inputTokenDecimals:number,outputTokenAddress:string,outputTokenDecimals:number)=>{
    const { uniswapV2RouterAddress } = contractConfig;
    const params=[
      chainId,
      provider,
      await getUniswapV2RouterContract (provider,uniswapV2RouterAddress),
      [inputTokenAddress,inputTokenDecimals],
      [outputTokenAddress,outputTokenDecimals],
      new Decimal(1),
      new Decimal(0),
      // 暂定5%
      // transactionFee.limit
      new Decimal(0),
    ].filter((item)=>item!==null)
    let amount:Decimal
    try {
      amount=await getAmountOut.apply(null,params)
    } catch (error) {
      console.log(error);
    }
    const amountValue=new Decimal(amount)
    // console.log(amountValue.toString());
    setTokenRate(amountValue.toString())
  }
  useEffect(()=>{
    // console.log(payTokenAmount);
    
    // setSliderValue(Number(payTokenAmount)/Number(tokenInputAmount)*100)
    if(payTokenAmount){
      // const percent=Number(payTokenAmount)/Number(tokenInputAmount)*100>100?100:Number(payTokenAmount)/Number(tokenInputAmount)*100
      // console.log(percent)
      // setSliderValue(Number(percent.toFixed(2)))
    }
  },[payTokenAmount])
  useEffect(()=>{
    // console.log(silderValue);
    // setExchangeAmount(Number(tokenInputAmount)*silderValue/100)
    setPayTokenAmount((Number(tokenOutputAmount)*(silderValue/100)).toString())
  },[silderValue])
  useEffect(()=>{
    // console.log(inputToken);
    
  },[inputToken])
  // 有市场汇率之后便于订单汇率进行比较
  useEffect(()=>{
    console.log(tokenRate);
    if(tokenRate) getRateRelation()
  },[tokenRate])
  useEffect(()=>{
    console.log(order);
    getInputToken(order.input,order.inputTokenDecimals)
    getOutputToken(order.outputs,order.outputTokenDecimals)
    getTokenRate(order.inputToken,order.inputTokenDecimals,order.outputToken,order.outputTokenDecimals)
    getTokenBalance(order.outputToken,setPayTokenBalance)
    setSliderValue(100)
  },[order])

  return (
    <div className="execute-window">
      <div className="execute-window-header">
        <div className="execute-header-left">
          <div className="header-row-one">
            <span
              className="execute-back"
              onClick={()=>{
                console.log('back');
                setShowDetailsWindow(false)
                setShowExecuteWindow(false)
              }}
            >
              <img src="/back-icon.svg" alt="" />
            </span>
            <span style={{flex:'1 1',textAlign:'center',fontSize:"20px"}}>{t("limit.execute")}</span>
            <span></span>
          </div>
          {/* <div className="header-row-two">
            <p className="header-row-two-left">
              1 {order.inputTokenSymbol} = {Number(order.orderPrice)>1?Number(order.orderPrice).toFixed(4):Number(order.orderPrice).toFixed(6)} {order.outputTokenSymbol}
            </p>
            <div className='header-row-two-right'>
                <img src="/incre-icon.svg" alt="" />
                <img src="/decre-icon.svg" alt="" />
                <p>10%</p>
              </div>
          </div> */}
        </div>
      </div>
      <div className="execute-window-amount">
        <span>
          <DefaultTokenImg
            name={order?.inputTokenSymbol}
            icon={order?.inputTokenLogo}
          />
        </span>
        <span className="amount-text">
          {/* {Number(tokenInputAmount)%1===0?Number(tokenInputAmount):Number(tokenInputAmount).toFixed(3)} {order?.inputTokenSymbol} */}
          {tokenInputAmount.toString()} {order?.inputTokenSymbol}
        </span>
        {
          rateLoading? <Skeleton.Button size="small" active />:(
            <div className={`order-price-change ${rateRelation}`}>
              {rateRelation=='incre'&&<img src="/incre-icon.svg" alt="" />}
              {rateRelation=='decre'&&<img src="/decre-icon.svg" alt="" />}
              <span>{diffRate}%</span>
            </div>
          )}
      </div>
      <div className="execute-window-body">
        <div className="execute-body-row">
          <span>
            {t("limit.fee")}
          </span>
          <span className="execute-fee">
            {t("limit.fees")}
          </span>
        </div>
        <div className="execute-body-row">
          <span>
            {t("limit.rate")}
          </span>
          <span className="execute-order-price">
            {order.orderPrice} {order.outputTokenSymbol} / {order.inputTokenSymbol}
          </span>
        </div>
        <div className="execute-body-row">
          <span>
            {t("limit.price")}
          </span>
          <span>
          {Number(tokenOutputAmount)%1===0?Number(tokenOutputAmount):Number(tokenOutputAmount).toFixed(3)} {order.outputTokenSymbol}
          </span>
        </div>

        {/* <div className="buying-window">
          <span className="buying-window-title">{t("limit.buying")}</span>
          <div className="buying-window-content">
            <span
              className="buying-window-amount"
              style={{color:exchangeAmount!==0?'#555':'#fff'}}
            >
              {exchangeAmount===0?tokenInputAmount:exchangeAmount}</span>
            <span
              className="max-btn"
              onClick={()=>{
                setExchangeAmount(Number(tokenInputAmount))
                setSliderValue(100) 
                // setPayTokenAmount((Number(tokenInputAmount)*Number(order.orderPrice)).toString())
                setPayTokenAmount(tokenOutputAmount)
                // setButtonDisable(false)
              }}
            >
              MAX 
            </span>
          </div>
          <div className="execute-silder">
            <div style={{width:'80%',display:'inline-block'}}>
              <ConfigProvider
                theme={{
                  components:{
                    Slider:{
                      railBg:'#5d5d5d',
                      railHoverBg:"#5d5d5d",
                      trackBg:'#86f097',
                      trackHoverBg:'#86f097',
                      dotActiveBorderColor:'#86f097',
                      handleActiveColor:'#86f097',
                      dotBorderColor:'#5d5d5d',
                      handleColor:'#86f097',
                      dotSize: 8,
                      trackBgDisabled:'#86f097'
                    }
                  }
                }}
              >
              <Slider 
                rootClassName="amount-slider" 
                // marks={marks} 
                defaultValue={0} 
                min={0}
                max={100}
                value={silderValue} 
                disabled
                onChange={(value) => {
                  setSliderValue(value)
                  // setExchangeAmount(Number(tokenInputAmount)*value/100)
                  // setPayTokenAmount((Number(tokenInputAmount)*value/100*Number(order.orderPrice)).toString())
                  // setPayTokenAmount(((silderValue/100)*Number(tokenOutputAmount)).toString())
                  // setButtonDisable(value===0?true:false)
                }}
              />
              </ConfigProvider>
            </div>
            <span style={{lineHeight:'42px'}}>{silderValue}%</span>
          </div>
        </div> */}
      </div>
      <div className="execute-window-body">
          <div  className="execute-body-row">
            <span>{t("limit.you receive")}</span>
            <span>
              {Number(tokenInputAmount)%1===0?Number(tokenInputAmount):setMany(tokenInputAmount)} {order?.inputTokenSymbol}
              </span>
          </div>
          <div  className="execute-body-row paytoken-balance">
            <span>{order.outputTokenSymbol}{t("limit.balance")}</span>
            {
              balanceLoading?( <Skeleton.Button active size="small" />
              ):(
              <span
                className=""
                style={{color:Number(payTokenBalance.toString())>Number(tokenOutputAmount)?'#86f097':'#EA6E6E'}}
              >
              {payTokenBalance.eq(payTokenBalance.toDecimalPlaces(0))
                ?payTokenBalance.toString()
                :payTokenBalance.toFixed(5)} {order.outputTokenSymbol}
              </span>
            )}
          </div>
      </div>
      {/* <div className="execute-input">
        <span>{t("limit.execute for")}</span>
        <div className="execute-token-select">
          <Input
            rootClassName="execute-amount-input"
            variant="borderless"
            placeholder="0"
            value={tokenOutputAmount}
            // value={payTokenAmount}
            onChange={(e) => {
              if (/^\d*\.?\d*$/.test(e.target.value)) {
                setPayTokenAmount(e.target.value);
              }
              // inputChangeDebounce(e.target.value)
            }}
          />
          <div className="execute-pay-token">
            <DefaultTokenImg
              name={order?.outputTokenSymbol}
              icon={order?.logoUrl}
            />
          </div>
        </div>
      </div> */}
      <div className="execute-window-footer">
        <Button
          rootClassName="execute-btn"
          // className={`${!buttonDisable?'execute-btn-active':''}`}
          className={order?.orderStatus !=='open'?'':'execute-btn-active'}
          loading={buttonLoading}
          disabled={order?.orderStatus !=='open'}
          onClick={() => {
            selcetExecuteOrder()
          }}
        >
          {order?.orderStatus ==='open'?'EXECUTE':order.orderStatus}
        </Button>
        {/* <span className="execute-tips">
          {t("limit.desc buying")} 
          <span style={{color:"#86f097"}}> { payTokenAmount?payTokenAmount:0}
          </span> {order.outputTokenSymbol} {t("limit.desc for")}
          <span style={{color:"#86f097"}}> {exchangeAmount}
            </span> {order.inputTokenSymbol}
          <br />
          You will automatically receive the equivalent amount of the protocol's tokens based on the total points purchased after settlement.
        </span> */}
      </div>
      {/* <SelectTokenModal
        open={showSelect}
        chainId={chainId}
        onChange={(token) => {setPayToken(token);setShowSelect(false)}}
        onCancel={()=>{setShowSelect(false)}}
      /> */}
    </div>
  )
}




export default ExecuteWindow;
