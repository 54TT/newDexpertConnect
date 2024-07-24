import { Button, ButtonProps } from 'antd';
import './index.less';
interface MintBottomButtonProps extends ButtonProps {
  text: string;
  onClick: () => void;
  bottom?: boolean;
  loading?: boolean;
}
function BottomButton({
  text,
  onClick,
  bottom = false,
  loading = false,
  ...props
}: MintBottomButtonProps) {
  return (
    <div className={`mint-bottom-button ${bottom ? 'mint-fix-bottom' : ''}`}>
      <Button
        className="action-button"
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
