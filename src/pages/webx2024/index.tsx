import { Button } from 'antd';
import './index.less';
import { useContext, useState } from 'react';
import CommonModal from '@/components/CommonModal';
import { CountContext } from '@/Layout';
export default function Webx2024() {
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const { setIsModalOpen, loginProvider, isLogin } = useContext(CountContext);

  const clickGetPassCardButton = () => {
    setRewardModal(true);
    if (isLogin) {
    } else {
      setConnectWalletModal(true);
    }
  };

  return (
    <div className="webx">
      <div className="webx-head">
        <img src="/dexpert-logo.png" alt="" />
        <img src="/webx-logo.svg" alt="" />
      </div>
      <div className="webx-body">
        <div className="webx-body-left">
          <div>
            <div>Thanks to WebX 2024 Tokyo, you found your way to us!</div>

            <div>
              As a special treat for connecting with us at this event, we’ve got
              an exclusive gift just for you.
            </div>
          </div>
          <Button
            className="action-button"
            onClick={() => clickGetPassCardButton()}
          >
            领取passCard
          </Button>
        </div>
        <img src="/webx-dpass.png" alt="" />
      </div>
      <div className="webx-city">
        <img src="/city-bgc.png" alt="" />
      </div>
      <div className="webx-tower">
        <img src="/tokyo-tower.png" alt="" />
      </div>
      <CommonModal
        width={360}
        open={rewardModal}
        className="webx-modal"
        title={<img src="/connect-wallet.png" />}
        footer={null}
      >
        <div>
          <div style={{ margin: '24px 0', color: '#fff' }}>
            Your D Pass is all set!
          </div>
          <div>Happy trading</div>
          <div>
            <img src="/congratulations.png" alt="" />
          </div>
          <div>
            <Button
              className="action-button"
              onClick={() => setIsModalOpen(true)}
            >
              Use Now!
            </Button>
          </div>
        </div>
      </CommonModal>
      <CommonModal
        width={360}
        open={connectWalletModal}
        className="webx-modal"
        title={<img src="/connect-wallet.png" />}
        footer={null}
      >
        <div>
          <div style={{ margin: '24px 0', color: '#fff' }}>
            请连接您的钱包再领取
          </div>
          <div>
            <Button
              className="action-button"
              onClick={() => setIsModalOpen(true)}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
