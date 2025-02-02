export const judgeStablecoin = (
  idOne: string,
  idTwo: string,
  chain: string
) => {
  const id0 = idOne.toLowerCase();
  const id1 = idTwo.toLowerCase();
  //   eth链下的   稳定币
  // '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 'WETH',
  // '0x6b175474e89094c44da98b954eedeac495271d0f', 'DAI',
  // '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 'USDC',
  // '0xdac17f958d2ee523a2206206994597c13d831ec7', 'USDT',

  // base 链下的稳定币
  // "0x4200000000000000000000000000000000000006"  WETH

  // Arbitrum 链下的
  // 0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9  USDT
  // 0x82af49447d8a07e3bd95bd0d56f35241523fbab1  WETH
  // 0xaf88d065e77c8cc2239327c5edb3a432268e5831  USDC

  // bnb链下
  // 0x55d398326f99059ff775485246999027b3197955  USDT
  // 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c  WBNB
  // 0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d  USDC

  //   Polygon 链下
  // 0x3c499c542cef5e3811e1192ce70d8cc03d5c3359    USDC
  // 0xc2132d05d31c914a87c6611c10748aeb04b58e8f    USDT
  // 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270    WMATIC

  // Optimism
  // 0x0b2c639c533813f4aa9d7837caf62653d097ff85  USDC
  // 0x4200000000000000000000000000000000000042   OP
  // 0x94b008aa00579c1307b0ef2c499ad98a8ce58e58 USDT
  // 0x4200000000000000000000000000000000000006  WETH

  const all: any = {
    Ethereum: [
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ],
    BASE: ['0x4200000000000000000000000000000000000006'],
    BSC: [
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      '0x55d398326f99059ff775485246999027b3197955',
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    ],
    Polygon: [
      '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    ],
    Optimism: [
      '0x4200000000000000000000000000000000000006',
      '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      '0x4200000000000000000000000000000000000042',
      '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    ],
    Arbitrum: [
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    ],
  };
  const one = all[chain].indexOf(id0);
  const two = all[chain].indexOf(id1);
  if ((one > -1 && two > -1) || (two == -1 && one === -1)) {
    return 2;
  } else if (one === -1) {
    return 0;
  } else {
    return 1;
  }
};

export const chain: any = {
  Ethereum: 'https://dexpertpairs.lol/subgraphs/name/ethereum/uniswapv2',
  Arbitrum: 'https://dexpertpairs.lol/subgraphs/name/arbitrum/uniswapv2',
  BASE: 'https://dexpertpairs.lol/subgraphs/name/base/uniswapv2',
  Polygon: 'https://dexpertpairs.lol/subgraphs/name/polygon/uniswapv2',
  BSC: 'https://dexpertpairs.lol/subgraphs/name/bsc/uniswapv2',
  Optimism: 'https://dexpertpairs.lol/subgraphs/name/optimism/uniswapv2',
};

export const CHAINID_TO_PAIR_QUERY_URL = {
  1: 'https://dexpertpairs.lol/subgraphs/name/ethereum/uniswapv2',
  42161: 'https://dexpertpairs.lol/subgraphs/name/arbitrum/uniswapv2',
  8453: 'https://dexpertpairs.lol/subgraphs/name/base/uniswapv2',
  56: 'https://dexpertpairs.lol/subgraphs/name/bsc/uniswapv2',
  10: 'https://dexpertpairs.lol/subgraphs/name/optimism/uniswapv2',
  // 测试节点，用于Swap搜索 Pair
  11155111: 'https://dexpertpairs.lol/subgraphs/name/ethereum/uniswapv2',
};

export const rpcLink: any = {
  Ethereum:
    'https://eth-mainnet.g.alchemy.com/v2/BhTc3g2lt1Qj3IagsyOJsH5065ueK1Aw',
  Arbitrum:
    'https://arb-mainnet.g.alchemy.com/v2/Fqghe_WhrdEyMYhFnt5S9XSZh3rfaF2R',
  BASE: 'https://base-mainnet.g.alchemy.com/v2/4rlBifaC-p1sVKE1LbGWAsDAoCSFkIEr',
  Optimism:
    'https://opt-mainnet.g.alchemy.com/v2/tZLGIvPXHqe_SVu8jTwAYnDPPLiREdjh',
  Polygon:
    'https://polygon-mainnet.g.alchemy.com/v2/RPyff7EXSXwk_yHReuS79yldR8leQ6si',
  BSC: 'https://bsc-mainnet.nodereal.io/v1/233ca173728d462095e7ac0c807fffe7',
};

export const chainParams = [
  { value: 'Ethereum', icon: '/EthereumCoin.svg' },
  {
    value: 'Arbitrum',
    icon: '/Arbitrum.svg',
    disabled: true,
  },
  { value: 'Avalanche', icon: '/AvalancheCoin.svg', hide: true },
  { value: 'BSC', icon: '/BNBChain.svg', disabled: true },
  {
    value: 'Polygon',
    icon: '/PolygonCoin.svg',
    hide: true,
  },
  { value: 'Optimism', icon: '/Optimism.svg', hide: true },
  { value: 'Blast', icon: '/Blast.svg', hide: true },
  {
    value: 'Base',
    icon: '/BASE.png',
    hide: true,
  },
  { value: 'Celo', icon: '/Celo.svg', hide: true },
];
export const chainList = [
  { value: 'Ethereum', icon: '/EthereumCoin.svg', chainId: '1', key: '0x1' },
  // {
  //   value: 'Arbitrum',
  //   icon: '/Arbitrum.svg',
  //   disabled: true,
  //   key: '0xa4b1',
  //   chainId: '42161',
  //   hideOnPro: true,
  // },
  // {
  //   value: 'BSC',
  //   icon: '/BNBChain.svg',
  //   disabled: true,
  //   key: '0x38',
  //   chainId: '56',
  //   hideOnPro: true,
  // },
  // {
  //   value: 'Optimism',
  //   icon: '/Optimism.svg',
  //   disabled: true,
  //   chainId: '10',
  //   key: '0xa',
  //   hideOnPro: true,
  // },
  // { value: 'Blast', icon: '/Blast.svg', hide: true, hideOnPro: true },
  {
    value: 'Base',
    icon: '/BASE.png',
    key: '0x2105',
    chainId: '8453',
  },
  {
    value: '5ire test',
    icon: '/5ire.png',
    key: '0x3e3',
    chainId: '997',
    hideOnPro: true,
  },
  {
    value: '5ire',
    icon: '/5ire.png',
    chainId: '995',
  },
  {
    value: 'BitLayer',
    icon: '/bitlayer.jpg',
    chainId: '200901',
  },
  {
    value: 'BitLayer test',
    icon: '/bitlayer.jpg',
    chainId: '200810',
    hideOnPro: true,
  },
  // {
  //   value: 'Ton',
  //   icon: '/ton_symbol.svg',
  //   chainId: '-2',
  //   disabled: true,
  // },
  {
    value: 'Sepolia',
    icon: '/unkonwLogo.png',
    key: '0xaa36a7',
    chainId: '11155111',
    hideOnPro: true,
  },
  {
    value: 'Manta',
    icon: '/unkonwLogo.png',
    chainId: '169',
    hideOnPro: true,
  },
  {
    value: 'Manta test',
    icon: '/unkonwLogo.png',
    chainId: '3441006',
    hideOnPro: true,
  },
  {
    value: 'Conflux testnet',
    icon: '/conflux-logo.png',
    chainId: '71',
    hideOnPro: true,
  },
  {
    value: 'Conflux',
    icon: '/conflux-logo.png',
    chainId: '1030',
  },
  {
    value: 'Neo',
    icon: '/neo.svg',
    chainId: '47763',
  },
];

export const swapChain = chainList.map((item) => ({
  ...item,
  key: `0x${Number(item.chainId).toString(16)}`,
}));
