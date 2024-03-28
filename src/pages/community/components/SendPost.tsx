import { Button, Input, message } from 'antd';
import { request } from '../../../../utils/axios';
import { useEffect, useState } from 'react';
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
  const [uploading, setUploading] = useState(false);
  const [sendDisable, setSendDisable] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const clickImage = () => {
    const uploadInput = document.getElementById('img-load');
    uploadInput?.click();
  }

  const handleuploadImage = (e) => {
    const file = e.target.files[0];
    const previewImg = URL.createObjectURL(file);
    setImg(file);
    setImgPreview(previewImg)
    handleChangeValue(value, file);
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
    const uploadInput = document.getElementById('img-load');
    uploadInput?.addEventListener('input', handleuploadImage, false);
    return () => {
      uploadInput?.removeEventListener('input', handleuploadImage);
    }
  }, [])

  const handlePostSend = async () => {
    const token = Cookies.get('token');
    try {
      setUploading(true);
      const imgUrl = await request('post', '/api/v1/upload/image', img, token);
      if (imgUrl === 'please') {
        console.log('please loding');
      } else if (!imgUrl && imgUrl?.status !== 200) {
        setUploading(false)
        return messageApi.open({
          type: 'warning',
          content: 'Upload failed, please upload again!',
        });
      }
      const data = {
        content: value,
        imgList: imgUrl
      }
      /*       const result = await request('post', "/api/v1/post/publish", {
              uid: user?.uid,
              address: user?.address,
              post: data
          }, token) */
      return;
      onPublish(data as UploadDataType)
    } catch (e) {
      console.error(e);
    }
  }

  const handleChangeValue = (value: string, img: string) => {
    console.log(img);

    if (value === '' && img === '') {
      setSendDisable(true);
    } else {
      setSendDisable(false);
    }
  }

  const clearImg = () => {
    setImg(null)
    setImgPreview(null)
  }

  return <>
    {contextHolder}
    <div className="community-content-post-send">
      <div className="community-content-post-send-avatar">
        <img src='data:image/jpeg;base64,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' alt="" />
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
        imgPreview ? <div>
          <img src={imgPreview} alt="" />
          <Button icon={<CloseOutlined />} shape="circle" type="text" onClick={() => clearImg()} />
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
        <Button onClick={() => handlePostSend} disabled={sendDisable} >Post</Button>
      </div>
    </div>
    <input type="file" name="file" id='img-load' style={{ display: 'none' }} />
  </>
}

export default SendPost;