import { Button, ButtonProps } from 'antd';
import './index.less';
interface MintBottomButtonProps extends ButtonProps {
  text: string;
  onClick: () => void;
  bottom?: boolean;
  loading?: boolean;
  isBack?: boolean;
}
function BottomButton({
  text,
  onClick,
  bottom = false,
  loading = false,
  isBack,
  ...props
}: MintBottomButtonProps) {
  return (
    <div className={`mint-bottom-button ${bottom ? 'mint-fix-bottom' : ''}`}>
      <Button
        className={`action-button `}
        style={{ backgroundColor: isBack ? 'gray' : '' }}
        loading={loading}
        onClick={onClick}
        {...props}
      >
        {text}
      </Button>
    </div>
  );
}

export default BottomButton;
