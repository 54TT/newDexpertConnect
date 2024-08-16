import { Collapse, Drawer,} from 'antd';
import { useTranslation } from 'react-i18next';
import { throttle } from 'lodash';
import { useNavigate } from 'react-router-dom';

export default function mobileRouter({onClose, open}:any) {
const history = useNavigate();
const { t,  } = useTranslation();
    const collapseItems: any = [
        {
          key: '0',
          label: (
            <div>
              <img src="/market.png" alt="" />
              <span>{t('Common.Market')}</span>
            </div>
          ),
        },
        {
          key: '1',
          label: (
            <div>
              <img src="/dappsLogo.png" alt="" />
              <span>Dapps</span>
            </div>
          ),
          children: (
            <div className={'collapseChildeen'}>
              {[
                { name: 'Swap', img: '/swapMore.png', key: 'swap' },
                {
                  name: 'Sniping',
                  img: '/snipingMore.png',
                  key: 'sniping',
                },
                { name: 'Buy Bot', img: '/buybotMore.png', key: 'buyBot' },
                {
                  name: 'Token Creation',
                  img: '/mainMore.svg',
                  key: 'tokencreation',
                },
              ].map((i: any) => {
                return (
                  <p
                    key={i.key}
                    onClick={throttle(
                      function () {
                        history('/dapps/' + i.key);
                        onClose();
                      },
                      1500,
                      { trailing: false }
                    )}
                  >
                    <img src={i.img} alt="" loading={'lazy'} />
                    <span style={{ color: 'rgb(200,200,200)' }}>{i.name}</span>
                  </p>
                );
              })}
            </div>
          ),
        },
        // {
        //   key: '2',
        //   label: (
        //     <div>
        //       <img src="/community.png" alt="" />
        //       <span>Community</span>
        //     </div>
        //   ),
        //   children: (
        //     <div className={'collapseChildeen'}>
        //       {[
        //         { name: 'lastest', img: '/community/latest.svg' },
        //         {
        //           name: 'profile',
        //           img: '/community/profile.svg',
        //         },
        //         { name: 'following', img: '/community/follow.svg' },
        //       ].map((i: any, ind: number) => {
        //         return (
        //           <p
        //             key={ind}
        //             onClick={throttle(
        //               function () {
        //                 history(`/community/${i.name}`);
        //                 onClose();
        //               },
        //               1500,
        //               { trailing: false }
        //             )}
        //           >
        //             <img src={i.img} alt="" loading={'lazy'} />
        //             <span>{i.name}</span>
        //           </p>
        //         );
        //       })}
        //     </div>
        //   ),
        // },
      ];

  const onChange = (key: string | string[]) => {
    if (key.length > 0 && key[0] === '0') {
      history('/');
      onClose();
    }
  };


  return (
    <Drawer
        width={'65vw'}
        className={'headerDrawerOpen'}
        destroyOnClose={true}
        onClose={onClose}
        open={open}
      >
        <Collapse
          items={collapseItems}
          accordion
          className={'headerCollapse'}
          onChange={onChange}
          ghost
        />
      </Drawer>
  )
}
