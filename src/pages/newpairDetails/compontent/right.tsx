import { useContext } from 'react';
import { CountContext } from '../../../Layout.tsx';
function Right() {
  const { browser }: any = useContext(CountContext);

  return (
    <div className={'right'} style={{ width: browser ? '21%' : '100%' }}>
      <div className="box">
        <p className="Swap">Swap</p>
      </div>
    </div>
  );
}

export default Right;
