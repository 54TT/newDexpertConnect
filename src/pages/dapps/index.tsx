import './in.less';
import BuyBot from './buyBot';
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swap from './swap';
import { CountContext } from '@/Layout';
export default function index() {
  const params: any = useParams();
  const { browser }: any = useContext(CountContext);
  const history = useNavigate();
  const top = [
    {
      status: params?.id === 'swap',
      imgAc: '/swapActive.png',
      img: '/swapMore.png',
      name: 'Swap',
      onClick: () => {
        history('/dapps/swap');
      },
      key: 'swap',
    },
    {
      status: params?.id === 'sniping',
      imgAc: '/snipingActive.png',
      img: '/snipingMore.png',
      name: 'Sniping',
      onClick: () => {
        history('/dapps/sniping');
      },
      key: 'sniping',
    },
    {
      imgAc: '/buybotActive.png',
      img: '/buybotMore.png',
      status: params?.id === 'buyBot',
      name: 'Buy Bot',
      onClick: () => {
        history('/dapps/buyBot');
      },
      key: 'buyBot',
    },
  ];

  return (
    <div className="dappsBox">
      <div
        style={{ padding: browser ? ' 12px 35%' : '10px 6%' }}
        className="top"
      >
        <div className="back"></div>
        <div className="box">
          {top.map((i: any) => {
            return (
              <div key={i.key} className="item" onClick={i.onClick}>
                <div
                  style={{
                    backgroundColor: i.status
                      ? 'rgb(79,79,79)'
                      : 'rgb(54,54,54)',
                  }}
                >
                  <img src={i.status ? i.imgAc : i.img} alt="" />
                </div>
                <span
                  style={{
                    color: i.status ? 'rgb(134,240,151)' : 'rgb(162,162,162)',
                  }}
                >
                  {i.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {params?.id === 'swap' && <Swap />}
      {params?.id === 'sniping' && <p style={{ color: 'white' }}>Comming Soon</p>}
      {params?.id === 'buyBot' && <BuyBot />}
    </div>
  );
}
