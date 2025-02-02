import './index.less';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChangeChain from '@/components/ChangeChain';
interface PageHeaderProps {
  arrow?: boolean;
  title?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  className?: string;
  disabled?: boolean; // 是否可修改链
  name?: any;
  setStep?: any;
}
function PageHeader({
  arrow = true,
  title = '',
  desc = '',
  className = '',
  disabled = true,
  name,
}: PageHeaderProps) {
  const history = useNavigate();
  return (
    <div className={`launch-header ${className}`}>
      <div className="launch-header-row">
        <div className="launch-header-arrow-left">
          {arrow && (
            <img
              src="/backImg.svg"
              alt=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (name === 'tokenList') {
                  history('/dapps/tokencreation');
                } else if (name) {
                  name();
                } else {
                  history(-1);
                }
              }}
            />
          )}
        </div>
        <div className="launch-header-center">
          {title && (
            <div
              className="launch-header-title"
              style={{ whiteSpace: 'nowrap' }}
            >
              {title}
            </div>
          )}
        </div>
        <div
          className={`launch-header-right ${!desc ? 'launch-header-right-line' : ''} `}
        >
          <ChangeChain disabled={disabled} />
        </div>
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
