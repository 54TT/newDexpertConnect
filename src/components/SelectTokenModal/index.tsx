import { Modal, ModalProps } from 'antd';
import SelectToken from '../SelectToken';
interface SelectTokenModalType extends ModalProps {
  onChange: (data: any) => void;
}

function SelectTokenModal({ onChange, ...props }: SelectTokenModalType) {
  return (
    <Modal {...props} footer={null}>
      <SelectToken onChange={onChange} />
    </Modal>
  );
}

export default SelectTokenModal;
