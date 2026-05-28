import type { Chain } from 'viem';

export const xLayerTestnet = {
  id: 1952,
  name: 'X Layer Testnet',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testrpc.xlayer.tech/terigon'] },
    public: { http: ['https://testrpc.xlayer.tech/terigon'] },
  },
  blockExplorers: {
    default: {
      name: 'OKLink',
      url: 'https://www.oklink.com/x-layer-testnet',
    },
  },
  testnet: true,
} as const satisfies Chain;

export const xLayerExplorerUrl = xLayerTestnet.blockExplorers.default.url;
export const xLayerExplorerName = xLayerTestnet.blockExplorers.default.name;
