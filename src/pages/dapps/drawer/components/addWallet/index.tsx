import { useState } from 'react';
import './index.less';
import WalletList from './components/walletList';
import AddMethod from './components/addMethod';
import ImportAndCreate from './components/importAndCreate';
export default function index({ setAddWallet ,setWalletId,id}: any) {
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
        <span>{status === 'list' ? 'Wallet management' : 'Add Wallet'}</span>
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
