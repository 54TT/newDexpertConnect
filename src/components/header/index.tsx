import { useContext, useState } from 'react';
import { CountContext } from '@/Layout.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { simplify } from '@/../utils/change.ts';
import Load from '../allLoad/load.tsx';
import HeaderModal from './components/headerModal.tsx';
import { throttle } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { Collapse, Drawer, Dropdown } from 'antd';

export type I18N_Key = 'zh_CN' | 'en_US';
function Header({ className }) {
  const router = useLocation();
  const {
    user,
    load,
    clear,
    browser,
    setIsModalOpen,
    languageChange,
    setLanguageChange,
  }: any = useContext(CountContext);
  const { t, i18n } = useTranslation();
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const showDrawer = throttle(
    function () {
      setOpen(true);
    },
    1500,
    { trailing: false }
  );
  const onClose = () => {
    setOpen(false);
  };
  // 改变路由方法
  const historyChange = throttle(
    function (i: string) {
      switch (i) {
        case 'Community':
          history('/community/lastest');
          break;
        case 'Market':
          history('/');
          break;
        case 'DApps':
          history('/dapps/swap');
          break;
      }
    },
    1500,
    { trailing: false }
  );
  const logout = throttle(
    function () {
      clear();
    },
    1500,
    { trailing: false }
  );
  const items: any = [
    {
      key: '1',
      label: <p onClick={logout}>{t('person.logout')}</p>,
    },
  ];

  const loginModal = throttle(
    function () {
      if (!load) {
        if (!user) {
          setIsModalOpen(true);
        }
      }
    },
    1500,
    { trailing: false }
  );
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
            {
              name: 'Token Creation',
              img: '/mainMore.svg',
              key: 'tokencreation',
            },
            { name: 'Swap', img: '/swapMore.png', key: 'swap' },
            {
              name: 'Sniping',
              img: '/snipingMore.png',
              key: 'sniping',
            },
            // { name: 'Buy Bot', img: '/buybotMore.png', key: 'buyBot' },
            // { name: 'Orders', img: '/limit.svg', key: 'limit' },
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
  const change = (ind: string) => {
    if (
      router.pathname === '/' ||
      router.pathname === '/newpairDetails' ||
      router.pathname === '/logout'
    ) {
      if (ind === 'Market') {
        return 'rgb(134,240,151)';
      } else {
        return 'rgb(172,172,172)';
      }
      // 判断  community
    } else if (
      router.pathname === '/community/lastest' ||
      router.pathname === '/community/profile' ||
      router.pathname === '/community/following'
    ) {
      if (ind === 'Community') {
        return 'rgb(134,240,151)';
      } else {
        return 'rgb(172,172,172)';
      }
      // 判断 dapps
    } else if (router.pathname.includes('/dapps/')) {
      if (ind === 'DApps') {
        return 'rgb(134,240,151)';
      } else {
        return 'rgb(172,172,172)';
      }
    } else {
      return 'rgb(172,172,172)';
    }
  };

  const HeaderList = [
    {
      label: t('Common.Market'),
      value: 'Market',
      key: 'Market',
    },
    {
      label: t('Common.DApps'),
      value: 'DApps',
      key: 'DApps',
    },
    // {
    //   label: t('Common.Community'),
    //   value: 'Community',
    //   key: 'Community',
    // },
  ];

  const [hoverColor, sethoverColor] = useState(false);
  const mouseOver = () => {
    sethoverColor(true);
  };
  const mouseOut = () => {
    sethoverColor(false);
  };

  const changeLanguage = throttle(
    function (language) {
      localStorage.setItem('language', language);
      setLanguageChange(language);
      i18n.changeLanguage(language);
    },
    1500,
    { trailing: false }
  );

  const translateList: any = [
    {
      key: 'en_US',
      value: t('Translate.en_US'),
      label: 'English',
    },
    {
      key: 'zh_CN',
      value: t('Translate.zh_CN'),
      label: '简体中文',
    },
    {
      key: 'zh_TW',
      value: t('Translate.zh_TW'),
      label: '繁體中文',
    },
    {
      key: 'zh_JP',
      value: t('Translate.zh_JP'),
      label: '日本語',
    },
  ];

  const onClickTranslate = ({ key }) => {
    changeLanguage(key);
  };

  return (
    <div className={`headerBox ${className}`}>
      <div className="dis">
        <img
          src="/logo1111.svg"
          alt=""
          onClick={throttle(
            function () {
              window.open('https://info.dexpert.io/');
            },
            1500,
            { trailing: false }
          )}
          style={{ width: '100px', display: 'block', cursor: 'pointer' }}
        />
      </div>
      {browser && (
        <p className={`headerCenter dis`} style={{ width: '40%' }}>
          {HeaderList.map(({ label, key }, ind) => {
            return (
              <span
                key={ind}
                style={{
                  color: change(key),
                  whiteSpace: 'nowrap',
                  margin: ind === 1 ? '0 10px' : '0',
                }}
                onClick={throttle(
                  function () {
                    historyChange(key);
                  },
                  1500,
                  { trailing: false }
                )}
              >
                {label}
              </span>
            );
          })}
        </p>
      )}
      <div
        className={'headerData'}
        style={{
          justifyContent: browser ? 'center' : 'space-between',
          width: browser ? '' : '40%',
        }}
      >
        <div
          className="disDis"
          style={{ cursor: 'pointer' }}
          onClick={throttle(
            function () {
              history('/activity');
            },
            1500,
            { trailing: false }
          )}
          onMouseOver={mouseOver}
          onMouseOut={mouseOut}
        >
          <img
            src={
              router.pathname === '/activity' || hoverColor
                ? '/gift1.svg'
                : '/giftWhite1.svg'
            }
            alt=""
            style={{ width: '23px', cursor: 'pointer' }}
          />
          {browser && (
            <p
              style={{
                color:
                  router.pathname === '/activity' || hoverColor
                    ? 'rgb(134,240,151)'
                    : 'rgb(214, 223, 215)',
                marginLeft: '6px',
              }}
            >
              {t('Common.Events')}
            </p>
          )}
        </div>
        {user?.uid ? (
          <>
            <div
              className={'disCen'}
              style={{ cursor: 'pointer', margin: browser ? '0 12px' : '' }}
            >
              <Dropdown
                overlayClassName={'headerDropdownClass'}
                menu={{
                  items,
                }}
              >
                {browser ? (
                  <div className={'headLine'}>
                    <img
                      src={user?.avatarUrl ? user?.avatarUrl : '/topLogo.png'}
                      style={{
                        width: '26px',
                        display: 'block',
                        marginRight: '-8px',
                        zIndex: '10',
                        borderRadius: '100%',
                      }}
                      alt=""
                      loading={'lazy'}
                    />
                    <p className={'headLineP'}>{simplify(user?.username)}</p>
                  </div>
                ) : (
                  <img
                    loading={'lazy'}
                    src={user?.avatarUrl ? user?.avatarUrl : '/topLogo.png'}
                    style={{
                      width: '25px',
                      margin: '0 15px',
                      display: 'block',
                      cursor: 'pointer',
                      borderRadius: '100%',
                    }}
                    alt=""
                  />
                )}
              </Dropdown>
              {browser && (
                <div className={'headLine'}>
                  <p className={'headLineP'}>
                    {user?.rewardPointCnt + ' D' || '0 D'}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {browser ? (
              <div
                className={'headerConnect'}
                style={{ margin: '0 8px' }}
                onClick={loginModal}
              >
                <div className={'disCen'}>
                  <span>{t('Common.Connect Wallet')}</span>
                  {load && <Load />}
                </div>
              </div>
            ) : (
              <img
                loading={'lazy'}
                src="/wallet.svg"
                onClick={loginModal}
                style={{ width: '26px' }}
                alt=""
              />
            )}
          </>
        )}
        <Dropdown menu={{ items: translateList, onClick: onClickTranslate }} overlayClassName={'language-select'}>
          <div
            className="dis"
            style={{
              // alignItems: 'flex-end',
              alignItems: 'center',
              marginRight: '6px',
              fontSize: '14px',
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <img
              src="/earth.svg"
              alt=""
              style={{ cursor: 'pointer', display: 'block', width: '25px' }}
            />
            <span
              style={{ color: '#ccc', marginLeft: '2px', marginBottom: '0px' }}
            >
              {translateList.find((item) => item.key === languageChange).value}
            </span>
          </div>
        </Dropdown>
        {!browser && (
          <img
            src="/rightOpen.png"
            loading={'lazy'}
            alt=""
            style={{ cursor: 'pointer', width: '23px' }}
            onClick={showDrawer}
          />
        )}
      </div>
      <HeaderModal />
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
    </div>
  );
}

export default Header;
