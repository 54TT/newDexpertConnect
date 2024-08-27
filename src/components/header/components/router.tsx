import { useTranslation } from 'react-i18next';
import { throttle } from 'lodash-es';
import { useLocation, useNavigate } from 'react-router-dom';

export default function list() {
  const { t } = useTranslation();
  const router = useLocation();
  const history = useNavigate();

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

  return (
    <p className={`headerCenter dis`} style={{ width: '30%' }}>
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
  );
}
