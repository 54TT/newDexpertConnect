import { ConfigProvider, Progress,Slider,InputNumber,Button } from "antd";
import {  useState,useContext, useCallback, useEffect } from "react";
import { CountContext } from '@/Layout';
import SelectTokenModal from "@/components/SelectTokenModal";
import DefaultTokenImg from "@/components/DefaultTokenImg";
import { debounce } from "lodash";
import {BigNumber} from 'bignumber.js';
import executeOrder from '@utils/limit/executeOrder'
import { ethers,BigNumber as BNtype } from "ethers";

const ExecuteWindow = ({order,setShowDetailsWindow,setShowExecuteWindow}) => {
  const {
    chainId,
    loginPrivider
  } = useContext(CountContext)
  // 滑动条的值，百分比
  const [silderValue,setSliderValue]=useState(0)
  // 选择支付的token
  const [selectedToken,setSelectedToken]=useState()
  const [showSelect,setShowSelect]=useState(false)
  const [buttonLoading,setButtonLoading]=useState(false)
  const [buutonDisable,setButtonDisable]=useState(true)
  const [tokenInputAmount,setTokenInputAmount]=useState(0)
  const [inputToken,setInputToken]=useState()
  // 想要兑换多少数量
  const [exchangeAmount,setExchangeAmount]=useState(0)
  // 选择支付token数量
  const [selectedTokenAmount,setSelectedTokenAmount]=useState(0)
  const marks= {
    0: '0%',
    20: '20%',
    40: '40%',
    60: '60%',
    80: '80%',
    100: '100%',
  };
  // 执行限价兑换订单
  const selcetExecuteOrder=async ()=>{
    console.log('---execute order---');
    setButtonLoading(true)
    const output=JSON.parse(order.outputs)[0]
    const web3Provider=new ethers.providers.Web3Provider(loginPrivider)
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
        setTokenInputAmount(startAmountNum.toNumber())
      }catch(error){
        console.log(error);
        
      }
    }
  }
  // 获取订单想要兑换的token信息
  const getOutputToken=(order)=>{
    console.log('output token');
    const outputTokenAddress=order.outputToken
    console.log(outputTokenAddress);
    
  }
  const inputChange=(v)=>{
    if(v!==0){
      setSelectedTokenAmount(v)
      setButtonDisable(false)
    }
  }
  const inputChangeDebounce=useCallback(debounce(inputChange,500),[selectedTokenAmount])

  useEffect(()=>{
    console.log(inputToken);
    
  },[inputToken])
  useEffect(()=>{
    console.log(order);
    getInputToken(order.input,order.inputTokenDecimals)
    getOutputToken(order)
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
              <p>Grass</p>
            </span>
            <span>X</span>
            <span>http url</span>
          </div>
          <div className="header-row-two">
            <span>{inputToken?.token||'token address'}</span>
          </div>
        </div>
        <div className="execute-header-right">
        <Progress
          rootClassName='execute-progress' 
          percent={50} 
          type="circle"
          size={70}
          strokeColor='#86f097'
          trailColor="#535353"
        />
        </div>
      </div>
      <div className="execute-window-body">
        <div className="buying-window">
          <span className="buying-window-title">BUYING</span>
          <div className="buying-window-content">
            <span
              className="buying-window-amount"
              style={{color:exchangeAmount===0?'#555':'#fff'}}
            >
              {exchangeAmount===0?tokenInputAmount:exchangeAmount}</span>
            <span
              className="max-btn"
              onClick={()=>{
                setExchangeAmount(tokenInputAmount)
                setSliderValue(100) 
                setSelectedTokenAmount(tokenInputAmount*Number(order.orderPrice))
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
                      dotSize: 8
                    }
                  }
                }}
              >
              <Slider 
                rootClassName="amount-slider" 
                marks={marks} 
                defaultValue={0} 
                min={0}
                max={100}
                value={silderValue} 
                onChange={(value) => {
                  setSliderValue(value)
                  setExchangeAmount(tokenInputAmount*value/100)
                  setSelectedTokenAmount(tokenInputAmount*value/100*Number(order.orderPrice))
                  setButtonDisable(value===0?true:false)
                }}
              />
              </ConfigProvider>
            </div>
            <span>{silderValue}%</span>
          </div>
        </div>
      </div>
      <div className="execute-input">
        <span>FOR</span>
        <div className="execute-token-select">
          <InputNumber
            rootClassName="execute-amount-input"
            controls={false}
            variant="borderless"
            value={selectedTokenAmount}
            onChange={(value) => {
              inputChangeDebounce(value)
            }}
          />
          <div onClick={()=>{setShowSelect(true)}}>
            <DefaultTokenImg
              name={selectedToken?.symbol}
              icon={selectedToken?.logoUrl}
            />
          </div>
        </div>
        <span>$999</span>
      </div>
      <div className="execute-window-footer">
        <Button
          rootClassName="execute-btn"
          className={`${buutonDisable?'execute-btn-disable':''}`}
          loading={buttonLoading}
          disabled={buutonDisable}
          onClick={() => {
            selcetExecuteOrder()
          }}
        >
          EXECUTE
        </Button>
        <span className="execute-tips">
          Buying 969,655 Grass points for 645.8 USDC
          <br />
          You will automatically receive the equivalent amount of the protocol's tokens based on the total points purchased after settlement.
        </span>
      </div>
      <SelectTokenModal
        open={showSelect}
        chainId={chainId}
        onChange={(token) => {setSelectedToken(token);setShowSelect(false)}}
        onCancel={()=>{setShowSelect(false)}}
      />
    </div>
  )
}




export default ExecuteWindow;
