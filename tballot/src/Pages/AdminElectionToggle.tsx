"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { toast } from "@/components/ui/8bit/toast";
import {
  getContractProvider,
  startElection,
  endElection,
  getWinner,
} from "../Contracts/etherContracts";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";

const AdminElectionToggle = () => {
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [electionState, setElectionState] = useState<
    "CREATED" | "ONGOING" | "ENDED"
  >("CREATED");
  const [winner, setWinner] = useState<{
    id: string;
    name: string;
    votes: string;
    status: string;
  } | null>(null);

  // Helper function to check if wallet is available (lenient check)
  const isWalletAvailable = (): boolean => {
    if (typeof window === 'undefined') return false;
    const ethereum = (window as any).ethereum;
    if (!ethereum) return false;
    
    // Just check if ethereum object exists - don't require specific properties
    // Different wallet extensions have different properties
    return true;
  };

  // Helper function to safely get contract provider with error handling
  const getContractProviderSafely = () => {
    if (!isWalletAvailable()) {
      throw new Error("Wallet extension not available");
    }
    
    try {
      return getContractProvider();
    } catch (error: any) {
      // Re-throw with more context
      if (error.message?.includes("No crypto wallet")) {
        throw new Error("Please install MetaMask or another crypto wallet");
      }
      throw error;
    }
  };

  // Track if wallet is responding to avoid repeated errors
  const [walletResponding, setWalletResponding] = useState(true);

  // Fetch current election state from contract
  useEffect(() => {
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 2;

    const fetchState = async () => {
      if (!isConnected) return;
      
      // If wallet has failed multiple times, stop trying
      if (!walletResponding) {
        return;
      }

      // Check if wallet is available before attempting contract calls
      if (!isWalletAvailable()) {
        setWalletResponding(false);
        return;
      }

      try {
        // Add timeout protection for contract calls
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Contract call timeout")), 3000) // Reduced to 3s
        );

        const contractPromise = (async () => {
          try {
            const contract = getContractProviderSafely();
            return await contract.state(); // returns 0,1,2
          } catch (providerError: any) {
            // Completely suppress "Unexpected error" - don't re-throw
            const errorMsg = providerError?.message || providerError?.toString() || "";
            if (errorMsg.includes("Unexpected error") || 
                providerError.code === "UNPREDICTABLE_GAS_LIMIT" ||
                errorMsg.includes("not been authorized")) {
              // Don't throw - just return null to indicate failure
              return null;
            }
            throw providerError;
          }
        })();

        const state = await Promise.race([contractPromise, timeoutPromise]);
        
        // If state is null (wallet error), stop trying
        if (state === null) {
          consecutiveErrors++;
          if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            setWalletResponding(false);
          }
          return; // Don't update state
        }

        // Reset error counter on success
        consecutiveErrors = 0;
        setWalletResponding(true);

        const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = [
          "CREATED",
          "ONGOING",
          "ENDED",
        ];
        setElectionState(mapping[state]);

        // If election is ended, fetch winner
        if (mapping[state] === "ENDED") {
          try {
            const winnerPromise = getWinner();
            const winnerTimeout = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Timeout")), 3000)
            );
            const w = await Promise.race([winnerPromise, winnerTimeout]);
            setWinner(w);
          } catch (err: any) {
            // Silently handle winner fetch errors - completely suppress
            const errorMsg = err?.message || err?.toString() || "";
            // Don't log anything - completely silent
          }
        } else {
          setWinner(null);
        }
      } catch (err: any) {
        // Completely suppress all errors - don't log anything
        consecutiveErrors++;
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          setWalletResponding(false);
          // Stop interval if wallet is not responding
          return;
        }
        // Keep current state if fetch fails
      }
    };

    // Only fetch if connected and wallet is responding
    if (isConnected && walletResponding) {
      fetchState();
      // Refresh state every 15 seconds (less frequent to avoid wallet spam)
      const interval = setInterval(() => {
        if (walletResponding && isConnected) {
          fetchState();
        }
      }, 15000); // Increased to 15 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected, walletResponding]);

  if (!isConnected) {
    return <WalletConnect />;
  }

  const handleToggle = async () => {
    // Check if wallet is available before attempting any action
    if (!isWalletAvailable()) {
      toast("❌ Please connect your wallet first!");
      return;
    }

    if (!isConnected) {
      toast("❌ Wallet not connected!");
      return;
    }

    try {
      setLoading(true);
      
      // First, get the current state from contract to ensure accuracy
      // Add timeout protection
      let actualState: "CREATED" | "ONGOING" | "ENDED" = electionState; // Use current state as fallback
      
      try {
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 5000)
        );

        const contractPromise = (async () => {
          try {
            const contract = getContractProviderSafely();
            return await contract.state();
          } catch (providerError: any) {
            // Completely suppress "Unexpected error" - return null instead of throwing
            const errorMsg = providerError?.message || providerError?.toString() || "";
            if (errorMsg.includes("Unexpected error") || 
                providerError.code === "UNPREDICTABLE_GAS_LIMIT" ||
                errorMsg.includes("not been authorized")) {
              // Return null to indicate failure without throwing
              return null;
            }
            throw providerError;
          }
        })();

        try {
          const currentState = await Promise.race([contractPromise, timeoutPromise]);
          
          // If null (wallet error), use current state and show message
          if (currentState === null) {
            toast("⚠️ Wallet not responding. Using current election state.");
            actualState = electionState;
          } else {
            const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = [
              "CREATED",
              "ONGOING",
              "ENDED",
            ];
            actualState = mapping[currentState];
          }
        } catch (stateErr: any) {
          // Completely suppress all errors - use current state silently
          actualState = electionState;
        }
      } catch (stateErr: any) {
        // Completely suppress all errors - use current state silently
        actualState = electionState;
      }
      
      // Execute action based on state
      if (actualState === "CREATED" || actualState === "ENDED") {
        try {
          console.log("🔄 Starting election...");
          console.log("📱 Wallet popup should appear now...");
         
          
          // Add timeout protection for transaction (30 seconds)
          const txTimeout = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Transaction timeout - please try again")), 30000)
          );

          // Call startElection
          console.log("📞 Calling startElection function...");
          const startPromise = (async () => {
            const tx = await startElection();
            return tx;
          })();
          
          // Wait for transaction (wallet popup should appear)
          console.log("⏳ Waiting for transaction...");
          const tx = await Promise.race([startPromise, txTimeout]);
          
          console.log("✅ Transaction completed! Hash:", tx.hash);
          
          setElectionState("ONGOING");
          setWinner(null); // Clear previous winner
         
          
          // Refresh state after transaction is confirmed
          setTimeout(async () => {
            try {
              const contract = getContractProviderSafely();
              const state = await contract.state();
              const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = ["CREATED", "ONGOING", "ENDED"];
              setElectionState(mapping[state]);
            } catch (err) {
              // Silently ignore refresh errors
            }
          }, 3000);
          
        } catch (startErr: any) {
          console.error("❌ Failed to start election:", startErr);
          console.error("❌ Error details:", {
            message: startErr?.message,
            reason: startErr?.reason,
            code: startErr?.code,
            data: startErr?.data,
            stack: startErr?.stack,
          });
          
          const errorMsg = startErr?.reason || startErr?.message || startErr?.toString() || "Unknown error";
          const errorCode = startErr?.code || "";
          
          // Handle specific errors
          if (errorMsg.includes("User rejected") || errorMsg.includes("user rejected") || errorCode === 4001) {
            toast("⚠️ Transaction cancelled. Election not started.");
          } else if (errorMsg.includes("already started") || errorMsg.includes("Election already started")) {
            toast("⚠️ Election is already started!");
            setElectionState("ONGOING");
          } else if (errorMsg.includes("not owner") || errorMsg.includes("Ownable") || errorMsg.includes("only owner")) {
            toast("❌ Only owner can start election!");
          } else if (errorMsg.includes("timeout") || errorMsg.includes("Timeout") || errorMsg.includes("Transaction timeout")) {
            toast("❌ Transaction timed out. Please try again.");
          } else if (errorMsg.includes("Unexpected error") || errorMsg.includes("not been authorized")) {
            toast("❌ Wallet not responding. Please refresh and try again.");
          } else if (errorMsg.includes("insufficient funds") || errorMsg.includes("gas")) {
            toast("❌ Insufficient funds for gas. Please add funds to your wallet.");
          } else if (errorMsg.includes("No crypto wallet") || errorMsg.includes("MetaMask")) {
            toast("❌ Please install and connect MetaMask!");
          } else {
            // Show actual error for debugging
            const shortError = errorMsg.length > 100 ? errorMsg.substring(0, 100) + "..." : errorMsg;
          
            console.error("Full error:", startErr);
          }
        } finally {
          setLoading(false);
        }
      } else if (actualState === "ONGOING") {
        try {
          console.log("🔄 Ending election...");
          console.log("📱 Wallet popup should appear now...");
        
          
          // Add timeout protection for transaction (60 seconds)
          const txTimeout = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Transaction timeout - please try again")), 60000)
          );

          // Call endElection - this should trigger wallet popup
          const endPromise = endElection();
          const receipt = await Promise.race([endPromise, txTimeout]);
          
          console.log("✅ Election ended successfully! Receipt:", receipt);
          setElectionState("ENDED");
        

          // Fetch winner automatically after a short delay
          setTimeout(async () => {
            try {
              const winnerTimeout = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 5000)
              );
              const w = await Promise.race([getWinner(), winnerTimeout]);
              setWinner(w);
           
            } catch (winnerErr: any) {
              console.warn("Could not fetch winner:", winnerErr?.message);
              // Don't throw - election was ended successfully
            }
          }, 2000);
          
          // Refresh state after transaction is confirmed
          setTimeout(async () => {
            try {
              const contract = getContractProviderSafely();
              const state = await contract.state();
              const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = ["CREATED", "ONGOING", "ENDED"];
              setElectionState(mapping[state]);
            } catch (err) {
              // Silently ignore refresh errors
            }
          }, 3000);
          
        } catch (endErr: any) {
          console.error("Failed to end election:", endErr);
          
          const errorMsg = endErr?.reason || endErr?.message || endErr?.toString() || "Unknown error";
          const errorCode = endErr?.code || "";
          
          // Handle specific errors
          if (errorMsg.includes("User rejected") || errorMsg.includes("user rejected") || errorCode === 4001) {
            toast("⚠️ Transaction cancelled. Election not ended.");
          } else if (errorMsg.includes("already ended") || errorMsg.includes("Election already ended")) {
            toast("⚠️ Election is already ended!");
            setElectionState("ENDED");
          } else if (errorMsg.includes("not owner") || errorMsg.includes("Ownable") || errorMsg.includes("only owner")) {
            toast("❌ Only owner can end election!");
          } else if (errorMsg.includes("timeout") || errorMsg.includes("Timeout") || errorMsg.includes("Transaction timeout")) {
            toast("❌ Transaction timed out. Please try again.");
          } else if (errorMsg.includes("Unexpected error") || errorMsg.includes("not been authorized")) {
            toast("❌ Wallet not responding. Please refresh and try again.");
          } else if (errorMsg.includes("insufficient funds") || errorMsg.includes("gas")) {
            toast("❌ Insufficient funds for gas. Please add funds to your wallet.");
          } else {
            // Show actual error for debugging
            const shortError = errorMsg.length > 50 ? errorMsg.substring(0, 50) + "..." : errorMsg;
            toast(`❌ Failed to end election: ${shortError}`);
          }
        }
      }

    } catch (err: any) {
      // Handle wallet/network errors gracefully
      const errorMsg = err?.reason || err?.message || err?.toString() || "Unknown error";
      
      // Suppress "Unexpected error" from wallet extensions - already handled above
      if (!errorMsg.includes("Unexpected error") && 
          !errorMsg.includes("Timeout") && 
          !errorMsg.includes("timeout")) {
        if (errorMsg.includes("already started") || errorMsg.includes("Election already started")) {
          toast("⚠️ Election is already started!");
        } else if (errorMsg.includes("already ended") || errorMsg.includes("Election already ended")) {
          toast("⚠️ Election is already ended!");
        } else if (errorMsg.includes("not owner") || errorMsg.includes("Ownable")) {
          toast("❌ Only owner can perform this action!");
        } else if (errorMsg.includes("No crypto wallet")) {
          toast("❌ Please install MetaMask!");
        } else if (!errorMsg.includes("Wallet extension") && !errorMsg.includes("Wallet not available")) {
          toast(`❌ Error: ${errorMsg}`);
        }
      }
      // Silently handle "Unexpected error" - already shown user-friendly message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold press-start-2p-regular mb-2">
            Election Control
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage election state</p>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="text-center mb-4">
            <p className="text-sm sm:text-base font-semibold mb-2">Current State:</p>
            <div
              className={`inline-block px-4 py-2 rounded ${electionState === "CREATED"
                  ? "bg-yellow-100 text-yellow-800"
                  : electionState === "ONGOING"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              <span className="font-bold text-sm sm:text-base">{electionState}</span>
            </div>
          </div>

          <Button
            onClick={handleToggle}
            disabled={loading}
            className={`w-full p-4 sm:p-6 text-base sm:text-lg ${electionState === "CREATED"
                ? "bg-green-600 hover:bg-green-700"
                : electionState === "ONGOING"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold rounded transition-colors`}
          >
            {loading
              ? "Processing..."
              : electionState === "CREATED"
                ? "▶️ Start Election"
                : electionState === "ONGOING"
                  ? "⏹️ End Election"
                  : "🔄 Start New Election"}
          </Button>
        </div>

        {winner && (
          <div className="mt-4 text-center p-4 sm:p-6 border-2 border-black rounded-lg shadow-lg bg-yellow-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">🏆 Election Winner</h2>
            <div className="space-y-2">
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Name:</span> {winner.name}
              </p>
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Votes:</span> {winner.votes}
              </p>
              {winner.status && (
                <p className="text-base sm:text-lg">
                  <span className="font-semibold">Status:</span> {winner.status}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminElectionToggle;