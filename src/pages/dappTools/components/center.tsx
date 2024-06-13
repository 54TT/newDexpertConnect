// import Conyent from "../../community/components/PostContent.tsx";
import { useContext } from 'react';
import { CountContext } from '../../../Layout.tsx';
import { useLocation, useParams } from 'react-router-dom';
import { throttle } from 'lodash';
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
              onClick={throttle(
                async function () {
                  if (params?.id === 'create') {
                    LINK_CREATE[ind] ? window.open(LINK_CREATE[ind]) : null;
                  } else {
                    LINK_sniper[ind] ? window.open(LINK_sniper[ind]) : null;
                  }
                },
                1500,
                { trailing: false }
              )}
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
                  <img src="/lock.png" alt="" style={{ width: '18px' }} />
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
