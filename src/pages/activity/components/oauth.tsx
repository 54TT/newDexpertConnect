import {useEffect} from "react";
import {useNavigate, useSearchParams,} from "react-router-dom";
import Loading from '../../../components/loading.tsx'
import Request from "../../../components/axios.tsx";
import cookie from "js-cookie";

function Oauth() {
    const {getAll,} = Request()
    const [search] = useSearchParams();
    const history = useNavigate()
    const claim = async (name: string, da: string, nu: number) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post',
                url: nu === 1 ? '/api/v1/oauth/twitter/claim' : nu === 2 ? '/api/v1/oauth/telegram/chat/bind' : '/api/v1/oauth/discord/claim',
                data: nu === 1 ? {OAuthToken: name, OAuthVerifier: da, taskId: '1'} : nu === 3 ? {
                    tgAuthResult: name,
                    chatId: '-1002120873901',
                    taskId: '3'
                } : {code: name, groupId: '1218109860999204904', taskId: '2'},
                token
            })
            if (res?.data?.message === 'ok') {
                history('/activity')
            } else {
                history('/activity')
            }
        }
    }

    useEffect(() => {
        const token = search.get('oauth_token')
        const verifier = search.get('oauth_verifier')   //数据
        const denied = search.get('denied')   //取消
        const code = search.get('code')   //取消
        const state = search.get('state')   //取消
        const error_description = search.get('error_description')   //取消
        const error = search.get('error')   //取消
        if (denied) {
            history('/activity')
        }else if(error_description&&error){
            history('/activity')
        }else if (token && verifier) {
            claim(token, verifier, 1)
        } else if (state && code) {
            claim(code, '', 2)
        } else {
            const at = window.location.href
            if (at.length > 0 && at.includes('#tgAuthResult=')) {
                const abc = at.split('#tgAuthResult=')
                claim(abc[1], '', 3)
            }
        }
    }, []);
    return (
        <Loading status={'20'}/>
    );
}

export default Oauth;