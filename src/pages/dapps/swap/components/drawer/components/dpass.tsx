import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
export default function dpass({ data }) {
  const { t } = useTranslation();
  console.log(data);
  const d = (name: string, sta: string) => {
    console.log(sta);
    return (
      <div className="pass">
        <div
          className="left"
          style={{
            backgroundColor:
              sta === 'swap' ? 'rgb(134,240,151)' : 'rgb(219,201,38)',
          }}
        >
          <img src="/dexpert.svg" alt="" />
        </div>
        <div className="right">
          <p>{sta === 'swap' ? 'D pass' : 'Gloden Pass'}</p>
          <p>
            {sta === 'swap'
              ? Number(name)
              : Number(name)
                ? dayjs.unix(Number(name)).format('YYYY-MM-DD')
                : t('Alert.Not')}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="dpass">
      {data?.sniperBotSwapCnt && d(data?.sniperBotSwapCnt, 'swap')}
      {data?.stopTs && d(data?.stopTs, 'gold')}
    </div>
  );
}
