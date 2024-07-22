import { Button } from 'antd';
import './index.less';
interface MintBottomButtonProps {
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
}: MintBottomButtonProps) {
  return (
    <div className={`mint-bottom-button ${bottom ? 'mint-fix-bottom' : ''}`}>
      <Button className="action-button" loading={loading} onClick={onClick}>
        {text}
      </Button>
    </div>
  );
}

export default BottomButton;
