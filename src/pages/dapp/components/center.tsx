import Conyent from "../../community/components/PostContent.tsx";
import { useContext } from "react";
import { CountContext } from "../../../Layout.tsx";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
const LINK_BUTTON = [
  "https://drive.google.com/file/d/1ED7qadkVJMKJazvnqlgVARGR4-RYMCbc/view?usp=sharing",
  "https://t.me/DexpertThorBot",
  "",
];
function Center() {
  const { browser }: any = useContext(CountContext);
  const router = useLocation();
  const { t } = useTranslation();
  return (
    <div className={"center"}>
      {
        <div className={"centerTop"}>
          <img src="/bot.svg" alt="" loading={"lazy"} />
          <div
            className={"centerTopRight"}
            style={{ paddingRight: browser ? "10%" : "2%" }}
          >
            <p style={{ fontSize: browser ? "30px" : "22px" }}>
              {t("Dapps.Token Creation Bot")} (Thor)
            </p>
            <p>
              {router.pathname === "/app"
                ? t("Dapps.Thor Desc")
                : t("Dapps.Run Tips")}
            </p>
            <div className={"dis"}>
              {[
                t("Dapps.Video Guide"),
                t("Dapps.Start on Telegram"),
                t("Dapps.Start on Web"),
              ].map((i: string, ind: number) => {
                return (
                  <div
                    onClick={() =>
                      LINK_BUTTON[ind] ? window.open(LINK_BUTTON[ind]) : null
                    }
                    style={{
                      width: browser ? "28%" : "30%",
                      color: ind === 2 ? "gray" : "rgb(220, 220, 220)",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    key={ind}
                  >
                    {i}
                    {ind === 2 ? (
                      <span
                        style={{
                          fontSize: "10px",
                          backgroundColor: "rgb(40,40,40)",
                          borderRadius: "6px",
                          padding: "4px",
                        }}
                      >
                                    {t("Common.Coming soon")}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
      <Conyent /* name={'dappCenter'} */ />
    </div>
  );
}

export default Center;
