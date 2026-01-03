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
  const { isConnected } = useAccount();
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

  // Fetch current election state from contract
  useEffect(() => {
    const fetchState = async () => {
      if (!isConnected) return;
      try {
        const contract = getContractProvider();
        const state = await contract.state(); // returns 0,1,2
        const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = [
          "CREATED",
          "ONGOING",
          "ENDED",
        ];
        setElectionState(mapping[state]);

        // If election is ended, fetch winner
        if (mapping[state] === "ENDED") {
          try {
            const w = await getWinner();
            setWinner(w);
          } catch (err) {
            console.error("Error fetching winner:", err);
          }
        } else {
          setWinner(null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchState();

    // Refresh state every 5 seconds
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

  if (!isConnected) {
    return <WalletConnect />;
  }

  const handleToggle = async () => {
    try {
      setLoading(true);
      
      // First, get the current state from contract to ensure accuracy
      const contract = getContractProvider();
      const currentState = await contract.state();
      const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = [
        "CREATED",
        "ONGOING",
        "ENDED",
      ];
      const actualState = mapping[currentState];
      
      if (actualState === "CREATED") {
        await startElection();
        toast("✅ Election started!");
      } else if (actualState === "ONGOING") {
        await endElection();
        toast("✅ Election ended!");

        // Fetch winner automatically
        try {
          const w = await getWinner();
          setWinner(w);
          toast(`🏆 Winner: ${w.name} with ${w.votes} votes!`);
        } catch (err) {
          console.error("Error fetching winner:", err);
        }
      } else if (actualState === "ENDED") {
        // Start a new election after previous one ended
        await startElection();
        setWinner(null); // Clear previous winner
        toast("✅ New Election started!");
      }

      // Refresh state from contract after action
      const newState = await contract.state();
      setElectionState(mapping[newState]);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.reason || err.message || "Unknown error";
      
      // Better error messages
      if (errorMsg.includes("already started") || errorMsg.includes("Election already started")) {
        toast("⚠️ Election is already started!");
      } else if (errorMsg.includes("already ended") || errorMsg.includes("Election already ended")) {
        toast("⚠️ Election is already ended!");
      } else if (errorMsg.includes("not owner") || errorMsg.includes("Ownable")) {
        toast("❌ Only owner can perform this action!");
      } else {
        toast(`❌ Error: ${errorMsg}`);
      }
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