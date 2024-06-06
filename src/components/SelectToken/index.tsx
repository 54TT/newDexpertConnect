import { useState } from 'react';

interface TokenItemData {
  symbol: string;
  name: string;
  address: string;
  id: string;
  icon: string;
}

interface SelectTokenType {
  onChange: (data: TokenItemData) => void;
}

const item: TokenItemData[] = new Array(10).fill(0).map(() => ({
  symbol: 'ETH',
  name: 'ETH',
  address: '0x000000000000000000',
  id: '0',
  icon: '/eth1.svg',
}));
function SelectToken({ onChange }: SelectTokenType) {
  const [tokenList, setTokenList] = useState<TokenItemData[]>(item);
  const [searchList, setSearchList] = useState<TokenItemData[]>();

  return (
    <div className="select-token">
      {tokenList?.map?.((item: TokenItemData) => <div></div>)}
    </div>
  );
}

export default SelectToken;
