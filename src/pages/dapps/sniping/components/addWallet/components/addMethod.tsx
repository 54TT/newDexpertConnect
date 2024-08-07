import { useTranslation } from 'react-i18next';
export default function addMethod({ setStatus }: any) {
const { t } = useTranslation();
  return (
    <div className="addMethod">
      {[
        { name: t('token.Create'), key: 'Create' },
        { name: t('token.Import'), key: 'Import' },
      ].map((i: any) => {
        return (
          <div className="item" key={i.key} onClick={() => setStatus(i.key)}>
            <p>{i.name}</p>
            <img src="/addWallet.svg" alt="" />
          </div>
        );
      })}
    </div>
  );
}
