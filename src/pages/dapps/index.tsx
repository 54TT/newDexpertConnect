import './in.less';
import React,{ useContext, useState } from 'react';
const BuyBot = React.lazy(() => import('./buyBot'));

import { CountContext } from '@/Layout';
import { useParams, useNavigate } from 'react-router-dom';
const Swap = React.lazy(() => import('./swap'));
const Sniping = React.lazy(() => import('./sniping'));
const Limit = React.lazy(() => import('./limit'));
const Mint = React.lazy(() => import('./mint'));

export default function index() {
  const params: any = useParams();
  const { browser }: any = useContext(CountContext);
  const [hoverKey, setHoverKey] = useState('');
  const history = useNavigate();
  const top = [
    {
      imgAc: '/mainActive.svg',
      img: '/mainMore.svg',
      status: params?.id === 'tokencreation',
      name: 'Token Creation',
      onClick: () => {
        history('/dapps/tokencreation');
      },
      key: 'mint',
    },
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
      name: 'Sniper',
      onClick: () => {
        history('/dapps/sniping');
      },
      key: 'sniping',
    },
    {
      imgAc: '/buybotActive.png',
      img: '/buybotMore.png',
      status: params?.id === 'buyBot',
      name: 'TG Group Notification Bot',
      onClick: () => {
        history('/dapps/buyBot');
      },
      key: 'buyBot',
    },
    {
      imgAc: '/limitActive.svg',
      img: '/limit.svg',
      status: params?.id === 'limit',
      name: 'Limit',
      onClick: () => {
        history('/dapps/limit');
      },
      key: 'limit',
    },
    // {
    //   imgAc: '/mainActive.svg',
    //   img: '/mainMore.svg',
    //   status: params?.id === 'tokencreation',
    //   name: 'Token Creation',
    //   onClick: () => {
    //     history('/dapps/tokencreation');
    //   },
    //   key: 'mint',
    // },
  ];
  const mouseOver = (key: string) => {
    setHoverKey(key);
  };
  return (
    <div className="dappsBox">
      {browser && (
        <div
          // style={{ padding: browser ? ' 12px 35%' : '10px 6%' }}
          className="top"
        >
          <div className="back"></div>
          <div className="box">
            {top.map((i: any) => {
              return (
                <div
                  key={i.key}
                  className="item"
                  onClick={i.onClick}
                  onMouseOver={() => mouseOver(i.key)}
                  onMouseOut={() => {
                    setHoverKey('');
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        i.status || hoverKey == i.key
                          ? 'rgb(79,79,79)'
                          : 'rgb(54,54,54)',
                    }}
                  >
                    <img
                      src={i.status || hoverKey == i.key ? i.imgAc : i.img}
                      alt=""
                      style={{ width: i.key === 'mint' ? '10px' : '' }}
                    />
                  </div>
                  <span
                    style={{
                      color:
                        i.status || hoverKey == i.key
                          ? 'rgb(134,240,151)'
                          : 'rgb(162,162,162)',
                      width: i.key === 'buyBot' ? '120px' : 'auto',
                    }}
                  >
                    {i.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {params?.id === 'swap' && <Swap />}
      {params?.id === 'sniping' && <Sniping />}
      {params?.id === 'buyBot' && <BuyBot />}
      {params?.id === 'limit' && <Limit />}
      {params?.id === 'tokencreation' && <Mint />}
    </div>
  );
}
