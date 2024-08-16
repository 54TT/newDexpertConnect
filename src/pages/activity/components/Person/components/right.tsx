import { useContext } from 'react';
import { CountContext } from '@/Layout.tsx';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
export default function right({ userPass }) {
  const { t } = useTranslation();
  const { user, browser }: any = useContext(CountContext);
  const passCard = [
    {
      name: 'Golden Pass:',
      data: Number(userPass?.stopTs)
        ? dayjs.unix(userPass?.stopTs).format('YYYY-MM-DD')
        : t('Alert.Not'),
    },
    { name: 'Fast Trade Pass:', data: userPass?.sniperBotSwapCnt || 0 },
    { name: 'Sniper Bot Pass:', data: userPass?.sniperBotPreswapCnt || 0 },
    {
      name: 'Token Creation Bot Pass:',
      data: userPass?.launchBotCreationCnt || 0,
    },
  ];
  return (
    <div className={`boxRight ${browser ? '' : 'boxRightSpacing'}`}>
      <div className="point dis">
        <span>D {t('person.points')}:</span>
        <span>{user?.rewardPointCnt || 0}</span>
      </div>
      {passCard.map((i: any, ind: number) => {
        return (
          <div key={ind} className="dis">
            <span>{i?.name}</span>
            <span>{i?.data}</span>
          </div>
        );
      })}
    </div>
  );
}
