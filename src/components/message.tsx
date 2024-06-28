import { notification } from 'antd';
function NotificationChange(status: string, data: string, description?: any) {
  notification.open({
    className: `allNotificationStyle ${status === 'success' ? 'allNotificationSucc' : status === 'error' ? 'allNotificationErr' : 'allNotificationWarn'}`,
    message: (
      <div className="content">
        <img
          src={
            status === 'success'
              ? '/messageSucc.svg'
              : status === 'error'
                ? '/messageErr.svg'
                : '/messageWarn.svg'
          }
          alt=""
        />
        <span>{data}</span>
        <div className="backLeft"></div>
        <div className="backRight"></div>
      </div>
    ),
    key: data + status,
    placement: 'topRight',
    duration: 3.5,
    btn: null,
    description: description,
    onClick: () => {
      notification.destroy(data + status);
    },
  });
}
export default NotificationChange;
