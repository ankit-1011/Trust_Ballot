/**
 * Advanced Linera Features Hooks
 * 
 * React hooks for advanced Linera features:
 * - Multi-election support
 * - Advanced voting methods
 * - Real-time auditing
 * - Advanced analytics
 */

import { useEffect, useState, useCallback } from "react";
import {
  getAllElections,
  getElection,
  createElection,
  switchElection,
  subscribeToElections,
  getAuditTrail,
  subscribeToAuditTrail,
  getAdvancedAnalytics,
  subscribeToAnalytics,
  voteRankedChoice,
  voteApproval,
  voteWeighted,
  getVotingMethod,
  setVotingMethod,
  type Election,
  type AuditEntry,
  type VotingMethod,
  type RankedChoiceVote,
  type ApprovalVote,
  type WeightedVote,
} from "../Contracts/lineraContracts";

/**
 * Hook for multi-election management
 */
export const useMultiElections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [currentElection, setCurrentElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Ensure elections is always an array (never null)
  const safeElections = Array.isArray(elections) ? elections : [];

  useEffect(() => {
    const loadElections = async () => {
      // Ensure Linera is initialized
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }

      setLoading(true);
      try {
        const allElections = await getAllElections();
        setElections(allElections);
      } catch (error) {
        console.error("Failed to load elections:", error);
      } finally {
        setLoading(false);
      }
    };

    loadElections();

    let unsubscribe: (() => void) | null = null;
    const setupSubscription = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        unsubscribe = subscribeToElections((updatedElections) => {
          setElections(updatedElections);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
      }
    };
    
    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const createNewElection = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const electionId = await createElection(name);
      const election = await getElection(electionId);
      setCurrentElection(election);
      return election;
    } catch (error) {
      console.error("Failed to create election:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const switchToElection = useCallback(async (electionId: string) => {
    setLoading(true);
    try {
      await switchElection(electionId);
      const election = await getElection(electionId);
      setCurrentElection(election);
      return election;
    } catch (error) {
      console.error("Failed to switch election:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    elections: safeElections,
    currentElection,
    loading,
    createNewElection,
    switchToElection,
  };
};

/**
 * Hook for real-time audit trail
 */
export const useAuditTrail = (electionId?: string) => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Ensure auditEntries is always an array
  const safeAuditEntries = auditEntries || [];

  useEffect(() => {
    const loadAuditTrail = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }

      setLoading(true);
      try {
        const entries = await getAuditTrail(electionId);
        setAuditEntries(entries);
      } catch (error) {
        console.error("Failed to load audit trail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuditTrail();

    let unsubscribe: (() => void) | null = null;
    const setupSubscription = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        unsubscribe = subscribeToAuditTrail((entry) => {
          setAuditEntries((prev) => [entry, ...prev]);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
      }
    };
    
    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [electionId]);

  return { auditEntries: safeAuditEntries, loading };
};

/**
 * Hook for advanced analytics
 */
export const useAdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }

      setLoading(true);
      try {
        const data = await getAdvancedAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    let unsubscribe: (() => void) | null = null;
    const setupSubscription = async () => {
      const { isLineraInitialized, initializeLinera } = await import("../Contracts/lineraContracts");
      
      if (!isLineraInitialized()) {
        try {
          await initializeLinera({ enableSubscriptions: true });
        } catch (error) {
          console.warn("Linera initialization in hook:", error);
        }
      }
      
      try {
        unsubscribe = subscribeToAnalytics((updatedAnalytics) => {
          setAnalytics(updatedAnalytics);
        });
      } catch (error) {
        console.warn("Subscription error:", error);
      }
    };
    
    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { analytics, loading };
};

/**
 * Hook for advanced voting methods
 */
export const useAdvancedVoting = (electionId: string) => {
  const [votingMethod, setVotingMethodState] = useState<VotingMethod>("simple");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVotingMethod = async () => {
      try {
        const method = await getVotingMethod(electionId);
        setVotingMethodState(method);
      } catch (error) {
        console.error("Failed to load voting method:", error);
      }
    };

    loadVotingMethod();
  }, [electionId]);

  const setMethod = useCallback(async (method: VotingMethod) => {
    setLoading(true);
    try {
      await setVotingMethod(electionId, method);
      setVotingMethodState(method);
    } catch (error) {
      console.error("Failed to set voting method:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [electionId]);

  const castRankedChoiceVote = useCallback(async (rankings: RankedChoiceVote[]) => {
    setLoading(true);
    try {
      return await voteRankedChoice(rankings);
    } catch (error) {
      console.error("Failed to cast ranked choice vote:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const castApprovalVote = useCallback(async (candidateIds: string[]) => {
    setLoading(true);
    try {
      return await voteApproval(candidateIds);
    } catch (error) {
      console.error("Failed to cast approval vote:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const castWeightedVote = useCallback(async (votes: WeightedVote[]) => {
    setLoading(true);
    try {
      return await voteWeighted(votes);
    } catch (error) {
      console.error("Failed to cast weighted vote:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    votingMethod,
    setMethod,
    castRankedChoiceVote,
    castApprovalVote,
    castWeightedVote,
    loading,
  };
};
