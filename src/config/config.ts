type ChainIdList =
  | '1'
  | '11155111'
  | '8453'
  | '995'
  | '997'
  | '200901'
  | '200810'
  | '97'
  | '3441006'
  | '169'
  | '71'
  | '1030';
export const config: Record<ChainIdList, any> = {
  '1': {
    rpcUrl:
      'https://eth-mainnet.g.alchemy.com/v2/pYR_0-1KLcH-cJ_j_7dWOAWByJmPM-bN',
    chainId: 1,
    name: 'Mainnet',
    verificationURL: 'https://api.etherscan.io/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x663A5C229c09b049E36dCc11a9B0d4a8Eb9db214',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://etherscan.io/tx/',
    tokenScan: 'https://etherscan.io/token/',
    scanName: 'Etherscan',
    launchFee: '0.08',
    tokenSymbol: 'ETH',
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
    name: 'Sepolia',
    // zeroName: 'SepoliaETH',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0xb22ce52905d25987321d6bf73d1705886f1cc4f4',
    uniswapV2FactoryAddress: '0xce71f5957f481a77161f368ad6dfc61d694cf171',
    uniswapV3FactoryAddress: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xF81c9Fa29fAF9Ff7CD7f582Ab301cC2Cc8551Ee7',
    universalRouterAddress: '0xF2f344e5fBf4FA8aAC548a8401c8E023b2783A92',
    wethAddress: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    wethUsdtPairAddress: '0x77f1a0ab2b0af8343640490264c65be6581bde3c',
    wethDecimal: 18,
    decimals: 18,
    tokenFactoryManagerAddress: '0x2F0c4B7c8DEb6562446410ab1Ba92D9106C85B4b',
    standardTokenFactoryAddress01: '0xA296c093C9b0eB4f710F4Aa5DECcD08A550e28Cf',
    standardTokenFactoryAddress02: '0xa3130Db2f60248d46ED39CC2D9EeEA46Dd7d3fA7',
    launchFee: '0.08',
    usdtAddress: '0xb72bc8971d5e595776592e8290be6f31937097c6',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    tokenSymbol: 'ETH',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x20893BBb093b0fdc669991236F6170ceCD101737',
    scan: 'https://sepolia.etherscan.io/tx/',
    tokenScan: 'https://sepolia.etherscan.io/token/',
    scanName: 'Sepolia etherscan',
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
    name: 'Base Mainnet',
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
    launchFee: '0.08',
    tokenSymbol: 'ETH',
    decimals: 18,
    usdtAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x2121136F02acb8162e4E7C74Cc8A064e3C40A10c',
    scan: 'https://basescan.org/tx/',
    tokenScan: 'https://basescan.org/token/',
    scanName: 'Basescan',
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
    verificationURL: 'https://contract.evm.scan.5ire.network/5ire/verify',
    chainId: 995,
    name: '5ire Mainnet',
    verificationApiKey: 'fireqa',
    uniswapV2RouterAddress: '0x4e823D28e97b06f4230132701b4f40a2467dB4F2',
    uniswapV2FactoryAddress: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV3FactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x6Dd2d8479C1a78D0EF7F2327B5A70afe01bB55E2',
    universalRouterAddress: '0x0067f21ca3530ca23846612ea64f17c2932f1f63',
    wethAddress: '0xcDF6E265468c8f3266E8840B712Bb2cDa07f8792',
    wethUsdtPairAddress: '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    tokenSymbol: '5ire',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x2121136F02acb8162e4E7C74Cc8A064e3C40A10c',
    scan: 'https://5irescan.io/contract/evm//tx/',
    tokenScan: 'https://5irescan.io/contract/evm/',
    scanName: '5irescan',
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
    launchFee: '0.08',
  },
  '997': {
    rpcUrl: 'https://qa-http-nodes.5ire.network',
    /*     'https://public.stackup.sh/api/v1/node/ethereum-sepolia', */
    verificationURL: 'https://api.basescan.org/api',
    name: '5ire Testnet',
    chainId: 997,
    verificationApiKey: '26DA1KNJPI4SMP8GUDAUA4611JIHQK16AD',
    uniswapV2RouterAddress: '0xC4227695a1Cf0dc5A805f8b2c4C2aeE151879dE2',
    uniswapV2FactoryAddress: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV3FactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xEc51D3b24Fe59e6Cf39C1ccB4f71ade54E1d2DcB',
    universalRouterAddress: '0x0067f21ca3530ca23846612ea64f17c2932f1f63',
    wethAddress: '0x6Dd2d8479C1a78D0EF7F2327B5A70afe01bB55E2',
    wethUsdtPairAddress: '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdtDecimal: 6,
    tokenSymbol: '5ire',
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x2121136F02acb8162e4E7C74Cc8A064e3C40A10c',
    scan: 'https://scan.qa.5ire.network/contract/evm/tx/',
    tokenScan: 'https://scan.qa.5ire.network/contract/evm/',
    scanName: '5ire testscan',
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
    launchFee: '0.08',
  },
  '200810': {
    rpcUrl: 'https://testnet-rpc.bitlayer.org',
    chainId: 200810,
    name: 'Bitlayer Testnet',
    verificationURL: 'https://api.etherscan.io/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x6239cA7C648EEC451f1152BEfb003eB322139455',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xa207B7Aa60791D5118E3A185933F8Dc486F5081a',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 8,
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    tokenSymbol: 'BTC',
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://testnet.btrscan.com/tx/',
    tokenScan: 'https://testnet.btrscan.com//token/',
    scanName: 'Bitlayer testscan',
    launchFee: '0.08',
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
  '200901': {
    rpcUrl: 'https://rpc.bitlayer.org',
    chainId: 200901,
    name: 'Bitlayer Mainnet',
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x774960245f1113c26d0548886F55298266C8fF45',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x9d56d4a323cD8de983706DE8847d7525c49CcEa0',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 8,
    tokenSymbol: 'BTC',
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://www.btrscan.com/tx/',
    tokenScan: 'https://www.btrscan.com/token/',
    scanName: 'Bitlayer scan',
    launchFee: '0.08',
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
  '97': {
    rpcUrl: 'https://bsc-testnet-dataseed.bnbchain.org',
    name: 'Bsc Testnet',
    chainId: 97,
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xf28E3A654cf976Ce0A0e8D15954f97d784d9367f',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    tokenSymbol: 'BNB',
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://testnet.bscscan.com/tx/',
    tokenScan: 'https://testnet.bscscan.com/token/',
    scanName: 'Bsc testscan',
    launchFee: '0.08',
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
  // '56': {
  //   rpcUrl: 'https://bsc-dataseed.bnbchain.org',
  //   chainId: 56,
  // name: 'Bnb',
  //   verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
  //   verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
  //   uniswapV2RouterAddress: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
  //   uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
  //   uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  //   permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
  //   uncxAddress: '0xf28E3A654cf976Ce0A0e8D15954f97d784d9367f',
  //   universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
  //   wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //   wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
  //   wethDecimal: 18,
  //   decimals: 18,
  //   usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  //   usdtDecimal: 6,
  //   ethAddress: '0x0000000000000000000000000000000000000000',
  //   zeroAddress: '0x0000000000000000000000000000000000000000',
  //   uniswapV3FeeAmounts: [500, 3000, 10000],
  //   quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  //   scan: 'https://etherscan.io/tx/',
  //   launchFee: '0.08',
  //   defaultTokenIn: {
  //     name: 'ETH',
  //     symbol: 'ETH',
  //     logoUrl: '/eth-logo.svg',
  //     contractAddress: '0x0000000000000000000000000000000000000000',
  //     balance: '0',
  //     decimals: '18',
  //   },
  //   defaultTokenOut: {
  //     name: 'USDT',
  //     symbol: 'USDT',
  //     logoUrl: '/usdt.svg',
  //     contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  //     balance: '0',
  //     decimals: '6',
  //   },
  // },
  '3441006': {
    rpcUrl: 'https://pacific-rpc.sepolia-testnet.manta.network/http',
    chainId: 3441006,
    name: 'Manta Sepolia',
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x7aa304e9175B634B9949135D828053335Ed78276',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://pacific-explorer.sepolia-testnet.manta.network/tx/',
    launchFee: '0.08',
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
  '71': {
    rpcUrl: 'https://evmtestnet.confluxrpc.com',
    name: 'Conflux Testnet',
    chainId: 71,
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x7C9BBd6c84D882574898Ce193Ba3caDa6B1DCB49',
    uniswapV2FactoryAddress: '0x822935C2240E6A0b5C96E3eA355446a83ed12C03',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x208931C00a31c2C3d0e313d4434DDAEF260a3510',
    uncxAddress: '0xE2c45bB7eeBE05c3b1eC5865abA719F7F4bCDee9',
    universalRouterAddress: '0x5c3A493A279dD744f07bC8269311E8F21908184a',
    wethAddress: '0x981B2eFF0F890ef6319879284a49A81c149bc770',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    tokenSymbol: 'CFX',
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://evmtestnet.confluxscan.net/tx/',
    tokenScan: 'https://evmtestnet.confluxscan.net/address/',
    launchFee: '0.8',
    defaultTokenIn: {
      name: 'CFX',
      symbol: 'CFX',
      logoUrl: '/conflux-logo.png',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '18',
    },
    defaultTokenOut: {
      name: 'USDT',
      symbol: 'USDT',
      logoUrl: '/usdt.svg',
      contractAddress: '0x193B740874a723f00a51a05E6d5eb60bFCeCFA90',
      balance: '0',
      decimals: '6',
    },
  },
  '1030': {
    rpcUrl: 'https://evm.confluxrpc.com',
    name: 'Conflux Mainnet',
    chainId: 1030,
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x62b0873055Bf896DD869e172119871ac24aEA305',
    uniswapV2FactoryAddress: '0xE2a6F7c0ce4d5d300F97aA7E125455f5cd3342F5',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0xCe2a41B655f9180F02f47DD591c359dae12C043e',
    uncxAddress: '0xb55bF103dA5cB8Ed06cf1bD4132A1603e1Dde6D0',
    universalRouterAddress: '0x38DEC32fd6055c6c6A4e46f65362a30c2d02D2A3',
    wethAddress: '0x14b2D3bC65e74DAE1030EAFd8ac30c533c976A9b',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    tokenSymbol: 'CFX',
    usdtAddress: '0xfe97E85d13ABD9c1c33384E796F10B73905637cE',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://evm.confluxscan.net/tx/',
    tokenScan: 'https://evm.confluxscan.net/address/',
    launchFee: '0.8',
    defaultTokenIn: {
      name: 'CFX',
      symbol: 'CFX',
      logoUrl: '/conflux-logo.png',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '18',
    },
    defaultTokenOut: {
      name: 'USDT',
      symbol: 'USDT',
      logoUrl: '/usdt.svg',
      contractAddress: '0xfe97E85d13ABD9c1c33384E796F10B73905637cE',
      balance: '0',
      decimals: '18',
    },
  },
  '169': {
    rpcUrl: 'https://pacific-rpc.manta.network/http',
    chainId: 169,
    name: 'Manta Mainnet',
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xf28E3A654cf976Ce0A0e8D15954f97d784d9367f',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://pacific-explorer.manta.network/tx/',
    tokenScan: 'https://testnet.bscscan.com/token/',
    scanName: 'Manta scan',
    launchFee: '0.08',
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
};
