import { useContext, useState } from "react";
import { Collapse, Drawer, Dropdown, } from "antd";
import { CountContext } from "../Layout.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined, } from "@ant-design/icons";
import { simplify } from "../../utils/change.ts";
import HeaderModal from "./headerModal.tsx";
import { throttle } from "lodash";
import { useTranslation } from "react-i18next";
export type I18N_Key = "zh_CN" | "en_US";
function Header() {
    const router = useLocation();
    const { user, load, clear, browser, setIsModalOpen, languageChange, setLanguageChange }: any =
        useContext(CountContext);
    const { t, i18n } = useTranslation();
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
        function (i: string) {
            switch (i) {
                case 'Community':
                    history("/community/lastest");
                    break;
                case 'Market':
                    history("/");
                    break;
                case 'DApps':
                    history("/app/create");
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
                                            history("/app/create");
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
    const change = (ind: string) => {
        if (router.pathname === "/" || router.pathname === "/newpairDetails") {
            if (ind === 'Market') {
                return "rgb(134,240,151)";
            } else {
                return "rgb(214,223,215)";
            }
        } else if (
            router.pathname === "/community/lastest" ||
            router.pathname === "/community/profile" ||
            router.pathname === "/community/following"
        ) {
            if (ind === 'Community') {
                return "rgb(134,240,151)";
            } else {
                return "rgb(214,223,215)";
            }
        } else if (router.pathname.includes("/app/")) {
            if (ind === 'DApps') {
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
            key: 'Market'
        },
        {
            label: t("Common.DApps & Tools"),
            value: "DApps & Tools",
            key: 'DApps'
        },
        {
            label: t("Common.Community"),
            value: "Community",
            key: 'Community'
        },
    ];

    const changeLanguage = throttle(
        function () {
            if (languageChange === "zh_CN") {
                localStorage.setItem("language", 'en_US');
                setLanguageChange('en_US');
                i18n.changeLanguage('en_US');
            } else {
                localStorage.setItem("language", 'zh_CN');
                setLanguageChange('zh_CN');
                i18n.changeLanguage('zh_CN');
            }
        },
        1500, { trailing: false });
    return (
        <div className={"headerBox"}>
            <div style={{ display: "flex", alignItems: "center", }}>
                <img src="/logo1111.svg" alt="" onClick={throttle(
                    function () {
                        window.open("https://info.dexpert.io/");
                    },
                    1500,
                    { trailing: false })} style={{ width: "100px", display: "block", cursor: 'pointer' }} />

            </div>
            {browser && (
                <p className={`headerCenter dis`}>
                    {HeaderList.map(({ label, key }, ind) => {
                        return (
                            <span
                                key={ind}
                                style={{ color: change(key) }}
                                onClick={throttle(
                                    function () {
                                        historyChange(key);
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
            <div className={'headerData'} style={{ justifyContent: browser ? 'center' : 'flex-end' }}>
                <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={throttle(
                        function () {
                            history('/activity')
                        },
                        1500,
                        { trailing: false })}>
                    <img src={router.pathname === '/activity' ? "/gift.svg" : "/giftWhite1.svg"} alt="" style={{ width: '23px', cursor: 'pointer', marginRight: '6px' }} />
                    {
                        browser && <p style={{ color: router.pathname === '/activity' ? 'rgb(134,240,151)' : 'rgb(214, 223, 215)' }}>{t("Common.Events")}</p>
                    }
                </div>
                {user?.uid ? (
                    <>
                        {browser ? (
                            <div className={"disCen"} style={{ cursor: "pointer" ,margin: '0 15px'}}>
                                <Dropdown
                                    overlayClassName={'headerDropdownClass'}
                                    menu={{
                                        items,
                                    }}>
                                    <div className={'headLine'}>
                                        <img src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.png"}
                                            style={{
                                                width: "26px",
                                                display: "block",
                                                marginRight: "-8px",
                                                zIndex: '10',
                                                borderRadius: "100%",
                                            }} alt="" loading={"lazy"} />
                                        <p className={'headLineP'}>{simplify(user?.username)}</p>
                                    </div>
                                </Dropdown>
                                <div className={'headLine'}>
                                    {/* <p className={'headLineP'}>{isBalance ? Number(balance[user?.address]) ? setMany(balance[user?.address]) : '0' + 'ETH' || '0ETH' :
                                        <LoadingOutlined style={{fontSize: '15px'}}/>}</p> */}
                                    <p className={'headLineP'}>{user?.rewardPointCnt + ' D' || '0 D'}</p>
                                </div>
                            </div>
                        ) : (
                            <img
                                loading={"lazy"}
                                src={user?.avatarUrl ? user?.avatarUrl : "/topLogo.png"}
                                style={{
                                    width: "25px",
                                    margin: '0 15px',
                                    display: "block",
                                    cursor: "pointer",
                                    borderRadius: "100%",
                                }}
                                alt=""
                            />
                        )}
                    </>
                ) : (
                    <>
                        {browser ? (
                            <div className={"headerConnect"} style={{ margin: '0 15px' }} onClick={loginModal}>
                                <div className={"disCen"}>
                                    <span>{t("Common.Connect Wallet")}</span>
                                    {load ? (
                                        <LoadingOutlined style={{ marginLeft: "4px" }} />
                                    ) : ''}
                                </div>
                            </div>
                        ) : (
                            <img
                                loading={"lazy"}
                                src="/wallet.svg"
                                onClick={loginModal}
                                style={{ width: "25%", margin: '0 15px' }}
                                alt=""
                            />
                        )}
                    </>
                )}
                {
                    browser && <img src="/earth.svg" alt=""
                        style={{ cursor: 'pointer', display: 'block', width: '22px' }}
                        onClick={changeLanguage} />
                }
                {!browser && (
                    <img
                        src="/side.svg"
                        loading={"lazy"}
                        alt=""
                        style={{ cursor: "pointer", width: "28px", marginLeft: "8px" }}
                        onClick={showDrawer}
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
