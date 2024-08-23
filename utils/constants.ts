export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  'eip155:1',
  'eip155:10',
  'eip155:100',
  'eip155:137',
  'eip155:324',
  'eip155:42161',
  'eip155:42220',
  'cosmos:cosmoshub-4',
  'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
  'polkadot:91b171bb158e2d3848fa23a9f1c25182',
  'mvx:1',
  'tron:0x2b6653dc',
  'tezos:mainnet',
  'kadena:mainnet01',
];

export type ChainId =
  | '-1'
  | '-2'
  | '1'
  | '11155111'
  | '8453'
  | '995'
  | '997'
  | '200810'
  | '200901'
  | '3441006'
  | '169'
  | '71';
export type ChainName =
  | 'solana'
  | 'ton'
  | 'eth'
  | 'base'
  | 'eth-sepolia'
  | '5ire'
  | '5ire test'
  | 'bitLayer test'
  | 'bitLayer'
  | 'manta-sepolia'
  | 'manta'
  | 'conflux test';

export const ChainID_TO_ChainName: Record<ChainId, ChainName> = {
  '-1': 'solana',
  '-2': 'ton',
  '1': 'eth',
  '11155111': 'eth-sepolia',
  '8453': 'base',
  '995': '5ire',
  '997': '5ire test',
  '200810': 'bitLayer test',
  '200901': 'bitLayer',
  '3441006': 'manta-sepolia',
  '169': 'manta',
  '71': 'conflux test',
};

//  链的  id
export const DEFAULT_TEST_CHAINS = [
  // testnets
  'eip155:5',
  // "eip155:280",
  // "eip155:420",
  // "eip155:80001",
  // "eip155:421611",
  // "eip155:44787",
  // "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K",
  // "polkadot:e143f23803ac50e8f6f8e62695d1ce9e",
  // "near:testnet",
  // "mvx:D",
  // "tron:0xcd8690dc",
  // "tezos:testnet",
  // "kadena:testnet04",
];

export const DEFAULT_PROJECT_ID = '0de2508201e9e52185bad284b82cf1da';
export const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com';

export const DEFAULT_LOGGER = 'debug';

export const DEFAULT_APP_METADATA = {
  name: 'React App',
  description: 'React App for WalletConnect',
  url: 'https://walletconnect.com/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  verifyUrl: 'https://verify.walletconnect.com',
};

export const DEFAULT_EIP155_METHODS = {
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
  PERSONAL_SIGN: 'personal_sign',
};

export const DEFAULT_EIP155_OPTIONAL_METHODS = {
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
};

export const DEFAULT_EIP_155_EVENTS = {
  ETH_CHAIN_CHANGED: 'chainChanged',
  ETH_ACCOUNTS_CHANGED: 'accountsChanged',
};
export const DEFAULT_COSMOS_METHODS = {
  COSMOS_SIGN_DIRECT: 'cosmos_signDirect',
  COSMOS_SIGN_AMINO: 'cosmos_signAmino',
};

export const DEFAULT_COSMOS_EVENTS = {};

export const DEFAULT_SOLANA_METHODS = {
  SOL_SIGN_TRANSACTION: 'solana_signTransaction',
  SOL_SIGN_MESSAGE: 'solana_signMessage',
};

export const DEFAULT_SOLANA_EVENTS = {};

export const DEFAULT_POLKADOT_METHODS = {
  POLKADOT_SIGN_TRANSACTION: 'polkadot_signTransaction',
  POLKADOT_SIGN_MESSAGE: 'polkadot_signMessage',
};

export const DEFAULT_POLKADOT_EVENTS = {};

export const DEFAULT_NEAR_METHODS = {
  NEAR_SIGN_IN: 'near_signIn',
  NEAR_SIGN_OUT: 'near_signOut',
  NEAR_GET_ACCOUNTS: 'near_getAccounts',
  NEAR_SIGN_AND_SEND_TRANSACTION: 'near_signAndSendTransaction',
  NEAR_SIGN_AND_SEND_TRANSACTIONS: 'near_signAndSendTransactions',
};

export const DEFAULT_NEAR_EVENTS = {};

export const DEFAULT_MULTIVERSX_METHODS = {
  MULTIVERSX_SIGN_TRANSACTION: 'mvx_signTransaction',
  MULTIVERSX_SIGN_TRANSACTIONS: 'mvx_signTransactions',
  MULTIVERSX_SIGN_MESSAGE: 'mvx_signMessage',
  MULTIVERSX_SIGN_LOGIN_TOKEN: 'mvx_signLoginToken',
  MULTIVERSX_SIGN_NATIVE_AUTH_TOKEN: 'mvx_signNativeAuthToken',
  MULTIVERSX_CANCEL_ACTION: 'mvx_cancelAction',
};

export const DEFAULT_MULTIVERSX_EVENTS = {};
/**
 * TRON
 */
export const DEFAULT_TRON_METHODS = {
  TRON_SIGN_TRANSACTION: 'tron_signTransaction',
  TRON_SIGN_MESSAGE: 'tron_signMessage',
};

export const DEFAULT_TRON_EVENTS = {};

export const DEFAULT_TEZOS_METHODS = {
  TEZOS_GET_ACCOUNTS: 'tezos_getAccounts',
  TEZOS_SEND: 'tezos_send',
  TEZOS_SIGN: 'tezos_sign',
};

export const DEFAULT_TEZOS_EVENTS = {};

export const DEFAULT_KADENA_METHODS = {
  KADENA_GET_ACCOUNTS: 'kadena_getAccounts_v1',
  KADENA_SIGN: 'kadena_sign_v1',
  KADENA_QUICKSIGN: 'kadena_quicksign_v1',
};

export const zeroAddress = '0x0000000000000000000000000000000000000000';

export const DEFAULT_KADENA_EVENTS = {};

export const CHAIN_NAME_TO_CHAIN_ID = {
  Ethereum: '1',
  Arbitrum: '42161',
  Polygon: '137',
  Optimism: '10',
  Base: '8453',
  BSC: '56',
  Sepolia: '11155111',
  '5ire': '995',
  '5ire-test': '997',
  Biylayer: '200810',
  'Bitlayer-test': '200901',
  'Manta-sepolia': '3441006',
  Manta: '169',
  'Conflux-test': '71',
  Conflux: '1030',
};

export const CHAIN_VERSION_TO_CHAIN_ID = {
  '0x1': '1',
  '0xa4b1': '42161',
  '0x89': '137',
  '0xa': '10',
  '0x2105': '8453',
  '0x38': '56',
  '0xaa36a7': '11155111',
};

// 传给后端需要用这个map
export const ID_TO_CHAIN_NAME_LOW = {
  '1': 'eth',
  '42161': 'arbitrum',
  '137': 'polygon',
  '10': 'optimism',
  '8453': 'base',
  '56': 'bsc',
  '11155111': 'eth-sepolia',
  '995': '5ire',
  '997': '5ire-test',
  '200810': 'bitlayer-test',
  '200901': 'bitlater',
  '3441006': 'manta-sepolia',
  '169': 'manta',
  '71': 'conflux-testnet',
  '1030': 'conflux',
};

export const CHAIN_ID_TO_CHAIN_NAME = () =>
  Object.keys(CHAIN_NAME_TO_CHAIN_ID).reduce((prev, key) => {
    prev = {
      ...prev,
      [CHAIN_NAME_TO_CHAIN_ID[key]]: key,
    };
    return prev;
  }, {});
