import { Select, Input } from 'antd';
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
import Load from '@/components/allLoad/load.tsx';

import { useState } from 'react';
export default function importWallet({ setStatus, status }: any) {
  const { getAll } = Request();
  const [value, setValue] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [load, setLoad] = useState(false);
  const handleChange = (value: string) => {
    setValue(value);
  };
  const change = (e: any) => {
    setValue(e.target.value || '');
    setIsShow(false);
  };
  const Create = async () => {
    const token = cookie.get('token');
    if (
      (status === 'Create' && value) ||
      (status !== 'Create' && value && privateKey)
    ) {
      const res = await getAll({
        method: 'post',
        url: '/api/v1/wallet',
        data: {
          walletName: value,
          privateKey: status === 'Create' ? undefined : privateKey,
        },
        token,
      });
      if (res?.status === 200 && res?.data?.code === 200) {
        setStatus('list');
        setLoad(false);
      } else {
        setLoad(false);
      }
    } else {
      setIsShow(true);
      setLoad(false);
    }
  };

  return (
    <div className="importWallet">
      <div className="item">
        <p>{status === 'Create' ? 'Create Wallet' : 'Import Wallet'}</p>
        <p></p>
      </div>
      {
        // Inport
        status === 'Create' ? (
          <div className="create">
            <p>name</p>
            <Input className="createInputKey"   autoComplete={'off'} allowClear onChange={change} />
            <p
              style={{
                visibility: isShow ? 'visible' : 'hidden',
                fontSize: '16px',
                color: 'red',
              }}
            >
              Please enter wallet name
            </p>
          </div>
        ) : (
          <div className="import">
            <p className="information">
              <span>
                Imported accounts won’t be associated with your MetaMask Secret
                Recovery Phrase. Learn more about imported accounts{' '}
              </span>
              <span>here</span>
            </p>
            <div className="type">
              <p>1111</p>
              <Select
                defaultValue="lucy"
                className="typeSelect"
                style={{ width: '140px' }}
                onChange={handleChange}
                options={[{ value: 'lucy', label: 'Private Key' }]}
              />
            </div>
            <p className="ent">Enter your private key string here:</p>
            <Input
              className="inputKey"
              autoComplete={'off'}
              allowClear
              onChange={(e: any) => setPrivateKey(e.target.value || '')}
            />
            <p className="ent">wallet name</p>
            <Input className="inputKey"   autoComplete={'off'} allowClear onChange={change} />
            <p
              style={{
                visibility: isShow ? 'visible' : 'hidden',
                fontSize: '16px',
                color: 'red',
              }}
            >
              Please enter wallet name
            </p>
          </div>
        )
      }
      <div className="buttonBox">
        <div
          className="button"
          onClick={() => {
            setLoad(true);
            Create();
          }}
        >
          Create
        </div>
        {load && (
          <div className="load">
            <Load />
          </div>
        )}
      </div>
    </div>
  );
}
