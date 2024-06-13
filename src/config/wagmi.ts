import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]:
      http(),
      /* 'https://eth-sepolia.g.alchemy.com/v2/3GkmJVXjddQflFMdyVbxbc80VjGn2R5n' */
  },
});
