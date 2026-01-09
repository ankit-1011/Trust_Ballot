# Migration Steps: Ethereum to Linera

## Phase 1: Setup Linera Environment

### 1.1 Install Linera CLI
```bash
# Install Linera CLI (when available)
cargo install linera

# Or use npm package
npm install -g @linera/cli
```

### 1.2 Create Linera Application
```bash
cd linera-app
cargo build --release
```

### 1.3 Deploy Application
```bash
linera application publish trustballot
```

## Phase 2: Update Frontend Dependencies

### 2.1 Install Linera SDK
```bash
cd tballot
npm install @linera/sdk
# or
pnpm add @linera/sdk
```

### 2.2 Remove Ethereum Dependencies (Optional)
```bash
# These can be kept for fallback or removed
pnpm remove wagmi @rainbow-me/rainbowkit ethers viem
```

## Phase 3: Update Frontend Code

### 3.1 Replace Wallet Connection
- Replace `WalletConnect.tsx` with `LineraWalletConnect.tsx`
- Update `App.tsx` to use Linera provider instead of WagmiProvider

### 3.2 Update Contract Interactions
- Replace imports from `etherContracts.ts` to `lineraContracts.ts`
- Update all components that use contract functions

### 3.3 Implement Real-time Subscriptions
- Add subscriptions in components that need live updates
- Remove polling mechanisms

## Phase 4: Component Updates

### Components to Update:
1. **Dashboard.tsx**
   - Replace `getAllCandidates` with Linera version
   - Add `subscribeToVotes` for real-time vote updates
   - Remove polling intervals

2. **AdminElectionToggle.tsx**
   - Replace `getContractProvider` with Linera version
   - Add `subscribeToElectionState` for real-time state updates

3. **Register.tsx**
   - Replace `selfRegister` with Linera version

4. **Candidate.tsx**
   - Replace `addCandidate` with Linera version
   - Add `subscribeToCandidates` for real-time updates

5. **Voter.tsx**
   - Replace `getAllVoters` with Linera version
   - Add subscription for voter updates

## Phase 5: Testing

### 5.1 Test Real-time Features
- Verify vote counts update instantly
- Test election state changes
- Verify candidate/voter list updates

### 5.2 Performance Testing
- Compare transaction speeds
- Measure real-time update latency
- Test high-throughput scenarios

## Benefits After Migration

✅ **Real-time Updates**: No more polling, instant updates
✅ **High Throughput**: Microchains handle more transactions
✅ **Lower Costs**: Efficient microchain architecture
✅ **Better UX**: Instant feedback on all actions
✅ **Scalability**: Handle more concurrent users

## Rollback Plan

If issues occur:
1. Keep Ethereum contracts deployed
2. Use feature flag to switch between Linera and Ethereum
3. Gradually migrate users to Linera
