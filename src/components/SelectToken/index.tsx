import {
  ChangeEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Input,  } from 'antd';
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
  open: boolean;
}
const { Search } = Input;
function SelectToken({
  onChange,
  chainName,
  disabledTokens,
  open,
}: SelectTokenType) {
  const [tokenList, setTokenList] = useState<TokenItemData[]>([]);
  const [PopularToken, setPopularToken] = useState<TokenItemData[]>([]);
  const { provider } = useContext(CountContext);
  const historyList = useRef<TokenItemData[]>([]);
  const [, setPage] = useState(1);
  const [value, setValue] = useState('');
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
    setPopularToken(tokens);
  };

  useEffect(() => {
    if (open) {
      setValue('');
      setTokenList([]);
    }
  }, [open]);
  useEffect(() => {
    setPage(1);
    getHotTradingToken(1);
  }, [chainName]);

  const onSearch: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const { value } = e?.target;
    setValue(value);
    if (value.length === 42) {
      /* notification.warning({
        message: 'please input address correctly',
      });
      return; */
      const tokenContract = await getERC20Contract(provider, value);
      if (tokenContract?.name && tokenContract?.symbol) {
        const searchToken = {
          ...tokenContract,
          contractAddress: value,
        };
        historyList.current = tokenList;
        setTokenList([searchToken]);
      }
    }
  };
  const moreToken = tokenList.length > 0 ? tokenList : PopularToken;
  return (
    <div className="select-token">
      <Search
        className="select-token-search"
        placeholder="Token Contract Address"
        value={value}
        onChange={onSearch}
      />
      <div className="token-history-list"></div>
      <span className="popular-tokens">Popular tokens</span>
      {moreToken?.map?.((item: TokenItemData) => (
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
            setValue('');
            setTokenList([]);
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
