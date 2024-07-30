type ChainIdList = '1' | '11155111' | '8453' | '995';
export const config: Record<ChainIdList, any> = {
  '1': {
    rpcUrl:
      'https://eth-mainnet.g.alchemy.com/v2/pYR_0-1KLcH-cJ_j_7dWOAWByJmPM-bN',
    chainId: 1,
    verificationURL: 'https://api.etherscan.io/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x663A5C229c09b049E36dCc11a9B0d4a8Eb9db214',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://etherscan.io/tx/',
    defaultTokenIn: {
      name: 'ETH',
      symbol: 'ETH',
      logoUrl: '/eth-logo.svg',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '18',
    },
    defaultTokenOut: {
      name: 'USDT',
      symbol: 'USDT',
      logoUrl: '/usdt.svg',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      balance: '0',
      decimals: '6',
    },
  },
  '11155111': {
    rpcUrl:
      'https://eth-sepolia.g.alchemy.com/v2/pYR_0-1KLcH-cJ_j_7dWOAWByJmPM-bN',
    /*     'https://public.stackup.sh/api/v1/node/ethereum-sepolia', */
    verificationURL: 'https://api-sepolia.etherscan.io/api',
    chainId: 11155111,
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0xb22ce52905d25987321d6bf73d1705886f1cc4f4',
    uniswapV2FactoryAddress: '0xce71f5957f481a77161f368ad6dfc61d694cf171',
    uniswapV3FactoryAddress: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xF81c9Fa29fAF9Ff7CD7f582Ab301cC2Cc8551Ee7',
    universalRouterAddress: '0x99A2B8cE2a52F2B0e689b540d8464222650696DC',
    wethAddress: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
    wethUsdtPairAddress: '0x77f1a0ab2b0af8343640490264c65be6581bde3c',
    wethDecimal: 18,
    usdtAddress: '0xb72bc8971d5e595776592e8290be6f31937097c6',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x20893BBb093b0fdc669991236F6170ceCD101737',
    scan: 'https://sepolia.etherscan.io/tx/',
    defaultTokenIn: {
      name: 'ETH',
      symbol: 'ETH',
      logoUrl: '/eth-logo.svg',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '18',
    },
    defaultTokenOut: {
      name: 'USDT',
      symbol: 'USDT',
      logoUrl: '/usdt.svg',
      contractAddress: '0xb72bc8971d5e595776592e8290be6f31937097c6',
      balance: '0',
      decimals: '6',
    },
  },
  '8453': {
    rpcUrl:
      'https://base-mainnet.g.alchemy.com/v2/pYR_0-1KLcH-cJ_j_7dWOAWByJmPM-bN',
    /*     'https://public.stackup.sh/api/v1/node/ethereum-sepolia', */
    verificationURL: 'https://api.basescan.org/api',
    chainId: 8453,
    verificationApiKey: '26DA1KNJPI4SMP8GUDAUA4611JIHQK16AD',
    uniswapV2RouterAddress: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
    uniswapV2FactoryAddress: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV3FactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xc4E637D37113192F4F1F060DaEbD7758De7F4131',
    universalRouterAddress: '0x0067f21ca3530ca23846612ea64f17c2932f1f63',
    wethAddress: '0x4200000000000000000000000000000000000006',
    wethUsdtPairAddress: '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C',
    wethDecimal: 18,
    usdtAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x2121136F02acb8162e4E7C74Cc8A064e3C40A10c',
    scan: 'https://basescan.org/tx/',
    defaultTokenIn: {
      name: 'ETH',
      symbol: 'ETH',
      logoUrl: '/eth-logo.svg',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '18',
    },
    defaultTokenOut: {
      name: 'USDC',
      symbol: 'USDC',
      logoUrl: '/usdc.svg',
      contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      balance: '0',
      decimals: '6',
    },
  },
  '995': {
    rpcUrl: 'https://rpc.5ire.network',
    /*     'https://public.stackup.sh/api/v1/node/ethereum-sepolia', */
    verificationURL: 'https://api.basescan.org/api',
    chainId: 995,
    verificationApiKey: '26DA1KNJPI4SMP8GUDAUA4611JIHQK16AD',
    uniswapV2RouterAddress: '0x4e823D28e97b06f4230132701b4f40a2467dB4F2',
    uniswapV2FactoryAddress: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV3FactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x6Dd2d8479C1a78D0EF7F2327B5A70afe01bB55E2',
    universalRouterAddress: '0x0067f21ca3530ca23846612ea64f17c2932f1f63',
    wethAddress: '0x4200000000000000000000000000000000000006',
    wethUsdtPairAddress: '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C',
    wethDecimal: 18,
    usdtAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x2121136F02acb8162e4E7C74Cc8A064e3C40A10c',
    scan: 'https://basescan.org/tx/',
    defaultTokenIn: {
      name: 'ETH',
      symbol: 'ETH',
      logoUrl: '/eth-logo.svg',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '18',
    },
    defaultTokenOut: {
      name: 'USDC',
      symbol: 'USDC',
      logoUrl: '/usdc.svg',
      contractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      balance: '0',
      decimals: '6',
    },
  },
};
