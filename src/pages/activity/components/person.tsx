import './index.less';
import { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout.tsx';
import Copy from '@/components/copy.tsx';
import { simplify } from '@/../utils/change.ts';
import dayjs from 'dayjs';
import { Popover } from 'antd';
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import Loading from '@/components/allLoad/loading.tsx';
import Load from '@/components/allLoad/load.tsx';
import Nodata from '@/components/Nodata.tsx';
import { CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { throttle } from 'lodash';
import { MessageAll } from '@/components/message.ts';
import copy from 'copy-to-clipboard';
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
  const [refresh, setRefresh] = useState(false);
  const currentAddress = cookie.get('currentAddress');
  const { user, bindingAddress, browser, setIsModalOpen, changeBindind }: any =
    useContext(CountContext);
  const [open, setOpen] = useState(false);
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
        MessageAll('success', t('person.copy'));
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
  const passCard = [
    {
      name: 'Golden Pass:',
      data: Number(userPass?.stopTs)
        ? dayjs.unix(userPass?.stopTs).format('YYYY-MM-DD')
        : t('Alert.Not'),
    },
    { name: 'Fast Trade Pass:', data: userPass?.sniperBotSwapCnt || 0 },
    { name: 'Sniper Bot Pass:', data: userPass?.sniperBotPreswapCnt || 0 },
    {
      name: 'Token Creation Bot Pass:',
      data: userPass?.launchBotCreationCnt || 0,
    },
  ];
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
  const select = (i: any) => {
    setOpen(false);
    setIsModalOpen(true);
    changeBindind.current = i.name;
  };
  const chainContent = (
    <div className="personBox" style={{ width: browser ? '50vw' : '90vw' }}>
      <div className="top">
        <p></p>
        <p> {t('person.Wallet')}</p>
        <p
          onClick={throttle(
            function () {
              changeBindind.current = '';
              setOpen(false);
            },
            1500,
            { trailing: false }
          )}
        >
          x
        </p>
      </div>
      <div className="chain">
        {list.map((i: any, ind: number) => {
          return (
            <div
              className="other"
              key={ind}
              onClick={throttle(
                function () {
                  if (
                    i?.address &&
                    currentAddress?.toLocaleLowerCase() !==
                      i?.address?.toLocaleLowerCase()
                  ) {
                    setRefresh(!refresh);
                    cookie.set('currentAddress', i?.address);
                  }
                },
                1500,
                { trailing: false }
              )}
              style={{
                border:
                  currentAddress?.toLocaleLowerCase() ===
                  i?.address?.toLocaleLowerCase()
                    ? '1px solid rgb(134,240,151)'
                    : '1px solid gray',
              }}
            >
              <div>
                <img src={i?.img} alt="" />
                <p
                  style={{
                    color:
                      currentAddress?.toLocaleLowerCase() ===
                      i?.address?.toLocaleLowerCase()
                        ? 'rgb(141,143,141)'
                        : 'gray',
                  }}
                >
                  {i?.name}
                </p>
              </div>
              <p
                className="activePersonChain"
                style={{
                  width: browser ? '70%' : '50%',
                }}
              >
                {i?.address || ''}
              </p>
              <p
                onClick={throttle(
                  function () {
                    if (i.name !== 'Sol') {
                      select(i);
                    }
                  },
                  1500,
                  { trailing: false }
                )}
                style={{
                  whiteSpace: 'nowrap',
                  color:
                    i.name === 'Sol'
                      ? 'gray'
                      : i?.address
                        ? 'white'
                        : 'rgb(141,143,141)',
                  cursor: i.name === 'Sol' ? 'not-allowed' : 'pointer',
                }}
              >
                {i.name === 'Sol'
                  ? t('person.com')
                  : i?.address
                    ? t('person.chang')
                    : t('person.Unbound')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const left = (
    <div
      style={{
        width: browser ? '90%' : '100%',
        marginRight: browser ? '2%' : '0',
      }}
      className="boxLeft"
    >
      <div className="tittle">
        <img
          src={user?.avatarUrl || '/topLogo.png'}
          alt=""
          style={{ width: browser ? '22.5%' : '80px' }}
        />
        <p>{simplify(user?.username)}</p>
      </div>
      <div className="address">
        <p className="topLeft">
          <span>
            {t('person.address')}:
            {simplify(currentAddress ? currentAddress : user?.username)}
          </span>
          <Copy name={currentAddress ? currentAddress : user?.username} />
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="img">
            <img src="/MetaMask.png" alt="" />
            <img src="/ton.png" alt="" />
            <img src="/solano.png" alt="" />
          </div>
          <Popover
            content={chainContent}
            rootClassName={'personChainName'}
            open={open}
            onOpenChange={handleOpenChange}
            title=""
            trigger="click"
          >
            <img
              src="/addChain.png"
              alt=""
              style={{ cursor: 'pointer', display: 'block', marginLeft: '6px' }}
            />
          </Popover>
        </div>
      </div>
    </div>
  );

  const right = (
    <div className={`boxRight ${browser ? '' : 'boxRightSpacing'}`}>
      <div className="point dis">
        <span>D {t('person.points')}:</span>
        <span>{user?.rewardPointCnt || 0}</span>
      </div>
      {passCard.map((i: any, ind: number) => {
        return (
          <div key={ind} className="dis">
            <span>{i?.name}</span>
            <span>{i?.data}</span>
          </div>
        );
      })}
    </div>
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
            MessageAll('success', t('person.ver'));
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
              {left}
              {browser && right}
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
            {!browser && right}
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
