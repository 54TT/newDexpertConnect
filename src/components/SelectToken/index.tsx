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
}

const { Search } = Input;

function SelectToken({ onChange, chainName, disabledTokens }: SelectTokenType) {
  const [tokenList, setTokenList] = useState<TokenItemData[]>([]);
  const { provider } = useContext(CountContext);
  const historyList = useRef<TokenItemData[]>([]);
  const historyTotal = useRef<number>(0);
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
      setTokenList(tokens || []);
      setTotalTokens(totalTokens);
      console.log(totalTokens);
    } else {
      setTokenList(tokenList.concat(tokens));
    }
  };

  useEffect(() => {
    setPage(1);
    getHotTradingToken(1);
  }, [chainName]);

  const next = () => {
    const newPage = page + 1;
    getHotTradingToken(newPage);
  };

  const clearSearch = () => {
    if (historyList?.current?.length) {
      setTokenList(historyList.current);
      setTotalTokens(historyTotal.current);
    }
  };

  const onSearch = async (value: string) => {
    if (value === '') {
      clearSearch();
      return;
    }

    if (value.length !== 42) {
      console.log('123123');

      notification.warning({
        message: 'please input address correctly',
      });
      return;
    }
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
      historyList.current = tokenList;
      historyTotal.current = totalTokens;

      setTokenList([searchToken]);
      setTotalTokens(1);
    } catch (e) {
      notification.warning({
        message: 'please input address correctly',
      });
    }
  };

  useEffect(() => {
    if (tokenList.length && totalTokens > tokenList.length) {
      const observeFn = (dom) => {
        console.log(dom, tokenList);

        if (dom[0].isIntersecting && page >= 1) {
          next();
        }
      };
      let io = new IntersectionObserver(observeFn);
      io.observe(document.getElementById('scroll-end-element'));
      return () => {
        io.disconnect();
      };
    }
  }, [tokenList]);

  return (
    <div className="select-token">
      <Search
        className="select-token-search"
        placeholder="Token Contract Address"
        onSearch={onSearch}
        allowClear
      />
      <div className="token-history-list"></div>
      <span className="popular-tokens">Popular tokens</span>
      <div id="scrollTarget">
        <>
          {tokenList?.map?.((item: TokenItemData) => (
            <div
              key={item.contractAddress}
              className={`select-token-item ${disabledTokens?.includes?.(item.contractAddress) ? 'disable-token' : ''}`}
              onClick={() => {
                if (
                  disabledTokens?.includes?.(item.contractAddress.toLowerCase())
                ) {
                  return;
                }
                onChange(item);
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
          <span id="scroll-end-element"></span>
        </>
      </div>
    </div>
  );
}

export default SelectToken;
