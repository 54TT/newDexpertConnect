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
    <div className="bottom-action-button ">
      {cancelText && (
        <Button className="action-button cancel-button" ghost onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      {okText&&(
        <Button className="action-button confirm-button" loading={loading} onClick={onOk}>
        {okText}
      </Button>
      )}
    </div>
  );
}
