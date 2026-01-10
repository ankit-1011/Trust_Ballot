/**
 * React Hooks for Linera Real-time Subscriptions
 * 
 * Provides easy-to-use React hooks for real-time Linera features
 */

import { useEffect, useState, useCallback } from "react";
import {
  subscribeToVotes,
  subscribeToElectionState,
  subscribeToCandidates,
  subscribeToVoters,
  subscribeToWinner,
  subscribeToLeaderboard,
  subscribeToStatistics,
  subscribeToAllEvents,
  type ElectionState,
  type Candidate,
  type Voter,
} from "../Contracts/lineraContracts";

/**
 * Hook for real-time vote updates
 */
export const useVoteSubscription = () => {
  const [voteUpdates, setVoteUpdates] = useState<Array<{
    candidateId: string;
    voteCount: string;
    timestamp: number;
  }>>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for client to be initialized
    const checkAndSubscribe = async () => {
      // Import dynamically to avoid circular dependency
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      setIsReady(true);
      
      try {
        const unsubscribe = subscribeToVotes((candidateId, voteCount) => {
          setVoteUpdates((prev) => [
            ...prev,
            { candidateId, voteCount, timestamp: Date.now() },
          ]);
        });
        return unsubscribe;
      } catch (error) {
        console.warn("Subscription error (client may not be ready):", error);
        return () => {}; // Return no-op unsubscribe
      }
    };

    const unsubscribePromise = checkAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  return voteUpdates;
};

/**
 * Hook for real-time election state
 */
export const useElectionStateSubscription = () => {
  const [state, setState] = useState<ElectionState>("CREATED");

  useEffect(() => {
    const checkAndSubscribe = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        return subscribeToElectionState((newState) => {
          setState(newState);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
        return () => {};
      }
    };

    const unsubscribePromise = checkAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  return state;
};

/**
 * Hook for real-time candidates
 */
export const useCandidatesSubscription = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const checkAndSubscribe = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        return subscribeToCandidates((updatedCandidates) => {
          setCandidates(updatedCandidates);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
        return () => {};
      }
    };

    const unsubscribePromise = checkAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  return candidates;
};

/**
 * Hook for real-time voters
 */
export const useVotersSubscription = () => {
  const [voters, setVoters] = useState<Voter[]>([]);

  useEffect(() => {
    const checkAndSubscribe = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        return subscribeToVoters((updatedVoters) => {
          setVoters(updatedVoters);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
        return () => {};
      }
    };

    const unsubscribePromise = checkAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  return voters;
};

/**
 * Hook for real-time winner
 */
export const useWinnerSubscription = () => {
  const [winner, setWinner] = useState<{
    id: string;
    name: string;
    votes: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    const checkAndSubscribe = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        return subscribeToWinner((winnerData) => {
          setWinner(winnerData);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
        return () => {};
      }
    };

    const unsubscribePromise = checkAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  return winner;
};

/**
 * Hook for real-time leaderboard
 */
export const useLeaderboardSubscription = () => {
  const [leaderboard, setLeaderboard] = useState<
    Array<{ candidate: Candidate; rank: number; percentage: number }>
  >([]);

  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;
    let refreshIntervalId: NodeJS.Timeout | null = null;
    
    const checkAndSubscribe = async () => {
      const { isLineraInitialized, initializeLinera, getLeaderboard, subscribeToLeaderboard } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      // Load initial leaderboard data immediately (with error handling)
      const loadLeaderboard = async () => {
        try {
          const initialLeaderboard = await getLeaderboard();
          console.log("📊 Initial leaderboard loaded:", initialLeaderboard?.length || 0, "candidates");
          if (initialLeaderboard && Array.isArray(initialLeaderboard) && initialLeaderboard.length > 0) {
            setLeaderboard(initialLeaderboard);
          } else {
            // Set empty array if no candidates (this is valid)
            setLeaderboard([]);
          }
        } catch (error: any) {
          // Silently handle errors - wallet might not be connected
          if (!error?.message?.includes("Unexpected error")) {
            console.log("⏭️ Leaderboard will load when candidates are available");
          }
          setLeaderboard([]); // Set empty array on error
        }
      };
      
      loadLeaderboard();
      
      // Setup subscription for real-time updates
      try {
        unsubscribeFn = subscribeToLeaderboard((updatedLeaderboard) => {
          console.log("Leaderboard updated via subscription:", updatedLeaderboard.length, "candidates");
          if (updatedLeaderboard && updatedLeaderboard.length > 0) {
            setLeaderboard(updatedLeaderboard);
          }
        });
      } catch (error) {
        console.warn("Subscription error:", error);
      }
      
      // Also refresh leaderboard periodically to catch new candidates (fallback)
      // Only refresh if we don't have candidates yet, or every 10 seconds (less frequent)
      refreshIntervalId = setInterval(async () => {
        try {
          const lb = await getLeaderboard();
          if (lb && Array.isArray(lb)) {
            setLeaderboard(lb);
          }
        } catch (err: any) {
          // Silently fail - expected when wallet is not connected
          if (!err?.message?.includes("Unexpected error")) {
            // Only log non-wallet errors
          }
        }
      }, 10000); // Refresh every 10 seconds (less frequent to avoid wallet spam)
    };
    
    checkAndSubscribe();
    
    return () => {
      if (unsubscribeFn) unsubscribeFn();
      if (refreshIntervalId) clearInterval(refreshIntervalId);
    };
  }, []);

  return leaderboard;
};

/**
 * Hook for real-time statistics
 */
export const useStatisticsSubscription = () => {
  const [statistics, setStatistics] = useState<{
    totalVotes: number;
    totalCandidates: number;
    totalVoters: number;
    participationRate: number;
    averageVotesPerCandidate: number;
  }>({
    totalVotes: 0,
    totalCandidates: 0,
    totalVoters: 0,
    participationRate: 0,
    averageVotesPerCandidate: 0,
  });

  useEffect(() => {
    const checkAndSubscribe = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        return subscribeToStatistics((stats) => {
          setStatistics(stats);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
        return () => {};
      }
    };

    const unsubscribePromise = checkAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  return statistics;
};

/**
 * Comprehensive hook for all election events
 */
export const useElectionEvents = () => {
  const [events, setEvents] = useState<Array<{
    type: string;
    data: any;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    const unsubscribe = subscribeToAllEvents({
      onVote: (candidateId, voteCount) => {
        setEvents((prev) => [
          ...prev,
          { type: "vote", data: { candidateId, voteCount }, timestamp: Date.now() },
        ]);
      },
      onStateChange: (state) => {
        setEvents((prev) => [
          ...prev,
          { type: "state_change", data: { state }, timestamp: Date.now() },
        ]);
      },
      onCandidateAdded: (candidate) => {
        setEvents((prev) => [
          ...prev,
          { type: "candidate_added", data: candidate, timestamp: Date.now() },
        ]);
      },
      onVoterRegistered: (voter) => {
        setEvents((prev) => [
          ...prev,
          { type: "voter_registered", data: voter, timestamp: Date.now() },
        ]);
      },
      onElectionStarted: () => {
        setEvents((prev) => [
          ...prev,
          { type: "election_started", data: {}, timestamp: Date.now() },
        ]);
      },
      onElectionEnded: () => {
        setEvents((prev) => [
          ...prev,
          { type: "election_ended", data: {}, timestamp: Date.now() },
        ]);
      },
      onWinner: (winner) => {
        setEvents((prev) => [
          ...prev,
          { type: "winner_declared", data: winner, timestamp: Date.now() },
        ]);
      },
    });

    return unsubscribe;
  }, []);

  return events;
};
