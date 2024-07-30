import { useTranslation } from 'react-i18next';
function Nodata({ name, setAddLink }: any) {
  const { t } = useTranslation();
  return (
    <p
      style={{
        flexDirection: 'column',
        paddingTop: '30px',
      }}
      className="disCen"
    >
      <img src="/noData.svg" style={{ width: '13%',minWidth:"100px" }} alt="" />
      <p
        style={{
          fontSize: '16px',
          color: 'rgb(220,220,220)',
          paddingTop: '15px',
        }}
      >
        {name ? name : t('token.data')}
        {setAddLink && (
          <span
            style={{
              color: 'rgb(134,240,151)',
              cursor: 'pointer',
              borderBottom: '1px solid rgb(134,240,151)',
              display:'inline-block',
              marginLeft:'8px'
            }}
            onClick={() => setAddLink(true)}
          >
            {t('sniping.Add')}
          </span>
        )}
      </p>
    </p>
  );
}

export default Nodata;
