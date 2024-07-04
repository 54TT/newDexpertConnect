import Load from '@/components/allLoad/load.tsx';
import Copy from '@/components/copy';
import './index.less';
import { useEffect, useState, useContext } from 'react';
import Request from '@/components/axios.tsx';
import Dpass from './components/dpass';
import { CountContext } from '@/Layout.tsx';
import { FloatingBubble } from 'antd-mobile';
import History from './components/history';
import cookie from 'js-cookie';
export default function index() {
  const { user, browser }: any = useContext(CountContext);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const { getAll } = Request();
  const [select, setSelect] = useState('pass');
  const [offset, setOffset] = useState<any>();
  //  左还是右
  const [position, setPosition] = useState('right');
  const swapPerson = [
    {
      img: select === 'pass' ? '/swapDpssAc.svg' : '/swapDpass.svg',
      name: 'D pass',
      key: 'pass',
    },
    {
      img: select === 'wallet' ? '/swapWalletAc.svg' : '/swapWallet.svg',
      name: 'Wallet',
      key: 'wallet',
    },
    {
      img: select === 'history' ? '/swapHisAc.svg' : '/swapHis.svg',
      name: 'History',
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
    });
    if (res?.status === 200) {
      setData(res?.data);
    }
  };
  return (
    <div
      className={`dappsSwapHistory ${position === 'left' ? 'leftPo' : 'rightPo'}`}
      style={{
        width: open ? (browser ? '30vw' : '80vw') : browser ? '55px' : '0',
      }}
    >
      {browser && (
        <div className="leftBox">
          <div className="bor">
            <div></div>
          </div>
          <div
            className="center"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <div className="po">
              <Load show={open ? 'down' : 'up'} />
            </div>
          </div>
          <div className="bor bot">
            <div></div>
          </div>
          <div></div>
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
      <div className="box">
        <div className="user">
          <div>
            <img
              src={user?.avatarUrl ? user?.avatarUrl : '/topLogo.png'}
              alt=""
            />
            <p>sdadasdsad</p>
            <Copy name="dsadasdsad" img="/copySwap.svg" />
          </div>
          <img
            src="/closeSwap.svg"
            alt=""
            onClick={() => {
              setOpen(!open);
            }}
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
    </div>
  );
}
