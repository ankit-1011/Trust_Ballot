# TrustBallot Linera Application

This is the Linera application (Rust) for TrustBallot voting system.

## Structure

```
linera-app/
├── src/
│   └── lib.rs          # Main application logic
├── Cargo.toml          # Rust dependencies
└── README.md
```

## Building

```bash
cd linera-app
cargo build --release
```

## Application Logic

The Linera application implements:
- Election state management (CREATED, ONGOING, ENDED)
- Candidate management
- Voter registration
- Voting mechanism
- Real-time event emissions

## State Structure

```rust
pub struct TrustBallot {
    pub owner: Owner,
    pub state: ElectionState,
    pub candidates: Vec<Candidate>,
    pub voters: BTreeMap<Owner, Voter>,
}
```

## Events

The application emits events for:
- CandidateAdded
- VoterRegistered
- ElectionStarted
- ElectionEnded
- VoteCast

These events enable real-time subscriptions in the frontend.

## Integration

The frontend uses `lineraContracts.ts` to interact with this application via the Linera SDK.
