import './in.less';
import BuyBot from './buyBot';
import { useParams, useNavigate } from 'react-router-dom';
import Swap from './swap';
export default function index() {
  const params: any = useParams();
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
      <div className="top">
        <div className='back'></div>
        <div className='box'>
        {top.map((i: any) => {
          return (
            <div key={i.key} className="item" onClick={i.onClick}>
              <div
                style={{
                  backgroundColor: i.status ? 'rgb(79,79,79)' : 'rgb(54,54,54)',
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
      {/* butbotLogo.svg */}
      {params?.id === 'swap' && <Swap />}
      {params?.id === 'sniping' && <p style={{ color: 'white' }}>2</p>}
      {params?.id === 'buyBot' && <BuyBot />}
    </div>
  );
}
