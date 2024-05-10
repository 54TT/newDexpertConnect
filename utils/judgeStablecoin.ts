export const judgeStablecoin = (idOne: string, idTwo: string) => {
    const id0 = idOne.toLowerCase()
    const id1 = idTwo.toLowerCase()
    // '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 'WETH',
    // '0x6b175474e89094c44da98b954eedeac495271d0f', 'DAI',
    // '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 'USDC',
    // '0xdac17f958d2ee523a2206206994597c13d831ec7', 'USDT',
    //   判断  weth的
    if ((id0 !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && id1 !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') || (id0 === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && id1 === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')) {
        return 2
    } else if (id0 !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
        return 0
    } else {
        return 1
    }
}