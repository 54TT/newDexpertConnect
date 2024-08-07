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
import { useTranslation } from 'react-i18next';
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
  const { provider, isLogin, chainId, loginProvider } =
    useContext(CountContext);
  const { t } = useTranslation();
  /*   const [showSearch, setShowSearch] = useState(false); */
  const [historyItems, setHistoryItems] = useState([]);
  const memoryTokenList = useRef<TokenItemData[]>([]);
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
      setTokenList(tokens || []);
      setTotalTokens(totalTokens);
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
    if (memoryTokenList?.current?.length) {
      setTokenList(memoryTokenList.current);
      setTotalTokens(memoryTokenTotal.current);
    }
  };

  const onSearch = async (value: string) => {
    if (value === '') {
      clearSearch();
      return;
    }

    if (value.length !== 42) {
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
      memoryTokenList.current = tokenList;
      memoryTokenTotal.current = totalTokens;

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

  const getHistoryTokenList = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(loginProvider);
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
  }, [isLogin, chainId, loginProvider]);

  const memoClickTokenHistory = async (data) => {
    if (!isLogin) return;
    const findIndex = historyItems.findIndex(
      (item) => item.contractAddress === data.contractAddress
    );
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
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
    memoClickTokenHistory(item);
    onChange(item);
  };

  return (
    <div className="select-token">
      <Search
        className="select-token-search"
        placeholder="Token Contract Address"
        onSearch={onSearch}
        allowClear
      />
      {isLogin && historyItems?.length ? (
        <div className="token-history-list">
          <span className="token-list-title">{t('Slider.Quote Rate')}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {historyItems.map((item) => (
              <div
                key={item.contractAddress}
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
      <span className="popular-tokens token-list-title">
        {t('Slider.Popular tokens')}
      </span>
      <div id="scrollTarget">
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
          <span id="scroll-end-element"></span>
        </>
      </div>
    </div>
  );
}

export default SelectToken;
