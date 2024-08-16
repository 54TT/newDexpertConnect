import React,{ useState } from 'react';
import './index.less';
const AddMethod = React.lazy(() => import('./components/addMethod'));
const ImportAndCreate = React.lazy(() => import('./components/importAndCreate'));
import { useTranslation } from 'react-i18next';
export default function index({setAddWallet,chainId}:any) {
const { t } = useTranslation();
  const [status, setStatus] = useState('addMethod');
  return (
    <div className="addWallet">
      <div className="top">
        <img
          src="/backLeft.svg"
          alt=""
          onClick={() => {
            if (status === 'addMethod') {
              setAddWallet(false)
            } else{
              setStatus('addMethod');
            }
          }}
        />
        <span>{ t('sniping.Add')}</span>
        <span></span>
      </div>
      { status === 'addMethod' ? (
        <AddMethod setStatus={setStatus} />
      ) : (
        <ImportAndCreate setAddWallet={setAddWallet} status={status} chainId={chainId}/>
      )}
    </div>
  );
}
