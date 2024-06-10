export const UniswapV3OracleLibraryAbi = [{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint32","name":"secondsAgo","type":"uint32"}],"name":"consult","outputs":[{"internalType":"int24","name":"arithmeticMeanTick","type":"int24"},{"internalType":"uint128","name":"harmonicMeanLiquidity","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint128","name":"baseAmount","type":"uint128"},{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"}],"name":"getQuoteAtTick","outputs":[{"internalType":"uint256","name":"quoteAmount","type":"uint256"}],"stateMutability":"pure","type":"function"}]