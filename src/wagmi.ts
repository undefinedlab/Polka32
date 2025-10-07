import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Paseo PassetHub chain
const paseoPassetHub = defineChain({
  id: 420420422,
  name: 'Paseo PassetHub',
  nativeCurrency: {
    decimals: 18,
    name: 'PAS',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: ['https://paseo-assethub.polkadot.io'], // You may need to update this RPC URL
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://paseo-assethub.polkadot.io' },
  },
});

export const config = getDefaultConfig({
  appName: 'Polkadot ESP32 Platform',
  projectId: 'YOUR_PROJECT_ID', // Get this from https://cloud.walletconnect.com
  chains: [
    paseoPassetHub,
  ],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
