import { Select,Input, Modal,  } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CountContext } from '@/Layout.tsx';
import newPair from '@/components/getNewPair.tsx';
import { useTranslation } from 'react-i18next';
const ChooseChain = React.lazy(
  () => import('@/components/ChangeChain/components/chooseChain.tsx')
);
const GasPrice = React.lazy(() => import('./gasPrice'));
import { chainParams } from '@utils/judgeStablecoin.ts';
import { SearchOutlined } from '@ant-design/icons';
import TableList from './tableList'
const { Search } = Input;
function Left() {
  const hei = useRef<any>();
  const {
    setSearchStr,
    searchStr,
  } = newPair() as any;
  const { browser,  setSwitchChain }: any =
    useContext(CountContext);
  const [tableHei, setTableHei] = useState('');
  const [select, setSelect] = useState('newPair');
  const [searchModal, setSearchModal] = useState(false);
  const [] = useState(false);
  useEffect(() => {
    if (hei && hei.current) {
      const h = hei.current.scrollHeight;
      const w = window.innerHeight;
      const o: any = w - h - 120 + 35;
      setTableHei(o);
    }
  }, []);

  const handleChange = (value: string) => {
    setSelect(value);
  };
  const { t } = useTranslation();
  const onSearchPair = (v: string) => {
    if (searchStr !== v) {
      setSearchStr(v);
    }
  };
  return (
    <div className={'indexBox'} style={{ width: browser ? '100%' : 'auto' }}>
      {/* top*/}
      <div
        ref={hei}
        className={`indexTop`}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <div
          className="disDis"
          style={{ alignItems: browser ? 'center' : 'flex-end' }}
        >
          <ChooseChain
            chainList={chainParams}
            disabledChain={true}
            hideChain={true}
            onChange={(v) => setSwitchChain(v)}
          />
          <Select
            onChange={handleChange}
            value={select}
            suffixIcon={
              <img
                src="/down.svg"
                alt=""
                width={'14px'}
                style={{ marginTop: '3px' }}
              />
            }
            style={{ width: browser ? 120 : 90 }}
            className={'indexSelect'}
            popupClassName={'indexSelectPopup'}
            options={[
              { value: 'newPair', label: t('Market.New') },
              /*  { value: 'trading', label: t('Market.Trading'), disabled: true },
              { value: 'watch', label: t('Market.Favorites'), disabled: true }, */
            ]}
          />
          {browser ? (
            <div className="pair-search">
              <Search
                className="common-search"
                placeholder={t('Common.SearchPairPlaceholder')}
                onSearch={onSearchPair}
                allowClear
              />
            </div>
          ) : (
            <SearchOutlined
              style={{ color: '#fff', marginLeft: '8px', fontSize: '20px' }}
              onClick={() => setSearchModal(true)}
            />
          )}
        </div>
        {/* <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} className={'homeSegmented'} defaultValue={'24h'} /> */}
        <GasPrice  />
      </div>
      <TableList tableHei={tableHei}/>
      <Modal
        open={searchModal}
        centered
        onCancel={() => setSearchModal(false)}
        footer={null}
      >
        <Search
          className="common-search pair-search-modal"
          placeholder={t('Common.SearchPairPlaceholder')}
          onSearch={onSearchPair}
          allowClear
        />
      </Modal>
    </div>
  );
}

export default Left;
