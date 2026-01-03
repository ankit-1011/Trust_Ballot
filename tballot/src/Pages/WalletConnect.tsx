

import { ConnectButton } from '@rainbow-me/rainbowkit';

const WalletConnect = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 space-y-4 sm:space-y-6">
      <h1 className="press-start-2p-regular text-2xl sm:text-3xl md:text-4xl font-bold text-center">
        Welcome To <span className="text-blue-500">TrustBallot</span>!
      </h1>

      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="press-start-2p-regular font-bold text-lg sm:text-2xl md:text-3xl text-center">
          Connect Your <span className="text-blue-500">Wallet</span>...
        </h2>
        <div className="mt-4">
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}

export default WalletConnect