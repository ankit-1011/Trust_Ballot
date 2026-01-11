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

### Linera Microchains (`linera-app/`) ⚡
- **Rust** - Linera application compiled to Wasm
- **Real-time subscriptions** - WebSocket-based instant updates
- **High throughput** - 1000+ TPS per microchain
- **Sub-second finality** - Milliseconds transaction confirmation
- **User-controlled chains** - Dedicated microchains per user
- **Elastic validators** - Parallel transaction processing
- **Zero-cost idle** - Efficient resource management
- **Cross-chain messaging** - Asynchronous communication
- **No mempool** - Direct block submission
- **Ephemeral chains** - On-demand temporary chains

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

Visit: `http://localhost:5173`

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
├── ⛓️ Contracts/           # Smart Contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   └── hardhat.config.ts
│
└── 🚀 linera-app/          # Linera Application (Future)
    ├── src/lib.rs         # Rust application
    └── Cargo.toml
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

---

## 🚀 Linera Microchains Features

### Architecture Benefits
- **Microchains**: Dedicated chain per user/application
- **Parallel Processing**: Multiple chains process simultaneously
- **Horizontal Scaling**: Add chains, not increase block size
- **User Control**: Users control their microchain

### Performance
- ⚡ **Sub-second Finality**: Milliseconds confirmation
- 🚀 **1000+ TPS**: High throughput capability
- 💰 **Zero-cost Idle**: Inactive chains free
- 📊 **Elastic Scaling**: Auto-scales with demand
- 🔄 **No Mempool**: Direct submission, no waiting

### Real-time Capabilities
- 📡 **WebSocket Subscriptions**: Live vote updates
- 🔔 **Event Streaming**: Real-time notifications
- 📈 **Live Analytics**: Instant vote counts
- 🎯 **Instant Feedback**: Immediate confirmations

### Developer Experience
- 🛠️ **Rust/Wasm**: Type-safe, performant
- 🔌 **JavaScript SDK**: Easy integration
- 📦 **Modular**: Reusable components
- 🧪 **Fast Dev**: Quick iteration
- 🔐 **Secure**: BFT consensus

### Cost Benefits
- 💵 **Lower Fees**: Efficient architecture
- ⚡ **Batch Ops**: Multiple operations per tx
- 🎯 **Targeted**: Only active chains consume
- 📉 **Reduced Overhead**: Minimal maintenance

### Planned Features
- 📈 Analytics dashboard
- 🔔 Email notifications
- 📱 Mobile app
- 🌍 Multi-language support
- 🎨 Custom themes
- 📊 Advanced voting methods

---

## 📚 Documentation

- **[PROJECT_PREVIEW.md](./PROJECT_PREVIEW.md)** - Comprehensive project overview
- **[LINERA_FEATURES.md](./LINERA_FEATURES.md)** - Complete Linera features guide ⭐
- **[LINERA_MIGRATION.md](./LINERA_MIGRATION.md)** - Linera migration guide
- **[MIGRATION_STEPS.md](./MIGRATION_STEPS.md)** - Step-by-step migration
- **[SECURITY.md](./SECURITY.md)** - Security practices

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Demo**: https://trust-ballot-zujo.vercel.app
- **Backend API**: https://trust-ballot.onrender.com
- **GitHub**: [Repository URL]

---

## 💡 Key Highlights

✨ **Decentralized** - No single point of failure  
🔒 **Transparent** - All votes verifiable on-chain  
⚡ **Fast** - Optimized for performance  
🎨 **Beautiful** - Modern, responsive UI  
🚀 **Scalable** - Ready for Linera migration  
📱 **Mobile-First** - Works on all devices  

---

**Built with ❤️ for transparent, democratic voting**

## 🙏 Acknowledgments

- Ethereum Foundation
- Linera Protocol
- React Team
- All contributors
