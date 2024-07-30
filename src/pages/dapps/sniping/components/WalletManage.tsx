import { useContext, useEffect, useState } from 'react';
import './index.less';
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import { CountContext } from '@/Layout';
import Loading from '@components/allLoad/loading';
import WalletDetail from './WalletDetail';
import getBalance from '@utils/getBalance';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import InfiniteScrollPage from '@/components/InfiniteScroll';
import Copy from '@/components/copy';
export default function WalletManage({
  id,
  setIsShow,
  setAddWallet,
  contractConfig,
}: any) {
  const { t } = useTranslation();
  const { browser, isLogin, setIsCopy }: any = useContext(CountContext);
  const [loading, setLoading] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const [walletList, setWalletList] = useState([]);
  const [showWalletDetail, setShowWalletDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [wallet, setWallet] = useState<any>();
  const [isLoad, setIsLoad] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //
  const [copyItem, setCopyItem] = useState(null);
  const { getAll } = Request();
  const getWalletList = async (page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/wallet/list',
      data: { page },
      token,
      chainId: id,
    });
    if (res?.status === 200) {
      let addressList: any = [];
      if (res?.data?.list?.length > 0) {
        res?.data?.list.map((item: any) => {
          addressList.push(item.address);
        });
        const priceAll = await getBalance(addressList, id.toString());
        if (priceAll.length > 0) {
          const priceList = priceAll.map((item: any) => {
            item.balance = Number(item.balance)
              ? (item.balance / 10 ** 18).toFixed(3)
              : 0;
            return item;
          });
          const walletHasBalance = res?.data?.list.map((index: any) => {
            priceList.map((item: any) => {
              if (index.address === item.account) {
                index.balance = item.balance;
              }
            });
            return index;
          });
          if (page === 1) {
            setWalletList(walletHasBalance);
          } else {
            const exWallet = walletList.concat(walletHasBalance);
            setWalletList(exWallet);
          }
        } else {
          if (page === 1) {
            setWalletList(res?.data?.list);
          } else {
            const exWallet = walletList.concat(res?.data?.list);
            setWalletList(exWallet);
          }
        }
      }
      if (res?.data?.list.length !== 10) {
        setIsNext(true);
      }
      setLoading(true);
      setNextLoad(false);
    } else {
      setLoading(true);
      setNextLoad(false);
    }
  };
  // 选择某个钱包，展示钱包详情
  const selectWallet = (wallet: any) => {
    setWallet(wallet);
    setShowWalletDetail(true);
  };
  // 创建钱包，未实现
  const createWallet = () => {
    setAddWallet(true);
  };
  const nextPage = () => {
    if (!isNext) {
      getWalletList(page + 1);
      setPage(page + 1);
      setNextLoad(true);
    }
  };
  useEffect(() => {
    getWalletList(1);
    setLoading(false);
  }, [isLogin, id]);
  const del = async () => {
    const token = cookie.get('token');
    if (wallet?.walletId && token) {
      const res = await getAll({
        method: 'delete',
        url: '/api/v1/wallet',
        data: { walletId: wallet?.walletId },
        token,
        chainId: id,
      });
      if (res?.status === 200) {
        const data = walletList.filter(
          (i: any) => i.walletId !== wallet?.walletId
        );
        setWalletList([...data]);
        handleCancel();
        setIsShow(false);
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = (item: any, index: number) => {
    return (
      <div
        style={{
          marginBottom: walletList.length - 1 === index ? '0px' : '6px',
        }}
        className="walletList-item"
        onClick={() => {
          selectWallet(item);
          setIsShow(true);
        }}
        key={index}
      >
        <div className="wallet-item-middle">
          <div className="wallet-name">{item.name}</div>
          <div
            className="wallet-address"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {item.address.slice(0, 4) + '...' + item.address.slice(-4)}
            <div
              onClick={(e: any) => {
                setIsCopy(true);
                setCopyItem(item);
                e.stopPropagation();
              }}
            >
              <Copy
                name={item.address}
                img={'/copy.svg'}
                select={
                  copyItem?.address === item.address &&
                  copyItem?.name === item.name
                    ? 'select'
                    : 'no'
                }
              />
            </div>
          </div>
        </div>
        <span className="wallet-balance">{item.balance} ETH</span>
      </div>
    );
  };

  return (
    <div
      className="wallet-manage"
      style={{ marginTop: showWalletDetail ? '0' : '16px' }}
    >
      <div className="scrollHei sniperOrder">
        {loading && !showWalletDetail ? (
          <InfiniteScrollPage
            data={walletList}
            next={nextPage}
            items={items}
            nextLoad={nextLoad}
            no={t('token.oo')}
            scrollableTarget={'scrollableSniperOrder'}
          />
        ) : (
          !showWalletDetail && <Loading status={'20'} browser={browser} />
        )}
      </div>
      {showWalletDetail && (
        <div className="details">
          <WalletDetail
            chainId={id}
            wallet={wallet}
            setWallet={setWallet}
            setIsLoad={setIsLoad}
            setWalletList={setWalletList}
            walletList={walletList}
            setIsShow={setIsShow}
            contractConfig={contractConfig}
            setShowWalletDetail={setShowWalletDetail}
          />
          {isLoad && (
            <p onClick={() => setIsModalOpen(true)} className="del">
              {t('token.Delete')}
            </p>
          )}
        </div>
      )}
      <Modal
        title=""
        rootClassName="delWallet"
        open={isModalOpen}
        centered
        closable={false}
        destroyOnClose={true}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="box">
          <p>{t('token.del')}</p>
          <p>
            {t('token.to')} "{wallet?.name}"
          </p>
          <div className="bot">
            <p onClick={handleCancel}>{t('Market.cancel')}</p>
            <p onClick={del}>{t('Active.Confirm')}</p>
          </div>
        </div>
      </Modal>
      {/* 添加钱包，未实现 */}
      {loading && !showWalletDetail && (
        <span className="add-wallet" onClick={createWallet}>
          {t('sniping.Add')}
        </span>
      )}
    </div>
  );
}
