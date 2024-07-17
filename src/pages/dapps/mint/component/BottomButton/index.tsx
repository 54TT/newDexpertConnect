import { Button } from 'antd';
import './index.less';
interface MintBottomButtonProps {
  text: string;
  onClick: () => void;
}
function BottomButton({ text, onClick }: MintBottomButtonProps) {
  return (
    <div className="mint-bottom-button">
      <Button className="action-button" onClick={onClick}>
        {text}
      </Button>
    </div>
  );
}

export default BottomButton;
