import { CSSProperties } from 'react';
import './index.less';
function DefaultTokenImg({
  name,
  icon,
  style,
}: {
  name: string;
  icon: string;
  style?: CSSProperties;
}) {
  return (
    <div className="default-token-img" style={style}>
      {icon ? (
        <img src={icon} alt="" />
      ) : (
        <div className="token-name-img">
          <span>{name?.charAt?.(0) || ''}</span>
        </div>
      )}
    </div>
  );
}

export default DefaultTokenImg;
