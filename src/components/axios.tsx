import axios from "axios";
import cookie from "js-cookie";
import { message, } from "antd";
import dayjs from 'dayjs'
import { useLocation, useNavigate } from "react-router-dom";
const requestA = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://165.22.51.161:8081' : 'https://dexpert.io/'
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
        message.warning(e?.message);
        return null
    }
);
const Request = () => {
    const router = useLocation()
    const history = useNavigate()
    const clear = () => {
        if (router.pathname !== '/') {
            history('/')
        }
        cookie.remove('username')
        cookie.remove('token')
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
        const { method, url, data, token } = name as any
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
                message.warning('Please login again!');
                clear()
            }
        } else {
            return await encapsulation(method, data, url, token, '')
        }
    }
    return { getAll }
}
export default Request
// export const handlePublish = async (data: any) => {
//     const token = cookie.get('token');
//     const username = JSON.parse(cookie.get('username') || '{}');
//     const result: any = await Request('post', "/api/v1/post/publish", {
//         uid: username?.uid,
//         address: username?.address,
//         post: data
//     }, token)
//     if (result?.status === 200) {
//         return result.status;
//     } else {
//         return Promise.reject('faild')
//     }
// }
// export const followUser = async (userId: string) => {
//     try {
//         const [token] = getTkAndUserName();
//         const result: any = await Request('post', '/api/v1/follow', {userId}, token);
//         if (result.status === 200) {
//             return result.data
//         } else {
//             return message.error('faild to follow');
//         }
//     } catch (e) {
//         return Promise.reject(e)
//     }
// }
// export const unfollowUser = async (userId: string) => {
//     try {
//         const [token] = getTkAndUserName();
//         const result: any = await Request('post', '/api/v1/unfollow', {uid: userId}, token);
//         if (result.status === 200) {
//             return result.data
//         } else {
//             return message.error('faild to unfollow');
//         }
//     } catch (e) {
//         return Promise.reject(e)
//     }
// }
export const getTkAndUserName = () => {
    const token = cookie.get('token');
    const username = JSON.parse(cookie.get('username') || '{}');
    return [token, username];
}
