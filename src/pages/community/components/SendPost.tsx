import { Button, Input, message, Popover } from "antd";
import Request from "../../../components/axios.tsx";
import { useEffect, useRef, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { throttle } from "lodash";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

interface SendPostTypeProps {
  type?: "comment" | "post" | "reply";
  changeRefresh?: (name: any) => void;
  onPublish?: (data: any) => void;
  postData?: any;
}

function SendPost({
  type = "post",
  changeRefresh,
  onPublish,
  postData,
}: SendPostTypeProps) {
  const { getAll } = Request();
  const [img, setImg] = useState<any>(null);
  const [imgPreview, setImgPreview] = useState<any>(null);
  const [value, setValue] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [sendDisable, setSendDisable] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>({});
  const { t } = useTranslation();
  const clickImage = throttle(
    function () {
      inputRef?.current?.click?.();
    },
    1500,
    { trailing: false }
  );
  const handleuploadImage = (e: any) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"]; // 允许的图片类型
    const uploadInput = inputRef?.current;
    const fileType = file.type;
    if (!allowedTypes.includes(fileType)) {
      messageApi.warning("Only images in JPEG and PNG formats can be uploaded");
      if (uploadInput?.value) {
        // 清空输入框的值，防止上传无效文件
        uploadInput.value = "";
      }
    } else {
      const previewImg = URL.createObjectURL(file);
      setImg(file);
      setImgPreview(previewImg);
      handleChangeValue(value, file);
    }
  };

  const toolsIcon = [
    {
      name: "image",
      img: "/community/image.svg",
      onClick: () => clickImage(),
    },
    {
      name: "gif",
      img: "/community/gif.svg",
    },
    {
      name: "emoji",
      img: "/community/emoji.svg",
    },
    {
      name: "mention",
      img: "/community/mention.svg",
    },
  ];

  useEffect(() => {
    const uploadInput = inputRef.current;
    uploadInput?.addEventListener("input", handleuploadImage, false);
    return () => {
      uploadInput?.removeEventListener("input", handleuploadImage);
    };
  }, []);

  const handlePostSend = throttle(
    async function () {
      const token = Cookies.get("token");
      const username: any = Cookies.get("username");
      let imgUrl: any = null;
      try {
        setPublishing(true);
        if (img !== null) {
          const at = {
            method: "post",
            url: "/api/v1/upload/image",
            data: img,
            token,
          };
          //     imgUrl =  Request();
          imgUrl = await getAll(at);
        }
        if (imgUrl !== null) {
          if (!imgUrl || imgUrl?.status !== 200) {
            return messageApi.open({
              type: "warning",
              content: "Upload failed, please upload again!",
            });
          }
        }
        const data = {
          content: value,
          imageList: imgUrl?.data?.url ? [imgUrl.data.url] : undefined,
        };
        let params;
        let url = "";
        if (type === "comment") {
          params = {
            postId: postData.postId,
            content: value,
          };
          url = "/api/v1/post/comment";
        }
        if (type === "post") {
          params = {
            uid: username?.uid,
            address: username?.address,
            post: data,
          };
          url = "/api/v1/post/publish";
        }
        if (type === "reply") {
          params = {
            targetId: postData.id,
            content: value,
          };
          url = "/api/v1/reply";
        }
        // const result: any = await Request(, , , token)
        const result: any = await getAll({
          method: "post",
          url,
          data: params,
          token,
        });
        if (result?.status === 200) {
          onPublish?.(data);
          changeRefresh?.(true);
        }
        setPublishing(false);
        clearImg();
        setValue("");
        if (result && result.status === 200) {
          changeRefresh?.(true);
        }
      } catch (e) {
        messageApi.error("Publish failed");
        setPublishing(false);
      }
    },
    1500,
    { trailing: false }
  );

  const handleChangeValue = (value: string, img: unknown) => {
    if (value === "" && img === null) {
      setSendDisable(true);
    } else {
      setSendDisable(false);
    }
  };
  const clearImg = throttle(
    function () {
      handleChangeValue(value, null);
      setImg(null);
      setImgPreview(null);
      const uploadInput: any = inputRef?.current;
      // 清空value，触发input事件
      if (uploadInput?.value) {
        uploadInput.value = null;
      }
    },
    1500,
    { trailing: false }
  );
  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  const change = (e: any) => {
    setValue(value + e.native);
  };
  const content = (
    <Picker
      data={emojiData}
      previewPosition={"none"}
      emojiButtonSize={"30"}
      searchPosition={"none"}
      maxFrequentRows={"0"}
      perLine={"5"}
      emojiSize={"17"}
      onEmojiSelect={change}
    />
  );
  return (
    <>
      {contextHolder}
      <div className="community-content-post-send">
        <div className="community-content-post-send-avatar">
          <img loading={"lazy"} src={user?.avatarUrl || "/logo.svg"} alt="" />
        </div>
        <div className="community-content-post-send-input">
          <TextArea
            value={value}
            autoSize
            variant="borderless"
            placeholder={t("Community.Share your insights...")}
            onChange={(e) => {
              setValue(e.target.value);
              handleChangeValue(e.target.value, img);
            }}
          />
        </div>
      </div>
      <div className="post-send-imgList">
        {imgPreview ? (
          <div className="post-send-imgList-delete">
            <img loading={"lazy"} src={imgPreview} alt="" />
            <Button
              size="small"
              icon={<CloseOutlined />}
              shape="circle"
              onClick={() => clearImg()}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="post-send-tools">
        <div className="post-send-tools-icon">
          {toolsIcon.map((data: any, ind: number) => {
            if (data.name === "emoji") {
              return (
                <Popover
                  content={content}
                  key={ind}
                  overlayClassName={"sendPostClass"}
                  trigger="click"
                >
                  <img
                    loading={"lazy"}
                    alt={""}
                    src={data.img}
                    onClick={data.onClick}
                  />
                </Popover>
              );
            } else {
              return (
                <img
                  key={ind}
                  loading={"lazy"}
                  alt={""}
                  src={data.img}
                  onClick={data.onClick}
                />
              );
            }
          })}
        </div>
        <div className="post-send-tools-button">
          <Button
            onClick={() => handlePostSend()}
            disabled={sendDisable}
            loading={publishing}
          >
            {t("Community.Post")}
          </Button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        name="file"
        id="img-load"
        accept="image/*"
        style={{ display: "none" }}
      />
    </>
  );
}

export default SendPost;
