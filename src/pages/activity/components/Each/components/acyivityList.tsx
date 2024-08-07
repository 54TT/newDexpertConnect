import { CountContext } from '@/Layout.tsx';
import React,{ useContext,  } from 'react';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
const Load = React.lazy(() => import('@/components/allLoad/load.tsx'));
import cookie from 'js-cookie';

export default function acyivityList({
  selectActive,
  it,
  arr,
  index,
  setSelectActive,
  params,
  option,
  loading,
  i,
  verification,
  getParams,
  select,
  operate,
  setSelect,
  setLoading,
  param,
  isVerify,
  setIsVerify,
}) {
  const { browser }: any = useContext(CountContext);
  const { t } = useTranslation();
  const changeImg = (id: string, title: string) => {
    if (title.includes('Twitter')) {
      return selectActive === id ? '/tuiActive.svg' : '/tui.svg';
    } else if (title.includes('Telegram')) {
      return selectActive === id ? '/telegramsActive.svg' : '/telegrams.svg';
    } else if (title.includes('Discord')) {
      return selectActive === id ? '/disActive.svg' : '/dis.svg';
    } else if (title.includes('Instagram')) {
      return selectActive === id ? '/instagramActive.svg' : '/instagram.svg';
    } else {
      return selectActive === id ? '/abc.png' : '/abcd.png';
    }
  };

  const changeTitle = (title: string, extra: any) => {
    if (params?.id === '1') {
      return title;
    } else {
      if (extra) {
        const aaa: any = extra?.split('|');
        if (aaa.length > 0) {
          return aaa[0];
        } else {
          return title;
        }
      } else {
        return title;
      }
    }
  };

  const showScore = (campaignId: string, it: any) => {
    if (params?.id === '1') {
      if (Number(it?.score)) {
        return '+' + it?.score;
      } else {
        return it?.score;
      }
    } else {
      if (it?.extra) {
        const par: any = it?.extra?.split('|');
        if (par.length > 0) {
          return '+' + par[1];
        } else {
          return '+0';
        }
      } else {
        if (option === 'first') {
          if (Number(campaignId) >= 4) {
            if (Number(it?.isCompleted)) {
              if (it?.operationSymbol?.includes('golden')) {
                return t('Dpass.deadline');
              } else {
                return '+' + it?.score;
              }
            } else {
              return '';
            }
          } else {
            if (Number(it?.score) || Number(it?.score) === 0) {
              return '+' + it?.score;
            } else {
              return it?.score;
            }
          }
        } else {
          if (Number(it?.score) || Number(it?.score) === 0) {
            return '+' + it?.score;
          } else {
            return it?.score;
          }
        }
      }
    }
  };

  return (
    <div
      key={it?.taskId}
      className={'firstLine'}
      style={{
        background:
          selectActive === it?.taskId
            ? 'rgb(52,62,53)'
            : 'linear-gradient(to right, #020c02, rgb(38, 45, 38))',
        marginBottom: index === arr.length - 1 ? '' : '35px',
        display: browser ? 'flex' : 'block',
      }}
      onClick={throttle(
        function () {
          if (selectActive !== it?.taskId) {
            setSelectActive(it?.taskId);
          } else {
            setSelectActive('');
          }
        },
        1500,
        { trailing: false }
      )}
    >
      <div className="left">
        <img src={changeImg(it?.taskId, it?.title)} alt="" />
        <span
          style={{
            color: selectActive === it?.taskId ? 'rgb(134,240,151)' : 'white',
          }}
        >
          {changeTitle(it?.title, it?.extra)}
        </span>
      </div>
      <div className="right" style={{ marginTop: browser ? '0' : '10px' }}>
        <p
          className="point"
          style={{
            color: selectActive === it?.taskId ? 'rgb(134,240,151)' : 'white',
            marginRight: '20px',
          }}
        >
          {showScore(i?.campaign?.campaignId, it)}
        </p>
        {Number(it?.isCompleted) !== 3 ? (
          <div
            onClick={throttle(
              function () {
                if (!isVerify && !loading) {
                  param(it, i?.campaign);
                  cookie.set('taskId', it?.taskId);
                  setSelect(it?.taskId);
                  setLoading(true);
                }
              },
              1500,
              { trailing: false }
            )}
            className={'start'}
          >
            {loading && select === it?.taskId ? (
              <Load />
            ) : (
              operate(it?.isCompleted, it?.title)
            )}
          </div>
        ) : (
          <div className={'success'}>
            <img
              src={
                selectActive === it?.taskId ? '/succActive.svg' : '/succ.svg'
              }
              alt=""
            />
          </div>
        )}
        {/* 验证 */}
        {option === 'daily' &&
          Number(it?.isCompleted) !== 3 &&
          Number(params?.id) < 4 && (
            <div
              className={'verify'}
              onClick={throttle(
                function () {
                  if (!isVerify && !loading) {
                    setIsVerify(true);
                    if (!it?.title?.includes('Twitter') && params?.id === '1') {
                      getParams();
                    } else {
                      verification(it?.taskId);
                    }
                  }
                },
                1500,
                { trailing: false }
              )}
            >
              {t('Dpass.verify')}
              {isVerify && selectActive === it?.taskId ? <Load /> : ''}
            </div>
          )}
      </div>
    </div>
  );
}
