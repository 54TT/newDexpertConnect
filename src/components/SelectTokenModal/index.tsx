import { Modal } from 'antd';
import SelectToken from '../SelectToken';
interface SelectTokenModalType {
  onChange: (data: any) => void;
}

function SelectTokenModal({ onChange }: SelectTokenModalType) {
  return (
    <Modal>
      <SelectToken onChange={onChange} />
    </Modal>
  );
}

export default SelectTokenModal;
