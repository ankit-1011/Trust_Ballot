//! TrustBallot - Linera Application
//! 
//! A decentralized voting system built on Linera Microchains
//! with real-time updates and high throughput.

use linera_sdk::base::{ApplicationId, Owner, WithContractAbi};
use linera_sdk::contract::system_api;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// The TrustBallot application.
#[derive(Debug, Default)]
pub struct TrustBallot {
    /// Owner (admin) of the application
    owner: Option<Owner>,
    /// Current election state
    state: ElectionState,
    /// Candidates in the election
    candidates: BTreeMap<u64, Candidate>,
    /// Registered voters
    voters: BTreeMap<Owner, Voter>,
    /// Next candidate ID
    next_candidate_id: u64,
}

/// Election state enum
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ElectionState {
    Created,
    Ongoing,
    Ended,
}

/// Candidate structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Candidate {
    pub id: u64,
    pub name: String,
    pub meta: String,
    pub vote_count: u64,
}

/// Voter structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Voter {
    pub name: String,
    pub image: String,
    pub is_registered: bool,
    pub has_voted: bool,
    pub voted_candidate_id: u64,
}

/// Application operation
#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    /// Add candidate (admin only)
    AddCandidate { name: String, meta: String },
    /// Register voter (admin)
    RegisterVoter { voter: Owner, name: String, image: String },
    /// Self register voter
    SelfRegister { name: String, image: String },
    /// Start election (admin)
    StartElection,
    /// End election (admin)
    EndElection,
    /// Cast vote
    Vote { candidate_id: u64 },
}

/// Application query
#[derive(Debug, Deserialize, Serialize)]
pub enum Query {
    /// Get election state
    GetState,
    /// Get candidate
    GetCandidate { id: u64 },
    /// Get all candidates
    GetAllCandidates,
    /// Get voter
    GetVoter { address: Owner },
    /// Get all voters
    GetAllVoters,
    /// Get winner
    GetWinner,
    /// Check if voter is registered
    IsVoterRegistered { address: Owner },
    /// Check if voter has voted
    HasVoted { address: Owner },
}

/// Application response
#[derive(Debug, Serialize, Deserialize)]
pub enum Response {
    State(ElectionState),
    Candidate(Option<Candidate>),
    Candidates(Vec<Candidate>),
    Voter(Option<Voter>),
    Voters(Vec<(Owner, Voter)>),
    Winner(Option<(u64, String, u64, String)>),
    Bool(bool),
}

/// Application event
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Event {
    CandidateAdded { id: u64, name: String },
    VoterRegistered { voter: Owner, name: String },
    ElectionStarted,
    ElectionEnded,
    VoteCast { voter: Owner, candidate_id: u64 },
}

impl TrustBallot {
    /// Initialize the application
    pub fn new() -> Self {
        Self {
            owner: None,
            state: ElectionState::Created,
            candidates: BTreeMap::new(),
            voters: BTreeMap::new(),
            next_candidate_id: 1,
        }
    }

    /// Set owner (first caller becomes owner)
    fn ensure_owner(&mut self) -> Owner {
        if let Some(owner) = self.owner {
            owner
        } else {
            let owner = system_api::current_application_id().creation.chain_id.owner();
            self.owner = Some(owner);
            owner
        }
    }

    /// Check if caller is owner
    fn is_owner(&self, caller: Owner) -> bool {
        self.owner.map_or(false, |owner| owner == caller)
    }

    /// Add candidate (admin only)
    fn add_candidate(&mut self, caller: Owner, name: String, meta: String) -> Event {
        if !self.is_owner(caller) {
            panic!("Only owner can add candidates");
        }

        let id = self.next_candidate_id;
        self.next_candidate_id += 1;

        let candidate = Candidate {
            id,
            name: name.clone(),
            meta,
            vote_count: 0,
        };

        self.candidates.insert(id, candidate);

        Event::CandidateAdded { id, name }
    }

    /// Register voter (admin)
    fn register_voter(
        &mut self,
        caller: Owner,
        voter: Owner,
        name: String,
        image: String,
    ) -> Event {
        if !self.is_owner(caller) {
            panic!("Only owner can register voters");
        }

        if self.voters.contains_key(&voter) {
            panic!("Voter already registered");
        }

        let voter_data = Voter {
            name: name.clone(),
            image,
            is_registered: true,
            has_voted: false,
            voted_candidate_id: 0,
        };

        self.voters.insert(voter, voter_data);

        Event::VoterRegistered {
            voter,
            name,
        }
    }

    /// Self register voter
    fn self_register(&mut self, caller: Owner, name: String, image: String) -> Event {
        if self.voters.contains_key(&caller) {
            panic!("Already registered");
        }

        let voter_data = Voter {
            name: name.clone(),
            image,
            is_registered: true,
            has_voted: false,
            voted_candidate_id: 0,
        };

        self.voters.insert(caller, voter_data);

        Event::VoterRegistered {
            voter: caller,
            name,
        }
    }

    /// Start election (admin)
    fn start_election(&mut self, caller: Owner) -> Event {
        if !self.is_owner(caller) {
            panic!("Only owner can start election");
        }

        if self.state == ElectionState::Ongoing {
            panic!("Election is already ongoing");
        }

        // Reset for new election
        self.candidates.clear();
        self.voters.clear();
        self.next_candidate_id = 1;

        self.state = ElectionState::Ongoing;

        Event::ElectionStarted
    }

    /// End election (admin)
    fn end_election(&mut self, caller: Owner) -> Event {
        if !self.is_owner(caller) {
            panic!("Only owner can end election");
        }

        if self.state != ElectionState::Ongoing {
            panic!("Election is not ongoing");
        }

        self.state = ElectionState::Ended;

        Event::ElectionEnded
    }

    /// Cast vote
    fn vote(&mut self, caller: Owner, candidate_id: u64) -> Event {
        if self.state != ElectionState::Ongoing {
            panic!("Voting not allowed");
        }

        let voter = self.voters.get_mut(&caller)
            .expect("Not a registered voter");

        if voter.has_voted {
            panic!("Already voted");
        }

        let candidate = self.candidates.get_mut(&candidate_id)
            .expect("Candidate does not exist");

        candidate.vote_count += 1;
        voter.has_voted = true;
        voter.voted_candidate_id = candidate_id;

        Event::VoteCast {
            voter: caller,
            candidate_id,
        }
    }

    /// Get winner
    fn get_winner(&self) -> Option<(u64, String, u64, String)> {
        if self.state != ElectionState::Ended {
            return None;
        }

        let mut top_id = 0u64;
        let mut top_votes = 0u64;
        let mut tie_count = 0u64;

        for (id, candidate) in &self.candidates {
            if candidate.vote_count > top_votes {
                top_votes = candidate.vote_count;
                top_id = *id;
                tie_count = 1;
            } else if candidate.vote_count == top_votes {
                tie_count += 1;
            }
        }

        if top_votes == 0 {
            return Some((0, String::new(), 0, "No winner".to_string()));
        }

        if tie_count > 1 {
            return Some((0, String::new(), top_votes, "Election tied".to_string()));
        }

        let candidate = self.candidates.get(&top_id)?;
        Some((
            top_id,
            candidate.name.clone(),
            top_votes,
            "Winner declared".to_string(),
        ))
    }
}

// Linera SDK implementation would continue here...
// This is a template structure for the actual Linera application
