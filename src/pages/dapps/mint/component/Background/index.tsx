import './index.less';
export default function background({ style }: any) {
  return (
    <div className="backBox" style={style || {}}>
      <img className="cloud-left cloud" src="/cloudLeft.svg" alt="" />
      <img className="rocket" src="/rocket.svg" alt="" />
      <img className="cloud-right cloud" src="/cloudRight.svg" alt="" />
    </div>
  );
}
