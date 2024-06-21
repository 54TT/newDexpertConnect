import { Radio } from 'antd';
import './index.less';
import classnames from 'classnames';

interface PassCardRadioItemType {
  className?: string;
  src: string;
  name: string;
  desc: string;
  onClick?: (v: any) => void;
  checked: boolean;
  radioValue: string;
  disable?: boolean;
  showRadio?: boolean;
}

function PassCardRadioItem({
  className,
  src,
  name,
  desc,
  onClick,
  checked,
  radioValue,
  disable = false,
  showRadio = true,
}: PassCardRadioItemType) {
  return (
    <div
      className={classnames(
        'pass-card-item',
        { 'pass-card-disable': disable },
        className
      )}
      onClick={() => {
        if (disable) {
          return;
        }
        onClick?.(radioValue);
      }}
    >
      <div className="pass-card-item-info">
        <div className="dis">
          {src && <img src={src} alt="" />}
          <div>
            <div style={{ marginLeft: '12px', fontSize: '14px' }}>{name}</div>
            <div
              style={{ marginLeft: '12px', fontSize: '12px', color: '#333' }}
            >
              {desc}
            </div>
          </div>
        </div>
        {showRadio && (
          <Radio value={radioValue} disabled={disable} checked={checked} />
        )}
      </div>
    </div>
  );
}

export default PassCardRadioItem;
