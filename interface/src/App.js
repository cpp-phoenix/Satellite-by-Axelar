import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Swap from './pages/Swap';
import Pools from './pages/Pools';
import Navbar from './components/Navbar';

const moonbase = {
  id: 1287,
  name: 'Moonbase Alpha',
  network: 'moonbase',
  iconUrl: 'https://moonscan.io/images/svg/brands/mainbrand-1.svg?v=22.11.5.0',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Moonbase Alpha',
    symbol: 'DEV',
  },
  rpcUrls: {
    default: 'https://rpc.testnet.moonbeam.network',
  },
  blockExplorers: {
    default: { name: 'Moonbase', url: 'https://moonbase.moonscan.io' },
  },
  testnet: true,
};

const bscTestnet = {
  id: 97,
  name: 'BSC Testnet',
  network: 'bsctestnet',
  iconUrl: 'https://bscscan.com/images/svg/brands/bnb.svg?v=1.3',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'BSC Testnet',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  },
  blockExplorers: {
    default: { name: 'Bscscan', url: 'https://bscscan.com/' },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [chain.goerli, bscTestnet, chain.polygonMumbai, moonbase],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="w-screen h-screen bg-black">
          <Router>
            <Navbar/>
            <Routes>
              <Route path='/' exact element={<Swap/>} />
              <Route path='/pools' element={<Pools/>} />
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
