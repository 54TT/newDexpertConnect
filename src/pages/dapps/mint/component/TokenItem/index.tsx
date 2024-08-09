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
  // const { title, remark, desc, tips } = data;
  const { title, desc, status } = data;
  return (
    <div
      className={` launch-token-item  ${classname}`}
      onClick={() => onClick?.(data)}
      style={{ cursor: 'pointer', justifyContent: 'space-between' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {title && (
          <div className="launch-token-item-title">
            {title.toString().replace('/', ' / ')}
          </div>
        )}
        {desc && <div className="launch-token-item-desc">{desc}</div>}
      </div>
      <div style={{color:'rgba(255,255,255,0.55)',fontSize:'14px'}}>{status}</div>
    </div>
  );
}

export default TokenItem;
