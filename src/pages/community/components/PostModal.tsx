import { CloseOutlined } from '@ant-design/icons';
import { Modal, ModalProps, Button } from 'antd'
import classNames from 'classnames';
import React from 'react';
import SendPost from './SendPost';
interface PostSendModaltypeProps extends React.PropsWithChildren {
  open: boolean;
  onPublish: () => void;
  onClose: () => void;
  className?: string;
  modalProps?: ModalProps
}



function PostSendModal({ open, modalProps, className = "", onClose, ...props }: PostSendModaltypeProps) {
  const ModalTitle = () => {
    return <>
      <Button icon={<CloseOutlined />} shape="circle" type="text" onClick={() => onClose()} />
      <span>Draft</span>
    </>
  }
  return <Modal width='600px' title={<ModalTitle />} className={classNames(className, 'post-send-modal')} open={open} {...modalProps} footer={null} closeIcon={null}>
    <SendPost onPublish={(data) => console.log(data)} />
  </Modal>
}

export default PostSendModal;