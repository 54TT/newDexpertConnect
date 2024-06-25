import Load from '@/components/allLoad/load.tsx';
import Copy from '@/components/copy';
import './index.less';
import { useEffect, useState } from 'react';
import Request from '@/components/axios.tsx';
import Dpass from './components/dpass';
import History from './components/history';
import cookie from 'js-cookie';
export default function index() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const { getAll } = Request();
  const [select, setSelect] = useState('pass');
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
    <div className="dappsSwapHistory" style={{ width: open ? '30vw' : '65px' }}>
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
      <div className="box">
        <div className="user">
          <div>
            <img src="/copySwap.svg" alt="" />
            <p>sdadasdsad</p>
            <Copy name="dsadasdsad" img="/copySwap.svg" />
          </div>
          <img src="/closeSwap.svg" alt="" onClick={() => setOpen(!open)} />
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
