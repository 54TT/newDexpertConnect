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
  | '71';
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
    scan: 'https://etherscan.io/tx/',
    tokenScan: 'https://etherscan.io/token/',
    scanName: 'Etherscan',
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
    wethAddress: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
    wethUsdtPairAddress: '0x77f1a0ab2b0af8343640490264c65be6581bde3c',
    wethDecimal: 18,
    decimals: 18,
    launchFee: '0.08',
    usdtAddress: '0xb72bc8971d5e595776592e8290be6f31937097c6',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x20893BBb093b0fdc669991236F6170ceCD101737',
    scan: 'https://sepolia.etherscan.io/tx/',
    tokenScan: 'https://sepolia.etherscan.io/token/',
    scanName: 'Sepolia.etherscan',
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
    name: 'Base',
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
    name: '5ire',
    verificationApiKey: 'fireqa',
    uniswapV2RouterAddress: '0x4e823D28e97b06f4230132701b4f40a2467dB4F2',
    uniswapV2FactoryAddress: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV3FactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x6Dd2d8479C1a78D0EF7F2327B5A70afe01bB55E2',
    universalRouterAddress: '0x0067f21ca3530ca23846612ea64f17c2932f1f63',
    wethAddress: '0x4200000000000000000000000000000000000006',
    wethUsdtPairAddress: '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
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
    name: '5ire-test',
    chainId: 995,
    verificationApiKey: '26DA1KNJPI4SMP8GUDAUA4611JIHQK16AD',
    uniswapV2RouterAddress: '0xC4227695a1Cf0dc5A805f8b2c4C2aeE151879dE2',
    uniswapV2FactoryAddress: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV3FactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xEc51D3b24Fe59e6Cf39C1ccB4f71ade54E1d2DcB',
    universalRouterAddress: '0x0067f21ca3530ca23846612ea64f17c2932f1f63',
    wethAddress: '0x4200000000000000000000000000000000000006',
    wethUsdtPairAddress: '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0x2121136F02acb8162e4E7C74Cc8A064e3C40A10c',
    scan: 'https://scan.qa.5ire.network/contract/evm/tx/',
    tokenScan: 'https://scan.qa.5ire.network/contract/evm/',
    scanName: '5ire-test',
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
    name: 'Bitlayer-test',
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
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://testnet.btrscan.com/tx/',
    tokenScan: 'https://testnet.btrscan.com//token/',
    scanName: 'Bitlayer-test',
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
    name: 'Bitlayer',
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
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://www.btrscan.com/tx/',
    tokenScan: 'https://www.btrscan.com/token/',
    scanName: 'Bitlayer',
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
    name: 'Bsc-test',
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
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://testnet.bscscan.com/tx/',
    tokenScan: 'https://testnet.bscscan.com/token/',
    scanName: 'Testnet.bscscan',
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
    name: 'Manta-sepolia',
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
    name: 'Conflux test',
    chainId: 71,
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
  '169': {
    rpcUrl: 'https://pacific-rpc.manta.network/http',
    chainId: 169,
    name: 'Manta',
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
    scan: 'https://pacific-explorer.manta.network/tx',
    tokenScan: 'https://testnet.bscscan.com/token/',
    scanName: 'Testnet.bscscan',
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
