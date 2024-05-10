import { CloseOutlined } from '@ant-design/icons';
import { Modal, ModalProps, Button } from 'antd'
import classNames from 'classnames';
import React from 'react';
import SendPost from './SendPost';
interface PostSendModaltypeProps extends React.PropsWithChildren {
  open: boolean;
  onPublish: (data: any) => void;
  onClose: () => void;
  className?: string;
  modalProps?: ModalProps
  content?: React.ReactNode;
  type?: 'comment' | 'reply' | 'post'
  postData?: any;
}
function PostSendModal({ open, modalProps, className = "", onClose, content, onPublish, ...props }: PostSendModaltypeProps) {
  const ModalTitle = () => {
    return <>
      <Button icon={<CloseOutlined />} shape="circle" type="text" onClick={() => onClose()} />
    </>
  }
  return <Modal destroyOnClose centered  width='600px' maskClosable={false} title={<ModalTitle />} className={classNames(className, 'post-send-modal')} open={open} {...modalProps} footer={null} closeIcon={null}>
    {content || <></>}
    <SendPost onPublish={onPublish} {...props} />
  </Modal>
}

export default PostSendModal;