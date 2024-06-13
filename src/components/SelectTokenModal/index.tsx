import { Modal, ModalProps } from 'antd';
import SelectToken from '../SelectToken';
import './index.less';
interface SelectTokenModalType extends ModalProps {
  onChange: (data: any) => void;
}

function SelectTokenModal({ onChange, ...props }: SelectTokenModalType) {
  return (
    <Modal
      {...props}
      centered
      wrapClassName="select-token-modal"
      title="Select Token"
      footer={null}
    >
      <SelectToken onChange={onChange} />
    </Modal>
  );
}

export default SelectTokenModal;
