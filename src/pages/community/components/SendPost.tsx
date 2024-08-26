import { Button, Input, Popover } from 'antd';
import Request from '@/components/axios.tsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import { throttle } from 'lodash-es';
import NotificationChange from '@/components/message';
import { useTranslation } from 'react-i18next';
import { CountContext } from '@/Layout.tsx';

const { TextArea } = Input;

interface SendPostTypeProps {
  type?: 'comment' | 'post' | 'reply';
  changeRefresh?: (name: any) => void;
  onPublish?: (data: any) => void;
  postData?: any;
}

function SendPost({
  type = 'post',
  changeRefresh,
  onPublish,
  postData,
}: SendPostTypeProps) {
  const { getAll } = Request();
  const { user }: any = useContext(CountContext);
  const [img, setImg] = useState<any>(null);
  const [imgPreview, setImgPreview] = useState<any>(null);
  const [value, setValue] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [sendDisable, setSendDisable] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
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
    const allowedTypes = ['image/jpeg', 'image/png']; // 允许的图片类型
    const uploadInput = inputRef?.current;
    const fileType = file.type;
    if (!allowedTypes.includes(fileType)) {
      NotificationChange('warning', t('Market.only'));
      if (uploadInput?.value) {
        // 清空输入框的值，防止上传无效文件
        uploadInput.value = '';
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
      name: 'image',
      img: '/community/image.svg',
      onClick: () => clickImage(),
    },
    {
      name: 'gif',
      img: '/community/gif.svg',
    },
    {
      name: 'emoji',
      img: '/community/emoji.svg',
    },
    {
      name: 'mention',
      img: '/community/mention.svg',
    },
  ];

  useEffect(() => {
    const uploadInput = inputRef.current;
    uploadInput?.addEventListener('input', handleuploadImage, false);
    return () => {
      uploadInput?.removeEventListener('input', handleuploadImage);
    };
  }, []);

  const handlePostSend = throttle(
    async function () {
      const token = Cookies.get('token');
      if (token && user) {
        let imgUrl: any = null;
        try {
          setPublishing(true);
          if (img !== null) {
            const at = {
              method: 'post',
              url: '/api/v1/upload/image',
              data: img,
              token,
            };
            imgUrl = await getAll(at);
          }
          if (imgUrl !== null) {
            if (!imgUrl || imgUrl?.status !== 200) {
              return NotificationChange('warning', t('Market.fail'));
            }
          }
          const data = {
            content: value,
            imageList: imgUrl?.data?.url ? [imgUrl.data.url] : undefined,
          };
          let params;
          let url = '';
          if (type === 'comment') {
            params = {
              postId: postData.postId,
              content: value,
            };
            url = '/api/v1/post/comment';
          }
          if (type === 'post') {
            params = {
              uid: user?.uid,
              address: user?.address,
              post: data,
            };
            url = '/api/v1/post/publish';
          }
          if (type === 'reply') {
            params = {
              targetId: postData.id,
              content: value,
            };
            url = '/api/v1/reply';
          }
          const result: any = await getAll({
            method: 'post',
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
          setValue('');
          if (result && result.status === 200) {
            changeRefresh?.(true);
          }
        } catch (e) {
          NotificationChange('error', t('Market.pub'));
          setPublishing(false);
        }
      } else {
        NotificationChange('warning', t('Market.line'));
      }
    },
    1500,
    { trailing: false }
  );

  const handleChangeValue = (value: string, img: unknown) => {
    if (value === '' && img === null) {
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
  const change = (e: any) => {
    setValue(value + e.native);
  };
  const content = (
    <Picker
      data={emojiData}
      previewPosition={'none'}
      emojiButtonSize={'33'}
      searchPosition={'none'}
      maxFrequentRows={'0'}
      perLine={'5'}
      emojiSize={'16'}
      onEmojiSelect={change}
    />
  );
  return (
    <>
      <div className="community-content-post-send">
        <div className="community-content-post-send-input">
          <TextArea
            autoSize={{ minRows: 3 }}
            value={value}
            placeholder={t('Community.Share your insights...')}
            onChange={(e) => {
              setValue(e.target.value);
              handleChangeValue(e.target.value, img);
            }}
          />
        </div>
        <div className="post">
          <div className="post-send-tools-icon">
            {toolsIcon.map((data: any, ind: number) => {
              if (data.name === 'emoji') {
                return (
                  <Popover
                    content={content}
                    key={ind}
                    overlayClassName={'sendPostClass'}
                    trigger="click"
                  >
                    <img loading={'lazy'} alt={''} src={data.img} />
                  </Popover>
                );
              } else {
                return (
                  <img
                    key={ind}
                    loading={'lazy'}
                    alt={''}
                    src={data.img}
                    onClick={data.onClick}
                  />
                );
              }
            })}
          </div>
          <div className="post-send-tools-button">
            <Button
              onClick={handlePostSend}
              disabled={sendDisable}
              loading={publishing}
            >
              {t('Community.Post')}
            </Button>
          </div>
        </div>
      </div>
      <div className="post-send-imgList">
        {imgPreview && (
          <div className="post-send-imgList-delete">
            <img loading={'lazy'} src={imgPreview} alt="" />
            <Button
              size="small"
              icon={<CloseOutlined />}
              shape="circle"
              onClick={() => clearImg()}
            />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        name="file"
        id="img-load"
        accept="image/*"
        style={{ display: 'none' }}
      />
    </>
  );
}

export default SendPost;
