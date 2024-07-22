import { Popover } from 'antd';
import './index.less';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';
interface ChooseChainType {
  onChange?: (v: any) => void;
  onClick?: (v: any) => void;
  hideChain?: boolean;
  disabledChain?: boolean;
  wrapClassName?: string;
  chainList: any[];
  disabled?: boolean;
  data?: any;
}

function ChooseChain({
  onChange,
  chainList,
  hideChain = false,
  disabledChain = false,
  wrapClassName,
  disabled = false,
  data,
  onClick,
}: ChooseChainType) {
  const [value, setValue] = useState<any>({
    value: 'Ethereum',
    icon: '/EthereumCoin.svg',
    chainId: '1',
    key: '0x1',
  });

  const [open, setOpen] = useState<any>(false);
  const click = throttle(
    function (i: any) {
      if (value !== i) {
        if (i?.disabled && disabledChain) {
          return;
        }
        if (
          i?.value !== 'Avalanche' &&
          i?.value !== 'Blast' &&
          i?.value !== 'Celo'
        ) {
          if (onClick) {
            onClick(i);
          }
          if (onChange) {
            onChange(i.value);
          }
          setOpen(false);
        }
      }
    },
    1500,
    { trailing: false }
  );
  const handleOpenChange = (newOpen: boolean) => {
    if (disabled) return;
    setOpen(newOpen);
  };
  const chain = (
    <div className={`headerChain dis`}>
      {chainList.map((i: any, ind: number) => {
        return (
          <div
            key={ind}
            style={hideChain ? { display: i?.hide ? 'none' : 'flex' } : {}}
            className={'chain disDis'}
            onClick={() => click(i)}
          >
            <img
              src={i?.icon}
              alt=""
              style={{ width: i?.value === 'Arbitrum' ? '20px' : '18px' }}
            />
            <span
              style={{
                color: disabledChain && i.disabled === true ? 'gray' : 'white',
              }}
            >
              {i?.value === 'BSC' ? 'BNB Chain' : i?.value}
            </span>
          </div>
        );
      })}
    </div>
  );
  useEffect(() => {
    if (data?.value) {
      setValue(data);
    }
  }, [data]);
  return (
    <Popover
      className="choose-chain"
      content={chain}
      title=""
      onOpenChange={handleOpenChange}
      placement="bottom"
      open={open}
      trigger="click"
      overlayClassName={`headerPopoverShow ${wrapClassName}`}
    >
      <div className={'boxPopover disDis'}>
        <img src={value?.icon} alt="" style={{ width: '22px' }} />
        {!disabled && (
          <img
            src="/down.svg"
            alt=""
            style={{ width: '10px', marginLeft: '4px' }}
          />
        )}
      </div>
    </Popover>
  );
}

export default ChooseChain;
