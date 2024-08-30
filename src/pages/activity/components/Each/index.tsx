import { useLocation, useParams } from 'react-router-dom';
import { CountContext } from '@/Layout.tsx';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './components/modal.tsx';
import cookie from 'js-cookie';
import AcyivityList from './components/acyivityList.tsx';
const Nodata = React.lazy(() => import('@/components/Nodata.tsx'));
import NotificationChange from '@/components/message';
import Request from '@/components/axios.tsx';
import SpecialOrPass from '../specialOrPass.tsx';
import Tables from './components/table.tsx';
function EachActivity({ option, rankList, isRankList, data, getParams }: any) {
  const par = data.length > 0 ? data : data?.campaign ? [data] : [];
  const { browser, languageChange, isLogin, setUserPar, user }: any =
    useContext(CountContext);
  const { getAll } = Request();
  const router = useLocation();
  const params: any = useParams();
  const [loading, setLoading] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const { t } = useTranslation();
  const [link, setLink] = useState('');
  useEffect(() => {
    setLoading(false);
    setIsVerify(false);
  }, [data]);
  const [selectActive, setSelectActive] = useState('');
  const [select, setSelect] = useState('');
  const [isModalOpen, setIsModalOpe] = useState(false);
  const signIn = async (token: string, url: string, taskId?: string) => {
    try {
      const res = await getAll({
        method: taskId ? 'post' : 'get',
        url: url,
        data: { taskId },
        token,
      });
      if (res?.status === 200) {
        if (taskId) {
          getParams();
        } else {
          if (res?.data?.url) {
            setLoading(false);
            window.open(res?.data?.url, '_self');
          } else {
            setLoading(false);
          }
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };
  const follow = async (id: any) => {
    const token = cookie.get('token');
    try {
      if (token) {
        const par: any = {
          '1': '/api/v1/oauth/twitter/follow',
          '2': '/api/v1/oauth/telegram/chat/follow',
          '3': '/api/v1/oauth/discord/follow',
          '5': '/api/v1/oauth/instagram/follow',
        };
        const res = await getAll({
          method: id === '2' ? 'post' : 'get',
          url: par[id],
          data: { taskId: id },
          token,
        });
        if (res?.data?.url) {
          window.open(res?.data?.url, '_self');
          getParams();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };
  const verify = async (id: string) => {
    const token = cookie.get('token');
    try {
      if (token) {
        const par: any = {
          '1': '/api/v1/oauth/twitter/verify',
          '2': '/api/v1/oauth/telegram/chat/verify',
          '3': '/api/v1/oauth/discord/verify',
        };
        const res = await getAll({
          method: 'post',
          url: par[id] ? par[id] : '/api/v1/oauth/instagram/verify',
          data: { taskId: id },
          token,
        });
        if (res?.status === 200 && res.data?.exist) {
          getParams();
        } else {
          if (res?.data?.url) {
            setLink(res?.data?.url);
            setIsModalOpe(true);
          }
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };
  const getT = async (i: any) => {
    const token = cookie.get('token');
    try {
      const par: any = {
        'follow-dexpert-twitter': '/api/v1/oauth/twitter/link',
        'join-dexpert-tg': '/api/v1/oauth/telegram/chat/link',
        'join-dexpert-discord': '/api/v1/oauth/discord/link',
      };
      if (token) {
        const res = await getAll({
          method: i?.operationSymbol === 'join-dexpert-tg' ? 'post' : 'get',
          url: par[i?.operationSymbol]
            ? par[i?.operationSymboloperation]
            : '/api/v1/oauth/instagram/link',
          data: { taskId: i?.taskId },
          token,
        });
        if (res?.data?.url) {
          window.open(res?.data?.url, '_self');
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };
  const handleCancel = () => {
    setIsModalOpe(false);
  };
  const verifyJointActivities = async (
    token: string,
    taskId: string,
    i: any
  ) => {
    try {
      const res = await getAll({
        method: 'post',
        url: '/api/v1/campaign/jointly-common/verify',
        data: {
          taskId: taskId,
          chainName: i?.chainName,
          projectName: i?.projectName,
        },
        token,
      });
      if (res?.status === 200) {
        getParams();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };
  const claimJointActivities = async (token: string, taskId: string) => {
    try {
      const res = await getAll({
        method: 'post',
        url: '/api/v1/campaign/jointly-common/claim',
        data: { taskId },
        token,
      });
      if (res?.status === 200) {
        setUserPar({
          ...user,
          rewardPointCnt:
            Number(user?.rewardPointCnt) + Number(res?.data?.score),
        });
        getParams();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };

  const getLink = async (taskId: string, token: string) => {
    try {
      // 获取链接
      const res: any = await getAll({
        method: 'get',
        url: '/api/v1/airdrop/task/twitter/daily/intent',
        data: { taskId },
        token,
      });
      if (res?.status === 200 && res?.data?.intent) {
        setLoading(false);
        setLink(res?.data?.intent);
        setIsModalOpe(true);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };

  const publicVerifyClaim = async (
    it: any,
    token: string,
    i: any,
    name?: any
  ) => {
    const url =
      name === 'daily'
        ? '/api/v1/campaign/jointly-common/daily-task/claim'
        : it?.operationSymbol?.includes('golden')
          ? '/api/v1/campaign/jointly-common/golden-pass/claim'
          : Number(it?.isCompleted)
            ? '/api/v1/campaign/jointly-common/claim'
            : '/api/v1/campaign/jointly-common/verify';
    const data =
      !Number(it?.isCompleted) || name === 'daily'
        ? {
            taskId: it?.taskId,
            chainName: i?.chainName,
            projectName: i?.projectName,
          }
        : { taskId: it?.taskId };
    try {
      const res: any = await getAll({
        method: 'post',
        url,
        data,
        token,
      });
      if (res?.status === 200) {
        setLoading(false);
        getParams();
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      return null;
    }
  };
  const param = async (it: any, i: any) => {
    const token = cookie.get('token');
    if (token) {
      // dexpert  活动
      if (i?.mode === '2') {
        if (option === 'daily') {
          //   id为8的  是twitter
          if (it?.operationSymbol !== 'dexpert-twitter-quote') {
            signIn(
              token,
              it?.operationSymbol === 'dexpert-tg-checkin'
                ? '/api/v1/telegram/signInChannelLink'
                : '/api/v1/discord/signInChannelLink'
              // dexpert-discord-checkin
            );
          } else {
            getLink(it?.taskId, token);
          }
        } else if (option === 'first') {
          if (Number(it?.isCompleted)) {
            if (Number(it?.isCompleted) === 1) {
              follow(it?.taskId);
            }
            if (Number(it?.isCompleted) === 2) {
              verify(it?.taskId);
            }
          } else {
            getT(it);
          }
        }
      } else {
        // 特别活动下的
        if (option === 'daily') {
          if (i?.operationSymbol === 'tg') {
            verifyJointActivities
          }
          if (i?.operationSymbol === 'discord') {
          }
          if (i?.operationSymbol === 'twitter') {
          }

          if (i?.mode === '1') {
            publicVerifyClaim(it, token, i, 'daily');
          } else if (i?.mode === '1') {
            signIn(
              token,
              it?.taskId === '17'
                ? '/api/v1/campaign/petGPT/tg/claim'
                : it?.taskId === '18'
                  ? '/api/v1/campaign/petGPT/discord/claim'
                  : '/api/v1/campaign/petGPT/twitter/claim',
              it?.taskId
            );
          } else {
            getLink(it?.taskId, token);
          }
        } else {
          if (it?.operationSymbol === 'verify and claim') {
            if (Number(it?.isCompleted)) {
              claimJointActivities(token, it?.taskId);
            } else {
              verifyJointActivities(token, it?.taskId, i);
            }
          }
        }
      }
    }
  };
  const change = (name: string) => {
    if (name.length > 0) {
      if (languageChange === 'zh_CN') {
        return name.slice(0, 2);
      } else {
        const data = name.split(' ');
        return data[0];
      }
    } else {
      return '';
    }
  };
  const operate = (isCompleted: string, title: string) => {
    if (option === 'daily') {
      if (Number(params?.id) >= 4) {
        return t('Market.Claim');
      } else {
        return t('Market.start');
      }
    } else if (option === 'first') {
      if (params?.id === '1') {
        if (Number(isCompleted)) {
          if (Number(isCompleted) === 1) {
            return change(title);
          } else if (Number(isCompleted) === 2) {
            return t('Market.Claim');
          } else {
            return t('Market.Completed');
          }
        } else {
          return t('Market.Authorize');
        }
      } else {
        if (Number(isCompleted)) {
          return t('Market.Claim');
        } else {
          return t('Dpass.verify');
        }
      }
    }
  };
  const verification = async (id: string) => {
    const token = cookie.get('token');
    try {
      if (id && token) {
        let url: any = null;
        if (router.pathname === '/specialActive/1') {
          url = '/api/v1/airdrop/task/twitter/daily/verify';
        } else {
          if (id === '10') {
            url = '/api/v1/airdrop/task/twitter/daily/yuliverseVerify';
          }
        }
        if (url) {
          const res: any = await getAll({
            method: 'post',
            url,
            data: { taskId: id },
            token,
          });
          if (res?.data?.message === 'success' && res?.status === 200) {
            getParams();
          } else if (res?.data?.code === '400') {
            setIsVerify(false);
            NotificationChange('warning', res?.data?.message);
          }
        }
      }
    } catch (e) {
      setIsVerify(false);
      return null;
    }
  };
  return (
    <>
      {isLogin && (
        <div
          className={'activeAll'}
          style={{ padding: browser ? '0 17%' : '0 5%' }}
        >
          {option === 'ranking' ? (
            <Tables isRankList={isRankList} rankList={rankList} />
          ) : option === 'daily' || option === 'first' ? (
            <div className={'first'}>
              {par.length > 0 ? (
                par.map((i: any) => {
                  let arr: any = [];
                  if (option === 'first') {
                    arr = i?.tasks;
                  } else {
                    arr = i?.dailTasks;
                  }
                  if (arr.length > 0) {
                    return arr.map((it: any, index: number) => {
                      const data = {
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
                      };
                      return <AcyivityList key={it?.taskId} {...data} />;
                    });
                  } else {
                    return <Nodata key={i} name={t('Market.no')} />;
                  }
                })
              ) : (
                <Nodata />
              )}
            </div>
          ) : (
            <SpecialOrPass option={option} data={par} />
          )}
        </div>
      )}
      <Modal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        select={select}
        option={option}
        link={link}
        setIsModalOpe={setIsModalOpe}
      />
    </>
  );
}

export default EachActivity;
