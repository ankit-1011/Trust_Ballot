import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
 
} from '@rainbow-me/rainbowkit';

import {
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';



export const config = getDefaultConfig({
  appName: 'TrustBallot',
  projectId: '2ad42b5adbba1a0bfd3eb8c3813248cc',
  chains: [sepolia, polygon, optimism, arbitrum, base],
  ssr: true, 
});