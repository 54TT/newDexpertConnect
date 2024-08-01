import Back from '../../../component/Background';
import './index.less';
export default function result() {
  return (
    <div className="resultBox">
      <Back
        style={{
          top: '40%',
          left: '0%',
          transform: 'translateX(-30%)',
          bottom: undefined,
        }}
      />
    </div>
  );
}
