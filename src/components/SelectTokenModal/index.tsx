import { Modal, ModalProps } from 'antd';
import React,{ useMemo } from 'react';
const SelectToken = React.lazy(() => import('../SelectToken'));

import './index.less';
import { ID_TO_CHAIN_NAME_LOW } from '@utils/constants';
import { useTranslation } from 'react-i18next';
interface SelectTokenModalType extends ModalProps {
  onChange: (data: any) => void;
  chainId: string;
  disabledTokens?: string[];
  disabled?: boolean;
}

function SelectTokenModal({
  onChange,
  chainId,
  disabledTokens,
  disabled,
  ...props
}: SelectTokenModalType) {
  const chainName = useMemo(() => ID_TO_CHAIN_NAME_LOW[chainId], [chainId]);
  const { t } = useTranslation();
  return (
    <Modal
      {...props}
      destroyOnClose
      centered
      wrapClassName="select-token-modal"
      title={t('Slider.Select Token')}
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
