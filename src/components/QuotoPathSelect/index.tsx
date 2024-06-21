import SelectComp, { SelectCompItemType } from '../SelectComp';

function QuotoPathSelect({ data, onChange }) {
  const WrapTitle = ({ text }) => (
    <div
      className="disCen"
      style={{
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '300',
        marginRight: '4px',
      }}
    >
      <img
        style={{ width: '24px', marginRight: '8px', marginBottom: '4px' }}
        src="/uniswap-uni-logo.svg"
        alt=""
      />
      <span style={{ display: 'inline-block', width: '80px' }}>{text}</span>
    </div>
  );
  const list: SelectCompItemType[] = [
    {
      label: <WrapTitle text="Uniswap V2" />,
      key: '0',
      title: <WrapTitle text="Uniswap V2" />,
    },
    {
      label: <WrapTitle text="Uniswap V3" />,
      key: '1',
      title: <WrapTitle text="Uniswap V3" />,
    },
  ];
  return <SelectComp list={list} data={data} onChange={onChange} />;
}

export default QuotoPathSelect;
