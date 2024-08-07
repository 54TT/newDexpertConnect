import { ConfigProvider,Slider,Input,Button } from "antd";
import {  useState,useContext, useCallback, useEffect } from "react";
import { CountContext } from '@/Layout';
// import SelectTokenModal from "@/components/SelectTokenModal";
import DefaultTokenImg from "@/components/DefaultTokenImg";
import { debounce } from "lodash";
import {BigNumber} from 'bignumber.js';
import executeOrder from '@utils/limit/executeOrder'
import { ethers,BigNumber as BNtype } from "ethers";
import {useTranslation} from 'react-i18next';

const ExecuteWindow = ({
  order,
  setShowDetailsWindow,
  setShowExecuteWindow
}) => {
  const {
    chainId,
    loginProvider
  } = useContext(CountContext)
  const {t}=useTranslation()
  // 滑动条的值，百分比
  const [silderValue,setSliderValue]=useState(100)
  // 选择支付的token
  // const [payToken,setPayToken]=useState()
  // const [showSelect,setShowSelect]=useState(false)
  const [buttonLoading,setButtonLoading]=useState(false)
  const [buttonDisable,setButtonDisable]=useState(true)
  const [tokenInputAmount,setTokenInputAmount]=useState('')
  const [tokenOutputAmount,setTokenOutputAmount]=useState('')
  const [inputToken,setInputToken]=useState()
  // 想要兑换多少数量的token0
  const [exchangeAmount,setExchangeAmount]=useState(0)
  // 选择支付token1的数量
  const [payTokenAmount,setPayTokenAmount]=useState('')
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
      if(res) setButtonLoading(false)
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
        // console.log(tokenObj.startAmount);
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
  // 获取订单想要兑换的token信息
  const getOutputToken=(outputToken:string,decimals:number)=>{
    console.log('output token');
    // console.log(JSON.parse(outputToken)[0]);
    // console.log(decimals);
    // setPayToken(JSON.parse(outputToken)[0])
    const startAmount=BigNumber(JSON.parse(outputToken)[0].startAmount.hex)
    const startAmountNum=startAmount.dividedBy(new BigNumber(10).pow(decimals))
    // console.log('outputtoken startAmountNum',startAmountNum.toString());
    
    setTokenOutputAmount(startAmountNum.toString())
    // const outputTokenAddress=order.outputToken
    // console.log(outputTokenAddress);
    
  }
  const inputChange=(v)=>{
    // console.log('input change',v)
    // console.log(payTokenAmount);
    // console.log(tokenOutputAmount);
    
    // console.log((Number(payTokenAmount)/Number(tokenInputAmount)*100).toFixed(2));
    // setPayTokenAmount(v)
    // if(v!==0){
    //   setPayTokenAmount(v)
    //   setButtonDisable(false)
    // }
  }
  const inputChangeDebounce=useCallback(debounce(inputChange,500),[payTokenAmount])

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
    setExchangeAmount(Number(tokenInputAmount)*silderValue/100)
    setPayTokenAmount((Number(tokenOutputAmount)*(silderValue/100)).toString())
  },[silderValue])
  useEffect(()=>{
    // console.log(inputToken);
    
  },[inputToken])
  useEffect(()=>{
    console.log(order);
    getInputToken(order.input,order.inputTokenDecimals)
    getOutputToken(order.outputs,order.outputTokenDecimals)
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
              <p>{order.inputTokenName}</p>
            </span>
          </div>
          <div className="header-row-two">
            {/* <span>{order?.orderHash||'token address'}</span> */}
            <p className="header-row-two-left">
              1 {order.inputTokenSymbol} = {Number(order.orderPrice)>1?Number(order.orderPrice).toFixed(4):Number(order.orderPrice).toFixed(6)} {order.outputTokenSymbol}
            </p>
            <div className='header-row-two-right'>
                <img src="/incre-icon.svg" alt="" />
                {/* <img src="/decre-icon.svg" alt="" /> */}
                <p>10%</p>
              </div>
          </div>
        </div>
        <div className="execute-header-right">
        {/* <Progress
          rootClassName='execute-progress' 
          percent={100} 
          type="circle"
          size={70}
          strokeColor='#86f097'
          trailColor="#535353"
        /> */}
        </div>
      </div>
      <div className="execute-window-body">
        <div className="buying-window">
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
                setButtonDisable(false)
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
                  setButtonDisable(value===0?true:false)
                }}
              />
              </ConfigProvider>
            </div>
            <span style={{lineHeight:'42px'}}>{silderValue}%</span>
          </div>
        </div>
      </div>
      <div className="execute-input">
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
              inputChangeDebounce(e.target.value)
            }}
          />
          <div className="execute-pay-token">
            <DefaultTokenImg
              name={order?.outputTokenSymbol}
              icon={order?.logoUrl}
            />
          </div>
        </div>
        {/* <span>$999</span> */}
      </div>
      <div className="execute-window-footer">
        <Button
          rootClassName="execute-btn"
          // className={`${!buttonDisable?'execute-btn-active':''}`}
          className={'execute-btn-active'}
          loading={buttonLoading}
          // disabled={buttonDisable}
          onClick={() => {
            selcetExecuteOrder()
          }}
        >
          EXECUTE
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
