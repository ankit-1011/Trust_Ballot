# 🗳️ TrustBallot

**Decentralized, transparent, and privacy-first voting platform**

## 📖 Overview

TrustBallot is a full-stack decentralized voting application that enables secure, transparent, and verifiable elections on the blockchain. Built with modern web technologies and designed for real-time updates.

### ✨ Key Features

- 🗳️ **Blockchain Voting** - All votes recorded on-chain for transparency
- 🔐 **Secure & Verifiable** - Smart contract enforced security
- ⚡ **Real-time Updates** - Live vote counts and election state
- 👥 **Voter Management** - Self-registration and admin controls
- 🎨 **Modern UI** - Beautiful, responsive 8-bit retro theme
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔄 **Complete Lifecycle** - Create → Start → Vote → End → Results

---

## 🏗️ Architecture

### Frontend (`tballot/`)
- **React 19** + **TypeScript** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **wagmi** + **RainbowKit** - Ethereum wallet integration
- **React Router DOM 7** - Client-side routing

### Backend (`Backend/`)
- **Node.js** + **Express** - REST API server
- **MongoDB** - User authentication
- **Pinata** - IPFS image storage
- **JWT** - Secure authentication
- **Nodemailer** - Email notifications

### Smart Contracts (`Contracts/`)
- **Solidity** - Ethereum smart contracts
- **Hardhat** - Development framework
- **TrustBallot.sol** - Main voting contract

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- pnpm (recommended) or npm
- MetaMask or compatible wallet
- MongoDB database
- Pinata account (for IPFS)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Trust_Ballot
```

2. **Install dependencies**

Frontend:
```bash
cd tballot
pnpm install
```

Backend:
```bash
cd Backend
pnpm install
```

Contracts:
```bash
cd Contracts
pnpm install
```

3. **Set up environment variables**

Frontend (`.env`):
```env
VITE_API_URL=http://localhost:3000
VITE_PINATA_JWT=your_pinata_jwt
VITE_GATEWAY_URL=your_gateway_url
```

Backend (`.env`):
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
```

4. **Deploy smart contract**
```bash
cd Contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

5. **Run the application**

Backend:
```bash
cd Backend
pnpm dev
```

Frontend:
```bash
cd tballot
pnpm dev
```

Visit: `https://trust-ballot-zujo.vercel.app/`

---

## 📁 Project Structure

```
Trust_Ballot/
├── 📱 tballot/              # Frontend React App
│   ├── src/
│   │   ├── Pages/          # Main pages
│   │   ├── Contracts/      # Blockchain interactions
│   │   ├── components/     # UI components
│   │   └── config/         # Configuration
│   └── package.json
│
├── 🔧 Backend/             # Express API Server
│   ├── server.ts          # Main server
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── controllers/       # Business logic
│
└── ⛓️ Contracts/           # Smart Contracts
    ├── contracts/         # Solidity contracts
    ├── scripts/           # Deployment scripts
    └── hardhat.config.ts
```

---

## 🎮 User Flows

### Voter Journey
1. Visit landing page
2. Connect wallet (MetaMask)
3. Register as voter
4. View candidates
5. Cast vote
6. See real-time results

### Admin Journey
1. Connect wallet (owner address)
2. Start election
3. Add candidates
4. Monitor votes in real-time
5. End election
6. View winner

---

## 🎨 Features

### UI/UX
- ✨ 8-bit retro theme
- 🎬 Smooth animations
- 🔔 Toast notifications

### Security
- 🔐 Blockchain verification
- 🛡️ One vote per voter
- 👑 Owner-only controls
- 📦 IPFS storage
- 🔑 JWT authentication

### Smart Contract
- 📊 Election state management
- 👥 Voter registration
- 🎯 Candidate management
- 🗳️ Voting mechanism
- 🏆 Winner calculation

--

## 🌐 Deployment

### Frontend
- **Platform**: Vercel
- **URL**: https://trust-ballot-zujo.vercel.app
- **Status**: ✅ Deployed

### Backend
- **Platform**: Render
- **URL**: https://trust-ballot.onrender.com
- **Status**: ✅ Deployed

### Smart Contracts
- **Network**: Sepolia Testnet
- **Status**: ✅ Deployed


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Key Highlights

✨ **Decentralized** - No single point of failure  
🔒 **Transparent** - All votes verifiable on-chain  
⚡ **Fast** - Optimized for performance  
🎨 **Beautiful** - Modern, responsive UI  
📱 **Mobile-First** - Works on all devices  
