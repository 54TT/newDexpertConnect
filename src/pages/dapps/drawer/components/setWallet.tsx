import './index.less';
import React from 'react'
const Copy = React.lazy(() => import('@/components/copy.tsx'));
import { Input } from 'antd';
export default function setWallet({ walletId }: any) {
  return (
    <div className="setWallet">
      <div className="top">
        <img src="/backLeft.svg" alt="" />
        <div>
          <img src="/setUser.svg" alt="" />
          <p>{walletId?.name}</p>
        </div>
        <img src="/setUser.svg" alt="" />
      </div>
      <div className="address">
        <div className="copy">
          <p>address</p>
          <Copy name={'nihao'} />
        </div>
        <Input.TextArea
          autoSize={true}
          autoComplete={'off'}
          readOnly
          value={walletId?.privateKey || ''}
          className="setInput"
        />
        <p className="show">Show private key</p>
        <p className="text">
          Warning: Never disclose this key. Anyone with your private keys can
          steal any assets held in your account.
        </p>
      </div>
    </div>
  );
}
