# Linera Microchains Migration Guide

## Overview
This guide documents the migration of TrustBallot from Ethereum to Linera Microchains for real-time onchain applications.

## Architecture Changes

### Current (Ethereum)
- Solidity smart contract on Ethereum/Sepolia
- wagmi + RainbowKit for wallet connection
- ethers.js for contract interactions
- Polling for state updates

### Target (Linera)
- Rust application compiled to Wasm
- Linera SDK for frontend
- Real-time subscriptions for instant updates
- Microchains for high throughput

## Migration Steps

### 1. Linera Application (Rust)
- Convert Solidity contract to Linera application
- Implement state management
- Add real-time event subscriptions

### 2. Frontend Updates
- Replace wagmi with Linera SDK
- Update wallet connection
- Implement real-time subscriptions
- Update all contract interaction functions

### 3. Real-time Features
- Live vote count updates
- Instant election state changes
- Real-time candidate/voter list updates

## File Structure

```
Trust_Ballot/
├── linera-app/              # Linera application (Rust)
│   ├── src/
│   │   └── lib.rs          # Main application logic
│   ├── Cargo.toml
│   └── README.md
├── tballot/                 # Frontend (updated for Linera)
│   └── src/
│       ├── Contracts/
│       │   └── lineraContracts.ts  # Linera SDK integration
│       └── ...
└── LINERA_MIGRATION.md      # This file
```

## Benefits
- ⚡ Real-time updates (no polling)
- 🚀 High throughput with microchains
- 💰 Lower transaction costs
- 🔄 Instant finality
- 📊 Better scalability
