import '../index.less';
import React, { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout.tsx';
import dayjs from 'dayjs';
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
const Loading = React.lazy(() => import('@/components/allLoad/loading.tsx'));
const Load = React.lazy(() => import('@/components/allLoad/load.tsx'));
const Nodata = React.lazy(() => import('@/components/Nodata.tsx'));
import { CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
const Left = React.lazy(() => import('./components/left'));
import { throttle } from 'lodash';
import NotificationChange from '@/components/message';
import copy from 'copy-to-clipboard';
const Right = React.lazy(() => import('./components/right'));
export default function person() {
  const { getAll } = Request();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);
  const [userPass, setUserPass] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [list, setList] = useState([
    { name: 'ETH', img: '/MetaMasketh.png' },
    { name: 'Sol', img: '/MetaMasksol.png' },
    { name: 'Ton', img: '/Groupton.png' },
  ]);
  const [isLoad, setIsLoad] = useState(false);
  const { user, bindingAddress, browser }: any = useContext(CountContext);
  const [isCopy, setIsCopy] = useState(false);
  const getLink = throttle(
    async function () {
      const token = cookie.get('token');
      const res = await getAll({
        method: 'get',
        url: '/api/v1/airdrop/referral/code',
        data: {},
        token,
      });
      if (res?.status === 200 && res?.data?.url) {
        setIsCopy(false);
        copy(res?.data?.url);
        NotificationChange('success', t('person.copy'));
      } else {
        setIsCopy(false);
      }
    },
    1500,
    { trailing: false }
  );
  const getPointHistory = async (page: number) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'post',
      url: '/api/v1/rewardPoint/history',
      data: { page },
      token,
    });
    if (res?.status === 200) {
      if (page === 1) {
        setHistory(res?.data?.list);
      } else {
        const at = history.concat(res?.data?.list);
        setHistory([...at]);
      }
      setLoad(false);
    } else {
      setLoad(false);
    }
  };
  const getUserPass = async () => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/d_pass/info',
      data: {},
      token,
    });
    if (res?.status === 200) {
      setUserPass(res?.data);
      setIsLoad(true);
    }
  };
  useEffect(() => {
    const token = cookie.get('token');
    if (user && token) {
      getPointHistory(1);
      getUserPass();
      const at = list.map((i: any) => {
        bindingAddress.map((item: any) => {
          if (i.name.toLowerCase() === item.chainName.toLowerCase()) {
            i.address = item.address;
          }
        });
        return i;
      });
      setList(at);
    }
  }, [user]);
  const next = throttle(
    function () {
      getPointHistory(page + 1);
      setPage(page + 1);
      setLoad(true);
    },
    1500,
    { trailing: false }
  );

  const [value, setValue] = useState('');
  const [isValue, setIsValue] = useState(false);
  const verifyInvite = throttle(
    async function () {
      if (value) {
        const token = cookie.get('token');
        if (token) {
          setIsValue(true);
          const res = await getAll({
            method: 'post',
            url: '/api/v1/invite-code/confirm',
            data: { inviteCode: value },
            token,
          });
          if (res?.status === 200) {
            setIsValue(false);
            NotificationChange('success', t('person.ver'));
          } else {
            setIsValue(false);
          }
        }
      }
    },
    1500,
    { trailing: false }
  );
  const change = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <>
      {isLoad ? (
        <div className="activityPerson">
          <div
            className="box"
            style={{
              width: browser ? '85%' : '90%',
              margin: browser ? '5% auto 60px' : '30px auto 60px',
            }}
          >
            <div className="person">
              {<Left />}
              {browser && <Right userPass={userPass} />}
              <img
                src="/GroupPass.svg"
                alt=""
                className="passCard"
                style={{
                  width: browser ? '10%' : '80px',
                  transform: browser
                    ? 'translate(30%,-50%)'
                    : 'translate(10%,-30%)',
                }}
              />
              {browser && (
                <img
                  src="/coinPass.svg"
                  alt=""
                  className="coinPass"
                  style={{
                    width: browser ? '8.5%' : '80px',
                    transform: 'translate(-50%,55%)',
                  }}
                />
              )}
            </div>
            {!browser && <Right userPass={userPass} />}
            <div style={{ display: 'none' }} className="Invite">
              <div style={{ display: 'flex', width: '80%' }}>
                <div className="left">
                  <div className="leftTop">
                    <p>{t('person.Invite')}</p>
                    <img src="/rightLi1.png" alt="" />
                  </div>
                  <div className="leftBot">
                    <p> {t('person.form')}</p>
                    <div
                      onClick={throttle(
                        function () {
                          getLink();
                          setIsCopy(true);
                        },
                        1500,
                        { trailing: false }
                      )}
                    >
                      {' '}
                      {isCopy ? <Load /> : t('person.Link')}
                    </div>
                  </div>
                </div>
                <div className="centerNow">
                  <p>{t('person.number')}</p>
                  <p>100</p>
                </div>
              </div>
              <div className="rightNow">
                {['/coinPass.svg', '/coinPass.svg', '/coinPass.svg'].map(
                  (i: string, ind: number) => {
                    return <img src={i} key={ind} alt="" />;
                  }
                )}
              </div>
            </div>
            <div className="sureInvite">
              <div style={{ width: browser ? '50%' : '100%' }}>
                <input
                  type="text"
                  placeholder={t('person.ent')}
                  onChange={change}
                />
                <div onClick={verifyInvite}>
                  {t('person.con')} {isValue && <Load />}
                </div>
              </div>
              {browser && (
                <img src="/GroupPass.svg" alt="" className="positionImg" />
              )}
              {browser && (
                <div className="rightNow">
                  {['/coinPass.svg', '/coinPass.svg', '/coinPass.svg'].map(
                    (i: string, ind: number) => {
                      return <img src={i} key={ind} alt="" />;
                    }
                  )}
                </div>
              )}
            </div>
            <div
              className="list"
              style={{
                padding: browser ? '3% 6%' : '45px 20px',
                marginTop: browser ? '8%' : '65px',
              }}
            >
              <div className="data dis top">
                <span>Time</span>
                <span>Task</span>
                <span>Integral</span>
              </div>
              {history.length > 0 ? (
                history.map((i: any, ind: number) => {
                  return (
                    <div className="data dis bot" key={ind}>
                      <span>
                        {i?.timestamp
                          ? dayjs(i?.timestamp).format('YYYY-MM-DD HH:mm:ss')
                          : ''}
                      </span>
                      <span>{i?.description}</span>
                      <span>+{i?.score || 0}</span>
                    </div>
                  );
                })
              ) : (
                <Nodata />
              )}
              {history.length > 0 && !(history.length % 10) && (
                <div className="next disCen" onClick={next}>
                  <span>下一页</span> {load ? <Load /> : <CaretDownOutlined />}
                </div>
              )}
              <img
                src="/GroupPass.svg"
                alt=""
                className="passCard"
                style={{
                  width: browser ? '10%' : '80px',
                  transform: browser
                    ? 'translate(-50%,-50%)'
                    : 'translate(-10%,-50%)',
                }}
              />
              <img
                src="/coinPass.svg"
                alt=""
                className="coinPass"
                style={{
                  width: browser ? '8.5%' : '80px',
                  transform: browser
                    ? 'translate(50%,-50%)'
                    : 'translate(13%,-50%)',
                }}
              />
            </div>
          </div>
          <div
            className="backgroundColor"
            style={{ top: '15vh', background: '#86F097', left: '0' }}
          ></div>
          <div
            className="backgroundColor"
            style={{ top: '10vh', background: '#0FF', right: '0' }}
          ></div>
        </div>
      ) : (
        <Loading status={'20'} browser={browser} />
      )}
    </>
  );
}
