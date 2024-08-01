import Back from '../../../component/Background';
import './index.less';
export default function result() {
  return (
    // resultBack.svg
    <div className="resultBox">
      <div className='back'>

      </div>
      <Back
        style={{
          top: '40%',
          left: '0%',
          transform: 'translateX(-30%)',
          bottom: 'initial',
        }}
      />
    </div>
  );
}
