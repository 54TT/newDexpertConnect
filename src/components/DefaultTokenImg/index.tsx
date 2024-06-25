import './index.less';
function DefaultTokenImg({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="default-token-img">
      {icon ? (
        <img src={icon} alt="" />
      ) : (
        <div className="token-name-img">
          <span>{name?.charAt?.(0) || ''}</span>
        </div>
      )}
    </div>
  );
}

export default DefaultTokenImg;
