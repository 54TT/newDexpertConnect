export type NETWORK_MAPPING_KEY =
  | "1"
  | "11155111"
  | "42161"
  | "8453"
  | "-1"
  | "-2";
  
export const SCAN: Record<NETWORK_MAPPING_KEY, string> = {
  "1": "https://etherscan.io/tx/",
  "11155111": "https://sepolia.etherscan.io/tx/",
  "42161": "https://arbiscan.io/tx/",
  "8453": "https://basescan.org/tx/",
  "-1": "solana",
  "-2": "ton",
};