import { Input, Select } from 'antd';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import Loading from '@/components/allLoad/loading';
import Request from '@/components/axios';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { CountContext } from '@/Layout';
import TokenItem from '../../component/TokenItem';
import { useNavigate } from 'react-router-dom';
import InfiniteScrollPage from '@/components/InfiniteScroll';
const { Search } = Input;
import { useTranslation } from 'react-i18next';
function ManageTokenList() {
  const { t } = useTranslation();
  const { chainId, browser } = useContext(CountContext);
  const { getAll } = Request();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);

  const [searchPar, setSearchPar] = useState('');
  const [searName, setSearName] = useState('');
  const [key, setKey] = useState('0');
  const [page, setPage] = useState(1);
  const history = useNavigate();
  const getTokenList = async (nu: number, value?: string, key?: string) => {
    const token = Cookies.get('token');
    const res = await getAll({
      method: 'get',
      url: '/api/v1/launch-bot/contract/list',
      data: {
        page: nu,
        pageSize: 10,
        search: value || '',
        key: key || '',
      },
      token,
      chainId,
    });
    if (res?.status === 200) {
      if (nu === 1) {
        setData(res?.data?.data);
      } else {
        const t = data.concat(res?.data?.data);
        setData([...t]);
      }
      if (res?.data?.data?.length != 10) {
        setIsNext(true);
      }
      setLoading(true);
      setNextLoad(false);
    } else {
      setLoading(true);
      setNextLoad(false);
    }
  };
  const changePage = () => {
    if (!isNext) {
      getTokenList(page + 1, searchPar, key);
      setPage(page + 1);
      setNextLoad(true);
    }
  };
  useEffect(() => {
    getTokenList(1, '', '0');
    setPage(1);
    setLoading(false);
    setKey('0');
    setSearchPar('');
    setSearName('');
  }, [chainId]);
  const items = (item: any) => {
    return (
      <TokenItem
        key={item.contractId}
        classname={'display'}
        data={{
          title: item.symbol,
          desc: '（' + item.name + '）',
          id: item.contractId,
          address: item.address,
        }}
        onClick={({ id, address, title }) =>
          history(`/dapps/tokencreation/managePair/${id}/${address}/${title}`)
        }
      />
    );
  };
  const handleChange = (value: string) => {
    setKey(value);
    getTokenList(1, searchPar, value);
    setPage(1);
    setLoading(false);
  };

  const search = (e: string) => {
    if (searchPar !== e) {
      setSearchPar(e);
      getTokenList(1, e, key);
      setPage(1);
      setLoading(false);
    }
  };

  const changeName = (e: any) => {
    setSearName(e.target.value);
  };
  return (
    <div className="launch-manage-token">
      <ToLaunchHeader />
      <PageHeader
        disabled={false}
        name={'tokenList'}
        className="launch-manage-token-header"
        title={t('token.me')}
      />
      <div className="launch-manage-token-search">
        <Search
          className="searchBox"
          value={searName}
          onChange={changeName}
          allowClear
          onSearch={search}
        />
        <Select
          style={{ width: 120 }}
          onChange={handleChange}
          className="selectBox"
          value={key}
          popupClassName={'manageTokenSelect'}
          options={[
            { value: '0', label: t('token.all') },
            { value: '2', label: t('token.Limits') },
            { value: '1', label: t('token.Trade') },
            { value: '3', label: t('token.Renounce') },
          ]}
        />
      </div>
      <div
        className="mint-scroll scroll"
        id="launchTokenList"
        style={{ height: '340px', overflowX: 'hidden' }}
      >
        {loading ? (
          <InfiniteScrollPage
            data={data}
            next={changePage}
            items={items}
            nextLoad={nextLoad}
            no={t('token.no')}
            scrollableTarget={'launchTokenList'}
          />
        ) : (
          <Loading status={'20'} browser={browser} />
        )}
      </div>
    </div>
  );
}

export default ManageTokenList;
