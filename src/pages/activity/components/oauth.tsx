import React, { useEffect, useContext } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
const Loading = React.lazy(() => import('@/components/allLoad/loading.tsx'));
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import { CountContext } from '@/Layout.tsx';
function Oauth() {
  const { browser }: any = useContext(CountContext);
  const token = cookie.get('token');
  const { getAll } = Request();
  const [search] = useSearchParams();
  const history = useNavigate();
  const params: any = useParams();
  const claim = async (name: string, da: string, id: string) => {
    const token = cookie.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/campaign',
      data: { id },
      token,
    });
    if (res?.status === 200 && res?.data?.campaignHome?.tasks?.length > 0) {
      const twitter = res?.data?.campaignHome?.tasks?.filter(
        (i) => i?.operationSymbol === 'follow-dexpert-twitter'
      );
      const discord = res?.data?.campaignHome?.tasks?.filter(
        (i) => i?.operationSymbol === 'join-dexpert-discord'
      );
      const telegram = res?.data?.campaignHome?.tasks?.filter(
        (i) => i?.operationSymbol === 'join-dexpert-tg'
      );
      if (token && params?.id) {
        const res = await getAll({
          method: 'post',
          url:
            params?.id === 'twitter'
              ? '/api/v1/oauth/twitter/claim'
              : params?.id === 'telegram'
                ? '/api/v1/oauth/telegram/chat/bind'
                : params?.id === 'discord'
                  ? '/api/v1/oauth/discord/claim'
                  : '',
          data:
            params?.id === 'twitter'
              ? {
                  OAuthToken: name,
                  OAuthVerifier: da,
                  taskId: twitter?.[0]?.taskId,
                }
              : params?.id === 'telegram'
                ? {
                    tgAuthResult: name,
                    taskId: telegram?.[0]?.taskId,
                  }
                : { code: name, taskId: discord?.[0]?.taskId },
          token,
        });
        if (res?.data?.message === 'ok') {
          history('/specialActive/' + id);
        } else {
          history('/specialActive/' + id);
        }
      }
    }
  };
  const getActive = async () => {
    const oauth_token = search.get('oauth_token');
    const verifier = search.get('oauth_verifier');
    const denied = search.get('denied');
    const code = search.get('code');
    const error_description = search.get('error_description');
    const error = search.get('error');

    const res = await getAll({
      method: 'post',
      url: '/api/v1/campaign/home',
      data: { token: token || '' },
      token: token || '',
    });
    if (res?.status === 200) {
      const data = res?.data?.campaignHome;
      if (data?.length > 0) {
        const dexpert = data.filter((i) => i?.campaign?.mode === '2');
        if (dexpert?.length > 0) {
          if (denied) {
            history('/specialActive/' + dexpert[0]?.campaign?.campaignId);
          } else if (error_description && error) {
            history('/specialActive/' + dexpert[0]?.campaign?.campaignId);
          } else if (oauth_token && verifier) {
            claim(oauth_token, verifier, dexpert[0]?.campaign?.campaignId);
          } else if (code) {
            claim(code, '', dexpert[0]?.campaign?.campaignId);
          } else {
            const at = window.location.href;
            if (
              at.length > 0 &&
              at.includes('#tgAuthResult=') &&
              at.includes('telegram')
            ) {
              const abc = at.split('#tgAuthResult=');
              claim(abc[1], '', dexpert[0]?.campaign?.campaignId);
            }
          }
        }
      }
    } else {
    }
  };

  useEffect(() => {
    getActive();
  }, []);
  return <Loading status={'20'} browser={browser} />;
}

export default Oauth;
