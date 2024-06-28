import { useContext, useEffect, useRef, useState } from 'react';
import { Input, notification } from 'antd';
import './index.less';
import { formatAddress } from '@utils/utils';
import {} from '../SelectTokenModal';
import Request from '../axios';
import Cookies from 'js-cookie';
import DefaultTokenImg from '../DefaultTokenImg';
import { CountContext } from '@/Layout';
import { getERC20Contract } from '@utils/contracts';
import { getHistoryToken, addHistoryToken } from '@utils/indexDBfn';
import { ethers } from 'ethers';
import axios from 'axios';
import { getGraphQlQuery } from './const';
import { CHAINID_TO_PAIR_QUERY_URL } from '@utils/judgeStablecoin';
import React from 'react';
export interface TokenItemData {
  symbol: string;
  name: string;
  contractAddress: string;
  logoUrl?: string;
  balance?: string;
  decimals: string;
}

interface SelectTokenType {
  onChange: (data: TokenItemData) => void;
  chainName: string;
  disabledTokens: string[];
  type: 'swap' | 'snip';
}

const { Search } = Input;

function SelectToken({
  onChange,
  chainName,
  disabledTokens,
  type = 'swap', // 只能搜币对
}: SelectTokenType) {
  const [tokenList, setTokenList] = useState<TokenItemData[]>([]);
  const { provider, isLogin, chainId, loginPrivider } =
    useContext(CountContext);
  console.log('rerender');

  /*   const [showSearch, setShowSearch] = useState(false); */
  const [historyItems, setHistoryItems] = useState([]);
  const memoryTokenList = useRef<TokenItemData[]>([]);
  const [first] = useState(10); // graphQl pageSize;
  const [skip, setSkip] = useState(0); // graphQl pageSKip;
  const [poplurList, setPoplurList] = useState([]);
  const [poplurTotals, setPoplurTotals] = useState(0);
  const [searchPariTokenList, setSearchPariTokenList] = useState([]);
  const [searchTotals, setSearchTotals] = useState(0);
  const [searchTokenList, setSearchTokenList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchString, setSearchString] = useState('');
  const memoryTokenTotal = useRef<number>(0);
  const [page, setPage] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);
  const { getAll } = Request();
  const token = Cookies.get('token');
  const getHotTradingToken = async (page: number) => {
    const { data } = await getAll({
      method: 'post',
      url: '/api/v1/dapp/hotTradingToken',
      data: {
        page: page.toString(),
        pageSize: '10',
        chainName,
      },
      token,
    });
    const { tokens, totalTokens } = data;
    if (page === 1) {
      setPoplurList(tokens || []);
      setPoplurTotals(totalTokens);
      setTokenList(tokens || []);
      setTotalTokens(totalTokens);
    } else {
      setPoplurList(tokenList.concat(tokens));
      setTokenList(tokenList.concat(tokens));
    }
  };

  useEffect(() => {
    setPage(1);
    getHotTradingToken(1);
  }, [chainName]);

  const next = async () => {
    if (!showSearch) {
      const newPage = page + 1;
      getHotTradingToken(newPage);
      return;
    }
    if (showSearch && type === 'swap') {
      console.log('run show next');

      const { data } = await getTokenPairList(
        searchString,
        { first, skip },
        chainId
      );
      setSkip(first + skip);
      const newData = searchPariTokenList.concat(data.pairs);
      console.log(data, newData);

      setSearchPariTokenList(newData);
      setTokenList(newData);
    }
  };

  const onSearch = async (value: string) => {
    if (value === '') {
      setShowSearch(false);
      setTokenList(poplurList);
      setTotalTokens(poplurTotals);
      setSkip(0);
      return;
    }

    if (value.length == 42 && value.startsWith('0x')) {
      if (type === 'snip') {
        const tokenContract = await getERC20Contract(provider, value);
        try {
          const getSymbolAsync = tokenContract.symbol();
          const getNameAsync = tokenContract.name();
          const getDecimalsAsync = tokenContract.decimals();
          const [symbol, name, decimals] = await Promise.all([
            getSymbolAsync,
            getNameAsync,
            getDecimalsAsync,
          ]);
          const searchToken = {
            symbol,
            name,
            decimals,
            contractAddress: value,
          };
          memoryTokenList.current = tokenList;
          memoryTokenTotal.current = totalTokens;

          setSearchTokenList([searchToken]);
          setTokenList([searchToken]);
          setSearchTotals(1);
          setTotalTokens(1);
        } catch (e) {
          notification.warning({
            message: 'please input address correctly',
          });
        }
      }
    } else {
      const { data } = await getTokenPairList(
        value,
        { first, skip: 0 },
        chainId
      );
      const totals = data.uniswapFactories[0].pairCount;
      setSearchTokenList(totals);
      setSearchPariTokenList(data.pairs);
      setTokenList(data.pairs);
      setSkip(first);
      setTotalTokens(totals);
    }
    setShowSearch(true);
  };

  const getTokenPairList = async (
    str,
    page: { first: number; skip: number },
    chainId: string
  ) => {
    const { data } = await axios.post(
      CHAINID_TO_PAIR_QUERY_URL[chainId],
      getGraphQlQuery(str, page)
    );
    return data;
  };

  useEffect(() => {
    if (tokenList.length && totalTokens > tokenList.length) {
      const observeFn = (dom) => {
        if (dom[0].isIntersecting) {
          console.log('at bottom');
          if (showSearch && type === 'swap' && skip > 0) {
            next();
          } else {
            if (!showSearch && type === 'snip' && page > 1) {
              next();
            }
          }
        }
      };
      let io = new IntersectionObserver(observeFn);
      io.observe(document.getElementById('scroll-end-element'));
      return () => {
        io.disconnect();
      };
    }
  }, [tokenList]);

  const getHistoryTokenList = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(loginPrivider);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const historyToken = await getHistoryToken({ address, chainId });

    setHistoryItems(historyToken || []);
  };

  useEffect(() => {
    if (isLogin) {
      getHistoryTokenList();
    } else {
      setHistoryItems([]);
    }
  }, [isLogin, chainId, loginPrivider]);

  const memoClickTokenHistory = async (data) => {
    if (showSearch && type === 'swap') return;
    if (!isLogin) return;
    const findIndex = historyItems.findIndex(
      (item) => item.contractAddress === data.contractAddress
    );
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(loginPrivider);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    if (findIndex == -1) {
      const newItem = [data, ...historyItems];
      if (newItem.length > 6) {
        newItem.pop();
      }
      setHistoryItems(newItem);
      addHistoryToken({ address, chainId }, newItem);
    } else {
      const item = historyItems.splice(findIndex, 1);
      const newItem = [...item, ...historyItems];
      setHistoryItems(newItem);
      addHistoryToken({ address, chainId }, newItem);
    }
  };

  const handleTokenSelect = (item: TokenItemData) => {
    if (disabledTokens?.includes?.(item.contractAddress.toLowerCase())) {
      return;
    }
    if (!showSearch && type !== 'swap') {
      memoClickTokenHistory(item);
    }
    onChange(item);
  };

  return (
    <div className="select-token">
      <Search
        className="select-token-search"
        placeholder="Token Contract Address"
        onSearch={onSearch}
        onChange={(e) => {
          setSearchString(e.target.value);
        }}
        value={searchString}
        allowClear
      />
      {isLogin && historyItems?.length ? (
        <div className="token-history-list">
          <span className="token-list-title">History tokens</span>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {historyItems.map((item,index) => (
              <div
              key={index}
                className={`history-token-item ${disabledTokens?.includes?.(item.contractAddress) ? 'disable-token' : ''}`}
                onClick={() => handleTokenSelect(item)}
              >
                <DefaultTokenImg name={item.symbol} icon={item.logoUrl} />
                <span>{item.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <span className="popular-tokens token-list-title">Search Pair</span>
      <div id="scrollTarget">
        <TokenList
          tokenList={tokenList}
          disabledTokens={disabledTokens}
          handleTokenSelect={handleTokenSelect}
          type={type}
          showSearch={showSearch}
        />
        <span id="scroll-end-element"></span>
      </div>
    </div>
  );
}

export default React.memo(SelectToken, (prev, next) => {
  const disabledTokensEqual = () => {
    const [token0Prev, token1Prev] = prev.disabledTokens;
    const [token0Next, token1Next] = next.disabledTokens;
    return token0Prev === token0Next && token1Prev === token1Next;
  };

  return (
    prev.type === next.type &&
    disabledTokensEqual() &&
    prev.chainName == next.chainName
  );
});

const TokenList = ({
  tokenList,
  disabledTokens,
  handleTokenSelect,
  type,
  showSearch,
}) => {
  const SingleToken = () => (
    <>
      {tokenList?.map?.((item: TokenItemData) => (
        <div
          key={item.contractAddress}
          className={`select-token-item ${disabledTokens?.includes?.(item.contractAddress) ? 'disable-token' : ''}`}
          onClick={() => {
            handleTokenSelect(item);
          }}
        >
          <div className="select-token-item-info">
            <DefaultTokenImg name={item.symbol} icon={item.logoUrl} />
            <div className="token-item-info-box">
              <span className="select-token-item-info-symbol">
                {item.symbol}
              </span>
              <span className="select-token-item-info-address">
                {formatAddress(item.contractAddress)}
              </span>
            </div>
          </div>
          <div className="select-token-item-balance">{item.balance}</div>
        </div>
      ))}
    </>
  );

  const PairToken = () => (
    <>
      {tokenList?.map?.((item: TokenItemData) => (
        <div
          key={item?.id}
          className={`select-token-item`}
          onClick={() => {
            /* handleTokenSelect(item); */
            console.log(item);
          }}
        >
          <div className="select-token-item-info">
            <DefaultTokenImg name={item?.token0?.symbol} icon={''} />
            <DefaultTokenImg
              style={{ marginLeft: '-12px' }}
              name={item?.token1?.symbol}
              icon={''}
            />
            <div className="token-item-info-box">
              <span className="select-token-item-info-symbol">
                {`${item?.token0?.symbol} / ${item?.token1?.symbol}`}
              </span>
              <span className="select-token-item-info-address">
                {formatAddress(item?.id)}
              </span>
            </div>
          </div>
          <div className="select-token-item-balance">{item?.balance}</div>
        </div>
      ))}
    </>
  );

  if (type === 'swap') {
    if (showSearch) {
      return <PairToken />;
    } else {
      return <SingleToken />;
    }
  } else {
    if (showSearch) {
      return <SingleToken />;
    } else {
      return <SingleToken />;
    }
  }
};
