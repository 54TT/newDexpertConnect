import { Modal, ModalProps } from 'antd';
import SelectToken from '../SelectToken';
import './index.less';
import { ID_TO_CHAIN_NAME_LOW } from '@utils/constants';
import { useMemo } from 'react';
interface SelectTokenModalType extends ModalProps {
  onChange: (data: any) => void;
  chainId: string;
  disabledTokens: string[];
}

function SelectTokenModal({
  onChange,
  chainId,
  disabledTokens,
  ...props
}: SelectTokenModalType) {
  const chainName = useMemo(() => ID_TO_CHAIN_NAME_LOW[chainId], [chainId]);
  console.log(props?.open);
  return (
    <Modal
      {...props}
      centered
      wrapClassName="select-token-modal"
      title="Select Token"
      footer={null}
    >
      <SelectToken
        open={props?.open}
        onChange={onChange}
        chainName={chainName}
        disabledTokens={disabledTokens}
      />
    </Modal>
  );
}

export default SelectTokenModal;
