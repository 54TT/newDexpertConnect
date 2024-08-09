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
import { chainList } from '@utils/judgeStablecoin';
function TokenItem({ onClick, data, classname }: TokenItemPropsType) {
  const { title, desc, status, contractConfig, tx } = data;
  return (
    <div
      className={` launch-token-item  ${classname}`}
      onClick={() => onClick?.(data)}
      style={{ cursor: 'pointer', justifyContent: 'space-between' }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {title && (
            <div className="launch-token-item-title">
              {title.toString().replace('/', ' / ')}
            </div>
          )}
          {desc && <div className="launch-token-item-desc">{desc}</div>}
        </div>
        {status && <div className="status">{status}</div>}
      </div>
      <p>
        {contractConfig?.chainId && (
          <img
            style={{ width: '20px' }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(contractConfig?.scan + tx);
            }}
            src={
              chainList.filter(
                (i: any) => i.chainId === contractConfig?.chainId?.toString()
              )?.[0]?.icon
            }
            alt=""
          />
        )}
      </p>
    </div>
  );
}

export default TokenItem;
