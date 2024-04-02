import axios from "axios";
import cookie from "js-cookie";
import Cookies from "js-cookie";
import dayjs from 'dayjs'
import {message, notification,} from "antd";

const requestA = axios.create({
    // baseURL: process.env.NODE_ENV === 'development' ? 'http://165.22.51.161:8081' : 'https://dexpert.io/',
    baseURL: 'http://165.22.51.161:8081'
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
        console.log(e)
        notification.warning({
            message: `Please refresh!`, placement: 'topLeft',
            duration: 2
        });
        return null
    }
);
const getTkAndUserName = () => {
    const token = Cookies.get('token');
    const username = JSON.parse(Cookies.get('username') || '{}');
    return [token, username];
}
export const Request = async (method: string, url: string, data: any, token?: any) => {
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
        const abc = await requestA({
            method,
            params: method === 'get' ? data : method === 'delete' ? undefined : '',
            data: method === 'get' ? '' : method === 'delete' ? undefined : data,
            url,
            headers: {
                'Authorization': token,
            }
        })
        console.log(abc)
        return abc
    }
}

export const handlePublish = async (data: any) => {
    const token = Cookies.get('token');
    const username = JSON.parse(Cookies.get('username') || '{}');
    const result: any = await Request('post', "/api/v1/post/publish", {
        uid: username?.uid,
        address: username?.address,
        post: data
    }, token)
    if (result?.status === 200) {
        return result.status;
    } else {
        return Promise.reject('faild')
    }
}

export const followUser = async (userId: string) => {
    try {
        const [token] = getTkAndUserName();
        const result: any = await Request('post', '/api/v1/follow', {userId}, token);
        if (result.status === 200) {
            return result.data
        } else {
            return message.error('faild to follow');
        }
    } catch (e) {
        return Promise.reject(e)
    }
}
export const unfollowUser = async (userId: string) => {
    try {
        const [token] = getTkAndUserName();
        const result: any = await Request('post', '/api/v1/unfollow', {uid: userId}, token);
        if (result.status === 200) {
            return result.data
        } else {
            return message.error('faild to unfollow');
        }
    } catch (e) {
        return Promise.reject(e)
    }
}

