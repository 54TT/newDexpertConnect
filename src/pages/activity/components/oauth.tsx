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
                data: nu === 1 ? {OAuthToken: name, OAuthVerifier: da, taskId: '1'} : nu === 2 ? {
                    tgAuthResult: name,
                    taskId: '2'
                } : {code: name,  taskId: '3'},
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
        const verifier = search.get('oauth_verifier')
        const denied = search.get('denied')
        const code = search.get('code')
        const error_description = search.get('error_description')
        const error = search.get('error')
        if (denied) {
            history('/activity')
        } else if (error_description && error) {
            history('/activity')
        } else if (token && verifier) {
            claim(token, verifier, 1)
        } else if (code) {
            claim(code, '', 3)
        } else {
            const at = window.location.href
            if (at.length > 0 && at.includes('#tgAuthResult=')) {
                const abc = at.split('#tgAuthResult=')
                claim(abc[1], '', 2)
            }
        }
    }, []);
    return (
        <Loading status={'20'}/>
    );
}

export default Oauth;