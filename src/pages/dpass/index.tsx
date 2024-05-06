import {Button, Tag,} from "antd";
import Cookies from "js-cookie";
import "./index.less";
import Request from "../../components/axios";
import {useContext, useEffect, useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {CaretDownOutlined, CopyOutlined, LoadingOutlined} from "@ant-design/icons";
import {CountContext} from "../../Layout";
import {MessageAll} from '../../components/message.ts'
import {useNavigate} from "react-router-dom";
function Dpass() {
    const token = Cookies.get("token");
    const {getAll} = Request();
    const history = useNavigate()
    const [dPassCount, setDpassCount] = useState(0);
    const [redeemCount, setRedeemCount] = useState(0);
    const [page, setPage] = useState(1);
    const [dPassList, setDPassList] = useState([]);
    const {t} = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [isNext, setIsNext] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const {user, setUserPar}: any = useContext(CountContext);
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
    const getDpassCount = async () => {
        const {data}: any = await getAll({
            method: "get",
            url: "/api/v1/d_pass",
            data: {},
            token,
        });
        setDpassCount(data?.dPassCount || 0);
    };

    const redeemDpass = async () => {
        if (Number(user?.rewardPointCnt) && Number(user?.rewardPointCnt) > 6000) {
            if (redeemCount === 0) {
                MessageAll('warning', t("Alert.Please enter the purchase quantity"))
            } else {
                const point = redeemCount * 6000
                if (Number(user?.rewardPointCnt) >= point) {
                    const res: any = await getAll({
                        method: "post",
                        url: "/api/v1/d_pass/redeem",
                        data: {
                            count: redeemCount,
                        },
                        token,
                    });
                    if (res?.data?.code === '200') {
                        setRedeemCount(0)
                        setUserPar({...user, rewardPointCnt: Number(user?.rewardPointCnt) - point})
                        getDpassCount();
                        getDpassList(1);
                        MessageAll('success', t("Alert.success"));
                    }
                } else {
                    MessageAll('warning', t("Alert.not"))
                }
            }
        } else {
            MessageAll('warning', t("Alert.not"))
        }
    };
    const getDpassList = async (page: number) => {
        const res: any = await getAll({
            method: "get",
            url: "/api/v1/d_pass/list",
            data: {
                page,
            },
            token,
        });
        if (res?.status === 200) {
            if (page === 1) {
                if (res?.data?.list?.length > 0) {
                    setDPassList(res?.data.list);
                    setIsNext(false)
                    if (res?.data?.list?.length !== 10) {
                        setIsShow(true)
                    }
                }
            } else {
                if (res?.data?.list?.length > 0) {
                    if (res?.data?.list?.length !== 10) {
                        setIsShow(true)
                    }
                    const at = dPassList.concat(res?.data?.list)
                    setDPassList([...at])
                    setIsNext(false)
                } else {
                    setIsShow(true)
                    setIsNext(false)
                }
            }
        }
    };

    useLayoutEffect(() => {
        if (document.body.offsetWidth < 900) {
            setIsMobile(true);
        }
    }, []);

    useEffect(() => {
        getDpassCount();
        getDpassList(1);
        // 启动观察器
        observer.observe(document.body, observerOptions);
        return () => observer.disconnect();
    }, []);

    const clickPlusOrReduce = (e: any) => {
        const {id} = e.target;
        if (id === "plus") {
            setRedeemCount(redeemCount + 1);
        }
        if (id === "reduce") {
            if (redeemCount === 0) return;
            setRedeemCount(redeemCount - 1);
        }
    };

    const handleOnInput = (e: any) => {
        const {value} = e.target;

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

    const Status = ({status}: any) =>
        (
            <>
                {status === "0" ? (
                    <Tag color="rgb(113, 173, 86)">{t("Dpass.Available")}</Tag>
                ) : (
                    <Tag color="#f50">{t("Dpass.Expired")}</Tag>
                )}
            </>
        );

    function copyToClipboard(text: string) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        MessageAll('success', t('Alert.copy'));
    }
    const nextPass = () => {
        setPage(page + 1)
        getDpassList(page + 1)
        setIsNext(true)
    }

    return (
        <div className="dpass-background">
            <div className="dpass-content">
                <div className="dpass-content-left">
                    <img className="dapss-card" src="/dpassCard.png" alt=""/>
                    <img className="dpass-light" src="/light.png" alt=""/>
                    <img className="dpass-cap" src="/bottomCap.png" alt=""/>
                </div>
                <div className="dpass-content-right">
                    <p className="dpass-content-right-title">D PASS</p>
                    <p className="dpass-content-right-content">
                        {t("Dpass.desc1")}
                    </p>
                    <p className="dpass-content-right-content">
                        {t("Dpass.desc2")}
                    </p>
                    <p className="dpass-content-right-content">{t("Dpass.desc3")}</p>
                    <div className="dpass-content-right-action">
                        <div className="dpass-content-right-action-input">
              <span id="reduce" onClick={clickPlusOrReduce}>
                -
              </span>
                            <input
                                value={redeemCount}
                                className="dpass-content-right-action-input_number"
                                onChange={handleOnInput}
                            />
                            <span id="plus" onClick={clickPlusOrReduce}>
                +
              </span>
                        </div>
                        <div
                            className="dpass-content-right-action-button"
                            onClick={() => redeemDpass()}
                            style={{background: Number(user?.rewardPointCnt) && Number(user?.rewardPointCnt) > 6000 ? '#86f097' : 'gray'}}
                        >
                            {t("Dpass.Exchange")}
                        </div>
                    </div>
                    <div className="dpass-content-right-info">
                        <div
                            className="dpass-content-right-info-points"
                            style={{borderRight: "1px solid #999", cursor: 'pointer'}}
                            onClick={() => {
                                history('/activity')
                            }}>
                            <div className="dpass-content-right-info-title">
                                {t("Dpass.pointsAmount")}
                            </div>
                            <div className="dpass-content-right-info-amount">{user?.rewardPointCnt || 0}</div>
                        </div>
                        <div className="dpass-content-right-info-points">
                            <div className="dpass-content-right-info-title">{t("Dpass.passCount")}</div>
                            <div className="dpass-content-right-info-amount">
                                {dPassCount}
                            </div>
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
                    {dPassList.map(({createdAt, key, passId, status}: any) => (
                        <div className="dpass-redeem-table-td" key={key}>
                            <span>{dayjs.unix(createdAt).format("DD/MM/YYYY HH:mm")}</span>
                            {isMobile ? <></> : <span>{passId}</span>}
                            <span>{<Status status={status}/>}</span>
                            <span>
                  {status === "0" ? (
                      isMobile ? (
                          <Button
                              onClick={() => copyToClipboard(key)}
                              className="copy-dpass-key"
                              icon={<CopyOutlined/>}
                          />
                      ) : (
                          <Button
                              onClick={() => copyToClipboard(key)}
                              className="copy-dpass-key"
                              icon={<CopyOutlined/>}
                          >
                              {t("Dpass.Copy")}
                          </Button>
                      )
                  ) : (
                      key
                  )}
                </span>
                        </div>
                    ))}

                    {
                        !isShow && <p style={{
                            marginTop: '20px',
                            color: 'gray',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}><span onClick={nextPass}
                                 style={{cursor: 'pointer'}}>{t('Common.Next')}</span>{isNext ?
                            <LoadingOutlined/> : <CaretDownOutlined/>}</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default Dpass;