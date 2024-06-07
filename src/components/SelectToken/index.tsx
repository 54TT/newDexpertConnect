import { useState } from 'react';
import { Input } from 'antd';
import './index.less';
import { formatAddress } from '@utils/utils';
interface TokenItemData {
  symbol: string;
  name: string;
  address: string;
  id: string;
  icon: string;
  balance: string;
}

interface SelectTokenType {
  onChange: (data: TokenItemData) => void;
}

const { Search } = Input;

const mockTokenList: TokenItemData[] = new Array(5).fill(0).map(() => ({
  symbol: 'ETH',
  name: 'ETH',
  address: '0x000000000000000000',
  id: '0',
  icon: '/eth1.svg',
  balance: '1',
}));
function SelectToken({ onChange }: SelectTokenType) {
  const [tokenList, setTokenList] = useState<TokenItemData[]>(mockTokenList);
  const [searchList, setSearchList] = useState<TokenItemData[]>();
  const [historyList, setHistoryList] = useState<TokenItemData[]>();

  return (
    <div className="select-token">
      <Search
        className="select-token-search"
        placeholder="Token Contract Address"
      />
      <div className="token-history-list"></div>
      <span className="popular-tokens">Popular tokens</span>
      {tokenList?.map?.((item: TokenItemData) => (
        <div className="select-token-item" onClick={() => onChange(item)}>
          <div className="select-token-item-info">
            <img src="/eth1.svg" alt="" />
            <div>
              <span className="select-token-item-info-symbol">
                {item.symbol}
              </span>
              <span className="select-token-item-info-address">
                {formatAddress(item.address)}
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
