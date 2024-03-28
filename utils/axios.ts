import axios from "axios";
import cookie from "js-cookie";
import dayjs from 'dayjs'
import {notification,} from "antd";

const requestA = axios.create({
    baseURL: 'http://165.22.51.161:8081',
})
axios.interceptors.request.use(
    (config) => {
        return config;
    },
    () => {
        notification.warning({
            message: `Please refresh!`, placement: 'topLeft',
            duration: 2
        });
        return null
    }
);
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    () => {
        notification.warning({
            message: `Please refresh!`, placement: 'topLeft',
            duration: 2
        });
        return null
    }
);
export const request = async (method:string, url:string, data:any, token?:any) => {
    const username = cookie.get('jwt')
    if (username && username != 'undefined') {
        const params = JSON.parse(username)
        if (params && params?.exp && dayjs(dayjs.unix(params?.exp)).isAfter(dayjs())) {
            if (url.includes('upload/image')) {
                const formData = new FormData();
                formData.append('file', data);
                return await requestA({
                    method,
                    data: formData,
                    url,
                    headers: {
                        'Content-Type': 'multipart/form-data', // 根据需要添加其他标头
                        'Authorization': token,
                    }
                })
            } else {
                return await requestA({
                    method,
                    params: method === 'get' ? data : method === 'delete' ? undefined : '',
                    data: method === 'get' ? '' : method === 'delete' ? undefined : data,
                    url,
                    headers: {'Authorization': token,}
                })
            }
        } else {
            notification.warning({
                message: `Please login again!`, placement: 'topLeft',
                duration: 2
            });
            return 'please'
        }
    } else {
        return await requestA({
            method,
            params: method === 'get' ? data : method === 'delete' ? undefined : '',
            data: method === 'get' ? '' : method === 'delete' ? undefined : data,
            url,
            headers: {
                'Authorization': token,
            }
        })
    }
}
