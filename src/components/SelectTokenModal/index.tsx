import { Modal, ModalProps } from 'antd';
import SelectToken from '../SelectToken';
import './index.less';
interface SelectTokenModalType extends ModalProps {
  onChange: (data: any) => void;
}

function SelectTokenModal({
  onChange,
  chainId,
  ...props
}: SelectTokenModalType) {
  return (
    <Modal
      {...props}
      centered
      wrapClassName="select-token-modal"
      title="Select Token"
      footer={null}
    >
      <SelectToken onChange={onChange} chainId={chainId} />
    </Modal>
  );
}

export default SelectTokenModal;
