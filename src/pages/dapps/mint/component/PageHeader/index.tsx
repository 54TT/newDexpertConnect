import { LeftOutlined } from '@ant-design/icons';
import './index.less';
import { useNavigate } from 'react-router-dom';
interface PageHeaderProps {
  arrow?: boolean;
  title?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  className?: string;
}
function PageHeader({
  arrow = true,
  title = '',
  desc = '',
  className = '',
}: PageHeaderProps) {
  const history = useNavigate();
  return (
    <div className={`launch-header ${className}`}>
      <div className="launch-header-row">
        <div className="launch-header-arrow-left">
          {arrow && (
            <LeftOutlined
              className="launch-header-arrow-left-icon"
              onClick={() => history(-1)}
            />
          )}
        </div>
        <div className="launch-header-center">
          {title && <div className="launch-header-title">{title}</div>}
        </div>
        <div className="launch-header-right"></div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {desc && <div className="launch-header-desc">{desc}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
