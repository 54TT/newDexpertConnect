import './index.less';
import { useTranslation } from 'react-i18next';
function InfoList({ data, className }: { data: any; className?: string }) {
  const { t } = useTranslation();
  const par: any = {
    filename: t('token.document'),
    name: t('token.token'),
    symbol: t('token.symbol'),
    totalSupply: t('token.max'),
    decimals: t('token.decimals'),
    description: t('token.describe'),
    preventSwapBefore: t('token.Before'),
    maxTxAmount: t('token.of'),
    maxTaxSwap: t('token.taxs'),
    taxSwapThreshold: t('token.swap'),
    maxWalletSize: t('token.size'),
    initialBuyTax: t('token.tax'),
    finalBuyTax: t('token.final'),
    finalSellTax: t('token.sela'),
    initialSellTax: t('token.sel'),
    reduceSellTaxAt: t('token.reduce'),
    reduceBuyTaxAt: t('token.redu'),
    Address: t('sniping.Contract'),
    Symbol: t('token.symbol'),
    Name: t('token.token'),
    Balance:t('token.Banlance'),  
    Lockamount:t('token.Lock'), 
    Pairaddress:t('token.Pairaddress'), 
    //   payTokenType: '',
    //   buyCount: '',
  };
  return (
    <div className={`info-list mint-scroll ${className}`}>
      {data.map(
        (item, index) =>
          item.label !== 'payTokenType' &&
          item.label !== 'buyCount' && (
            <div key={index} className="info-list-item">
              <span>{par[item.label?.replace(/\s*/g,"")]}：</span>
              <span>{item.show ?? item.value}</span>
            </div>
          )
      )}
      <img src="/resultBack.svg" alt="" className="img" />
    </div>
  );
}
export default InfoList;
