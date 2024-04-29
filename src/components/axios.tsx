import axios from "axios";
import cookie from "js-cookie";
import dayjs from 'dayjs'
import {useNavigate} from "react-router-dom";
import {MessageAll} from "./message.ts";
import {useTranslation} from "react-i18next";

const requestA = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://165.22.51.161:8081' : 'https://dexpert.io'
})
requestA.interceptors.request.use(
    (config) => {
        return config;
    },
    () => {
        return null
    }
);
requestA.interceptors.response.use(
    (response) => {
        return response;
    },
    (e: any) => {
        MessageAll('warning',e?.message)
    }
);
const Request = () => {
    const {t} = useTranslation();
    const history = useNavigate()
    const clear = () => {
        history('/?change=1')
        cookie.remove('username')
        cookie.remove('token')
        cookie.remove('jwt')
    }
    const username = cookie.get('jwt')
    const encapsulation = async (method: string, data: any, url: string, token: string, name: string) => {
        try {
            const abc = await requestA({
                method,
                params: method === 'get' ? data : method === 'delete' ? undefined : '',
                data: method === 'get' ? '' : method === 'delete' ? undefined : data,
                url,
                headers: {
                    'Content-Type': name ? 'multipart/form-data' : 'application/json', // 根据需要添加其他标头
                    'Authorization': token,
                }
            })
            if (abc?.status === 200) {
                return abc
            }
        } catch (e) {
        }
    }

    const getAll = async (name: any) => {
        const {method, url, data, token} = name as any
        if (username && username != 'undefined') {
            const params = JSON.parse(username)
            if (params && params?.exp && dayjs(dayjs.unix(params?.exp)).isAfter(dayjs())) {
                if (url.includes('upload/image')) {
                    const formData = new FormData();
                    formData.append('file', data);
                    return await encapsulation(method, formData, url, token, 'form')
                } else {
                    return await encapsulation(method, data, url, token, '')
                }
            } else {
                MessageAll('warning',t('Market.login'))
                clear()
            }
        } else {
            return await encapsulation(method, data, url, token, '')
        }
    }
    return {getAll}
}
export default Request
export const getTkAndUserName = () => {
    const token = cookie.get('token');
    const username = JSON.parse(cookie.get('username') || '{}');
    return [token, username];
}
