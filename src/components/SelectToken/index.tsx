import { useEffect, useState } from 'react';
import { Input } from 'antd';
import './index.less';
import { formatAddress } from '@utils/utils';
import {} from '../SelectTokenModal';
import Request from '../axios';
import Cookies from 'js-cookie';
import DefaultTokenImg from '../DefaultTokenImg';
export interface TokenItemData {
  symbol: string;
  name: string;
  contractAddress: string;
  logoUrl: string;
  balance: string;
}

interface SelectTokenType {
  onChange: (data: TokenItemData) => void;
  chainName: string;
  disabledTokens: string[];
}

const { Search } = Input;

function SelectToken({ onChange, chainName, disabledTokens }: SelectTokenType) {
  const [tokenList, setTokenList] = useState<TokenItemData[]>([]);
  /*   const [searchList, setSearchList] = useState<TokenItemData[]>();
  const [historyList, setHistoryList] = useState<TokenItemData[]>(); */
  const [, setPage] = useState(1);
  const { getAll } = Request();
  const token = Cookies.get('token');
  const getHotTradingToken = async (page: number) => {
    const { data } = await getAll({
      method: 'post',
      url: '/api/v1/dapp/hotTradingToken',
      data: {
        page: page.toString(),
        pageSize: '5',
        chainName,
      },
      token,
    });
    const { tokens } = data;

    setTokenList(tokens);
  };

  useEffect(() => {
    setPage(1);
    getHotTradingToken(1);
  }, [chainName]);

  return (
    <div className="select-token">
      <Search
        className="select-token-search"
        placeholder="Token Contract Address"
      />
      <div className="token-history-list"></div>
      <span className="popular-tokens">Popular tokens</span>
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
    </div>
  );
}

export default SelectToken;
