import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import { Slider, Modal, Input, InputNumber } from 'antd';
import { useEffect, useState, useContext } from 'react';
import SellTokenModal from './sellTokenModal';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/allLoad/loading';
import Load from '@/components/allLoad/load';
import { CountContext } from '@/Layout';
import InfiniteScrollPage from '@/components/InfiniteScroll';
export default function WalletDetail({
  setShowWalletDetail,
  setIsShow,
  chainId,
  wallet,
  setWallet,
  setWalletList,
  walletList,
  setIsLoad,
  contractConfig,
}: any) {
  const { t } = useTranslation();
  const { browser }: any = useContext(CountContext);
  const [tokenList, setTokenList] = useState<any>([]);
  const [amount, setAmount] = useState('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenItem, setTokenItem] = useState<any>(null);
  const [updateName, setUpdateName] = useState('more');
  const [value, setValue] = useState(wallet?.name);
  const [slider, setSlider] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalUSDT, setTotalUSDT] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [isApproveToken, setIsApproveToken] = useState(false);
  const [status, setStatus] = useState(false);
  const [page, setPage] = useState(1);
  //   token  sell  总数
  const [total, setTotal] = useState('');
  const [sellLoad, setSellLoad] = useState(false);
  const [load, setLoad] = useState(false);
  const { getAll } = Request();
  const getWalletDetail = async (page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/assets',
      data: {
        walletId: wallet?.walletId,
        page,
        pageSize: 10,
      },
      token,
      chainId,
    });
    if (res?.status === 200) {
      if (page === 1) {
        setTokenList(res?.data?.walletAssets);
      } else {
      }
      if (res?.data?.walletAssets?.length !== 10) {
        setStatus(true);
      }
      setLoading(true);
      setIsLoad(true);
    }
  };
  const getWalletTotal = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/assets/total',
      data: {
        walletId: wallet?.walletId,
      },
      token,
      chainId,
    });
    if (res?.status === 200) {
      setTotalUSDT(res?.data?.totalUSDT);
    }
  };
  // 获取默认数据
  useEffect(() => {
    if (wallet?.walletId) {
      getWalletDetail(1);
      getWalletTotal();
    }
  }, [wallet?.walletId, refresh]);
  // 滑点
  const changeSlider = (e: number) => {
    const data = Number((e * Number(tokenItem?.quantity)) / 100)
      ? Number((e * Number(tokenItem?.quantity)) / 100)
          .toFixed(4)
          .replace(/\.?0*$/, '')
      : '0';
    setAmount(data);
    setSlider(e);
  };
  // 取消
  const handleCancel = (show?: any) => {
    setIsModalOpen(false);
    setIsApproveToken(false);
    if (show === 'show') {
      setRefresh(true);
      setLoading(false);
    }
  };
  //  输入数量
  const changeAmount = (e: any) => {
    if (Number(e)) {
      const data = Number((e / Number(tokenItem?.quantity)) * 100)
        .toFixed(2)
        .replace(/\.?0*$/, '');
      if (Number(data)) {
        setSlider(Number(data));
      } else {
        setSlider(0);
      }
      setAmount(e);
    } else {
      setAmount('0');
      setSlider(0);
    }
  };
  const update = async () => {
    if (value) {
      const token = cookie.get('token');
      const res = await getAll({
        method: 'put',
        url: '/api/v1/wallet',
        data: {
          walletId: wallet?.walletId?.toString(),
          name: value,
        },
        token,
        chainId,
      });
      if (res?.status === 200) {
        setUpdateName('more');
        setWallet({ ...wallet, name: value });
        const data = walletList.map((i: any) => {
          if (i.walletId === wallet?.walletId) {
            i.name = value;
          }
          return i;
        });
        setWalletList([...data]);
      }
    }
  };
  const changeName = (e: any) => {
    setValue(e.target.value);
  };
  // 是否授权 token
  const isApprove = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/wallet/token/permit2/allowance',
      data: {
        walletId: wallet?.walletId,
        tokenAddress: tokenItem?.address,
      },
      token,
      chainId,
    });
    if (res?.status === 200) {
      if (res?.data?.message === 'unsuccess') {
        setIsApproveToken(false);
      } else {
        setIsApproveToken(true);
      }
      setIsModalOpen(true);
      setSellLoad(false);
    } else {
      setSellLoad(false);
    }
  };
  const changePage = () => {
    if (!status) {
      getWalletDetail(page + 1);
      setPage(page + 1);
      setLoad(true);
    }
  };

  const items = (item: any) => {
    return (
      <div
        className={`token-list-item ${tokenItem?.address === item?.address ? 'activeItem' : ''}`}
        key={item?.address}
      >
        <div
          className="item-header"
          onClick={() => {
            if (item?.address !== tokenItem?.address) {
              setTokenItem(item);
            }
          }}
        >
          <span className="token-symbol">{item?.name?.slice(0, 1)}</span>
          <span className="token-name">{item?.name}</span>
          {tokenItem?.address === item?.address ? (
            <div className="amount">
              <span style={{ whiteSpace: 'nowrap' }}>{t('token.Amount')}</span>
              {/* <input type="text" className="amountInput" /> */}
              <InputNumber
                controls={false}
                value={amount}
                max={
                  Number(item?.quantity) ? Number(item?.quantity).toFixed(4) : 0
                }
                min={0}
                stringMode={true}
                onChange={changeAmount}
                rootClassName="amountInput"
              />
              <img
                src="/down-icon-small.svg"
                onClick={() => {
                  setTokenItem(null);
                }}
              />
            </div>
          ) : (
            <img src="/down-icon-small.svg" />
          )}
        </div>
        {tokenItem?.address === item?.address && (
          <div className="slider">
            <Slider
              rootClassName="upAllBack"
              value={slider}
              onChange={changeSlider}
            />
            <p className="botPclass">
              {t('token.sum')}:
              <span>$
                {Number(item?.amount)
                  ? Number(item?.amount)
                      .toFixed(4)
                      .replace(/\.?0*$/, '')
                  : '0'}
              </span>
            </p>
            <div className="bott">
              <p className="botPclass">
                {t('token.The')}:
                <span>
                  {Number(item?.quantity)
                    ? Number(item?.quantity)
                        .toFixed(4)
                        .replace(/\.?0*$/, '')
                    : '0'}
                </span>
              </p>
              <div
                className='sure'
                onClick={() => {
                  if (Number(amount)) {
                    setSellLoad(true);
                    isApprove();
                    setTotal(item?.quantity);
                  }
                }}
              >
                {t('token.Sell')}
                {sellLoad && (
                  <div>
                    <Load />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const modal = {
    handleCancel,
    wallet,
    chainId,
    tokenItem,
    contractConfig,
    amount,
    isApproveToken,
    setIsApproveToken,
    total,
  };
  return (
    <div className="walletDetail">
      {loading ? (
        <>
          <div className="detail-header">
            <img
              src="/sniperBack.svg"
              alt=""
              onClick={() => {
                setShowWalletDetail(false);
                setIsShow(false);
                setIsLoad(false);
                setWallet(null);
              }}
            />
            {updateName === 'set' && (
              <Input
                value={value}
                maxLength={20}
                rootClassName="setInput"
                onChange={changeName}
                suffix={
                  <div className="operateSuffix">
                    <img
                      src="/updateWalletNameNo.svg"
                      alt=""
                      onClick={() => {
                        setUpdateName('more');
                        setValue(wallet?.name);
                      }}
                    />
                    <p></p>
                    <img
                      src="/updateWalletNameyYes.svg"
                      alt=""
                      onClick={update}
                    />
                  </div>
                }
              />
            )}
            {updateName === 'more' && (
              <div className="detail-title">{wallet?.name}</div>
            )}
            {updateName === 'more' && (
              <img
                src="/updateWalletName.svg"
                alt=""
                onClick={() => setUpdateName('set')}
              />
            )}
          </div>
          <div className="detail-body">
            <div className="detail-body-header">
              <p>
                ${' '}
                {Number(totalUSDT)
                  ? Number(totalUSDT)
                      .toFixed(5)
                      .replace(/\.?0*$/, '')
                  : '0'}
              </p>
              <p>{wallet?.address}</p>
            </div>
            <div className="token-list">
              <InfiniteScrollPage
                data={tokenList}
                next={changePage}
                items={items}
                nextLoad={load}
                no={t('token.no')}
                scrollableTarget={''}
              />
              {/* 拥有  token */}
            </div>
          </div>
        </>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
      <Modal
        title=""
        rootClassName="walletDetailDelToken"
        open={isModalOpen}
        footer={null}
        centered
        destroyOnClose={true}
        keyboard={false}
        maskClosable={false}
        onCancel={handleCancel}
      >
        <SellTokenModal {...modal} />
      </Modal>
    </div>
  );
}
