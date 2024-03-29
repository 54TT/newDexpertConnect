import { Button, Input, message } from 'antd';
import { request } from '../../../../utils/axios';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { CloseOutlined } from '@ant-design/icons';
const { TextArea } = Input;

export interface UploadDataType {
  content: string;
  imgList: string;
}

interface SendPostPropsType {
  onPublish: (data: UploadDataType) => void;
}

function SendPost({ onPublish }: SendPostPropsType) {
  const [img, setImg] = useState<any>(null);
  const [imgPreview, setImgPreview] = useState<any>(null);
  const [value, setValue] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [sendDisable, setSendDisable] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState({});
  const clickImage = () => {
    inputRef?.current?.click?.();
  }

  const handleuploadImage = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png']; // 允许的图片类型
    const uploadInput = inputRef?.current
    const fileType = file.type;
    if (!allowedTypes.includes(fileType)) {
      messageApi.warning('Only images in JPEG and PNG formats can be uploaded');
      if (uploadInput?.value) {
        // 清空输入框的值，防止上传无效文件
        uploadInput.value = ""
      }
    } else {
      const previewImg = URL.createObjectURL(file);
      setImg(file);
      setImgPreview(previewImg)
      handleChangeValue(value, file);
    }
  }


  const toolsIcon = [
    {
      name: 'image',
      img: '/community/image.svg',
      onClick: () => clickImage()
    },
    {
      name: 'gif',
      img: '/community/gif.svg'
    },
    {
      name: 'emoji',
      img: '/community/emoji.svg'
    },
    {
      name: 'mention',
      img: '/community/mention.svg'
    }
  ]

  useEffect(() => {
    const uploadInput = inputRef.current
    uploadInput?.addEventListener('input', handleuploadImage, false);
    return () => {
      uploadInput?.removeEventListener('input', handleuploadImage);
    }
  }, [])

  const handlePostSend = async () => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');

    let imgUrl = null;
    try {
      setPublishing(true);
      if (img !== null) {
        imgUrl = await request('post', '/api/v1/upload/image', img, token);
      }

      if (imgUrl !== null) {
        if (imgUrl === 'please') {
          console.log('please loding');
        } else if (!imgUrl || imgUrl?.status !== 200) {
          return messageApi.open({
            type: 'warning',
            content: 'Upload failed, please upload again!',
          });
        }
      }

      const data = {
        content: value,
        imageList: imgUrl?.data?.url ? [imgUrl.data.url] : undefined,
      }

      const result = await request('post', "/api/v1/post/publish", {
        uid: username?.uid,
        address: username?.address,
        post: data
      }, token)
      setPublishing(false);
      clearImg();
      setValue('')
      onPublish(result);
      const event = new CustomEvent("publish-post");
      document.dispatchEvent(event);
    } catch (e) {
      console.error(e);
      messageApi.error('Publishing failed')
      setPublishing(false);
    }

  }

  const handleChangeValue = (value: string, img: unknown) => {

    if (value === '' && img === null) {
      setSendDisable(true);
    } else {
      setSendDisable(false);
    }
  }

  const clearImg = () => {
    handleChangeValue(value, null);
    setImg(null)
    setImgPreview(null)

    const uploadInput = inputRef?.current;
    // 清空value，触发input事件

    if (uploadInput?.value) {
      uploadInput.value = null
    }
  }

  useEffect(() => {
    const user = Cookies.get('username');
    if (user) {
      setUser(JSON.parse(user));
      console.log(JSON.parse(user));
    }
  }, [])

  return <>
    {contextHolder}
    <div className="community-content-post-send">
      <div className="community-content-post-send-avatar">
        <img src={user?.avatarUrl || '/logo.svg'} alt="" />
      </div>
      <div className="community-content-post-send-input">
        <TextArea value={value} autoSize variant="borderless" placeholder='Share your insights...' onChange={(e) => {
          setValue(e.target.value)
          handleChangeValue(e.target.value, img)
        }} />
      </div>
    </div>
    <div className='post-send-imgList'>
      {
        imgPreview ? <div className='post-send-imgList-delete' >
          <img src={imgPreview} alt="" />
          <Button size='small' icon={<CloseOutlined />} shape="circle" onClick={() => clearImg()} />
        </div> : <></>
      }
    </div>
    <div className='post-send-tools'>
      <div className='post-send-tools-icon'>
        {
          toolsIcon.map((data) => <img key={data.name} src={data.img} onClick={data.onClick} />)
        }
      </div>
      <div className='post-send-tools-button'>
        <Button onClick={() => handlePostSend()} disabled={sendDisable} loading={publishing} >Post</Button>
      </div>
    </div>
    <input ref={inputRef} type="file" name="file" id='img-load' accept="image/*" style={{ display: 'none' }} />
  </>
}

export default SendPost;