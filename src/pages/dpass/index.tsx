import { Button, Tag, message } from "antd";
import Cookies from "js-cookie";
import "./index.less";
import Request from "../../components/axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { CopyOutlined } from "@ant-design/icons";
function Dpass() {
  const token = Cookies.get("token");
  const { getAll } = Request();
  const [dPassCount, setDpassCount] = useState(0);
  const [redeemCount, setRedeemCount] = useState(0);
  const [page, setPage] = useState(1);
  const [dPassList, setDPassList] = useState([]);
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  // 创建一个MutationObserver实例
  const observer = new MutationObserver(function (mutationsList, observer) {
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
    const { data }: any = await getAll({
      method: "get",
      url: "/api/v1/d_pass",
      data: {},
      token,
    });

    setDpassCount(data?.dPassCount || 0);
  };

  const redeemDpass = () => {
    if (redeemCount === 0) {
      message.warning(t("Alert.Please enter the purchase quantity"));
      return;
    }
    const res = getAll({
      method: "post",
      url: "/api/v1/d_pass/redeem",
      data: {
        count: redeemCount,
      },
      token,
    });
    if (res?.data?.code === 200) {
      getDpassCount();
      return message.success(t("Alert.success"));
    }
  };

  const getDpassList = async () => {
    const { data } = await getAll({
      method: "get",
      url: "/api/v1/d_pass/list",
      data: {
        page,
      },
      token,
    });
    if (data?.list?.length) {
      setDPassList(data.list);
    } else {
      message.warning("no more history");
    }
  };

  useLayoutEffect(() => {
    if (document.body.offsetWidth < 900) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    getDpassCount();
    getDpassList();
    // 启动观察器
    observer.observe(document.body, observerOptions);
    return () => observer.disconnect();
  }, []);

  const clickPlusOrReduce = (e) => {
    const { id } = e.target;
    if (id === "plus") {
      setRedeemCount(redeemCount + 1);
    }
    if (id === "reduce") {
      if (redeemCount === 0) return;
      setRedeemCount(redeemCount - 1);
    }
  };

  const handleOnInput = (e: any) => {
    const { value } = e.target;

    const count = Number(value);
    if (Number.isNaN(count)) {
      return setRedeemCount(0);
    }
    if (typeof count === "number") {
      return setRedeemCount(count);
    }

    if (typeof value)
      if (value === "") {
        setRedeemCount(0);
      }
  };

  const Status = ({ status }) =>
 (
      <>
        {status === "0" ? (
          <Tag color="rgb(113, 173, 86)">valid</Tag>
        ) : (
          <Tag color="#f50">expired</Tag>
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
    message.success("copy success");
  }

  return (
    <div className="dpass-background">
      <div className="dpass-content">
        <div className="dpass-content-left">
          <img className="dapss-card" src="/dpassCard.png" alt="" />
          <img className="dpass-light" src="/light.png" alt="" />
          <img className="dpass-cap" src="/bottomCap.png" alt="" />
        </div>
        <div className="dpass-content-right">
          <p className="dpass-content-right-title">D PASS</p>
          <p className="dpass-content-right-content">
            6000 D points can to redeem one Pass, which allows you to use
            DEXpert’s robot service once.
          </p>
          <p className="dpass-content-right-content">
            In the future, D point can be exchanged for our token, $DEXP.
          </p>
          <p className="dpass-content-right-content">6000 D point</p>
          <div className="dpass-content-right-action">
            <div className="dpass-content-right-action-input">
              <span id="reduce" onClick={clickPlusOrReduce}>
                -
              </span>
              <input
                value={redeemCount}
                className="dpass-content-right-action-input_number"
                defaultValue={1}
                onChange={handleOnInput}
              />
              <span id="plus" onClick={clickPlusOrReduce}>
                +
              </span>
            </div>
            <Button
              className="dpass-content-right-action-button"
              onClick={() => redeemDpass()}
            >
              Exchange
            </Button>
          </div>
          <div className="dpass-content-right-info">
            <div
              className="dpass-content-right-info-points"
              style={{ borderRight: "1px solid #999" }}
            >
              <div className="dpass-content-right-info-title">
                Your D Points
              </div>
              <div className="dpass-content-right-info-amount">123123</div>
            </div>
            <div className="dpass-content-right-info-points">
              <div className="dpass-content-right-info-title">Your Pass</div>
              <div className="dpass-content-right-info-amount">
                {dPassCount}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dpass-redeem">
        <div>
          <div className="dpass-redeem-table">
            <div className="dpass-redeem-table-th">
              <span>Time</span>
             { !isMobile && <span>Your Pass Id</span>}
              <span>Status</span>
              <span>Key</span>
            </div>
            {dPassList.map(({ createdAt, key, passId, status }: any) => (
              <div className="dpass-redeem-table-td">
                <span>{dayjs.unix(createdAt).format("DD/MM/YYYY HH:mm")}</span>
                {isMobile ? <></> : <span>{passId}</span> }
                <span>{<Status status={status} />}</span>
                <span>
                  {status === "0" ? (
                    isMobile ? (
                      <Button
                        onClick={() => copyToClipboard(key)}
                        className="copy-dpass-key"
                        icon={<CopyOutlined />}
                      />
                    ) : (
                      <Button
                        onClick={() => copyToClipboard(key)}
                        className="copy-dpass-key"
                        icon={<CopyOutlined />}
                      >
                        Copy
                      </Button>
                    )
                  ) : (
                    key
                  )}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dpass;
