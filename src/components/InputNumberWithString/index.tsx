import { Button, InputNumber, InputProps } from 'antd';
import './index.less';
interface InputWithBigNumberProps extends Omit<InputProps, 'onChange'> {
  onChange: (v: string) => void;
  balance: string;
  clickMax: () => void;
  addonUnit?: string;
}
function InputNumberWithString({
  value,
  onChange,
  balance,
  clickMax,
  addonUnit = '',
}: InputWithBigNumberProps) {
  return (
    <div className="input-number-string">
      <div
        style={{
          textAlign: 'end',
          marginBottom: '12px',
          fontSize: '14px',
          color: 'rgba(139, 139, 139, 1)',
        }}
      >
        Balance: {balance}
      </div>
      <InputNumber
        value={value}
        addonAfter={
          <div>
            <span>{addonUnit}</span>
            <Button className="action-button" ghost onClick={clickMax}>
              Max
            </Button>
          </div>
        }
        controls={false}
        stringMode={true}
        onChange={onChange}
      />
    </div>
  );
}

export default InputNumberWithString;
