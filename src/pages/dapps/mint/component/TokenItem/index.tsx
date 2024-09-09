import Copy from '@/components/copy';
import './index.less';
export type ItemDataType = {
  title?: string | React.ReactNode; // 左上
  desc?: string | React.ReactNode; // 左下
  remark?: string | React.ReactNode; // 右上
  tips?: string | React.ReactNode; // 右下
  id?: string;
  address?: string;
  [x: string]: any;
};

interface TokenItemPropsType {
  onClick?: (data: ItemDataType) => void;
  data: ItemDataType;
  classname?: any;
}

function TokenItem({ onClick, data, classname }: TokenItemPropsType) {
  const { symbol, name, address, logo } = data;
  return (
    <div
      className={` launch-token-item  ${classname}`}
      onClick={() => onClick?.(data)}
      style={{ cursor: 'pointer', justifyContent: 'space-between' }}
    >
      <div className="launch-token-item-info">
        <img
          className="launch-token-item-info-logo"
          src={logo ? logo : '/default-edit-icon.png'}
          alt=""
        />
        <div className="launch-token-item-detail">
          <div className="launch-token-item-detail-symbol">{symbol}</div>
          <div className="launch-token-item-detail-name">{name}</div>
          <div className="launch-token-item-detail-address">
            <span>CA:{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
            <Copy img={'/copy-icon.svg'} name={address} change={true} />
          </div>
        </div>
      </div>
      <div className="launch-token-item-arrow">
        <img src="/arrow-right.png" alt="" />
      </div>
    </div>
  );
}

export default TokenItem;
