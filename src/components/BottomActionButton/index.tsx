import { Button } from 'antd';
import './index.less';
export default function BottomActionButton({
  onOk,
  onCancel,
  okText,
  cancelText,
}) {
  return (
    <div className="bottom-action-button">
      <Button className="action-button" ghost onClick={onCancel}>
        {cancelText}
      </Button>
      <Button className="action-button" onClick={onOk}>
        {okText}
      </Button>
    </div>
  );
}
