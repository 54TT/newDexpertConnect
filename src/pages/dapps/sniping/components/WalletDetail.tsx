import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import { Slider } from 'antd';
import { useEffect, useState } from 'react';

export default function WalletDetail({id,name,balance,setShowWalletDetail,setIsShow}: any) {
  const [tokenList,setTokenList]=useState<any>([
  ])
  setTokenList([{id:1,name:'USDT',amount:1000},
    {id:2,name:'USDC',amount:1000},
    {id:3,name:'BTC',amount:1000},
    {id:4,name:'ETH',amount:1000},
    {id:5,name:'BNB',amount:1000},
    {id:6,name:'MATIC',amount:1000},
    {id:7,name:'DAI',amount:1000},
    {id:8,name:'USDT',amount:1000}])
  const [itemIndex,setItemIndex]=useState(0)
  const {getAll}=Request();
  const getWalletDetail=async(id:number,page:number,pageSize:number)=>{
    const token=cookie.get('token')
    const res=await getAll({
      method:'post',
      url:'/api/v1/wallet/assets',
      data:{
        walletId:id.toString(),
        page:page.toString(),
        pageSize:pageSize.toString()
      },
      token
    })
    if(res?.status===200){
      console.log(res)
    }
  }
  const handleItemClick=(index:number)=>{
    console.log();
    
    setItemIndex(index===itemIndex?-1:index)
  }
  useEffect(()=>{
    getWalletDetail(id,1,5)
  },[])
  return (
    <div className="walletDetail">
      <div className="detail-header">
        <img
            src="/sniperBack.svg"
            alt=""
            onClick={() => {
              // setOrderPar(null);
              setShowWalletDetail(false)
              setIsShow(false)
            }}
          />
        <div className="detail-title">{name}</div>
      </div>
      <div className='detail-body'>
        <div className='detail-body-header'>
          <span className='wallet-logo'>{name.slice(0,1)}</span>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <span style={{fontSize:'18px',fontWeight:'700'}}>{name}</span>
            <span style={{fontSize:'14px'}}>{balance?balance:'0'} ETH</span>
          </div>
        </div>
        <div className='token-list'>
          {tokenList.map((item:any,index:number)=>(
            <div className={`token-list-item ${itemIndex===index?'activeItem':''}`} key={index}>
              <div className='item-header'>
                <span className='token-symbol'>{item?.name.slice(0,1)}</span>
                <span className='token-name'>{item?.name}</span>
                <img src="/down-icon-small.svg" onClick={()=>{handleItemClick(index)}} />
                {/* <span className='quickly-sell'>卖出</span> */}
              </div>
              <div className='slider'>
                <Slider
                  rootClassName='token-amount-slider'
                  value={item?.value}
                  onChange={() => {
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      walletDetail+{id}
    </div>
  )
}