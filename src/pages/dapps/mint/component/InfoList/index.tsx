import './index.less';
function InfoList({ data, className }: { data: any; className?: string }) {
  return (
    <div className={`info-list mint-scroll ${className}`}>
      {data.map((item, index) => (
        <div key={index} className="info-list-item">
          <span>{item.label}：</span>
          <span>{item.show ?? item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default InfoList;
