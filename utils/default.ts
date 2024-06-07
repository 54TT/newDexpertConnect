import axios from 'axios'
import {PactCommand} from "@kadena/client";
import {
    DEFAULT_COSMOS_EVENTS,
    DEFAULT_COSMOS_METHODS,
    DEFAULT_EIP155_METHODS,
    DEFAULT_EIP155_OPTIONAL_METHODS,
    DEFAULT_EIP_155_EVENTS,
    DEFAULT_KADENA_EVENTS,
    DEFAULT_KADENA_METHODS,
    DEFAULT_MULTIVERSX_EVENTS,
    DEFAULT_MULTIVERSX_METHODS,
    DEFAULT_NEAR_EVENTS,
    DEFAULT_NEAR_METHODS,
    DEFAULT_POLKADOT_EVENTS,
    DEFAULT_POLKADOT_METHODS,
    DEFAULT_SOLANA_EVENTS,
    DEFAULT_SOLANA_METHODS,
    DEFAULT_TEZOS_EVENTS,
    DEFAULT_TEZOS_METHODS,
    DEFAULT_TRON_EVENTS,
    DEFAULT_TRON_METHODS
} from "./constants";

const WALLETCONNECT_RPC_BASE_URL = `https://rpc.walletconnect.com/v1?projectId=0de2508201e9e52185bad284b82cf1da`;
export const DEFAULT_APP_METADATA = {
    name: "DexPert",
    description: "DexPert for WalletConnect",
    url: "https://dexpert.io//",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
    // verifyUrl: "https://verify.walletconnect.com",
};

export const DEFAULT_PROJECT_ID = '0de2508201e9e52185bad284b82cf1da';
export const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com';

export const DEFAULT_LOGGER = "debug";


const kadenaNumberOfChains:any = {
    mainnet01: 0,
    testnet04: 0,
};

export async function getKadenaChainAmount(
    WCNetworkId:string
) {
    const ENDPOINT = WCNetworkId === "testnet04" ? "testnet." : "";
    try {
        const response = await fetch(`https://api.${ENDPOINT}chainweb.com/info`, {
            mode: "cors",
        });
        const json:any = await response.json();
        return json.nodeNumberOfChains;
    } catch (e) {
        return 0;
    }
}

async function getKadenaBalanceForChain(
    publicKey:any,
    WCNetworkId:any,
    kadenaChainID:any
) {
    const ENDPOINT = WCNetworkId === "testnet04" ? "testnet." : "";
    const API_HOST = `https://api.${ENDPOINT}chainweb.com/chainweb/0.0/${WCNetworkId}/chain/${kadenaChainID}/pact`;
    // This request will fail if there is no on-chain activity for the given account yet
    try {
        const command = new PactCommand();
        command.code = `(coin.get-balance "k:${publicKey}")`;
        command.setMeta(
            {sender: `k:${publicKey}`, chainId: kadenaChainID},
            WCNetworkId
        );
        const {result} = await command.local(API_HOST, {
            preflight: false,
            signatureVerification: false,
        });

        if (result.status !== "success") return 0;

        return result.data * 10e17;
    } catch (e) {
        return 0;
    }
}


export async function apiGetKadenaAccountBalance(
    publicKey:any,
    WCNetworkId:any
) {
    if (!kadenaNumberOfChains[WCNetworkId]) {
        kadenaNumberOfChains[WCNetworkId] = await getKadenaChainAmount(WCNetworkId);
    }
    const chainBalances = await Promise.all(
            Array.from(Array(kadenaNumberOfChains[WCNetworkId])).map(
                async (_val, chainNumber) =>
                    getKadenaBalanceForChain(
                        publicKey,
                        WCNetworkId,
                        chainNumber.toString()
                    )
            )
        )
    ;

    const totalBalance = chainBalances.reduce((acc, item) => acc + item, 0);

    return {
        balance: totalBalance.toString(),
        symbol: "KDA",
        name: "KDA",
    };
}

export const rpcProvidersByChainId:any = {
    1: {
        name: "Ethereum Mainnet",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:1",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    5: {
        name: "Ethereum Goerli",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:5",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    137: {
        name: "Polygon Mainnet",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:137",
        token: {
            name: "Matic",
            symbol: "MATIC",
        },
    },
    280: {
        name: "zkSync Era Testnet",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:280",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    324: {
        name: "zkSync Era",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:324",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    80001: {
        name: "Polygon Mumbai",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:80001",
        token: {
            name: "Matic",
            symbol: "MATIC",
        },
    },
    10: {
        name: "Optimism",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:10",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    420: {
        name: "Optimism Goerli",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:420",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    42161: {
        name: "Arbitrum",
        baseURL: WALLETCONNECT_RPC_BASE_URL + "&chainId=eip155:42161",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    421611: {
        name: "Arbitrum Rinkeby",
        baseURL: "https://rinkeby.arbitrum.io/rpc",
        token: {
            name: "Ether",
            symbol: "ETH",
        },
    },
    100: {
        name: "xDAI",
        baseURL: "https://xdai-archive.blockscout.com",
        token: {
            name: "xDAI",
            symbol: "xDAI",
        },
    },
    42220: {
        name: "Celo",
        baseURL: "https://rpc.walletconnect.com/v1",
        token: {
            name: "CELO",
            symbol: "CELO",
        },
    },
    44787: {
        name: "Celo Alfajores",
        baseURL: "https://alfajores-forno.celo-testnet.org",
        token: {
            name: "CELO",
            symbol: "CELO",
        },
    },
};

const api = axios.create({
    baseURL: "https://rpc.walletconnect.com/v1",
    timeout: 10000, // 10 secs
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export async function apiGetAccountBalance(
    address:any,
    chainId:any
) {
    const [namespace, networkId] = chainId.split(":");
    if (namespace === "kadena") {
        return apiGetKadenaAccountBalance(
            address,
            networkId
        )
    }
    if (namespace !== "eip155") {
        return {balance: "", symbol: "", name: ""};
    }
    const ethChainId = chainId.split(":")[1];
    const rpc = rpcProvidersByChainId[Number(ethChainId)]
    if (!rpc) {
        return {balance: "", symbol: "", name: ""};
    }
    const {baseURL, token} = rpc;
    const response = await api.post(baseURL, {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
    });
    const {result} = response.data;
    const balance = parseInt(result, 16).toString();
    return {balance, ...token};
}

export const getNamespacesFromChains = (chains:any) => {
    const supportedNamespaces = [] as any
    chains.forEach((chainId:any) => {
        const [namespace] = chainId.split(":");
        if (!supportedNamespaces.includes(namespace)) {
            supportedNamespaces.push(namespace);
        }
    });
    return supportedNamespaces;
};

export const getSupportedRequiredMethodsByNamespace = (namespace:any) => {
    switch (namespace) {
        case "eip155":
            return Object.values(DEFAULT_EIP155_METHODS);
        case "cosmos":
            return Object.values(DEFAULT_COSMOS_METHODS);
        case "solana":
            return Object.values(DEFAULT_SOLANA_METHODS);
        case "polkadot":
            return Object.values(DEFAULT_POLKADOT_METHODS);
        case "near":
            return Object.values(DEFAULT_NEAR_METHODS);
        case "mvx":
            return Object.values(DEFAULT_MULTIVERSX_METHODS);
        case "tron":
            return Object.values(DEFAULT_TRON_METHODS);
        case "tezos":
            return Object.values(DEFAULT_TEZOS_METHODS);
        case "kadena":
            return Object.values(DEFAULT_KADENA_METHODS);
        default:
          return null
    }
};
export const getSupportedOptionalMethodsByNamespace = (namespace:any) => {
    switch (namespace) {
        case "eip155":
            return Object.values(DEFAULT_EIP155_OPTIONAL_METHODS);
        case "cosmos":
        case "solana":
        case "polkadot":
        case "near":
        case "mvx":
        case "tron":
        case "tezos":
        case "kadena":
            return [];
        default:
           return null
    }
};

export const getOptionalNamespaces = (
    chains:any
) => {
    const selectedNamespaces = getNamespacesFromChains(chains);
    console.log(selectedNamespaces)
    return Object.fromEntries(
        selectedNamespaces.map((namespace:any) => [
            namespace,
            {
                methods: getSupportedOptionalMethodsByNamespace(namespace),
                chains: chains.filter((chain:any) => chain.startsWith(namespace)),
                events: [],
            },
        ])
    )
};
export const getSupportedEventsByNamespace = (namespace:any) => {
    switch (namespace) {
        case "eip155":
            return Object.values(DEFAULT_EIP_155_EVENTS);
        case "cosmos":
            return Object.values(DEFAULT_COSMOS_EVENTS);
        case "solana":
            return Object.values(DEFAULT_SOLANA_EVENTS);
        case "polkadot":
            return Object.values(DEFAULT_POLKADOT_EVENTS);
        case "near":
            return Object.values(DEFAULT_NEAR_EVENTS);
        case "mvx":
            return Object.values(DEFAULT_MULTIVERSX_EVENTS);
        case "tron":
            return Object.values(DEFAULT_TRON_EVENTS);
        case "tezos":
            return Object.values(DEFAULT_TEZOS_EVENTS);
        case "kadena":
            return Object.values(DEFAULT_KADENA_EVENTS);
        default: return  null
    }
};

export const getRequiredNamespaces = (
    chains:any
) => {
    const selectedNamespaces = getNamespacesFromChains(chains);
    return Object.fromEntries(
        selectedNamespaces.map((namespace: any) => [
            namespace,
            {
                methods: getSupportedRequiredMethodsByNamespace(namespace),
                chains: chains.filter((chain:any) => chain.startsWith(namespace)),
                events: getSupportedEventsByNamespace(namespace)
            },
        ])
    )
};


