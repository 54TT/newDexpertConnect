import { useState } from 'react';

interface TokenItemData {
  symbol: string;
  name: string;
  address: string;
  id: string;
}

interface SelectTokenType {
  onChange: (data: TokenItemData) => void;
}

function SelectToken({ onChange }: SelectTokenType) {
  const [tokenList, setTokenList] = useState<TokenItemData[]>();
  const [searchList, setSearchList] = useState<TokenItemData[]>();

  return (
    <div className="select-token">
      {tokenList?.map?.((item: TokenItemData) => <div></div>)}
    </div>
  );
}

export default SelectToken;
