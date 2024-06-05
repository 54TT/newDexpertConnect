// import Conyent from "../../community/components/PostContent.tsx";
import { useContext } from 'react';
import { CountContext } from '../../../Layout.tsx';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const LINK_CREATE = [
  'https://drive.google.com/file/d/1ED7qadkVJMKJazvnqlgVARGR4-RYMCbc/view?usp=sharing',
  'https://t.me/DexpertThorBot',
];
const LINK_sniper = [
  'https://youtu.be/vkKD4GD_awY',
  'https://t.me/DexpertOdinBot',
];
function Center() {
  const { browser }: any = useContext(CountContext);
  const router = useLocation();
  const params: any = useParams();
  const { t } = useTranslation();

  const video = (
    <>
      {params?.id === 'create' ? (
        <p className={'pp'} style={{ marginBottom: '20px' }}>
          {router.pathname === '/app'
            ? t('Dapps.Thor Desc')
            : t('Dapps.Run Tips')}
        </p>
      ) : (
        <>
          <p className={'pp'} style={{ marginBottom: '6px' }}>
            {t('Dapps.a')}
          </p>
          <p className={'pp'} style={{ marginBottom: '6px' }}>
            {t('Dapps.b')}
          </p>
          <p className={'pp'}>{t('Dapps.c')}</p>
        </>
      )}
      <p style={{ color: 'rgb(130,230,150)', margin: '5px 0' }}>
        <span>{t('Dapps.Fee')}:</span>
        <span style={{ marginLeft: '10px' }}>
          {params?.id === 'create' ? '0.08eth' : 'Swap 0.4%, Sniper 0.8%'}
        </span>
      </p>
      <div className={'dis video'} style={{ width: browser ? '85%' : '100%' }}>
        {[
          t('Dapps.Video Guide'),
          t('Dapps.Start on Telegram'),
          t('Dapps.Start on Web'),
        ].map((i: string, ind: number) => {
          return (
            <div
              onClick={() => {
                if (params?.id === 'create') {
                  LINK_CREATE[ind] ? window.open(LINK_CREATE[ind]) : null;
                } else {
                  LINK_sniper[ind] ? window.open(LINK_sniper[ind]) : null;
                }
              }}
              style={{
                width: browser ? '28%' : '32%',
                color: ind === 2 ? 'gray' : 'rgb(220, 220, 220)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={ind}
            >
              {i}
              {ind === 2 && (
                <span>
                  <svg
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1552"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M849.271873 389.69543h-74.437356v-113.652634C774.834517 123.789221 656.983902 0 512 0S249.063094 123.789221 249.063094 276.145185v113.550245h-74.334967c-35.836416 0-64.915108 30.512149-64.915108 68.191581v497.819018c0 37.679432 29.078692 68.293971 64.915108 68.293971h674.646136c35.836416 0 64.812719-30.512149 64.812718-68.293971V457.784622c0.10239-37.577042-28.976302-68.089191-64.915108-68.089192zM548.450755 719.69763v108.737926c0 4.914709-3.788421 8.907909-8.49835 8.90791h-55.80242c-4.709929 0-8.49835-3.993201-8.60074-8.90791V719.69763c-26.211779-14.129787-44.437156-42.286971-44.437156-75.358864 0-46.792121 36.143586-84.881112 80.785521-84.881112 44.641936 0 80.887911 38.088991 80.887911 84.881112 0.10239 33.071893-18.020598 61.331467-44.334766 75.358864z m125.529847-330.0022H350.019398V280.547945c0-93.789021 72.69673-170.171783 162.082992-170.171783 89.283872 0 161.878212 76.382762 161.878212 170.171783v109.147485z m0 0"
                      fill="#808080"
                      p-id="1553"
                    ></path>
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
  return (
    <div
      className={'center'}
      style={{ width: browser ? '80%' : '95%', marginTop: '25px' }}
    >
      <div className="tt">
        <div
          className="ttLeft"
          style={{
            width: browser ? '30%' : '35%',
            borderBottom: browser ? '' : 'none',
            borderRadius: browser ? '10px 10px 0 10px' : '10px 10px 0 0',
          }}
        >
          <img
            style={{ width: params?.id === 'create' ? '65%' : '72%' }}
            src={params?.id === 'create' ? '/bot11.png' : '/bot.png'}
            alt=""
          />
        </div>
        <div className="ttRight" style={{ width: browser ? '70%' : '65%' }}>
          <div className="ttRightTop">
            <div
              className="tokenTT"
              style={{ padding: params?.id === 'create' ? '1%' : '0.5%' }}
            >
              <p
                style={{
                  fontSize: browser ? '28px' : '18px',
                  padding: browser ? '' : '5%',
                }}
              >
                {params?.id === 'create'
                  ? t('Dapps.Token Creation Bot') + '(Thor)'
                  : t('Dapps.sniper')}
              </p>
            </div>
          </div>
          <div
            className="ttRightBot"
            style={{
              height: browser ? 'auto' : '15px',
              borderBottom: browser ? '' : 'none',
              padding: params?.id === 'create' ? '3% 13px' : '1.6% 13px',
              borderRadius: browser ? '0 10px 10px 0' : '0 10px 0 0',
            }}
          >
            {browser && video}
          </div>
        </div>
      </div>
      {!browser && <div className="botBb">{video}</div>}
    </div>
  );
}

export default Center;
