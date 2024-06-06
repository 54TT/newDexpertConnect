import { Modal, ModalProps } from 'antd';
import classNames from 'classnames';
import React from 'react';
import './index.less';
export interface CommonModalPropsType extends React.PropsWithChildren, ModalProps {
  className: string;

}
const CommonModal = ({ className, ...props }: CommonModalPropsType) => {

  return <Modal  {...props}  destroyOnClose centered  maskClosable={false} className={classNames('common-modal', className)} >
    {props.children}
  </Modal>
}

export default CommonModal