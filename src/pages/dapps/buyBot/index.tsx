import '../in.less';
import { useContext } from 'react';
import { CountContext } from '@/Layout';
import { useTranslation } from 'react-i18next';
export default function index() {
  const { t } = useTranslation();
  const { browser }: any = useContext(CountContext);
  return (
    <div style={{ width: browser ? '24%' : '75%' }} className="buybotBox">
      <div className="logoNow" >
        <img src="/buyBotLogo.png" alt="" />
      </div>
      <div
        style={{ width: browser ? '80%' : '50%' }}
        className="link"
        onClick={() => {
          window.open('https://t.me/dexpertbuybot');
        }}
      >
        {t('token.Go')}
      </div>
    </div>
  );
}
