import {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {CountContext} from "../../../Layout.tsx";
import {throttle} from "lodash";

function Left() {
    const history = useNavigate();
    const {user,setIsModalOpen}: any = useContext(CountContext);
    const [value, setValue] = useState("Token Creation Bot");
    const {t} = useTranslation();
    const LeftTab = [
        [
            {
                label: t("Dapps.Token Creation Bot"),
                value: "Token Creation Bot",
            },
            {
                label: t("Dapps.Sniper Bot"),
                value: "Sniper Bot",
            },
            {
                label: t("Dapps.Air drop Bot"),
                value: "Air drop Bot",
            },
            {
                label: t("Dapps.Market maker"),
                value: "Market maker",
            },
            {
                label: 'D Pass',
                value: "D Pass",
            },
        ],
        [
            {
                label: t("Dapps.New Buy Notification"),
                value: "New Buy Notification",
            },
            {
                label: t("Dapps.Token Checker"),
                value: "Token Checker",
            },
            {
                label: t("Dapps.Trending"),
                value: "Trending",
            },
        ],
    ];
    return (
        <div className={"left"}>
            {LeftTab.map((i: any, ind: number) => {
                return (
                    <div className={"top"} key={ind}>
                        {ind === 0 ? <p>DApps</p> : <p>{t("Dapps.Telegram Suite")}</p>}
                        {i.map(({label, value: valueData}: any, it: number) => {
                            return (
                                <p
                                    key={it}
                                    className={"list"}
                                    onClick={
                                        throttle( function () {
                                        if (valueData === 'D Pass') {
                                            if(user?.address) {
                                                history('/Dpass')
                                            }else {
                                                setIsModalOpen(true)
                                            }
                                        } else if (value !== valueData) {
                                            if (ind === 0) {
                                                if (it !== 2 && it !== 1) {
                                                    setValue(valueData);
                                                }
                                            }
                                        }
                                        }, 1500, {'trailing': false})}
                                    style={{
                                        color:
                                            valueData === "Token Creation Bot"
                                                ? "rgb(134,240,151)" : valueData === 'D Pass' ? 'white'
                                                    : "rgb(104,124,105)",
                                    }}
                                >
                                    <img
                                        loading={"lazy"}
                                        src={
                                            ind === 0
                                                ? it === 0
                                                    ? "/token.svg"
                                                    : it === 1
                                                        ? "/sniper.svg"
                                                        : it === 2
                                                            ? "/dropBot.svg" : it === 4 ? '/padds.svg' :
                                                                "/money.svg"
                                                : it === 0
                                                    ? "/news.svg"
                                                    : it === 1
                                                        ? "/checker.svg"
                                                        : "/trending.svg"
                                        }
                                        alt=""
                                    />
                                    <span>{label}</span>
                                    {(valueData === "Token Checker" ||
                                        valueData === "New Buy Notification" ||
                                        valueData === "Trending" ||
                                        valueData === "Sniper Bot" ||
                                        valueData === "Air drop Bot" ||
                                        valueData === "Market maker") && (
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
