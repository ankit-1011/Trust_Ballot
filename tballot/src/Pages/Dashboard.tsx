"use client";
import { useEffect, useState } from "react";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";
import { getAllCandidates, getContractSigner } from "../Contracts/etherContracts";
import { toast } from "@/components/ui/8bit/toast";

const Dashboard = () => {
  const { isConnected } = useAccount();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //  Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!isConnected) return;
      
      // Check if wallet is available before attempting contract calls
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        console.log("⏭️ Wallet not available, skipping candidate fetch");
        return;
      }

      try {
        // Add timeout protection
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 5000)
        );

        const candidatesPromise = getAllCandidates();
        const list = await Promise.race([candidatesPromise, timeoutPromise]);
        
        if (list && Array.isArray(list)) {
          setCandidates(list);
        }
      } catch (err: any) {
        // Silently handle wallet/contract errors
        if (!err?.message?.includes("Unexpected error") && 
            !err?.message?.includes("Timeout") &&
            !err?.message?.includes("No crypto wallet")) {
          console.warn("Could not fetch candidates:", err?.message || err);
        }
        // Keep empty array on error
        setCandidates([]);
      }
    };
    
    if (isConnected) {
      fetchCandidates();
      // Refresh candidates every 10 seconds (less frequent to avoid wallet spam)
      const interval = setInterval(() => {
        if (isConnected) fetchCandidates();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  //  Vote for a candidate
  const handleVote = async (id: string) => {
    // Check if wallet is available
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      toast(" Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);
      
      // Add timeout protection
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Transaction timeout")), 30000)
      );

      const votePromise = (async () => {
        const contract = await getContractSigner();
        const tx = await contract.vote(id);
        await tx.wait();
        return tx;
      })();

      await Promise.race([votePromise, timeoutPromise]);
      toast(` Successfully voted for candidate #${id}`);

      // Refresh candidates list to update vote counts (with error handling)
      try {
        const refreshTimeout = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 5000)
        );
        const updatedList = await Promise.race([getAllCandidates(), refreshTimeout]);
        if (updatedList && Array.isArray(updatedList)) {
          setCandidates(updatedList);
        }
      } catch (refreshErr: any) {
        // Silently handle refresh errors - vote was successful
        console.warn("Could not refresh candidates after vote:", refreshErr?.message);
      }
    } catch (err: any) {
      const errorMsg = err?.reason || err?.message || "Unknown error";
      
      if (errorMsg.includes("User rejected") || errorMsg.includes("user rejected")) {
        toast(" Transaction cancelled");
      } else if (errorMsg.includes("already voted") || errorMsg.includes("Already voted")) {
        toast(" You have already voted!");
      } else if (errorMsg.includes("not registered") || errorMsg.includes("Not a registered voter")) {
        toast(" Please register as a voter first!");
      } else if (errorMsg.includes("Voting not allowed") || errorMsg.includes("not ongoing")) {
        toast(" Election is not active!");
      } else if (errorMsg.includes("Unexpected error") || errorMsg.includes("not been authorized")) {
        toast(" Wallet not responding. Please refresh and try again.");
      } else if (errorMsg.includes("Timeout") || errorMsg.includes("timeout")) {
        toast(" Transaction timed out. Please try again.");
      } else if (errorMsg.includes("No crypto wallet") || errorMsg.includes("MetaMask")) {
        toast(" Please install and connect MetaMask!");
      } else {
        toast(` Error: ${errorMsg.length > 50 ? errorMsg.substring(0, 50) + "..." : errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="flex flex-wrap fixed justify-center gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-8 bg-gray-100 w-full overflow-y-auto">
      {candidates.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No candidates registered yet.</p>
      ) : (
        candidates.map((c) => (
          <div
            key={c.id}
            className="w-full sm:w-[250px] md:w-[250px] border-4  border-black rounded-lg shadow-lg sm:p-4 border-r-4 sm:border-r-8 border-b-4 sm:border-b-8 bg-slate-100"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-black mb-2 ">
                <img
                  src={c.meta}
                  alt={c.name}
                  className="w-full h-20 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                  }}
                />
              </div>

              <h3 className="font-bold text-base sm:text-lg mb-1 text-center press-start-2p-regular">
                {c.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm font-semibold">Votes:</span>
                <span className="text-base sm:text-lg font-bold text-blue-600">
                  {c.voteCount}
                </span>
              </div>

              <div
                onClick={() => handleVote(c.id)}
                className={`w-full sm:w-27 h-7 ml-2 sm:ml-3 mt-1 mb-1 text-center leading-7 border-3 border-black border-r-3 sm:border-r-5 border-b-3 sm:border-b-5 rounded-sm press-start-2p-regular text-xs sm:text-sm cursor-pointer ${
                  loading ? "bg-gray-400" : "bg-amber-200 active:bg-violet-400"
                } transition-colors duration-200`}
              >
                {loading ? "Voting" : "Vote"}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
