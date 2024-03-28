import { Modal, ModalProps } from 'antd';
import classNames from 'classnames';
import React from 'react';
export interface CommonModalPropsType extends React.PropsWithChildren {
  visible: boolean;
  className: string;
  antdModalProps: ModalProps
}
const CommonModal = ({ visible, className, antdModalProps, ...props }: CommonModalPropsType) => {

  return <Modal open={visible}  {...antdModalProps} className={classNames('common-modal', className)} >
    {props.children}
  </Modal>
}

export default CommonModal