import { useTranslation } from 'react-i18next';
function Nodata({ name }: any) {
  const { t } = useTranslation();
  return (
    <p
      style={{
        flexDirection: 'column',
        paddingTop: '30px',
      }}
      className="disCen"
    >
      <img src="/noData.svg" style={{ width: '13%' }} alt="" />
      <span
        style={{
          fontSize: '20px',
          color: 'rgb(220,220,220)',
          paddingTop: '15px',
        }}
      >
        {name ? name : t('token.data')}
      </span>
    </p>
  );
}

export default Nodata;
