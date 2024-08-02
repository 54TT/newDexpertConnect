import { Button, ButtonProps } from 'antd';
import './index.less';
interface MintBottomButtonProps extends ButtonProps {
  text: any;
  onClick: () => void;
  bottom?: boolean;
  loading?: boolean;
  isBack?: boolean;
  classname?: any;
}
function BottomButton({
  text,
  onClick,
  bottom = false,
  loading = false,
  isBack,
  classname,
  ...props
}: MintBottomButtonProps) {
  return (
    <div
      className={`mint-bottom-button ${bottom ? 'mint-fix-bottom' : ''}  ${isBack !== undefined ? (isBack ? 'buttonBack' : 'buttonHave') : ''}  ${classname}`}
    >
      <Button
        className={`action-button `}
        loading={loading}
        onClick={onClick}
        iconPosition={'end'}
        {...props}
      >
        {text}
      </Button>
    </div>
  );
}

export default BottomButton;
