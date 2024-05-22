import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams, } from "react-router-dom";
import Loading from '../../../components/loading.tsx'
import Request from "../../../components/axios.tsx";
import cookie from "js-cookie";

function Oauth() {
    const { getAll, } = Request()
    const [search] = useSearchParams();
    const history = useNavigate()
    const params: any = useParams()
    const claim = async (name: string, da: string, nu: string) => {
        const token = cookie.get('token')
        if (token && params?.id && nu) {
            const res = await getAll({
                method: 'post',
                url: params?.id === 'twitter' ? '/api/v1/oauth/twitter/claim' : params?.id === 'telegram' ? '/api/v1/oauth/telegram/chat/bind' : params?.id === 'discord' ? '/api/v1/oauth/discord/claim' : '',
                data: params?.id === 'twitter' ? { OAuthToken: name, OAuthVerifier: da, taskId: nu } : params?.id === 'telegram' ? {
                    tgAuthResult: name,
                    taskId: nu
                } : { code: name, taskId: nu },
                token
            })
            if (res?.data?.message === 'ok') {
                history('/specialActive/1')
            } else {
                history('/specialActive/1')
            }
        }
    }
    useEffect(() => {
        const id: any = cookie.get('taskId')
        const token = search.get('oauth_token')
        const verifier = search.get('oauth_verifier')
        const denied = search.get('denied')
        const code = search.get('code')
        const error_description = search.get('error_description')
        const error = search.get('error')
        if (denied) {
            history('/specialActive/1')
        } else if (error_description && error) {
            history('/specialActive/1')
        } else if (token && verifier && id) {
            claim(token, verifier, id)
        } else if (code && id) {
            claim(code, '', id)
        } else {
            const at = window.location.href
            if (at.length > 0 && at.includes('#tgAuthResult=')) {
                const abc = at.split('#tgAuthResult=')
                claim(abc[1], '', id)
            }
        }
    }, []);
    return (
        <Loading status={'20'} />
    );
}

export default Oauth;