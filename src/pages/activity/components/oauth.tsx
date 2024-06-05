import { useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams, } from "react-router-dom";
import Loading from '../../../components/allLoad/loading.tsx'
import Request from "../../../components/axios.tsx";
import cookie from "js-cookie";
import { CountContext } from '../../../Layout.tsx'
function Oauth() {
    const {
        browser,
    }: any = useContext(CountContext);
    const { getAll, } = Request()
    const [search] = useSearchParams();
    const history = useNavigate()
    const params: any = useParams()
    const claim = async (name: string, da: string) => {
        const token = cookie.get('token')
        if (token && params?.id) {
            const res = await getAll({
                method: 'post',
                url: params?.id === 'twitter' ? '/api/v1/oauth/twitter/claim' : params?.id === 'telegram' ? '/api/v1/oauth/telegram/chat/bind' : params?.id === 'discord' ? '/api/v1/oauth/discord/claim' : '',
                data: params?.id === 'twitter' ? { OAuthToken: name, OAuthVerifier: da, taskId: '1' } : params?.id === 'telegram' ? {
                    tgAuthResult: name,
                    taskId: '2'
                } : { code: name, taskId: '3' },
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
        } else if (token && verifier) {
            claim(token, verifier,)
        } else if (code) {
            claim(code, '')
        } else {
            const at = window.location.href
            if (at.length > 0 && at.includes('#tgAuthResult=') && at.includes('telegram')) {
                const abc = at.split('#tgAuthResult=')
                claim(abc[1], '')
            }
        }
    }, []);
    return (
        <Loading status={'20'} browser={browser} />
    );
}

export default Oauth;