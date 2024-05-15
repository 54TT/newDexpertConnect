import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { CountContext } from "../../../Layout.tsx";
import { throttle } from "lodash";

function Left() {
    const history = useNavigate();
    const params: any = useParams()
    const { user, setIsModalOpen }: any = useContext(CountContext);
    const [value, setValue] = useState('');
    useEffect(() => {
        if (params?.id) {
            setValue(params?.id)
        }
    }, [params])
    const { t } = useTranslation();
    const LeftTab = [
        [
            {
                label: t("Dapps.Token Creation Bot"),
                key: 'create'
            },
            {
                label: t("Dapps.sniper"),
                key: 'sniper'
            },
            {
                label: t("Dapps.Air drop Bot"),
                key: 'Air'
            },
            {
                label: t("Dapps.Market maker"),
                key: 'Market'
            },
            {
                label: 'D Pass',
                key: 'D'
            },
        ],
        [
            {
                label: t("Dapps.New Buy Notification"),
                key: 'New'
            },
            {
                label: t("Dapps.Token Checker"),
                key: 'Checker'
            },
            {
                label: t("Dapps.Trending"),
                key: 'Trending'
            },
        ],
    ];
    const changeImg = (ind: number, it: string) => {
        if (ind === 0) {
            if (it === 'create') {
                if (it === value) {
                    return "/tokenActive.svg"
                } else {
                    return "/tokenWhite.svg"
                }
            } else if (it === 'sniper') {
                if (it === value) {
                    return "/sniperActive.svg"
                } else {
                    return "/sniperWhite.svg"
                }
            } else if (it === 'Air') {
                return "/dropBot.svg"
                // dropBotActive
            } else if (it === 'Market') {
                return "/money.svg"
                // moneyActive
            } else if (it === 'D') {
                return '/padds.svg'
            }
        } else {
            if (it === 'New') {
                return "/news.svg"
                // newsActive
            } else if (it === 'Checker') {
                return "/checker.svg"
                // checkerActive.svg
            } else if (it === 'Trending') {
                return "/trending.svg"
                // trendingActive
            }
        }
    }

    return (
        <div className={"left"}>
            {LeftTab.map((i: any, ind: number) => {
                return (
                    <div className={"top"} key={ind}>
                        {ind === 0 ? <p>DApps</p> : <p>{t("Dapps.Telegram Suite")}</p>}
                        {i.map(({ label, key: valueData }: any, it: number) => {
                            return (
                                <p
                                    key={it}
                                    className={"list"}
                                    onClick={
                                        throttle(function () {
                                            if (valueData === 'D') {
                                                if (user?.address) {
                                                    history('/Dpass')
                                                } else {
                                                    setIsModalOpen(true)
                                                }
                                            } else if (valueData === 'sniper') {
                                                history('/app/sniper')
                                            } else if (valueData === 'create') {
                                                history('/app/create')
                                            } else if (value !== valueData) {
                                                if (ind === 0) {
                                                    if (it !== 2 && it !== 3) {
                                                        setValue(valueData);
                                                    }
                                                }
                                            }
                                        }, 1500, { 'trailing': false })}
                                    style={{
                                        color:
                                            valueData === value
                                                ? "rgb(134,240,151)" : valueData === 'D' || valueData === 'create' || valueData === 'sniper' ? 'white'
                                                    : "rgb(104,124,105)",
                                    }}
                                >
                                    <img
                                        loading={"lazy"}
                                        src={changeImg(ind, valueData)}
                                        alt=""
                                    />
                                    <span>{label}</span>
                                    {(valueData === "Air" || valueData === "New" || valueData === "Checker" || valueData === "Trending" ||
                                        valueData === "Market") && (
                                            <span
                                                style={{
                                                    fontSize: "10px",
                                                    marginLeft: "5px",
                                                    backgroundColor: "rgb(40,40,40)",
                                                    padding: "4px",
                                                    display: "block",
                                                    borderRadius: "6px",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {t("Common.Coming soon")}
                                            </span>
                                        )}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default Left;
