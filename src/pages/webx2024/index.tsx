import { Button } from 'antd';
import './index.less';
import { useContext, useState } from 'react';
import CommonModal from '@/components/CommonModal';
import { CountContext } from '@/Layout';
import Request from '@/components/axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function Webx2024() {
  const { getAll } = Request();
  const  history  = useNavigate()
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [showPassModal,setShowPassModal]=useState(false)
  const [claimLoading, setClaimLoading]=useState(false)
  const [rewardModal, setRewardModal] = useState(false);
  // 2: tokenCreationBot 3: sniperBot 4: fastTrade 
  const [selectCard,setSelectCard]=useState(2)
  const { setIsModalOpen, isLogin } = useContext(CountContext);

  const clickGetPassCardButton = () => {
    // setRewardModal(true);
    if (isLogin) {
      // setRewardModal(true);
      setShowPassModal(true);
    } else {
      setConnectWalletModal(true);
    }
  };
  // 领取passCard
  const getPassCard= async()=>{

    setClaimLoading(true)
    try {
      const token=Cookies.get('token')
      const res=await getAll({
        method:'post',
        url:'/api/v1/passcard/giveaway',
        data:{
          event:'webx2024',
          passcardType:selectCard,
        },
        token
      })
      if(res.status===200){
        setShowPassModal(false);
        setRewardModal(true);
      }
    } catch (error) {
      if(error?.response?.data?.msg==="you've already received the passcard"){
        setShowPassModal(false);
        setRewardModal(true);
      }
    }
  } 
  
  
  // useNow
  const clickUseNowButton = () => {
    if(selectCard===2) history('/dapps/tokencreation');
    if(selectCard===3) history('/dapps/sniping');
    if(selectCard===4) history('/dapps/swap');
  }


  return (
    <div className="webx">
      <div className="webx-head">
        <img src="/dexpert-logo.png" alt="" />
        <img src="/webx-logo.svg" alt="" />
      </div>
      <div className="webx-body">
        <div className="webx-body-left">
          <div>
            <div>Thanks to WebX 2024 Tokyo, 
            you found your way to us! </div>
            <br />
            <div>
            Here is your exclusive gift.
            </div>
          </div>
          <Button
            className="action-button"
            onClick={() => clickGetPassCardButton()}
          >
            Free D Pass
          </Button>
        </div>
        <img src="/webx-dpass.png" className='webx-dpasscard' />
      </div>
      <div className="webx-city">
        <img src="/city-bgc.png" alt="" />
      </div>
      <div className="webx-tower">
        <img src="/tokyo-tower.png" alt="" />
      </div>
      {/* 领取成功modal */}
      <CommonModal
        width={320}
        open={rewardModal}
        className="webx-modal"
        title={
          <span className='complete-title'>Congradulations!</span>
        }
        footer={null}
        onCancel={() => setRewardModal(false)}
      >
        <div>
          <div style={{ margin: '24px 0', color: '#fff',lineHeight:'20px' }}>
            Your D Pass is all set!<br/>
            Happy trading
          </div>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'24px'}}>
            <img src="/art.svg" />
          </div>
          <div>
            <Button
              className="action-button useNow-btn"
              onClick={() => clickUseNowButton()}
            >
              Use Now!
            </Button>
          </div>
        </div>
      </CommonModal>
      {/* 连接钱包modal */}
      <CommonModal
        width={320}
        open={connectWalletModal}
        className="webx-modal"
        title={''}
        footer={null}
        onCancel={() =>{
          setConnectWalletModal(false)
        }}
      >
        <div>
          <div style={{ margin: '36px 0', color: '#fff' }}>
          Connect wallet to claim.
          </div>
          <div>
            <Button
              className="action-button"
              onClick={() =>{
                setIsModalOpen(true)
                setConnectWalletModal(false)
              }}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </CommonModal>
      {/* 领取passCard modal */}
      <CommonModal
        width={320}
        open={showPassModal}
        className="webx-modal getPass-modal"
        title={"Select Your Gift."}
        footer={null}
        onCancel={() =>{
          setShowPassModal(false)
          setClaimLoading(false)
        }}
      >
        <div className="getPass-modal-body">
          <div className={`getPass-modal-item ${selectCard === 2 ? 'getPass-modal-item-active' : ''}`}onClick={()=>setSelectCard(2)}>
            <span>
              <span style={{color:'#86f097'}}>Token Create Bot</span> Pass
              </span>
            <span>x1</span>
          </div>
          <div className={`getPass-modal-item ${selectCard === 3 ? 'getPass-modal-item-active' : ''}`} onClick={()=>setSelectCard(3)}>
            <span><span style={{color:'#86f097'}}>Sniper Bot</span> Pass</span>
            <span>x3</span>
          </div>
          <div className={`getPass-modal-item ${selectCard === 4 ? 'getPass-modal-item-active' : ''}`} onClick={()=>setSelectCard(4)}>
            <span><span style={{color:'#86f097'}}>Fast Trade</span> Pass</span>
            <span>x15</span>
          </div>
        </div>
        <Button
          loading={claimLoading}
          className="action-button getPass-btn"
          onClick={() => {
            getPassCard()
            // setShowPassModal(false);
            // setRewardModal(true);
          }}
        >
          Comfirm
        </Button>
      </CommonModal>
    </div>
  );
}
