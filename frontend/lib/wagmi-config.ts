import { createConfig, http } from 'wagmi';
import { injected } from '@wagmi/core';

import { xLayerTestnet } from './chains';

const xLayerRpcUrl =
  process.env.NEXT_PUBLIC_XLAYER_TESTNET_RPC ?? xLayerTestnet.rpcUrls.default.http[0];

export const wagmiConfig = createConfig({
  chains: [xLayerTestnet],
  connectors: [injected({ shimDisconnect: true })],
  ssr: true,
  transports: {
    [xLayerTestnet.id]: http(xLayerRpcUrl),
  },
});
