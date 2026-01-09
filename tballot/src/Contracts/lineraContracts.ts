/**
 * Linera Microchains Integration for TrustBallot
 * 
 * This file replaces etherContracts.ts to use Linera SDK
 * for real-time onchain interactions.
 */

// Linera SDK types (to be updated with actual SDK)
interface LineraClient {
  subscribe: (callback: (data: any) => void) => void;
  query: (method: string, params?: any) => Promise<any>;
  execute: (method: string, params?: any) => Promise<string>;
  getApplicationId: () => string;
}

// Application state types
export type ElectionState = "CREATED" | "ONGOING" | "ENDED";

export interface Candidate {
  id: string;
  name: string;
  meta: string;
  voteCount: string;
}

export interface Voter {
  name: string;
  image: string;
  isRegistered: boolean;
  hasVoted: boolean;
  votedId: string;
  address: string;
}

// Linera client instance (to be initialized with actual SDK)
let lineraClient: LineraClient | null = null;
let subscriptionActive = false;

/**
 * Initialize Linera client
 * This will be replaced with actual Linera SDK initialization
 */
export const initializeLinera = async (): Promise<void> => {
  try {
    // TODO: Initialize with actual Linera SDK
    // Example: lineraClient = await LineraSDK.connect({...});
    console.log("Linera client initialized");
  } catch (error) {
    console.error("Failed to initialize Linera:", error);
    throw error;
  }
};

/**
 * Get Linera client instance
 */
const getClient = (): LineraClient => {
  if (!lineraClient) {
    throw new Error("Linera client not initialized. Call initializeLinera() first.");
  }
  return lineraClient;
};

// ============================================================
// 🔹 Real-time Subscriptions
// ============================================================

/**
 * Subscribe to election state changes (real-time)
 */
export const subscribeToElectionState = (
  callback: (state: ElectionState) => void
): (() => void) => {
  const client = getClient();
  
  // Subscribe to state changes
  const unsubscribe = client.subscribe((data) => {
    if (data.type === "election_state_changed") {
      callback(data.state);
    }
  });
  
  return unsubscribe;
};

/**
 * Subscribe to vote updates (real-time)
 */
export const subscribeToVotes = (
  callback: (candidateId: string, newVoteCount: string) => void
): (() => void) => {
  const client = getClient();
  
  const unsubscribe = client.subscribe((data) => {
    if (data.type === "vote_cast") {
      callback(data.candidateId, data.voteCount);
    }
  });
  
  return unsubscribe;
};

/**
 * Subscribe to candidate updates (real-time)
 */
export const subscribeToCandidates = (
  callback: (candidates: Candidate[]) => void
): (() => void) => {
  const client = getClient();
  
  const unsubscribe = client.subscribe((data) => {
    if (data.type === "candidate_added" || data.type === "candidates_updated") {
      getAllCandidates().then(callback);
    }
  });
  
  return unsubscribe;
};

// ============================================================
// 🔹 Admin Functions
// ============================================================

/**
 * Add new candidate (Admin only)
 */
export const addCandidate = async (name: string, meta: string): Promise<void> => {
  const client = getClient();
  const txHash = await client.execute("addCandidate", { name, meta });
  console.log("Candidate added, transaction:", txHash);
};

/**
 * Register voter manually (Admin only)
 */
export const registerVoter = async (
  voterAddress: string,
  name: string,
  image: string
): Promise<void> => {
  const client = getClient();
  const txHash = await client.execute("registerVoter", {
    voterAddress,
    name,
    image,
  });
  console.log("Voter registered, transaction:", txHash);
};

/**
 * Start election (Admin only)
 */
export const startElection = async (): Promise<void> => {
  const client = getClient();
  const txHash = await client.execute("startElection", {});
  console.log("Election started, transaction:", txHash);
};

/**
 * End election (Admin only)
 */
export const endElection = async (): Promise<void> => {
  const client = getClient();
  const txHash = await client.execute("endElection", {});
  console.log("Election ended, transaction:", txHash);
};

// ============================================================
// 🔹 Voter Functions
// ============================================================

/**
 * Self registration (voter using wallet)
 */
export const selfRegister = async (name: string, image: string): Promise<void> => {
  const client = getClient();
  const txHash = await client.execute("selfRegister", { name, image });
  console.log("Voter self-registered, transaction:", txHash);
};

/**
 * Cast vote
 */
export const voteCandidate = async (candidateId: number): Promise<void> => {
  const client = getClient();
  const txHash = await client.execute("vote", { candidateId });
  console.log("Vote cast, transaction:", txHash);
};

// ============================================================
// 🔹 View / Read Functions (with real-time support)
// ============================================================

/**
 * Get election state
 */
export const getElectionState = async (): Promise<ElectionState> => {
  const client = getClient();
  const state = await client.query("state");
  const mapping: ElectionState[] = ["CREATED", "ONGOING", "ENDED"];
  return mapping[state] || "CREATED";
};

/**
 * Get single candidate details
 */
export const getCandidate = async (id: number): Promise<Candidate> => {
  const client = getClient();
  const candidate = await client.query("getCandidate", { id });
  return {
    id: candidate.id.toString(),
    name: candidate.name,
    meta: candidate.meta,
    voteCount: candidate.voteCount.toString(),
  };
};

/**
 * Get all candidates (with real-time updates support)
 */
export const getAllCandidates = async (): Promise<Candidate[]> => {
  const client = getClient();
  const candidates = await client.query("getAllCandidates");
  return candidates.map((c: any) => ({
    id: c.id.toString(),
    name: c.name,
    meta: c.meta,
    voteCount: c.voteCount.toString(),
  }));
};

/**
 * Get all voters
 */
export const getAllVoters = async (): Promise<Voter[]> => {
  try {
    const client = getClient();
    const [voterDataArray, addresses] = await client.query("getAllVoters");
    
    return voterDataArray
      .map((v: any, i: number) => {
        if (!v || !addresses[i]) return null;
        return {
          name: v.name || "Unknown",
          image: v.image || "",
          isRegistered: v.isRegistered || false,
          hasVoted: v.hasVoted || false,
          votedId: v.votedId ? v.votedId.toString() : "0",
          address: addresses[i] || "",
        };
      })
      .filter((voter: Voter | null) => voter !== null && voter.address);
  } catch (error) {
    console.error("Error fetching voters:", error);
    return [];
  }
};

/**
 * Get winner (after election ended)
 */
export const getWinner = async (): Promise<{
  id: string;
  name: string;
  votes: string;
  status: string;
}> => {
  const client = getClient();
  const winner = await client.query("getWinner");
  return {
    id: winner.id.toString(),
    name: winner.name,
    votes: winner.votes.toString(),
    status: winner.status,
  };
};

/**
 * Get voter details
 */
export const getVoter = async (address: string): Promise<Voter | null> => {
  try {
    const client = getClient();
    const voter = await client.query("getVoter", { address });
    return {
      name: voter.name || "Unknown",
      image: voter.image || "",
      isRegistered: voter.isRegistered || false,
      hasVoted: voter.hasVoted || false,
      votedId: voter.votedId ? voter.votedId.toString() : "0",
      address: address,
    };
  } catch (error) {
    console.error("Error fetching voter:", error);
    return null;
  }
};

/**
 * Check if voter is registered
 */
export const isVoterRegistered = async (address: string): Promise<boolean> => {
  const client = getClient();
  return await client.query("isVoterRegistered", { address });
};

/**
 * Check if voter has voted
 */
export const hasVoted = async (address: string): Promise<boolean> => {
  const client = getClient();
  return await client.query("hasVoted", { address });
};

/**
 * Get contract provider (for compatibility with existing code)
 * This returns a Linera-compatible interface
 */
export const getContractProvider = () => {
  return {
    state: async () => {
      const state = await getElectionState();
      const mapping = { CREATED: 0, ONGOING: 1, ENDED: 2 };
      return mapping[state];
    },
  };
};

/**
 * Get contract signer (for compatibility with existing code)
 * This returns a Linera-compatible interface
 */
export const getContractSigner = async () => {
  return {
    vote: async (id: string) => {
      await voteCandidate(parseInt(id));
      return { wait: async () => {} };
    },
    startElection: async () => {
      await startElection();
      return { wait: async () => {} };
    },
    endElection: async () => {
      await endElection();
      return { wait: async () => {} };
    },
  };
};
