import { LeftOutlined } from '@ant-design/icons';
import './index.less';
import { useNavigate } from 'react-router-dom';
interface PageHeaderProps {
  arrow: boolean;
  title: string | React.ReactNode;
  desc: string | React.ReactNode;
}
function PageHeader({ arrow, title, desc }: PageHeaderProps) {
  const history = useNavigate();
  return (
    <div className="launch-header">
      <div className="launch-header-row">
        <div className="launch-header-arrow-left">
          {arrow ? (
            <LeftOutlined
              className="launch-header-arrow-left-icon"
              onClick={() => history(-1)}
            />
          ) : null}
        </div>
        <div className="launch-header-center">
          <div className="launch-header-title">{title}</div>
        </div>
        <div className="launch-header-right"></div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginLeft: '24px',
        }}
      >
        <div className="launch-header-desc">{desc}</div>
      </div>
    </div>
  );
}

export default PageHeader;
