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

const mockTokenETH = '0x0000000000000000000000000000000000000000';
const mockTokenWETH = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
const mockTokenUSDT = '0xb72bc8971d5e595776592e8290be6f31937097c6';

const mockTokenList: TokenItemData[] = [
  {
    symbol: 'ETH',
    name: 'ETH',
    address: mockTokenETH,
    id: '0',
    icon: '/eth1.svg',
    balance: '0.1',
  },
  {
    symbol: 'WETH',
    name: 'WETH',
    address: mockTokenWETH,
    id: '1',
    icon: '/powEth.svg',
    balance: '0.02',
  },
  {
    symbol: 'USDT',
    name: 'USDT',
    address: mockTokenUSDT,
    id: '2',
    icon: '/usdt.svg',
    balance: '200',
  },
];
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
            <img src={item.icon} alt="" />
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
