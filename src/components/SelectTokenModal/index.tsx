import { Modal, ModalProps } from 'antd';
import SelectToken from '../SelectToken';
import './index.less';
import { ID_TO_CHAIN_NAME_LOW } from '@utils/constants';
import { useMemo } from 'react';
interface SelectTokenModalType extends ModalProps {
  onChange: (data: any) => void;
  chainId: string;
  disabledTokens: string[];
  disabled: boolean;
}

function SelectTokenModal({
  onChange,
  chainId,
  disabledTokens,
  disabled,
  ...props
}: SelectTokenModalType) {
  const chainName = useMemo(() => ID_TO_CHAIN_NAME_LOW[chainId], [chainId]);

  return (
    <Modal
      {...props}
      destroyOnClose
      centered
      wrapClassName="select-token-modal"
      title="Select Token"
      footer={null}
    >
      <SelectToken
        onChange={onChange}
        chainName={chainName}
        disabledTokens={disabledTokens}
      />
    </Modal>
  );
}

export default SelectTokenModal;
