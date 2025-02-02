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
  | '1030'
  | '47763';
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
    standardTokenAddress01: '0x5c165587E94d99952C5dD9AeAdc5F87Ecc5Bfb84',
    tokenFactoryManagerAddress: '0xC1CF7DDa75295186b44EEcDa85598966c57DAcE9',
    standardTokenFactoryAddress01: '0x9Ba604031d1a00EA253D777035C588C291881204',
    permit2Address: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
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
    universalRouterAddress: '0x5C0Fe44391ee35856A5De861dFd340197D252624',
    wethAddress: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    wethUsdtPairAddress: '0x77f1a0ab2b0af8343640490264c65be6581bde3c',
    wethDecimal: 18,
    decimals: 18,
    standardTokenAddress01: '0x1f9a21838f3470686aa051661A72d1165C760D83',
    tokenFactoryManagerAddress: '0x283Fc183f86D7d5958ed26B77c97569a160CFD16',
    standardTokenFactoryAddress01: '0x822935C2240E6A0b5C96E3eA355446a83ed12C03',
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
    uniswapV2RouterAddress: '0x61d72865B4d74E23Fbef1233151205d164Ef4439',
    uniswapV2FactoryAddress: '0x414934739DdE0f685e7276Ed5d35c0576Ea6B4Bd',
    uniswapV3FactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    standardTokenAddress01: '0x79B861477012D127a9DE00CA8f0ceD28212aa954',
    tokenFactoryManagerAddress: '0xAB255ECA00D1816f35FED0cdebeA5A4C26C7C311',
    standardTokenFactoryAddress01: '0x6f6f088bA7409E14f60aFA92D3Bee56a7BAd446B',
    uncxAddress: '0x9Ba604031d1a00EA253D777035C588C291881204',
    universalRouterAddress: '0x0067f21ca3530ca23846612ea64f17c2932f1f63',
    wethAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
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
    uniswapV2RouterAddress: '0xA16fC83947D26f8a16cA02DC30D95Af5440C38AD',
    uniswapV2FactoryAddress: '0x8e8867CB4f2E4688ec1962d19A654a084659307c',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    standardTokenAddress01: '0x5e57b4e054A058CD3f69d7626eAe6ba2c1df8162',
    tokenFactoryManagerAddress: '0xd12edb3B94f6Adfed3E223ABb9d95C6AC0C46175',
    standardTokenFactoryAddress01: '0xf02469f4789153a17848bE31d108aCC2b9C9E4a6',
    permit2Address: '0xaACdC2c24401B463F8A50ed8f3F60B5C140aBdcc',
    uncxAddress: '0xa207B7Aa60791D5118E3A185933F8Dc486F5081a',
    universalRouterAddress: '0xd0613571B6Ea6b0Da822A129BBa483c719B05C0D',
    wethAddress: '0x3e57d6946f893314324C975AA9CEBBdF3232967E',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
    uniswapV3FeeAmounts: [500, 3000, 10000],
    tokenSymbol: 'BTC',
    wethLogo: '/wbtc.png',
    quoterAddress: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    scan: 'https://testnet.btrscan.com/tx/',
    tokenScan: 'https://testnet.btrscan.com//token/',
    scanName: 'Bitlayer testscan',
    launchFee: '0.08',
    defaultTokenIn: {
      name: 'BTC',
      symbol: 'BTC',
      logoUrl: '/btc.svg',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '18',
    },
    defaultTokenOut: {
      name: 'USDT',
      symbol: 'USDT',
      logoUrl: '/usdt.svg',
      contractAddress: '0x418da97f8505c0929f67C698625d4bFD9F2E3AaB',
      balance: '0',
      decimals: '18',
    },
  },
  '200901': {
    rpcUrl: 'https://rpc.bitlayer.org',
    chainId: 200901,
    name: 'Bitlayer Mainnet',
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0xB0Cc30795f9E0125575742cFA8e73D20D9966f81',
    uniswapV2FactoryAddress: '0x1037E9078df7ab09B9AF78B15D5E7aaD7C1AfDd0',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0x8E5C368667308Da4D2B3763f7bB70afB8ccbF1FF',
    standardTokenAddress01: '0x79B861477012D127a9DE00CA8f0ceD28212aa954',
    tokenFactoryManagerAddress: '0xAB255ECA00D1816f35FED0cdebeA5A4C26C7C311',
    standardTokenFactoryAddress01: '0x6f6f088bA7409E14f60aFA92D3Bee56a7BAd446B',
    universalRouterAddress: '0x100BF56427202b895827CecFA623006af86FBbd1',
    wethAddress: '0xff204e2681a6fa0e2c3fade68a1b28fb90e4fc5f',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 8,
    tokenSymbol: 'BTC',
    wethLogo: '/wbtc.png',
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
      name: 'BTC',
      symbol: 'BTC',
      logoUrl: '/btc.svg',
      contractAddress: '0x0000000000000000000000000000000000000000',
      balance: '0',
      decimals: '8',
    },
    defaultTokenOut: {
      name: 'USDT',
      symbol: 'USDT',
      logoUrl: '/usdt.svg',
      contractAddress: '0xfe9f969faf8ad72a83b761138bf25de87eff9dd2',
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
    tokenSymbol: 'MANTA',
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
    standardTokenAddress01: '0xe8C0E357dF681B99C823dCE231A09Ef69339da5f',
    tokenFactoryManagerAddress: '0x6f2064286397aF971321aDc6c6c643185365B8a6',
    standardTokenFactoryAddress01: '0xC6Dcd2a66D98f3Cf8F6C7C7d1acA5Cf6CE2Cdb42',
    uncxAddress: '0xE2c45bB7eeBE05c3b1eC5865abA719F7F4bCDee9',
    universalRouterAddress: '0x5c3A493A279dD744f07bC8269311E8F21908184a',
    wethAddress: '0x981B2eFF0F890ef6319879284a49A81c149bc770',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    tokenSymbol: 'CFX',
    wethLogo: '/conflux-logo.png',
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
    uniswapV2RouterAddress: '0x62b0873055bf896dd869e172119871ac24aea305',
    uniswapV2FactoryAddress: '0xe2a6f7c0ce4d5d300f97aa7e125455f5cd3342f5',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    standardTokenAddress01: ' 0x346701B418C5C41410d4D68fC68FD306972F4F8A',
    tokenFactoryManagerAddress: '0x35dE6880c112Fd12ca6C6884Cc1b948CF274A7D5',
    standardTokenFactoryAddress01: '0x9998Bc4B6e148FC4633b274E2CC040B19638F554',
    permit2Address: '0xCe2a41B655f9180F02f47DD591c359dae12C043e',
    uncxAddress: '0xb55bF103dA5cB8Ed06cf1bD4132A1603e1Dde6D0',
    universalRouterAddress: '0x962408EDa28732fAcE8d2BD4056628de044eeEc1',
    wethAddress: '0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    decimals: 18,
    tokenSymbol: 'CFX',
    wethLogo: '/wcfx.png',
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
    tokenSymbol: 'Manta',
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
  '47763': {
    rpcUrl: 'https://mainnet-1.rpc.banelabs.org',
    chainId: 47763,
    name: 'Neo X',
    tokenSymbol: 'NEO',
    verificationURL: 'https://api-testnet.bitlayer.org/scan/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uniswapV2RouterAddress: '0x82b56Dd9c7FD5A977255BA51B96c3D97fa1Af9A9',
    uniswapV2FactoryAddress: '0x753df473702cB31BB81a93966e658e1AA4f10DD8',
    uniswapV3FactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    standardTokenAddress01: ' 0xa8295c0022edcd69a62e2188215D306103C5E25C',
    tokenFactoryManagerAddress: '0xAea63C36CC64ab6E068F79C6D88A7bD1eC9e2Fb2',
    standardTokenFactoryAddress01: '0x5c165587E94d99952C5dD9AeAdc5F87Ecc5Bfb84',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    uncxAddress: '0xf28E3A654cf976Ce0A0e8D15954f97d784d9367f',
    universalRouterAddress: '0x45ed48611aaa13b10aa2af1a954ed164e8662d36',
    wethAddress: '0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF',
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
      name: 'NEO',
      symbol: 'NEO',
      logoUrl: '/neo.svg',
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
