import { Input, Select } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import Loading from '@/components/allLoad/loading';
import Request from '@/components/axios';
import { CountContext } from '@/Layout';
import TokenItem from '../../component/TokenItem';
import { useNavigate } from 'react-router-dom';
import InfiniteScrollPage from '@/components/InfiniteScroll';
const { Search } = Input;
import { useTranslation } from 'react-i18next';
import { BigNumber, ethers } from 'ethers';
import { TokenFactoryManagerAbi } from '@abis/TokenFactoryManagerAbi';
import { tokenFactoryERC20Abi } from '@abis/tokenFactoryERC20Abi';
function ManageTokenList() {
  const { t } = useTranslation();
  const { chainId, browser, contractConfig, signer } = useContext(CountContext);
  const { getAll } = Request();
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isNext, setIsNext] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const [page, setPage] = useState(1);
  const history = useNavigate();
  const { tokenFactoryManagerAddress } = contractConfig || {};
  const [total, setTotal] = useState(0);
  const [tokenFactoryManagerContract, setTokenManageMentContract] = useState<ethers.Contract>();

  // const getTokenList = async (nu: number, value?: string, key?: string) => {
  //   const token = Cookies.get('token');
  //   const res = await getAll({
  //     method: 'get',
  //     url: '/api/v1/launch-bot/contract/list',
  //     data: {
  //       page: nu,
  //       pageSize: 10,
  //       search: value || '',
  //       key: key || '',
  //     },
  //     token,
  //     chainId,
  //   });
  //   if (res?.status === 200) {
  //     if (nu === 1) {
  //       setData(res?.data?.data);
  //     } else {
  //       const t = data.concat(res?.data?.data);
  //       setData([...t]);
  //     }
  //     if (res?.data?.data?.length != 10) {
  //       setIsNext(true);
  //     }
  //     setLoading(true);
  //     setNextLoad(false);
  //   } else {
  //     setLoading(true);
  //     setNextLoad(false);
  //   }
  // };


  const initData = async () => {
    setLoading(true);
    try {
      const address = await signer.getAddress();
      const tokenFactoryManagerContract = new ethers.Contract(
        tokenFactoryManagerAddress,
        TokenFactoryManagerAbi,
        signer
      );
      const res: BigNumber =
        await tokenFactoryManagerContract.getTokensCount(address);
      const total = res.toNumber();
      setTotal(total);
      setTokenManageMentContract(tokenFactoryManagerContract);
      await getTokenList(tokenFactoryManagerContract, total);
      setLoading(false);
    } catch(e) {
      setLoading(false);
    }

  }

  const getTokenList = async (tokenFactoryManagerContract, total) => {
    
    try {
      const address = await signer.getAddress();
      let start = 5 * (page - 1)
      let end = 5 * page
      if (end > total) {
        end = total
      }
      console.log(start, end, total)
      const [tokenListsAddress, tokenListsType] =
        await tokenFactoryManagerContract.getTokens(address, 0, total);

      // 不阻塞获取内容
      const promiseList = tokenListsAddress.map(async (address) => {
        const tokenContract = new ethers.Contract(
          address,
          tokenFactoryERC20Abi,
          signer
        );
        const {
          description,
          logoLink,
          twitterLink,
          telegramLink,
          discordLink,
          websiteLink,
        } = await tokenContract.tokenInfo();
        const name = await tokenContract.name();
        const totalSupply = await tokenContract.totalSupply();
        const symbol = await tokenContract.symbol();
        const tokenItemDataFormat = {
          description,
          logoLink,
          twitterLink,
          telegramLink,
          discordLink,
          websiteLink,
          address,
          name,
          symbol,
          totalSupply: totalSupply.toString(),
        };
        return tokenItemDataFormat
      });
      const tokenDataList = await Promise.all(promiseList);

      setData([...data,...tokenDataList]);
    } catch (e) {
      console.error(e);
    }
  };
  // const changePage = () => {
  //   if (!isNext) {
  //     getTokenList(page + 1, searchPar, key);
  //     setPage(page + 1);
  //     setNextLoad(true);
  //   }
  // };
  // useEffect(() => {
  //   if (contractConfig?.chainId === Number(chainId)) {
  //     getTokenList(1, '', '0');
  //     setPage(1);
  //     setLoading(false);
  //     setKey('0');
  //     setSearchPar('');
  //     setSearName('');
  //     getTokenListFromManagement();
  //   }
  // }, [chainId, contractConfig]);

  useEffect(() => {
    if (page === 1) {
      initData()
    }
  }, [])

  useEffect(() => {
    if (page !== 1) {
      console.log(page)
      getTokenList(tokenFactoryManagerContract, total);
    }
  }, [page]);

  const items = (item: any) => {
    return (
      <TokenItem
        key={item.contractId}
        classname={'display'}
        data={{
          logo: item.logoLink,
          symbol: item.symbol,
          name: item.name,
          address: item.address,
          id: item.address,
        }}
        onClick={({ address }) =>
          history(`/dapps/tokencreation/tokenDetail/${address}`)
        }
      />
    );
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
        {/* <Search
      {/* <div className="launch-manage-token-search">
        <Search
          className="searchBox"
          value={searName}
          onChange={changeName}
          allowClear
          onSearch={search}
        /> */}
        {/* <Select
          style={{ width: 120 }}
          onChange={handleChange}
          className="selectBox"
          value={key}
          popupClassName={'manageTokenSelect'}
          options={[
            { value: '0', label: t('token.all') },
            { value: '2', label: t('token.Limits') },
            { value: '1', label: t('token.Trade') },
            { value: '3', label: t('token.Renounces') },
          ]}
        /> */}
      </div>
      <div
        className="mint-scroll scroll"
        id="launchTokenList"
      >
        {!loading ? (
          <InfiniteScrollPage
            data={data}
            total={total}
            next={() => setPage(page + 1)}
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
