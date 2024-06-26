import { Popover } from 'antd';
import './index.less';
import { useState } from 'react';
import { throttle } from 'lodash';
interface ChooseChainType {
  onChange: (v: any) => void;
  hideChain?: boolean;
  disabledChain?: boolean;
  wrapClassName?: string;
  chainList: any[];
}

function ChooseChain({
  onChange,
  chainList,
  hideChain = false,
  disabledChain = false,
  wrapClassName,
}: ChooseChainType) {
  const [value, setValue] = useState<any>({
    value: 'Ethereum',
    icon: '/EthereumCoin.svg',
  });

  const [open, setOpen] = useState<any>(false);
  const click = throttle(
    function (i: any) {
      if (value !== i) {
        if (i?.disabled && disabledChain) {
          console.log('rr');
          return;
        }
        if (
          i?.value !== 'Avalanche' &&
          i?.value !== 'Blast' &&
          i?.value !== 'Celo'
        ) {
          setValue(i);
          onChange(i.value);
          setOpen(false);
        }
      }
    },
    1500,
    { trailing: false }
  );
  const handleOpenChange = (newOpen: boolean) => {
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
  return (
    <Popover
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
        <img
          src="/down.svg"
          alt=""
          style={{ width: '10px', marginLeft: '4px' }}
        />
      </div>
    </Popover>
  );
}

export default ChooseChain;
