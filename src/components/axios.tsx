import axios from 'axios';
import cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import NotificationChange from './message';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { ChainId, ID_TO_CHAIN_NAME_LOW } from '@/../utils/constants.ts';
const requestA = axios.create({
  baseURL:
    'http://165.22.51.161:8081',
  timeout: 20000,
});
requestA.interceptors.request.use(
  (config) => {
    return config;
  },
  () => {
    return null;
  }
);
requestA.interceptors.response.use(
  (response) => {
    return response;
  },
  (e: any) => {
    if (
      e?.config?.url === '/api/v1/oauth/twitter/claim' ||
      e?.config?.url === '/api/v1/discord/signInChannelLink' ||
      e?.config?.url === '/api/v1/telegram/signInChannelLink' ||
      e?.config?.url === '/api/v1/oauth/discord/claim' ||
      e?.config?.url === '/api/v1/oauth/telegram/chat/bind'
    ) {
      NotificationChange('warning', e?.response?.data?.msg);
    } else {
      NotificationChange('warning', e?.response?.data?.msg);
    }
    return Promise.reject(e);
  }
);
const Request = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  const clear = () => {
    history('/logout');
    cookie.remove('token');
    cookie.remove('jwt');
  };
  const chain = localStorage.getItem('chainId');
  const username = cookie.get('jwt');
  const encapsulation = async (
    method: string,
    data: any,
    url: string,
    token: string,
    name: string,
    chainId?: any
  ) => {
    try {
      const abc = await requestA({
        method,
        params: method === 'get' ? data : method === 'delete' ? data : '',
        data: method === 'get' ? '' : method === 'delete' ? undefined : data,
        url,
        headers: {
          'Content-Type': name ? 'multipart/form-data' : 'application/json', // 根据需要添加其他标头
          Authorization: token,
          'x-chainId': chainId ? chainId : chain || '1',
          'x-app': 'dexpert',
          'x-chainName': chainId
            ? ID_TO_CHAIN_NAME_LOW[chainId as ChainId]
            : ID_TO_CHAIN_NAME_LOW[chain as ChainId] || 'eth',
        },
      });
      if (abc?.status === 200) {
        return abc;
      } else {
        return null;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const getAll = async (name: any) => {
    const { method, url, data, token, chainId } = name as any;
    if (username && username != 'undefined') {
      const params = JSON.parse(username);
      if (
        params &&
        params?.exp &&
        dayjs(dayjs.unix(params?.exp)).isAfter(dayjs())
      ) {
        if (url.includes('upload/image')) {
          const formData = new FormData();
          formData.append('file', data);
          return await encapsulation(
            method,
            formData,
            url,
            token,
            'form',
            chainId
          );
        } else {
          return await encapsulation(method, data, url, token, '', chainId);
        }
      } else {
        NotificationChange('warning', t('Market.login'));
        clear();
      }
    } else {
      return await encapsulation(method, data, url, token, '', chainId);
    }
  };
  return { getAll };
};
export default Request;