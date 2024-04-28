import { useState } from "react";
import { useTranslation } from "react-i18next";

function Left() {
  const [value, setValue] = useState("Token Creation Bot");
  const { t } = useTranslation();
  const LeftTab = [
    [
      {
        label: t("Dapps.Token Creation Bot"),
        value: "'Token Creation Bot'",
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
    ],
    [
      {
        label: t("Dapps.New Buy Notification"),
        valie: "New Buy Notification",
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
            {i.map(({ label, value }: any, it: number) => {
              return (
                <p
                  key={it}
                  className={"list"}
                  onClick={() => {
                    if (value !== value) {
                      // {
                      //     if (it !== 2 && it !== 3 && it !== 1) {
                      //         setValue(item)
                      //     }
                      // } else
                      if (ind === 0) {
                        if (it !== 2 && it !== 1) {
                          setValue(value);
                        }
                      }
                    }
                  }}
                  // style={{color: ind === 0 ? value === item ? 'rgb(134,240,151)' : it === 2 || it === 1 || it === 3 ? 'rgb(104,124,105)' : 'rgb(214, 223, 215)' : value === item ? 'rgb(134,240,151)' : it === 0 ? 'rgb(214, 223, 215)' : 'rgb(104,124,105)'}}>
                  style={{
                    color:
                      value === "Token Creation Bot"
                        ? "rgb(134,240,151)"
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
                              ? "/dropBot.svg"
                              : "/money.svg"
                        : it === 0
                          ? "/news.svg"
                          : it === 1
                            ? "/checker.svg"
                            : "/trending.svg"
                    }
                    alt=""
                  />
                  <span>{label}</span>
                  {(value === "Token Checker" ||
                    value === "New Buy Notification" ||
                    value === "Trending" ||
                    value === "Sniper Bot" ||
                    value === "Air drop Bot" ||
                    value === "Market maker") && (
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
                      Coming soon
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
