import { useContext, useEffect, useState } from 'react';
import PageHeader from '../../component/PageHeader';
import ToLaunchHeader from '../../component/ToLaunchHeader';
import './index.less';
import Loading from '@/components/allLoad/loading';
import { CountContext } from '@/Layout';
import TokenItem from '../../component/TokenItem';
import { useNavigate } from 'react-router-dom';
import InfiniteScrollPage from '@/components/InfiniteScroll';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { TokenFactoryManagerAbi } from '@abis/TokenFactoryManagerAbi';
import { tokenFactoryERC20Abi } from '@abis/tokenFactoryERC20Abi';
import { useActiveAccount } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { client } from '@/client';
import { useReadContract } from 'thirdweb/react';
import { toEthWithDecimal } from '@utils/convertEthUnit';

function ManageTokenList() {
  const { t } = useTranslation();
  const { browser, contractConfig, allChain } = useContext(CountContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextLoad] = useState(false);
  const [page, setPage] = useState(1);
  const history = useNavigate();
  const activeAccount = useActiveAccount();
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [addressIndex, setAddressIndex] = useState(0);
  const [tokenFactoryManagerContract, setTokenManageMentContract] =
    useState<ethers.Contract>();
  // 生成合约
  const TokenFactoryContract = getContract({
    client,
    chain: allChain,
    address: contractConfig?.tokenFactoryManagerAddress,
    abi: TokenFactoryManagerAbi as any,
  });

  // 生成合约
  const TokenAddressContract = getContract({
    client,
    chain: allChain,
    address: address,
    abi: tokenFactoryERC20Abi as any,
  });
  // 获取   tokenMetaData  值的顺序 description, logoLink,twitterLink,telegramLink, discordLink, websiteLink,
  const { data: tokenMetaData, isLoading: isTokenMetaData }: any =
    useReadContract({
      contract: TokenAddressContract,
      method: 'tokenMetaData',
      params: [],
    });
  // 获取   token name
  const { data: tokenName, isLoading: isTokenName }: any = useReadContract({
    contract: TokenAddressContract,
    method: 'name',
    params: [],
  });
  // 获取   token totalSupply
  const { data: totalSupply, isLoading: isTotalSupply }: any = useReadContract({
    contract: TokenAddressContract,
    method: 'totalSupply',
    params: [],
  });
  // 获取   token symbol
  const { data: totalSymbol, isLoading: isTotalSymbol }: any = useReadContract({
    contract: TokenAddressContract,
    method: 'symbol',
    params: [],
  });
  // 获取   token symbol
  const { data: totalDecimals, isLoading: isTotalDecimals }: any =
    useReadContract({
      contract: TokenAddressContract,
      method: 'decimals',
      params: [],
    });

  useEffect(() => {
    if (
      !isTokenMetaData &&
      !isTokenName &&
      !isTotalSupply &&
      !isTotalSymbol &&
      address &&
      !isTotalDecimals
    ) {
      const tokenItemDataFormat = {
        description: tokenMetaData?.[0],
        logoLink: tokenMetaData?.[1],
        twitterLink: tokenMetaData?.[2],
        telegramLink: tokenMetaData?.[3],
        discordLink: tokenMetaData?.[4],
        websiteLink: tokenMetaData?.[5],
        address,
        name: tokenName,
        symbol: totalSymbol,
        totalSupply: toEthWithDecimal(totalSupply.toString(), totalDecimals),
      };
      const params = data.concat([tokenItemDataFormat]);
      setData([...params]);
      const addressParams = getTokens?.[0]?.[addressIndex + 1];
      if (addressParams) {
        setAddressIndex(addressIndex + 1);
        setAddress(addressParams);
      } else {
        setLoading(false);
      }
    }
  }, [
    isTokenMetaData,
    isTokenName,
    isTotalSupply,
    isTotalSymbol,
    isTotalDecimals,addressIndex
  ]);
  // 获取   getTokensCount
  const { data: getTokensCount }: any = useReadContract({
    contract: TokenFactoryContract,
    method: 'getTokensCount',
    params: [activeAccount?.address],
  });
  // 获取   getTokens
  const { data: getTokens }: any = useReadContract({
    contract: TokenFactoryContract,
    method: 'getTokens',
    params: [activeAccount?.address, 0, getTokensCount?.toString()],
  });

  const initData = async () => {
    setLoading(true);
    try {
      setTotal(getTokensCount?.toString());
      setTokenManageMentContract(tokenFactoryManagerContract);
      await getTokenList();
    } catch (e) {
      setLoading(false);
    }
  };

  const getTokenList = async () => {
    try {
      if (getTokens?.[0]?.length > 0) {
        setAddress(getTokens?.[0]?.[addressIndex]);
      } else {
        setLoading(false);
      }
    } catch (e) {
      return null;
    }
  };
  useEffect(() => {
    initData();
  }, []);
  const items = (item: any) => {
    return (
      <TokenItem
        key={item.address}
        classname={'display'}
        data={{
          logo: item.logoLink,
          symbol: item.symbol,
          name: item.name,
          address: item.address,
          id: item.address,
        }}
        onClick={({ address }) =>
          history(`/dapps/tokencreation/tokenDetail/${address}`)
        }
      />
    );
  };
  return (
    <div className="launch-manage-token">
      <ToLaunchHeader />
      <PageHeader
        disabled={false}
        name={'tokenList'}
        className="launch-manage-token-header"
        title={t('mint.Management')}
      />
      <div className="launch-manage-token-search"></div>
      <div className="mint-scroll scroll" id="launchTokenList">
        {!loading ? (
          <InfiniteScrollPage
            data={data}
            total={total}
            next={() => setPage(page + 1)}
            items={items}
            nextLoad={nextLoad}
            no={t('token.no')}
            scrollableTarget={'launchTokenList'}
          />
        ) : (
          <Loading status={'20'} browser={browser} />
        )}
      </div>
    </div>
  );
}

export default ManageTokenList;
