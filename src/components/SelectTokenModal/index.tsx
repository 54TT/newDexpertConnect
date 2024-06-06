import { Modal } from 'antd';
import SelectToken from '../SelectToken';
interface SelectTokenModalType {
  onChange: (data: any) => void;
}

function SelectTokenModal({ onChange }: SelectTokenModalType) {


  const onchange = () => {
    onChange()
  }

  return <Modal >
    <SelectToken onChange={(data) => } />
  </Modal>;
}

export default SelectTokenModal;
