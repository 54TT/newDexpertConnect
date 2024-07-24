import { useState } from 'react';
import './index.less';
import AddMethod from './components/addMethod';
import ImportAndCreate from './components/importAndCreate';
import { useTranslation } from 'react-i18next';
export default function index({setAddWallet}:any) {
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
        <ImportAndCreate setAddWallet={setAddWallet} status={status} />
      )}
    </div>
  );
}
