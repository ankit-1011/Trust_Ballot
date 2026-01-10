# 🗳️ TrustBallot - Project Preview

## 📋 Overview

**TrustBallot** is a decentralized, transparent, and privacy-first voting platform built on blockchain technology. It enables secure, verifiable elections with real-time updates and a modern user interface.

### 🎯 Key Features

- ✅ **Decentralized Voting**: Blockchain-based voting system for tamper-proof elections
- 🔐 **Secure & Transparent**: All votes are recorded on-chain and verifiable
- ⚡ **Real-time Updates**: Live vote counts and election state changes
- 👥 **Voter Management**: Self-registration and admin-managed voter lists
- 🎨 **Modern UI**: Beautiful, responsive interface with 8-bit retro theme
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🔄 **Election Lifecycle**: Complete election management (Create → Start → Vote → End → Results)

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 19** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router DOM 7** - Client-side routing
- **wagmi** + **RainbowKit** - Ethereum wallet integration
- **ethers.js** - Blockchain interactions

#### Backend
- **Node.js** + **Express** - REST API server
- **MongoDB** - User authentication database
- **Pinata** - IPFS for image storage
- **JWT** - Authentication tokens
- **Nodemailer** - Email notifications

#### Smart Contracts
- **Solidity** - Ethereum smart contracts
- **Hardhat** - Development framework
- **Ethers.js** - Contract interactions

#### Linera Microchains ⚡ (Active Development)
- **Rust** - Linera application compiled to Wasm
- **Real-time subscriptions** - Instant updates via WebSocket
- **High throughput** - Microchains architecture (1000+ TPS)
- **Low latency** - Sub-second transaction finality
- **User-controlled chains** - Dedicated microchains per user/app
- **Elastic validators** - Parallel transaction processing
- **Zero-cost idle chains** - Efficient resource management
- **Cross-chain messaging** - Asynchronous communication
- **No mempool** - Direct block submission
- **Ephemeral chains** - On-demand temporary chains

---

## 📁 Project Structure

```
Trust_Ballot/
├── 📱 tballot/                    # Frontend Application
│   ├── src/
│   │   ├── Pages/                 # Main pages
│   │   │   ├── home.tsx           # Landing page
│   │   │   ├── Dashboard.tsx      # Voting interface
│   │   │   ├── Register.tsx      # Voter registration
│   │   │   ├── Candidate.tsx      # Candidate registration
│   │   │   ├── Voter.tsx          # Voter list
│   │   │   └── AdminElectionToggle.tsx  # Election control
│   │   ├── Contracts/
│   │   │   ├── etherContracts.ts  # Ethereum interactions
│   │   │   └── lineraContracts.ts # Linera integration (new)
│   │   ├── components/           # UI components
│   │   └── config/               # Configuration
│   └── package.json
│
├── 🔧 Backend/                    # Express API Server
│   ├── server.ts                 # Main server
│   ├── routes/
│   │   └── PintaUpload.ts        # IPFS upload
│   ├── models/
│   │   └── SignUp.ts             # User model
│   └── controllers/              # Email controllers
│
├── ⛓️ Contracts/                  # Smart Contracts
│   ├── contracts/
│   │   └── TrustBallot.sol       # Main voting contract
│   ├── scripts/
│   │   └── deploy.ts             # Deployment script
│   └── hardhat.config.ts
│
└── 🚀 linera-app/                 # Linera Application (Future)
    ├── src/
    │   └── lib.rs                # Rust application
    └── Cargo.toml
```

---

## 🎮 User Flows

### 1. **Voter Flow**
```
Landing Page → Connect Wallet → Register as Voter → 
View Candidates → Cast Vote → See Results
```

### 2. **Admin Flow**
```
Landing Page → Connect Wallet → Admin Dashboard →
Start Election → Add Candidates → Monitor Votes → 
End Election → View Winner
```

### 3. **Candidate Registration**
```
Connect Wallet → Register Candidate → Upload Image (IPFS) →
Candidate Added to Election
```

---

## 🎨 UI/UX Features

### Design Highlights
- **8-bit Retro Theme**: Nostalgic gaming aesthetic
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Easy on the eyes
- **Real-time Feedback**: Toast notifications for all actions

### Key Pages

#### 🏠 Landing Page
- Animated hero section
- Feature highlights
- Demo video
- Social links

#### 📊 Dashboard
- Live candidate list
- Real-time vote counts
- One-click voting
- Wallet connection status

#### 👤 Voter Registration
- Self-registration with wallet
- IPFS image upload
- Duplicate check
- Registration status

#### 🎯 Candidate Registration
- Name and metadata
- Image upload to IPFS
- Duplicate name prevention
- Admin verification

#### ⚙️ Election Control (Admin)
- Start/End election
- View current state
- Winner declaration
- New election creation

---

## 🔐 Security Features

- ✅ **Blockchain Verification**: All votes on-chain
- ✅ **One Vote Per Voter**: Smart contract enforcement
- ✅ **Owner-only Controls**: Admin functions protected
- ✅ **IPFS Storage**: Decentralized image storage
- ✅ **JWT Authentication**: Secure API access
- ✅ **Input Validation**: Frontend and contract-level checks

---

## 📊 Smart Contract Features

### Election States
- **CREATED**: Initial state, setup phase
- **ONGOING**: Active voting period
- **ENDED**: Voting closed, results available

### Key Functions

#### Admin Functions
- `addCandidate()` - Add election candidates
- `registerVoter()` - Register voters manually
- `startElection()` - Begin voting
- `endElection()` - Close voting
- `getWinner()` - Calculate and return winner

#### Voter Functions
- `selfRegister()` - Register with wallet
- `vote()` - Cast vote for candidate
- `getVoter()` - View voter details

#### View Functions
- `getAllCandidates()` - List all candidates
- `getAllVoters()` - List all voters
- `getElectionState()` - Current state
- `hasVoted()` - Check voting status

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm (recommended) or npm
- MetaMask or compatible wallet
- MongoDB database
- Pinata account (for IPFS)

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd Trust_Ballot
```

#### 2. Install Dependencies

**Frontend:**
```bash
cd tballot
pnpm install
```

**Backend:**
```bash
cd Backend
pnpm install
```

**Contracts:**
```bash
cd Contracts
pnpm install
```

#### 3. Environment Setup

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
VITE_PINATA_JWT=your_pinata_jwt
VITE_GATEWAY_URL=your_gateway_url
```

**Backend (.env):**
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
```

#### 4. Deploy Smart Contract
```bash
cd Contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

#### 5. Run Application

**Backend:**
```bash
cd Backend
pnpm dev
```

**Frontend:**
```bash
cd tballot
pnpm dev
```

Visit: `http://localhost:5173`

---

## 🌐 Deployment

### Frontend (Vercel)
- ✅ Automatic deployments
- ✅ SPA routing configured
- ✅ Environment variables setup

### Backend (Render)
- ✅ Express server
- ✅ MongoDB connection
- ✅ CORS configured

### Smart Contracts
- ✅ Deployed on Sepolia testnet
- ✅ Contract address configured
- ✅ ABI exported

---

## 🚀 Linera Microchains Integration

### Active Development
TrustBallot is being enhanced with **Linera Microchains** for real-time, high-performance voting.

**See [LINERA_FEATURES.md](./LINERA_FEATURES.md) for complete feature list**

### Key Linera Benefits
- ⚡ **Real-time Updates**: WebSocket subscriptions, no polling
- 🚀 **High Throughput**: 1000+ TPS per microchain
- 💰 **Lower Costs**: Efficient architecture, zero-cost idle chains
- 📊 **Better Scalability**: Horizontal scaling, elastic validators
- 🔄 **Sub-second Finality**: Milliseconds transaction confirmation
- 🌐 **Cross-chain**: Asynchronous messaging, multi-chain apps
- 🛠️ **Developer-friendly**: Rust/Wasm, JavaScript SDK

### Real-time Features in TrustBallot
- 📡 Live vote count updates
- 🔔 Instant election state changes
- 📈 Real-time candidate list
- 🎯 Instant voter registration
- ⚡ Immediate transaction feedback

---

## 🔮 Future Enhancements

### Planned Features
- 📈 Analytics dashboard with real-time charts
- 🔔 Email notifications for election events
- 📱 Mobile app (React Native)
- 🌍 Multi-language support
- 🎨 Custom themes and branding
- 📊 Advanced voting methods (ranked choice, approval voting)
- 🔍 Real-time election auditing
- 🌐 Multi-election support
- 📡 Cross-chain election capabilities

---

## 📸 Screenshots Preview

### Landing Page
- Animated hero with TrustBallot logo
- Feature highlights
- Demo video section
- Social media links

### Dashboard
- Grid of candidate cards
- Vote count badges
- Connect wallet button
- Real-time updates

### Admin Panel
- Election state indicator
- Start/End buttons
- Winner display
- Voter/Candidate lists

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Submit pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 🔗 Links

- **Frontend**: https://trust-ballot-zujo.vercel.app
- **Backend**: https://trust-ballot.onrender.com
- **Documentation**: See README.md
- **Linera Features**: See [LINERA_FEATURES.md](./LINERA_FEATURES.md)
- **Migration Guide**: See LINERA_MIGRATION.md
- **Migration Steps**: See MIGRATION_STEPS.md

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
