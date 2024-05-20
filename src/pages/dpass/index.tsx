import Cookies from "js-cookie";
import "./index.less";
import Request from "../../components/axios";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { CaretDownOutlined, LoadingOutlined } from "@ant-design/icons";
import { CountContext } from "../../Layout";
import { MessageAll } from '../../components/message.ts'
import { useParams } from "react-router-dom";
import Loading from "../../components/loading.tsx";
import Nodata from '../../components/Nodata.tsx'
import { throttle, } from "lodash";
function Dpass() {
    const token = Cookies.get("token");
    const params: any = useParams()
    const { getAll } = Request();
    const [redeemCount, setRedeemCount] = useState(0);
    const [page, setPage] = useState(1);
    const [dPassHistory, setDPassHistory] = useState<any>([]);
    const [isHistory, setIsHistory] = useState(false);
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const par = ['1', '2', '3', '4']
    const [isNext, setIsNext] = useState(false);
    // const [passList, setPassList] = useState([]);
    // const [isPass, setIsPass] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [imgSta, setImgSta] = useState(params?.id);
    // const getDpass = async () => {
    //     const token = Cookies.get("token");
    //     if (token) {
    //         const res: any = await getAll({
    //             method: 'get', url: '/api/v1/d_pass/list', data: { page: 1 }, token
    //         })
    //         if (res?.status === 200 && res?.data?.list) {
    //             setPassList(res?.data?.list)
    //             setIsPass(true)
    //         }
    //     }
    // }
    const { user, setUserPar }: any = useContext(CountContext);
    // 创建一个MutationObserver实例
    const observer = new MutationObserver(function (mutationsList: any,) {
        if (mutationsList[0].target.offsetWidth <= 900) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    });

    // 配置观察器选项
    var observerOptions = {
        attributes: true, // 监听属性变化
    };

    const redeemDpass = throttle(async function () {
        if (imgSta !== '4') {
            if (redeemCount === 0) {
                MessageAll('warning', t("Alert.Please enter the purchase quantity"))
            } else {
                let point: any = null
                if (imgSta === '1') {
                    point = redeemCount * 6000
                } else if (imgSta === '2') {
                    point = redeemCount * 480
                } else if (imgSta === '3') {
                    point = redeemCount * 1200
                }
                if (point && Number(user?.rewardPointCnt) >= point) {
                    const res: any = await getAll({
                        method: "post",
                        url: "/api/v1/d_pass/redeem",
                        data: {
                            count: redeemCount,
                            passId: imgSta
                        },
                        token,
                    });
                    if (res?.data?.code === '200') {
                        setRedeemCount(0)
                        setUserPar({ ...user, rewardPointCnt: Number(user?.rewardPointCnt) - point })
                        getDpassList(1, imgSta);
                        MessageAll('success', t("Alert.success"));
                    }
                } else {
                    MessageAll('warning', t("Alert.not"))
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
    useLayoutEffect(() => {
        if (document.body.offsetWidth < 900) {
            setIsMobile(true);
        }
    }, []);
    useEffect(() => {
        if (params?.id) {
            getDpassList(1, params?.id);
            // getDpass()
        }
        // 启动观察器
        observer.observe(document.body, observerOptions);
        return () => observer.disconnect();
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
        setPage(page + 1)
        getDpassList(page + 1, imgSta)
        setIsNext(true)
    }, 1500, { 'trailing': false })
    const setImg = throttle(function (ind: number) {
        setPage(1)
        setIsHistory(false)
        setDPassHistory([])
        const index = par.indexOf(imgSta)
        if (index > -1) {
            const at = index + ind
            if (at > 3) {
                setImgSta(par[0])
                getDpassList(1, par[0])
            } else if (at < 0) {
                setImgSta(par[par.length - 1])
                getDpassList(1, par[par.length - 1])
            } else {
                setImgSta(par[at])
                getDpassList(1, par[at])
            }
        } else {
            getDpassList(1, par[0])
            setImgSta(par[0])
        }
    }, 1500, { 'trailing': false })

    const changeImg = (name: string) => {
        if (name === 'img') {
            return imgSta === '1' ? '/launchPass.svg' : imgSta === '2' ? '/sniperPass.svg' : imgSta === '3' ? '/swapPass.svg' : '/goldenPass.svg'
        } else if (name === 'text') {
            return imgSta === '1' ? t("Dpass.laun") : imgSta === '2' ? t("Dpass.Swap") : imgSta === '3' ? t("Dpass.Snipert") : t("Dpass.jin")
        } else if (name === 'point') {
            return imgSta === '1' ? '6000' : imgSta === '2' ? '480' : imgSta === '3' ? '1200' : 'mission accomplished'
        } else {
            return imgSta === '1' ? t("Dpass.Creation") : imgSta === '2' ? t("Dpass.Fast") : imgSta === '3' ? t("Dpass.Pass") : t("Active.Golden")
        }
    }
    const show = (back: string) => {
        if (imgSta === '4') {
            if (back === 'back') {
                return 'gray'
            } else {
                return 'not-allowed'
            }
        } else if ((imgSta === '1' && Number(user?.rewardPointCnt) > 6000) || (imgSta === '2' && Number(user?.rewardPointCnt) > 480) || (imgSta === '3' && Number(user?.rewardPointCnt) > 1200)) {
            if (back === 'back') {
                return '#86f097'
            } else {
                return 'pointer'
            }
        } else {
            if (back === 'back') {
                return 'gray'
            } else {
                return 'not-allowed'
            }
        }
    }

    return (
        <>
            {
                <div className="dpass-background">
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
                            <p className="dpass-content-right-title"> {changeImg('')}</p>
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
                                    {imgSta === '4' ? t("Dpass.Inconvertible") : t("Dpass.Exchange")}
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
                                {!isMobile && <span>   {t("Dpass.Pass Id")}</span>}
                                <span> {t("Dpass.Status")}</span>
                                <span>{t("Dpass.Key")}</span>
                            </div>
                            {isHistory ? dPassHistory.length > 0 ? dPassHistory.map(({ createdAt, cnt, passId, cost }: any) => (
                                <div className="dpass-redeem-table-td" key={passId}>
                                    <span>{dayjs.unix(createdAt).format("DD/MM/YYYY HH:mm")}</span>
                                    {isMobile ? <></> : <span>{passId}</span>}
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
                </div>
            }
        </>
    );
}

export default Dpass;