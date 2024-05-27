// import Conyent from "../../community/components/PostContent.tsx";
import { useContext } from "react";
import { CountContext } from "../../../Layout.tsx";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
const LINK_CREATE = [
  "https://drive.google.com/file/d/1ED7qadkVJMKJazvnqlgVARGR4-RYMCbc/view?usp=sharing",
  "https://t.me/DexpertThorBot",

];
const LINK_sniper = ['https://youtu.be/vkKD4GD_awY', "https://t.me/DexpertOdinBot"]
function Center() {
  const { browser }: any = useContext(CountContext);
  const router = useLocation();
  const params: any = useParams()
  const { t } = useTranslation();
  return (
    <div className={"center"} style={{ width: browser ? '68%' : '92%' }}>
      {
        <div className={"centerTop"} style={{ flexDirection: browser ? 'row' : 'column' }}> 
          <img src={params?.id === 'create' ? "/bot11.png" : '/bot.png'} alt="" loading={"lazy"} style={{width:browser?'25%':'50%'}}/>
          <div
            className={"centerTopRight"}
            style={{ paddingRight: browser ? "10%" : "2%" }}
          >
            <p style={{ fontSize: browser ? "30px" : "22px" }}>
              {params?.id === 'create' ? t("Dapps.Token Creation Bot") + '(Thor)' : t("Dapps.sniper")}
            </p>
            {
              params?.id === 'create' ? <p className={'pp'}>
                {router.pathname === "/app"
                  ? t("Dapps.Thor Desc")
                  : t("Dapps.Run Tips")}
              </p> : <>
                <p className={'pp'}>{t("Dapps.a")}</p>
                <p className={'pp'}>{t("Dapps.b")}</p>
                <p className={'pp'}>{t("Dapps.c")}</p>
              </>
            }
            <p style={{ color: "rgb(130,230,150)", marginBottom: '5px' }}><span>{t("Dapps.fee")}</span><span style={{ marginLeft: "10px" }}>{params?.id === 'create' ? '0.08eth' : 'Swap 0.2%, Sniper 0.5%'}</span></p>
            <div className={"dis"}>
              {[
                t("Dapps.Video Guide"),
                t("Dapps.Start on Telegram"),
                t("Dapps.Start on Web"),
              ].map((i: string, ind: number) => {
                return (
                  <div
                    onClick={() => {
                      if (params?.id === 'create') {
                        LINK_CREATE[ind] ? window.open(LINK_CREATE[ind]) : null
                      } else {
                        LINK_sniper[ind] ? window.open(LINK_sniper[ind]) : null
                      }
                    }
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
      {/*<Conyent  />*/}
    </div >
  );
}

export default Center;
