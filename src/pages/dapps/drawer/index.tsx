import React,{ useEffect, useState, useContext } from 'react';
const Copy = React.lazy(() => import('@/components/copy'));
const Load = React.lazy(() => import('@/components/allLoad/load.tsx'));
import './index.less';
import Request from '@/components/axios.tsx';
import { Drawer } from 'antd';
const Dpass = React.lazy(() => import('./components/dpass'));
import { CountContext } from '@/Layout.tsx';
import { FloatingBubble } from 'antd-mobile';
const History = React.lazy(() => import('./components/history'));

const AddWallet = React.lazy(() => import('./components/addWallet'));

const SetWallet = React.lazy(() => import('./components/setWallet'));

import cookie from 'js-cookie';
import { useTranslation } from 'react-i18next';

export default function index({ id }: any) {
  const { t } = useTranslation();
  const { user, browser }: any = useContext(CountContext);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const { getAll } = Request();
  const [select, setSelect] = useState('pass');
  const [addWallet, setAddWallet] = useState('more');
  const [walletId, setWalletId] = useState<any>(null);
  const [offset, setOffset] = useState<any>();
  //  左还是右
  const [position, setPosition] = useState('right');
  const onClose = () => {
    setOpen(false);
    setAddWallet('more');
    setWalletId(null);
  };
  const swapPerson = [
    {
      img: select === 'pass' ? '/swapDpssAc.svg' : '/swapDpass.svg',
      name: 'D pass',
      key: 'pass',
    },
    {
      img: select === 'wallet' ? '/swapWalletAc.svg' : '/swapWallet.svg',
      name: t('sniping.Assets'),
      key: 'wallet',
    },
    {
      img: select === 'history' ? '/swapHisAc.svg' : '/swapHis.svg',
      name: t('sniping.History'),
      key: 'history',
    },
  ];
  useEffect(() => {
    getUserPass();
  }, []);
  useEffect(() => {
    if (!open) {
      setSelect('pass');
    }
  }, [open]);
  const getUserPass = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/d_pass/info',
      data: {},
      token,
      chainId: id.toString(),
    });
    if (res?.status === 200) {
      setData(res?.data);
    }
  };
  return (
    <div
      className={`dappsSwapHistory ${position === 'left' ? 'leftPo' : 'rightPo'}`}
    >
      {browser && !open && (
        <div
          className="po"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Load show={open ? 'down' : 'up'} />
        </div>
      )}
      {!browser && !open && (
        <FloatingBubble
          axis="xy"
          offset={offset}
          magnetic="x"
          style={{
            '--initial-position-bottom': '50%',
            '--initial-position-right': '0',
            '--background': 'none',
            '--edge-distance': '-6px',
            '--border-radius': '0',
            '--size': 'auto',
            '--z-index': '0',
          }}
          onOffsetChange={(offset: any) => {
            const at = parseInt(offset?.x);
            const win = window.innerWidth;
            if (35 - win == at) {
              setPosition('left');
            }
            if (at === 0) {
              setPosition('right');
            }
            setOffset(offset);
          }}
        >
          <img
            src={
              position === 'left' ? '/swapSideImg2.svg' : '/swapSideImg1.svg'
            }
            onClick={() => setOpen(!open)}
            alt=""
            width={'35px'}
          />
        </FloatingBubble>
      )}
      <Drawer
        title="Basic Drawer"
        rootClassName="dappsAllDrawer"
        onClose={onClose}
        open={open}
      >
        {addWallet === 'more' ? (
          <div className="box">
            <div className="user">
              <div>
                <img
                  src={user?.avatarUrl ? user?.avatarUrl : '/topLogo.png'}
                  style={{ borderRadius: '50%' }}
                  alt=""
                />
                <p>
                  {user?.username
                    ? user?.username.slice(0, 4) + '...'
                    : user?.username}
                </p>
                <Copy name="dsadasdsad" img="/copySwap.svg" />
              </div>
              <img
                src="/walletAdd.svg"
                alt=""
                onClick={() => setAddWallet('add')}
                style={{ cursor: 'pointer', display: 'none' }}
              />
            </div>
            <p className="price">dsdada</p>
            <div className="select">
              {swapPerson.map((i: any) => {
                return (
                  <div
                    onClick={() => {
                      if (select !== i.key) {
                        setSelect(i.key);
                      }
                    }}
                    key={i.key}
                    className={select === i.key ? 'back' : ''}
                  >
                    <img src={i.img} alt="" />
                    <p>{i.name}</p>
                  </div>
                );
              })}
            </div>
            {select === 'pass' && <Dpass data={data} />}
            {select === 'history' && <History />}
          </div>
        ) : addWallet === 'add' ? (
          <AddWallet
            setAddWallet={setAddWallet}
            setWalletId={setWalletId}
            id={id}
          />
        ) : (
          <SetWallet walletId={walletId} />
        )}
      </Drawer>
    </div>
  );
}
