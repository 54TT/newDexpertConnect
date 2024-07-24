import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import { Slider, Modal } from 'antd';
import { useEffect, useState } from 'react';
import Load from '@/components/allLoad/load';
import { useTranslation } from 'react-i18next';
export default function WalletDetail({
  id,
  name,
  balance,
  setShowWalletDetail,
  setIsShow,
}: any) {
const { t } = useTranslation();
  const [tokenList, setTokenList] = useState<any>([]);
  const [itemIndex, setItemIndex] = useState('');
  const [sliderNum, setSliderNum] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState<any>(null);
  const { getAll } = Request();
  const getWalletDetail = async (id: number, page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/assets',
      data: {
        walletId: id.toString(),
        page: page,
        pageSize: 10,
      },
      token,
    });
    if (res?.status === 200) {
      setTokenList(res?.data?.walletAssets);
    }
  };

  const getWalletTotal = async (id: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/assets/total',
      data: {
        walletId: id.toString(),
      },
      token,
    });
    if (res?.status === 200) {
    }
  };

  const sellToken = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/token/sell',
      data: {
        walletId: id.toString(),
        tokenCa: item?.address,
        quantity: (sliderNum * Number(item?.quantity)) / 100,
      },
      token,
    });
    if (res?.status === 200) {
    }
  };

  const handleItemClick = (index: string) => {
    setItemIndex(index === itemIndex ? '' : index);
  };
  useEffect(() => {
    if(id){
      getWalletDetail(id, 1);
      getWalletTotal(id);
    }
  }, [id]);
  const change = () => {};
  const changeSlider = (e: number) => {
    setSliderNum(e);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setItem(null);
  };

  return (
    <div className="walletDetail">
      <div className="detail-header">
        <img
          src="/sniperBack.svg"
          alt=""
          onClick={() => {
            // setOrderPar(null);
            setShowWalletDetail(false);
            setIsShow(false);
          }}
        />
        <div className="detail-title">{name}</div>
      </div>
      <div className="detail-body">
        <div className="detail-body-header">
          <span className="wallet-logo">{name.slice(0, 1)}</span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '700' }}>{name}</span>
            <span style={{ fontSize: '14px' }}>
              {balance ? balance : '0'} ETH
            </span>
          </div>
        </div>
        <div className="token-list">
          {tokenList.length > 0 ? (
            tokenList.map((item: any) => (
              <div
                className={`token-list-item ${itemIndex === item?.address ? 'activeItem' : ''}`}
                key={item?.address}
                onClick={change}
              >
                <div
                  className="item-header"
                  onClick={() => {
                    handleItemClick(item?.address);
                    setSliderNum(0);
                  }}
                >
                  <span className="token-symbol">{item?.name.slice(0, 1)}</span>
                  <span className="token-name">{item?.name}</span>
                  {itemIndex === item?.address ? (
                    <div className="amount">
                      <span>{t('token.Amount')}</span>
                      <span>
                        {(sliderNum * Number(item?.quantity)) / 100 || 0}
                      </span>
                    </div>
                  ) : (
                    <img src="/down-icon-small.svg" />
                  )}
                </div>
                {itemIndex === item?.address && (
                  <div className="slider">
                    <Slider rootClassName="upAllBack" onChange={changeSlider} />
                    <div className="bott">
                      <p>
                        Balance: <span>{item?.quantity}</span>
                      </p>
                      <p
                        onClick={() => {
                          if (sliderNum) {
                            setItem(item);
                            setIsModalOpen(true);
                          }
                        }}
                      >
                        {t('token.Sell')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.55)',
                fontSize: '22px',
                margin: '20px 0',
              }}
            >
              {t('token.no')}
            </p>
          )}
        </div>
      </div>
      <Modal
        title=""
        rootClassName="walletDetailDelToken"
        open={isModalOpen}
        footer={null}
        destroyOnClose={true}
        keyboard={false}
        maskClosable={false}
        onCancel={handleCancel}
      >
        <div className="modalBox">
          <div className="title">{t('token.con')}</div>
          {/* item */}
          <div className="token">
            <span>头像</span>
            <span>token</span>
          </div>
          <div className="amount">
            <div className="left">{t('token.Amount')}:{0}</div>
            <p></p>
            <div className="left">{t('token.gas')}:{0}</div>
          </div>
          <div className="butt">
            <p onClick={handleCancel}>{t('token.later')}</p>
            <p onClick={sellToken}>{t('token.Confirm')}</p>
          </div>
        </div>
        <div className="sellLoad">
          <div className="ethCancel">
            <img
              src="/ethLogo.svg"
              alt=""
              onClick={() => {
                // window.open('')
              }}
            />
            <p onClick={handleCancel}>x</p>
          </div>
          {/* sellSuccess.svg  sellError.svg */}
          <img src="/delToken.svg" alt="" className="logo" />
          <div style={{ margin: '8px 0 30px' }}>
            <Load />
          </div>
          <div className="sell">
            <span>{t('token.Selling')}</span>
            <p>
              <span>头像</span>
              <span>token</span>
            </p>
          </div>
          <div className="amount">
            <div className="left">{t('token.Amount')}:{0}</div>
            <p></p>
            <div className="left">{t('token.gas')}:{0}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
