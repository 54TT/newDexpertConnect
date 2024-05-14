export const judgeStablecoin = (idOne: string, idTwo: string, chain: string) => {
    const id0 = idOne.toLowerCase()
    const id1 = idTwo.toLowerCase()
    //   eth链下的   稳定币
    // '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 'WETH',
    // '0x6b175474e89094c44da98b954eedeac495271d0f', 'DAI',
    // '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 'USDC',
    // '0xdac17f958d2ee523a2206206994597c13d831ec7', 'USDT',
    // base 链下的稳定币
    // "0x4200000000000000000000000000000000000006"  WETH
    const all: any = {
        Ethereum: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        BASE: '0x4200000000000000000000000000000000000006'
    }
    //   判断  weth的
    if ((id0 !== all[chain] && id1 !== all[chain]) || (id0 === all[chain] && id1 === all[chain])) {
        return 2
    } else if (id0 !== all[chain]) {
        return 0
    } else {
        return 1
    }
}

export const chain: any = {
    Ethereum: 'https://dexpertpairs.lol/subgraphs/name/ethereum/uniswapv2',
    Arbitrum: "https://dexpertpairs.lol/subgraphs/name/arbitrum/uniswapv2",
    BASE: 'https://dexpertpairs.lol/subgraphs/name/base/uniswapv2',
    Polygon: 'https://dexpertpairs.lol/subgraphs/name/polygon/uniswapv2',
    BNB: 'https://dexpertpairs.lol/subgraphs/name/bsc/uniswapv2',
    Optimism: 'https://dexpertpairs.lol/subgraphs/name/optimism/uniswapv2',
}

export const rpcLink: any = {
    Ethereum: 'https://eth-mainnet.g.alchemy.com/v2/BhTc3g2lt1Qj3IagsyOJsH5065ueK1Aw',
    Arbitrum: "https://arb-mainnet.g.alchemy.com/v2/Fqghe_WhrdEyMYhFnt5S9XSZh3rfaF2R",
    BASE: 'https://base-mainnet.g.alchemy.com/v2/4rlBifaC-p1sVKE1LbGWAsDAoCSFkIEr',
    Optimism: "https://opt-mainnet.g.alchemy.com/v2/tZLGIvPXHqe_SVu8jTwAYnDPPLiREdjh",
    Polygon: 'https://polygon-mainnet.g.alchemy.com/v2/RPyff7EXSXwk_yHReuS79yldR8leQ6si',
    BNB: 'https://bsc-mainnet.nodereal.io/v1/233ca173728d462095e7ac0c807fffe7',
}

export const chainParams = [{value: 'Ethereum', icon: '/EthereumChain.svg'}, {
    value: 'Arbitrum',
    icon: '/Arbitrum.svg'
}, {value: 'Avalanche', icon: '/AvalancheCoin.svg'}, {value: 'BNB', icon: '/BNBChain.svg'}, {
    value: 'Polygon',
    icon: '/PolygonCoin.svg'
}, {value: 'Optimism', icon: '/Optimism.svg'}, {value: 'Blast', icon: '/Blast.svg'}, {
    value: 'BASE',
    icon: '/BASE.png'
}, {value: 'Celo', icon: '/Celo.svg'},]

