type ChainIdList = '1' | '11155111';

export const config: Record<ChainIdList, any> = {
  '1': {
    rpcUrl:
      'https://eth-mainnet.g.alchemy.com/v2/yvW_w6m8ti-CX4tjL7XQYU_6BbIUX3O7',
    chainId: 1,
    verificationURL: 'https://api.etherscan.io/api',
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uncxAddress: '0x663A5C229c09b049E36dCc11a9B0d4a8Eb9db214',
    uniswapV2RouterAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    uniswapV2FactoryAddress: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    universalRouterAddress: '0x2299422d7631731dA6116d1C3b6691348Df27671',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethUsdtPairAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    wethDecimal: 18,
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
  },
  '11155111': {
    rpcUrl:
      'https://eth-sepolia.g.alchemy.com/v2/9XFPPIAIzHPbfcr7BV6hPwNeMS65beJC',
    verificationURL: 'https://api-sepolia.etherscan.io/api',
    chainId: 11155111,
    verificationApiKey: 'QEAE2M96IB94MVPUN7ESQEBNI416F1EWRR',
    uncxAddress: '0xdc5adc1c05fd9e46200349258f74761b0a75baa7',
    uniswapV2RouterAddress: '0xb22ce52905d25987321d6bf73d1705886f1cc4f4',
    uniswapV2FactoryAddress: '0xce71f5957f481a77161f368ad6dfc61d694cf171',
    permit2Address: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    universalRouterAddress: '0xD06CBe0ec2138c7aAFA8eAB031EA164f5c1C6bC1',
    wethAddress: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
    wethUsdtPairAddress: '0x77f1a0ab2b0af8343640490264c65be6581bde3c',
    wethDecimal: 18,
    usdtAddress: '0xb72bc8971d5e595776592e8290be6f31937097c6',
    usdtDecimal: 6,
    ethAddress: '0x0000000000000000000000000000000000000000',
    zeroAddress: '0x0000000000000000000000000000000000000000',
  },
};
