import Cookies from "js-cookie";
import "./index.less";
import Request from "../../components/axios";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CaretDownOutlined, LoadingOutlined } from "@ant-design/icons";
import { CountContext } from "../../Layout";
import { MessageAll } from '../../components/message.ts'
import { useParams } from "react-router-dom";
import Loading from "../../components/loading.tsx";
import Nodata from '../../components/Nodata.tsx'
import { throttle, find } from "lodash";

function Dpass() {
    const token = Cookies.get("token");
    const params: any = useParams()
    const { getAll } = Request();
    const [redeemCount, setRedeemCount] = useState(0);
    const [page, setPage] = useState(1);
    const [dPassHistory, setDPassHistory] = useState<any>([]);
    const [isHistory, setIsHistory] = useState(false);
    const { t } = useTranslation();
    const [isNext, setIsNext] = useState(false);
    const [isExchange, setIsExchange] = useState(false);
    const [passList, setPassList] = useState<any>([]);
    const [isPass, setIsPass] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [imgSta, setImgSta] = useState<any>(null);
    const getDpass = async () => {
        const token = Cookies.get("token");
        if (token) {
            const res: any = await getAll({
                method: 'get', url: '/api/v1/d_pass/list', data: { page: 1 }, token
            })
            if (res?.status === 200 && res?.data?.list) {
                setPassList(res?.data?.list)
                const at = find(res?.data?.list, (i: any) => i?.passId === params?.id)
                if (at?.name) {
                    setImgSta(at)
                }
                setIsPass(true)
            }
        }
    }

    const { user, setUserPar, browser }: any = useContext(CountContext);
    const redeemDpass = throttle(async function () {
        const at = find(passList, (i: any) => i?.name === imgSta?.name)
        if (!at?.name?.includes('Golden')) {
            setIsExchange(true)
            if (redeemCount === 0) {
                setIsExchange(false)
            } else {
                let point: any = null
                if (at?.name?.includes('Creation')) {
                    point = redeemCount * 6000
                } else if (at?.name?.includes('Trade')) {
                    point = redeemCount * 480
                } else if (at?.name?.includes('Sniper')) {
                    point = redeemCount * 1200
                }
                if (point && Number(user?.rewardPointCnt) >= point) {
                    const res: any = await getAll({
                        method: "post",
                        url: "/api/v1/d_pass/redeem",
                        data: {
                            count: redeemCount,
                            passId: at?.passId
                        },
                        token,
                    });
                    if (res?.data?.code === '200') {
                        setRedeemCount(0)
                        setUserPar({ ...user, rewardPointCnt: Number(user?.rewardPointCnt) - point })
                        getDpassList(1, at?.passId);
                        MessageAll('success', t("Alert.success"));
                        setIsExchange(false)
                    } else {
                        setIsExchange(false)
                    }
                } else {
                    MessageAll('warning', t("Alert.not"))
                    setIsExchange(false)
                }
            }
        }
    }, 1500, { 'trailing': false })
    const getDpassList = async (page: number, id: string) => {
        const res: any = await getAll({
            method: "get",
            url: "/api/v1/d_pass/recharge/history",
            data: {
                page,
                passId: id
            },
            token,
        });

        if (res?.status === 200) {
            setIsHistory(true)
            if (res?.data?.list?.length !== 10) {
                setIsShow(true)
            }
            if (page === 1) {
                if (res?.data?.list?.length > 0) {
                    setDPassHistory(res?.data.list);
                }
                setIsNext(false)
            } else {
                if (res?.data?.list?.length > 0) {
                    const at = dPassHistory.concat(res?.data?.list)
                    setDPassHistory([...at])
                }
                setIsNext(false)
            }
        }
    };
    useEffect(() => {
        if (params?.id) {
            getDpassList(1, params?.id);
            getDpass()
        }
    }, []);
    const clickPlusOrReduce = throttle(function (e: any) {
        const { id } = e.target;
        if (id === "plus") {
            setRedeemCount(redeemCount + 1);
        }
        if (id === "reduce") {
            if (redeemCount === 0) return;
            setRedeemCount(redeemCount - 1);
        }
    }, 1500, { 'trailing': false })
    const handleOnInput = (e: any) => {
        const { value } = e.target;

        const count = Number(value);
        if (Number.isNaN(count)) {
            return setRedeemCount(0);
        }
        if (typeof count === "number") {
            return setRedeemCount(count);
        }
        if (typeof value) {
            if (value === "") {
                setRedeemCount(0);
            }
        }
    };
    const nextPass = throttle(function () {
        const at = find(passList, (i: any) => i?.name === imgSta?.name)
        if (at?.passId) {
            setPage(page + 1)
            getDpassList(page + 1, at?.passId)
            setIsNext(true)
        }
    }, 1500, { 'trailing': false })
    const setImg = throttle(function (ind: number) {
        setPage(1)
        setIsHistory(false)
        setDPassHistory([])
        const index = passList.findIndex((res: any) => res?.name === imgSta?.name)
        if (index > -1) {
            const at = index + ind
            if (at > 3) {
                setImgSta(passList[0])
                getDpassList(1, passList?.[0]?.passId)
            } else if (at < 0) {
                setImgSta(passList[passList.length - 1])
                getDpassList(1, passList[passList.length - 1]?.passId)
            } else {
                setImgSta(passList[at])
                getDpassList(1, passList[at]?.passId)
            }
        } else {
            getDpassList(1, passList[0]?.passId)
            setImgSta(passList[0])
        }
    }, 1500, { 'trailing': false })

    const changeImg = (name: string) => {
        if (imgSta?.name) {
            const at = imgSta?.name
            if (name === 'img') {
                return at.includes('Creation') ? '/launchPass.png' : at.includes('Trade') ? '/trade.png' : at.includes('Sniper') ? '/sniper.png' : '/goldenPass.svg'
            } else if (name === 'text') {
                return at.includes('Creation') ? t("Dpass.laun") : at.includes('Trade') ? t("Dpass.Swap") : at.includes('Sniper') ? t("Dpass.Snipert") : t("Dpass.jin")
            } else if (name === 'point') {
                return at.includes('Creation') ? '6000' : at.includes('Trade') ? '480' : at.includes('Sniper') ? '1200' : 'mission accomplished'
            } else {
                return at.includes('Creation') ? t("Dpass.Creation") : at.includes('Trade') ? t("Dpass.Fast") : at.includes('Sniper') ? t("Dpass.Pass") : t("Active.Golden")
            }
        }
    }
    const show = (back: string) => {
        if (imgSta?.name) {
            const at = imgSta?.name
            if (at?.includes('Golden')) {
                if (back === 'back') {
                    return '#D6DFD7'
                } else {
                    return 'not-allowed'
                }
            } else if ((at.includes('Creation') && Number(user?.rewardPointCnt) > 6000) || (at.includes('Trade') && Number(user?.rewardPointCnt) > 480) || (at.includes('Sniper') && Number(user?.rewardPointCnt) > 1200)) {
                if (back === 'back') {
                    return '#86f097'
                } else {
                    return 'pointer'
                }
            } else {
                if (back === 'back') {
                    return '#D6DFD7'
                } else {
                    return 'not-allowed'
                }
            }
        }
    }

    return (
        <>
            {
                !isPass ? <Loading status={'20'} /> : <div className="dpass-background">
                    <div className="dpass-content">
                        <div className="dpass-content-left">
                            <div style={{ position: 'relative', zIndex: '10' }}>
                                <img src="/Rectangle1.svg" alt="" onClick={() => setImg(-1)} style={{
                                    position: 'absolute',
                                    left: '-60px',
                                    top: '50%',
                                    display: 'block',
                                    transform: 'translate(0,-50%)', cursor: 'pointer'
                                }} />
                                <img className="dapss-card" src={changeImg('img')} alt="" />
                                <img src="/Rectangle111.svg" alt="" onClick={() => setImg(1)} style={{
                                    position: 'absolute',
                                    right: '-60px',
                                    top: '50%',
                                    display: 'block',
                                    transform: 'translate(0,-50%)', cursor: 'pointer'
                                }} />
                            </div>
                            <img className="dpass-light" src={'/light.png'} alt="" />
                            <img className="dpass-cap" src={'/bottomCap.png'} alt="" />
                        </div>
                        <div className="dpass-content-right">
                            <p className="dpass-content-right-title"> <span style={{ color: 'rgb(134,240,151)' }}>{changeImg('')}</span> <span>Pass</span></p>
                            <p className="dpass-content-right-content">{changeImg('text')}</p>
                            <div className="dpass-content-right-action">
                                <div className="dpass-content-right-action-input">
                                    <span id="reduce" style={{ userSelect: 'none' }} onClick={clickPlusOrReduce}>
                                        -
                                    </span>
                                    <input
                                        value={redeemCount}
                                        className="dpass-content-right-action-input_number"
                                        onChange={handleOnInput}
                                    />
                                    <span id="plus" style={{ userSelect: 'none' }} onClick={clickPlusOrReduce}>
                                        +
                                    </span>
                                </div>
                                <div
                                    className="dpass-content-right-action-button"
                                    onClick={redeemDpass}
                                    style={{
                                        background: show('back'),
                                        cursor: show('current')
                                    }}>
                                    {imgSta?.name?.includes('Golden') ? t("Dpass.Inconvertible") : t("Dpass.Exchange")}
                                    {isExchange ? <LoadingOutlined /> : ''}
                                </div>
                            </div>
                            <div className="dpass-content-right-info">
                                <div className="dpass-content-right-info-points" style={{ borderRight: "1px solid #999", cursor: 'pointer' }} >
                                    <div className="dpass-content-right-info-title">  {t("Dpass.required")}</div>
                                    <div className="dpass-content-right-info-amount"> {changeImg('point')}  </div>
                                </div>
                                <div
                                    className="dpass-content-right-info-points">
                                    <div className="dpass-content-right-info-title">
                                        {t("Dpass.pointsAmount")}
                                    </div>
                                    <div className="dpass-content-right-info-amount">{user?.rewardPointCnt || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dpass-redeem">
                        <div className="dpass-redeem-table">
                            <div className="dpass-redeem-table-th">
                                <span>   {t("Dpass.Time")}</span>
                                {browser && <span>  {t("Dpass.Pass Id")}</span>}
                                <span> {t("Dpass.Status")}</span>
                                <span>{t("Dpass.Key")}</span>
                            </div>
                            {isHistory ? dPassHistory.length > 0 ? dPassHistory.map(({ createdAt, cnt, passId, cost }: any) => (
                                <div className="dpass-redeem-table-td" key={passId}>
                                    <span>{createdAt}</span>
                                    {!browser ? <></> : <span>{passId}</span>}
                                    <span>{cost}</span>
                                    <span>{cnt}</span>
                                </div>
                            )) : <Nodata /> : <Loading status={'20'} />
                            }
                            {
                                !isShow && <p style={{
                                    marginTop: '20px',
                                    color: 'gray',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}><span onClick={nextPass}
                                    style={{ cursor: 'pointer' }}>{t('Common.Next')}</span>{isNext ?
                                        <LoadingOutlined /> : <CaretDownOutlined />}</p>
                            }
                        </div>
                    </div>
                    <div className='background' style={{ top: '18vh', background: '#86F097', left: "0" }}></div>
                    <div className='background' style={{ top: '17vh', background: '#0FF', right: "0" }}></div>
                </div>
            }
        </>
    );
}

export default Dpass;