import { Popconfirm, PopconfirmProps } from 'antd';
import { useState } from 'react';
import './index.less';
import { CloseOutlined } from '@ant-design/icons';

interface AdvConfigProps {
  onClose: (data: any) => void;
}

// 高级设置
function AdvConfig({ onClose }: AdvConfigProps) {
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const Title = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <span className="popup-title">Advanced setting</span>
      <CloseOutlined
        style={{ color: '#fff', cursor: 'pointer', padding: '4px' }}
        onClick={() => {
          onClose?.(data);
          setOpen(false);
        }}
      />
    </div>
  );

  return (
    <Popconfirm
      overlayClassName="adv-config-pop"
      title={<Title />}
      open={open}
      icon={null}
      description={
        <SettingContent data={data} onChange={() => console.log('onChang')} />
      }
    >
      <img
        style={{
          float: 'right',
          margin: '0 10px 12px 0',
          padding: '4px',
          width: '20px',
          cursor: 'pointer',
        }}
        src="/setting.svg"
        alt=""
        onClick={() => setOpen(true)}
      />
    </Popconfirm>
  );
}

const SettingContent = ({ data, onChange }) => {
  return (
    <div className="setting-content">
      <div className="setting-item">
        <span>Maximum Slip</span>
      </div>
      <div className="setting-item">
        <span>Trade Deadline</span>
      </div>
    </div>
  );
};

export default AdvConfig;
