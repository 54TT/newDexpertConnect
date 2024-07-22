import { useTranslation } from 'react-i18next';

const useButtonDesc = (id: string) => {
  const { t } = useTranslation();
  const desc = {
    '1': t('Dapps.Swap'),
    '2': t('Dapps.Connect Wallet'),
    '3': t('Dapps.Chain not supported'),
    '4': t('Dapps.Insufficient Fund'),
    '5': t('Dapps.Approving'),
    '6': t('Dapps.Authenticating'),
    '7': t('Dapps.Converting'),
    '8': t('Dapps.Confirming'),
    '9': t("Dapps.Awaiting wallet's response"),
  };
  return [desc[id]];
};

export default useButtonDesc;
