import React,{ useState } from 'react';
import './index.less';
const WalletList = React.lazy(() => import('./components/walletList'));

const AddMethod = React.lazy(() => import('./components/addMethod'));

const ImportAndCreate = React.lazy(() => import('./components/importAndCreate'));
import { useTranslation } from 'react-i18next';
export default function index({ setAddWallet ,setWalletId,id}: any) {
const { t } = useTranslation();
  const [status, setStatus] = useState('list');
  return (
    <div className="addWallet">
      <div className="top">
        <img
          src="/backLeft.svg"
          alt=""
          onClick={() => {
            if (status === 'list') {
              setAddWallet('more');
            } else if (status === 'addMethod') {
              setStatus('list');
            } else{
              setStatus('addMethod');
            }
          }}
        />
        <span>{status === 'list' ?t('sniping.management') : t('sniping.Add')}</span>
        <span></span>
      </div>
      {status === 'list' ? (
        <WalletList setStatus={setStatus} setAddWallet={setAddWallet} setWalletId={setWalletId} id={id}/>
      ) : status === 'addMethod' ? (
        <AddMethod setStatus={setStatus} />
      ) : (
        <ImportAndCreate setStatus={setStatus} status={status} />
      )}
    </div>
  );
}
