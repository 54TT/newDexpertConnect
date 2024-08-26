import { InputNumber, InputNumberProps } from 'antd';
import classnames from 'classnames';
import './index.less';
import { valueType } from 'antd/es/statistic/utils';
interface ProInputPropsType {
  inputNumberProps?: InputNumberProps<number>;
  value: InputNumberProps['value'];
  onChange: (data: valueType) => void;
  style?: React.CSSProperties;
  className?: string;
}

function ProInputNumber({
  value,
  inputNumberProps,
  onChange,
  style,
  className,
}: ProInputPropsType) {
  return (
    <div className={classnames('pro-input', className)} style={style}>
      <InputNumber
        {...inputNumberProps}
        value={value}
        onChange={(value) => onChange(value)}
      />
    </div>
  );
}

export default ProInputNumber;
