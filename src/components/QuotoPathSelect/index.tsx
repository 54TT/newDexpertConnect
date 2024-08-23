import SelectComp, { SelectCompItemType } from '../SelectComp';
import './index.less';
function QuotoPathSelect({ data, onChange, chainId }) {
  const WrapTitle = ({ text, icon, className = '' }) => (
    <div
      className={`disCen quoto-item ${className}`}
      style={{
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '300',
        marginRight: '4px',
      }}
    >
      <img src={icon} alt="" />
      <span style={{ display: 'inline-block' }}>{text}</span>
    </div>
  );

  const QuotoPathList: Record<string, SelectCompItemType[]> = {
    default: [
      {
        key: '0',
        title: <WrapTitle text="Uniswap V2" icon={'/uniswap-uni-logo.svg'} />,
        label: <WrapTitle text="Uniswap V2" icon={'/uniswap-uni-logo.svg'} />,
      },
      {
        key: '1',
        title: <WrapTitle text="Uniswap V3" icon={'/uniswap-uni-logo.svg'} />,
        label: <WrapTitle text="Uniswap V2" icon={'/uniswap-uni-logo.svg'} />,
      },
    ],
    '71': [
      {
        key: '0',
        title: (
          <WrapTitle
            text="Swappi"
            icon={'/swappi.png'}
            className="swappi-logo"
          />
        ),
        label: (
          <WrapTitle
            text="Swappi"
            icon={'/swappi.png'}
            className="swappi-logo"
          />
        ),
      },
    ],
    '1030': [
      {
        key: '0',
        title: (
          <WrapTitle
            text="Swappi"
            icon={'/swappi.png'}
            className="swappi-logo"
          />
        ),
        label: (
          <WrapTitle
            text="Swappi"
            icon={'/swappi.png'}
            className="swappi-logo"
          />
        ),
      },
    ],
  };

  return (
    <SelectComp
      list={QuotoPathList[chainId] ?? QuotoPathList['default']}
      data={data}
      onChange={onChange}
    />
  );
}

export default QuotoPathSelect;
