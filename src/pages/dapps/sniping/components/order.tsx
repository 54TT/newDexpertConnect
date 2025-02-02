import React, { useEffect, useState, useContext } from 'react';
import './index.less';
import { Modal, Dropdown, Tooltip } from 'antd';
import cookie from 'js-cookie';
import NotificationChange from '@/components/message';
const LoadIng = React.lazy(() => import('@/components/allLoad/loading.tsx'));
import {SyncOutlined,} from '@ant-design/icons';
import Request from '@/components/axios.tsx';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
const InputSearch = React.lazy(() => import('./inputSearch'));

const InfiniteScrollPage = React.lazy(
  () => import('@/components/InfiniteScroll')
);
export default function order({ setIsShow, setOrderPar, chainId }: any) {
  const { t } = useTranslation();
  const { getAll } = Request();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const { browser }: any = useContext(CountContext);
  const [load, setLoad] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setIsOrderId] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isOpenDrop, setisOpenDrop] = useState(false);
  const [select, setSelect] = useState('0');
  const [refreshDeg,setRefreshDeg]=useState(0)
  // 是否在搜索
  const [isSearch, setIsSearch] = useState(false);
  const changePage = () => {
    if (!show) {
      setPage(page + 1);
      setLoad(true);
      if (isSearch) {
        getList(page + 1, select, searchValue.length === 42 ? searchValue : '');
      } else {
        getList(page + 1, '0', '');
      }
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setOrderPar(null);
  };

  const cancelOrder = async () => {
    const token = cookie.get('token');
    if (token && orderId) {
      const res = await getAll({
        method: 'post',
        url: '/api/v1/preswap/cancel',
        data: { orderId: orderId },
        token,
        chainId,
      });
      if (res?.status === 200) {
        const tt = data?.map((i: any) => {
          if (i.orderCode === orderId) {
            i.status = '2';
          }
          return i;
        });
        setData([...tt]);
        handleCancel();
        NotificationChange('success', res?.data?.message);
      }
    }
  };
  const getList = async (page: number, status: string, address: string) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/sniper/getSniperOrderList',
      data: { orderPage: page, status, address },
      token,
      chainId,
    });
    if (res?.status === 200) {
      if (res?.data?.orderList.length !== 10) {
        setShow(true);
      }
      if (page === 1) {
        setData(res?.data?.orderList);
      } else {
        const tt = data.concat(res?.data?.orderList);
        setData(tt);
      }
      setLoading(true);
      setLoad(false);
    } else {
      setShow(true);
      setLoading(true);
      setLoad(false);
    }
  };
  useEffect(() => {
    setLoading(false);
    getList(1, '0', '');
    setLoading(false);
    setPage(1);
  }, [chainId]);
  const changeItem = (status: string, name: string) => {
    return (
      <span
        style={{
          color: select === status ? 'rgb(134,240,151)' : 'white',
          textAlign: 'center',
          fontWeight: select === status ? 'bold' : 'normal',
        }}
        onClick={() => {
          if (select !== status) {
            setSelect(status);
            setIsSearch(true);
            getList(1, status, searchValue.length === 42 ? searchValue : '');
            setPage(1);
            setLoading(false);
          }
        }}
      >
        {name}
      </span>
    );
  };

  const items: any = [
    {
      key: '0',
      label: changeItem('0', t('token.all')),
    },
    {
      key: '1',
      label: changeItem('1', t('sniping.wait')),
    },
    {
      key: '2',
      label: changeItem('2', t('sniping.success')),
    },
    {
      key: '3',
      label: changeItem('3', t('sniping.canceled')),
    },
    {
      key: '4',
      label: changeItem('4', t('sniping.fail')),
    },
  ];

  const enter = async (e?: any) => {
    if (searchValue.length === 42 || searchValue.length === 0) {
      if (e.key === 'Enter' || e === 'click') {
        setIsSearch(true);
        getList(1, select, searchValue.length === 42 ? searchValue : '');
        setLoading(false);
        setPage(1);
      }
    }
  };
  const searchChange = async (e: any) => {
    setSearchValue(e.target.value);
    if (e.target.value?.length !== 42) {
      setIsSearch(false);
    }
  };
  const changeDropdown = (open: boolean) => {
    setisOpenDrop(open);
  };

  const itemPage = (i: any, ind: number) => {
    return (
      <div
        className="oriderItem"
        style={{
          marginBottom: data.length - 1 === ind ? '0' : '10px',
        }}
        key={ind}
      >
        <div className="top">
          <div className="left">
            <p>{i?.tokenOutSymbol}</p>
            <Tooltip title={i?.tokenOutCa}>
              <p>
                {i?.tokenOutCa?.slice(0, 4) + '...' + i?.tokenOutCa?.slice(-4)}
              </p>
            </Tooltip>
          </div>
          <div className="right">
            <p
              style={{
                border: i?.status === '1' ? '1px solid #ea6e6e' : 'none',
                color: i?.status === '1' ? '#ea6e6e' : '#7C7C7C',
              }}
              onClick={() => {
                if (i?.status === '1') {
                  setIsOrderId(i.orderCode);
                  setIsModalOpen(true);
                  setOrderPar(i);
                }
              }}
            >
              {i?.status === '1'
                ? t('Active.Cancel')
                : i?.status === '2'
                  ? t('sniping.success')
                  : i?.status === '3'
                    ? t('sniping.canceled')
                    : t('sniping.fail')}
            </p>
            <img
              src="/orderRight.svg"
              alt=""
              onClick={() => {
                setOrderPar(i);
                setIsShow(true);
              }}
            />
          </div>
        </div>
        <p className="line"></p>
        <div className="data">
          <span>{t('sniping.number')}</span>
          <div>{i?.orderCode}</div>
        </div>
        <div className="data borderBot">
          <span>{t('sniping.wallet')}</span>
          <div className="wallet">
            <div>
              {i.walletArr.map((it: string, ind: number) => {
                if (ind < 3) {
                  return (
                    <span style={{ marginRight: '4px' }} key={ind}>
                      {it}
                    </span>
                  );
                }
              })}
              {i.walletArr.length > 3 && <span>...</span>}
            </div>
            <p
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '13px',
                whiteSpace: 'nowrap',
              }}
            >
              {t('token.there')}
              {i.walletArr.length}
              {t('token.in')}
            </p>
          </div>
        </div>
        <div className="data">
          <span>{t('sniping.Amount')}</span>
          <div>{i?.tokenInAmount}</div>
        </div>
        <div className="data">
          <span>{t('sniping.time')}</span>
          <div>{i?.orderEndTime}</div>
        </div>
        <div className="status">
          <p className="succ">
            {t('sniping.Finished')} {i?.successAmount}
          </p>
          <p className="err">
            {' '}
            {t('sniping.Failed')} {i?.failAmount}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="order scrollHei sniperOrder">
      <div className="search">
        <div className="searchBox">
          <InputSearch
            enter={enter}
            searchChange={searchChange}
            placeholder={t('sniping.Contract')}
          />
        </div>
        <span 
          style={{marginLeft:'8px',cursor:'pointer'}}
          onClick={() => {
            setRefreshDeg(refreshDeg+1)
            setLoading(false)
            setData([])
            getList(1, '0', '');
          }}
        >
          <SyncOutlined style={{color:'#fff',transform:`rotate(${refreshDeg*180}deg)`,transition:'all 1s ease-in-out'}}  />
        </span>
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          onOpenChange={changeDropdown}
          placement="bottom"
          rootClassName="orderFilterDropdown"
        >
          <div className={`status ${isOpenDrop ? 'statusSelect' : ''}`}>
            <img src="/filterStatus.svg" alt="" />
            {isOpenDrop && (
              <div className="left">
                <div></div>
              </div>
            )}

            {isOpenDrop && (
              <div className="right">
                <div></div>
              </div>
            )}
          </div>
        </Dropdown>
      </div>
      {loading ? (
        <InfiniteScrollPage
          data={data}
          next={changePage}
          items={itemPage}
          nextLoad={load}
          no={t('token.data')}
          scrollableTarget={'scrollableSniperOrder'}
        />
      ) : (
        <LoadIng status={'20'} browser={browser} />
      )}
      <Modal
        title=""
        rootClassName="orderModalCancel"
        footer={null}
        centered
        open={isModalOpen}
        destroyOnClose={true}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="box">
          <p className="title">{t('token.Cancel')}</p>
          <p className="ord">{t('token.number')}</p>
          <p className="num">{orderId}</p>
          <div className="bot">
            <p onClick={handleCancel}>{t('token.later')}</p>
            <p onClick={cancelOrder}>{t('token.Terminate')}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
