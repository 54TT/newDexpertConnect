import { Input, InputProps } from 'antd';
import { ChangeEvent, useState } from 'react';

interface InputWithBigNumberProps extends Omit<InputProps, 'onChange'> {
  onChange: (v: string) => void;
}
function InputNumberWithString({ value, onChange }: InputWithBigNumberProps) {
  // 判断数字的正则
  const validNumberRegex = /^(0$|^[1-9]\d*$|^\d*\.\d*[1-9]\d*$)/;
  const [showValue, setShowValue] = useState<any>(value);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === '0') onChange(value);
    if (validNumberRegex.test(event.target.value)) {
      onChange(value);
    }
    setShowValue(value);
  };
  return (
    <Input
      value={showValue}
      onChange={(v) => handleOnChange(v)}
      onBlur={() => setShowValue(value)}
    />
  );
}

export default InputNumberWithString;
