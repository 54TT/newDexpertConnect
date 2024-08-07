import { useContext, useState } from 'react';
import {  Dropdown } from 'antd';
import { CountContext } from '../../Layout.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { simplify } from '@/../utils/change.ts';
import Load from '../allLoad/load.tsx';
import HeaderModal from './components/headerModal.tsx';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import ListText from './components/router.tsx';
import MobileRouter from './components/mobileRouter.tsx'
export type I18N_Key = 'zh_CN' | 'en_US';
function Header() {
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
  const [hoverColor, sethoverColor] = useState(false);
  const mouseOver = () => {
    sethoverColor(true);
  };
  const mouseOut = () => {
    sethoverColor(false);
  };

  const changeLanguage = throttle(
    function () {
      if (languageChange === 'zh_CN') {
        localStorage.setItem('language', 'en_US');
        setLanguageChange('en_US');
        i18n.changeLanguage('en_US');
      } else {
        localStorage.setItem('language', 'zh_CN');
        setLanguageChange('zh_CN');
        i18n.changeLanguage('zh_CN');
      }
    },
    1500,
    { trailing: false }
  );
  return (
    <div className={'headerBox'}>
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
      {browser && <ListText />}
      <div
        className={'headerData'}
        style={{
          justifyContent: browser ? 'center' : 'space-between',
          width: browser ? '' : '35%',
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
        <img
          src="/earth.svg"
          alt=""
          style={{ cursor: 'pointer', display: 'block', width: '25px' }}
          onClick={changeLanguage}
        />
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
      <MobileRouter onClose={onClose} open={open}/>
    </div>
  );
}

export default Header;
