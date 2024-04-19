import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Loading from '../../../components/loading.tsx'
import Request from "../../../components/axios.tsx";
import cookie from "js-cookie";

function Oauth() {
    const {getAll,} = Request()
    const [search] = useSearchParams();
    const history = useNavigate()
    const claim = async (name: string, da: string) => {
        const token = cookie.get('token')
        if (token) {
            const res = await getAll({
                method: 'post', url: '/api/v1/oauth/twitter/claim', data: {OAuthToken: name, OAuthVerifier: da}, token
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
        // 授权成功
        if (token && verifier) {
            claim(token, verifier)
        }
        // 取消
        if (denied) {
            history('/activity')
        }
    }, []);
    return (
        <Loading/>
    );
}

export default Oauth;