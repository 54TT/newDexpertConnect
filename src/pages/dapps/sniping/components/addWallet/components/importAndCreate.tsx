import { Select, Input } from 'antd';
import React, { useState } from 'react';
import Request from '@/components/axios.tsx';
import cookie from 'js-cookie';
const Load = React.lazy(() => import('@/components/allLoad/load.tsx'));
import { useTranslation } from 'react-i18next';
export default function importWallet({ status, setAddWallet, chainId }: any) {
  const { t } = useTranslation();
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
        chainId,
      });
      if (res?.status === 200 && res?.data?.code === 200) {
        setAddWallet(false);
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
        <p>{status === 'Create' ? t('token.Create') : t('token.Import')}</p>
        <p style={{ display: 'none' }}></p>
      </div>
      {
        // Import
        status === 'Create' ? (
          <div className="create">
            <p>{t('token.name')}</p>
            <Input
              className="createInputKey"
              autoComplete={'off'}
              allowClear
              maxLength={20}
              onChange={change}
            />
            <p
              style={{
                visibility: isShow ? 'visible' : 'hidden',
                fontSize: '16px',
                color: 'red',
              }}
            >
              {t('token.Please')}
            </p>
          </div>
        ) : (
          <div className="import">
            <p className="information">
              <span>{t('token.with')}</span>
              <span style={{ marginLeft: '5px' }}>{t('token.here')}</span>
            </p>
            <div className="type">
              <p>{t('token.Select')}</p>
              <Select
                defaultValue="lucy"
                className="typeSelect"
                style={{ width: '140px' }}
                onChange={handleChange}
                options={[{ value: 'lucy', label: t('token.Private') }]}
              />
            </div>
            <p className="ent">{t('token.key')}</p>
            <Input.TextArea
              className="inputKey"
              autoComplete={'off'}
              allowClear
              onChange={(e: any) => setPrivateKey(e.target.value || '')}
              autoSize
            />
            <p className="ent" style={{ marginTop: '10px' }}>
              {t('token.wallet')}
            </p>
            <Input
              className="inputKey"
              autoComplete={'off'}
              allowClear
              maxLength={20}
              onChange={change}
            />
            <p
              style={{
                visibility: isShow ? 'visible' : 'hidden',
                fontSize: '16px',
                color: 'red',
              }}
            >
              {t('token.names')}
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
          {t('token.Creates')}
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
