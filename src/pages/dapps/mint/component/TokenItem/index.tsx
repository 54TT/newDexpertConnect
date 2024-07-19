import './index.less';
export type ItemDataType = {
  title: string | React.ReactNode; // 左上
  desc: string | React.ReactNode; // 左下
  remark: string | React.ReactNode; // 右上
  tips: string | React.ReactNode; // 右下
};

interface TokenItemPropsType {
  onClick: (data: ItemDataType) => void;
  data: ItemDataType;
}
function TokenItem({ onClick, data }: TokenItemPropsType) {
  const { title, remark, desc, tips } = data;
  return (
    <div className="launch-token-item" onClick={() => onClick(data)}>
      <div className="dis">
        {title && <div className="launch-token-item-title">{title}</div>}
        {remark && <div className="launch-token-item-remark">{remark}</div>}
      </div>
      <div className="dis">
        {desc && <div className="launch-token-item-desc">{desc}</div>}
        {tips && <div className="launch-token-item-tips">{tips}</div>}
      </div>
    </div>
  );
}

export default TokenItem;
