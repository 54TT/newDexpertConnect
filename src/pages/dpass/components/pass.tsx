import { useContext,} from 'react';
import { CountContext } from '@/Layout';
import Nodata from '@/components/Nodata.tsx';
import Loading from '@/components/allLoad/loading.tsx';
import { CaretDownOutlined } from '@ant-design/icons';
import Load from '@/components/allLoad/load.tsx';
import { useTranslation } from 'react-i18next';

export default function pass({
  nextPass,
  isHistory,
  dPassHistory,
  isShow,
  isNext,
}) {
  const { t } = useTranslation();
  const { browser }: any = useContext(CountContext);
  return (
    <div className="dpass-redeem">
      <div className="dpass-redeem-table">
        <div className="dpass-redeem-table-th">
          <span> {t('Dpass.Time')}</span>
          {browser && <span> {t('Dpass.Pass Id')}</span>}
          <span> {t('Dpass.Status')}</span>
          <span>{t('Dpass.Key')}</span>
        </div>
        {isHistory ? (
          dPassHistory.length > 0 ? (
            dPassHistory.map(
              ({ createdAt, cnt, passId, cost }: any, ind: number) => (
                <div className="dpass-redeem-table-td" key={ind}>
                  <span>{createdAt}</span>
                  {!browser ? <></> : <span>{passId}</span>}
                  <span>{cost}</span>
                  <span>{cnt}</span>
                </div>
              )
            )
          ) : (
            <Nodata />
          )
        ) : (
          <Loading status={'20'} browser={browser} />
        )}
        {!isShow && (
          <div className="dpassPageShow">
            <span onClick={nextPass} style={{ cursor: 'pointer' }}>
              {t('Common.Next')}
            </span>
            {isNext ? <Load /> : <CaretDownOutlined />}
          </div>
        )}
      </div>
    </div>
  );
}
