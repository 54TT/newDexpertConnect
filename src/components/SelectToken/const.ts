export const getGraphQlQuery = (
  queryString: string,
  { first, skip }: { first: number; skip: number }
) => {
  return {
    query: `query MyQuery {\n  _meta {\n    deployment\n    block {\n      number\n    }\n  }\n  uniswapFactories {\n    pairCount\n  }\n  bundles {\n    ethPrice\n  }\n  pairs(\n    where: {or: [{token0_: {name_contains: "${queryString}"}}, {token0_: {symbol_contains: "${queryString}"}}, {token1_: {symbol_contains: "${queryString}"}}, {token1_: {name_contains: "${queryString}"}}]}\n    first: ${first}\n, skip: ${skip}\n orderBy: reserveUSD\n    orderDirection: desc\n  ) {\n    initialReserve\n    initialReserve0\n    initialReserve1\n    reserve0\n    reserve1\n    priceUSD\n    id\n    token1Price\n    token0Price\n    token1 {\n      name\n      id\n      symbol\n    }\n    token0 {\n      name\n      id\n      symbol\n    }\n  }\n}`,
    operationName: 'MyQuery',
    extensions: {},
  };
};
