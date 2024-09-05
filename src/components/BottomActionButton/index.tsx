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
      <Button className="action-button" ghost onClick={onOk}>
        {cancelText}
      </Button>
      <Button className="action-button" onClick={onCancel}>
        {okText}
      </Button>
    </div>
  );
}
