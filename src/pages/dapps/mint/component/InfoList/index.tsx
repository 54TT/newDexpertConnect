import './index.less';
import { useTranslation } from 'react-i18next';
import Copy from '@/components/copy';
import { useContext } from 'react';
import { CountContext } from '@/Layout';
function InfoList({ data, className }: { data: any; className?: string }) {
  const { contractConfig } = useContext(CountContext);
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
    Balance: t('token.Banlance'),
    Lockamount: t('token.Lock'),
    Pairaddress: t('token.Pairaddress'),
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
              <span style={{ whiteSpace: 'nowrap' }}>
                {par[item.label?.replace(/\s*/g, '')]}：
              </span>
              {item.label?.replace(/\s*/g, '') === 'Address' ||
              item.label?.replace(/\s*/g, '') === 'Pairaddress' ? (
                <span
                  className={'address'}
                  onClick={() => {
                    window.open(contractConfig?.tokenScan + item.value);
                  }}
                >
                  {item.value.slice(0, 4) + '...' + item.value.slice(-4)}
                </span>
              ) : (
                <span>{item.show ?? item.value}</span>
              )}
              {(item.label?.replace(/\s*/g, '') === 'Address' ||
                item.label?.replace(/\s*/g, '') === 'Pairaddress') && (
                <div style={{ position: 'relative', zIndex: '10' }}>
                  <Copy name={item.value} img="/copyColor.svg" />
                </div>
              )}
            </div>
          )
      )}
      <img src="/resultBack.svg" alt="" className="img" />
    </div>
  );
}
export default InfoList;
