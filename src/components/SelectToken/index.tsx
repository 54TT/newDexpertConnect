import { useState } from 'react';
import './index.less';
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

const mockTokenList: TokenItemData[] = new Array(10).fill(0).map(() => ({
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

  return (
    <div className="select-token">
      {tokenList?.map?.((item: TokenItemData) => (
        <div className="select-token-item" onClick={() => onChange(item)}>
          <div className="select-token-item-info">
            <img src="/eth1.svg" alt="" />
            <div>
              <span className="select-token-item-info-symbol">
                {item.symbol}
              </span>
              <span className="select-token-item-info-address">
                {item.address}
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
