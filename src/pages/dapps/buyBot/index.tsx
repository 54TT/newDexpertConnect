import '../in.less';
import { useContext } from 'react';
import { CountContext } from '../../../Layout';
export default function index() {
  const { browser }: any = useContext(CountContext);
  return (
    <div style={{ width: browser ? '22%' : '85%' }} className="buybotBox">
      <div className="logo" style={{ width: browser ? '80%' : '50%' }}>
        <img src="/buyBotLogo.png" alt="" />
      </div>
      <div
        style={{ width: browser ? '80%' : '50%' }}
        className="link"
        onClick={() => {
          window.open('https://t.me/BuyTest1Bot');
        }}
      >
        launch on telegram
      </div>
    </div>
  );
}
