import { Button } from 'antd';
import './index.less';
export default function BottomActionButton({
  onOk,
  onCancel,
  okText,
  cancelText = '',
  loading = false,
}) {
  return (
    <div className="bottom-action-button">
      {cancelText && (
        <Button className="action-button" ghost onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      <Button className="action-button" loading={loading} onClick={onOk}>
        {okText}
      </Button>
    </div>
  );
}
