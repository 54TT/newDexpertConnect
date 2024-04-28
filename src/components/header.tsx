import { useContext, useState } from "react";
import { Collapse, Drawer, Dropdown } from "antd";
import { CountContext } from "../Layout.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { simplify } from "../../utils/change.ts";
import HeaderModal from "./headerModal.tsx";
import { throttle } from "lodash";
import { useTranslation } from "react-i18next";

export type I18N_Key = "zh_CN" | "en_US";

function Header() {
  const router = useLocation();
  const { t, i18n } = useTranslation();
  const language = (localStorage.getItem("language") || "zh_CN") as I18N_Key;
  const [languageType, setLanguageType] = useState<I18N_Key>(language);
  const { user, load, clear, browser, setIsModalOpen }: any =
    useContext(CountContext);
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const showDrawer = throttle(
    function () {
      setOpen(true);
    },
    1500,
    { trailing: false }
  );
  const onClose = () => {
    setOpen(false);
  };
  // 改变路由方法
  const historyChange = throttle(
    function (i: number) {
      switch (i) {
        case 2:
          history("/community/lastest");
          break;
        case 0:
          history("/");
          break;
        case 1:
          history("/app");
          break;
      }
    },
    1500,
    { trailing: false }
  );
  const logout = throttle(
    function () {
      clear();
    },
    1500,
    { trailing: false }
  );
  const items: any = [
    {
      key: "1",
      label: <p onClick={logout}>logout</p>,
    },
  ];
  const loginModal = throttle(
    function () {
      if (!load) {
        if (!user) {
          setIsModalOpen(true);
        }
      }
    },
    1500,
    { trailing: false }
  );

  const collapseItems: any = [
    {
      key: "0",
      label: t("Common.Market"),
    },
    {
      key: "1",
      label: "Dapps & Tools",
      children: (
        <div className={"collapseChildeen"}>
          {[
            { name: t("Dapps.Token Creation Bot"), img: "/token.svg" },
            {
              name: t("Dapps.Sniper Bot"),
              img: "/sniper.svg",
            },
            { name: t("Dapps.Air drop Bot"), img: "/dropBot.svg" },
            {
              name: t("Dapps.Market maker"),
              img: "/money.svg",
            },
            { name: t("Dapps.New Buy Notification"), img: "/news.svg" },
            {
              name: t("Dapps.Token Checker"),
              img: "/checker.svg",
            },
            { name: "Trending", img: "/trending.svg" },
          ].map((i: any, ind: number) => {
            return (
              <p
                key={ind}
                onClick={throttle(
                  function () {
                    if (ind === 0) {
                      history("/app");
                      onClose();
                    }
                  },
                  1500,
                  { trailing: false }
                )}
              >
                <img src={i.img} alt="" loading={"lazy"} />
                <span style={{ color: ind > 0 ? "gray" : "rgb(200,200,200)" }}>
                  {i.name}
                </span>
              </p>
            );
          })}
        </div>
      ),
    },
    {
      key: "2",
      label: "Community",
      children: (
        <div className={"collapseChildeen"}>
          {[
            { name: "Lastest", img: "/community/latest.svg" },
            {
              name: "Profile",
              img: "/community/profile.svg",
            },
            { name: "Following", img: "/community/follow.svg" },
          ].map((i: any, ind: number) => {
            return (
              <p
                key={ind}
                onClick={throttle(
                  function () {
                    history(`/community/${i.name}`);
                    onClose();
                  },
                  1500,
                  { trailing: false }
                )}
              >
                <img src={i.img} alt="" loading={"lazy"} />
                <span>{i.name}</span>
              </p>
            );
          })}
        </div>
      ),
    },
  ];
  const onChange = (key: string | string[]) => {
    if (key.length > 0 && key[0] === "0") {
      history("/");
      onClose();
    }
  };
  const change = (ind: number) => {
    if (router.pathname === "/" || router.pathname === "/newpairDetails") {
      if (ind === 0) {
        return "rgb(134,240,151)";
      } else {
        return "rgb(214,223,215)";
      }
    } else if (
      router.pathname === "/community/lastest" ||
      router.pathname === "/community/profile" ||
      router.pathname === "/community/following"
    ) {
      if (ind === 2) {
        return "rgb(134,240,151)";
      } else {
        return "rgb(214,223,215)";
      }
    } else if (router.pathname === "/app") {
      if (ind === 1) {
        return "rgb(134,240,151)";
      } else {
        return "rgb(214,223,215)";
      }
    } else {
      return "rgb(214,223,215)";
    }
  };

  const HeaderList = [
    {
      label: t("Common.Market"),
      value: "Market",
    },
    {
      label: t("Common.DApps & Tools"),
      value: "DApps & Tools",
    },
    {
      label: t("Common.Community"),
      value: "Community",
    },
  ];

  const changeLanguage = (e: any) => {
    const { target } = e.target.dataset;
    if (target) {
      localStorage.setItem("language", target);
      setLanguageType(target);
      i18n.changeLanguage(target);
    }
  };

  return (
    <div className={"headerBox"}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          width: browser ? "10%" : "20%",
        }}
        onClick={throttle(
          function () {
            window.open("https://info.dexpert.io/");
          },
          1500,
          { trailing: false }
        )}
      >
        <img
          src="/logo1111.svg"
          alt=""
          style={{ width: "100%", display: "block" }}
        />
      </div>
      {browser && (
        <p className={`headerCenter dis`}>
          {HeaderList.map(({ label }, ind) => {
            return (
              <span
                key={ind}
                style={{ color: change(ind) }}
                onClick={throttle(
                  function () {
                    historyChange(ind);
                  },
                  1500,
                  { trailing: false }
                )}
              >
                {label}
              </span>
            );
          })}
        </p>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {user?.uid ? (
          <Dropdown
            menu={{
              items,
            }}
          >
            {browser ? (
              <div className={"disCen"} style={{ cursor: "pointer" }}>
                <img
                  src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.svg"}
                  style={{
                    width: "25px",
                    display: "block",
                    marginRight: "4px",
                    borderRadius: "100%",
                  }}
                  alt=""
                  loading={"lazy"}
                />
                <p style={{ color: "rgb(214,223,215)" }}>
                  {" "}
                  {simplify(user?.username)}
                </p>
                <DownOutlined
                  style={{ color: "rgb(214,223,215)", marginTop: "3px" }}
                />
              </div>
            ) : (
              <img
                loading={"lazy"}
                src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.svg"}
                style={{
                  width: "28px",
                  display: "block",
                  cursor: "pointer",
                  borderRadius: "100%",
                }}
                alt=""
              />
            )}
          </Dropdown>
        ) : (
          <>
            <div onClick={(e) => changeLanguage(e)}>
              {languageType === "zh_CN" && (
                <img
                  className="language-icon language-icon_CN"
                  id="zh_CN"
                  data-target="en_US"
                  src="/zhong.svg"
                  alt=""
                />
              )}
              {languageType === "en_US" && (
                <img
                  id="en_US"
                  data-target="zh_CN"
                  className="language-icon  language-icon_EN"
                  src="/ying.svg"
                  alt=""
                />
              )}
            </div>
            {browser ? (
              <div className={"headerConnect"} onClick={loginModal}>
                <div className={"disCen"}>
                  <span>{t("Common.Connect Wallet")}</span>
                  {load ? (
                    <LoadingOutlined style={{ marginLeft: "4px" }} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              <img
                loading={"lazy"}
                src="/wallet.svg"
                onClick={loginModal}
                style={{ width: "13%" }}
                alt=""
              />
            )}
          </>
        )}
        {!browser && (
          <img
            src="/side.svg"
            loading={"lazy"}
            alt=""
            style={{ cursor: "pointer", width: "28px", marginLeft: "8px" }}
            onClick={() => {
              showDrawer();
            }}
          />
        )}
      </div>
      <HeaderModal />
      <Drawer
        width={"65vw"}
        className={"headerDrawerOpen"}
        destroyOnClose={true}
        onClose={onClose}
        open={open}
      >
        <Collapse
          items={collapseItems}
          accordion
          className={"headerCollapse"}
          onChange={onChange}
          ghost
        />
      </Drawer>
    </div>
  );
}

export default Header;
