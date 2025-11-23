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
      if (electionState === "CREATED") {
        await startElection();
        setElectionState("ONGOING");
        toast("Election started!");
      } else if (electionState === "ONGOING") {
        await endElection();
        setElectionState("ENDED");
        toast("Election ended!");

        // Fetch winner automatically
        try {
          const w = await getWinner();
          setWinner(w);
          toast(`🏆 Winner: ${w.name} with ${w.votes} votes!`);
        } catch (err) {
          console.error("Error fetching winner:", err);
        }
      } else if (electionState === "ENDED") {
        // Start a new election after previous one ended
        await startElection();
        setElectionState("ONGOING");
        setWinner(null); // Clear previous winner
        toast("New Election started!");
      }

      // Refresh state from contract
      const contract = getContractProvider();
      const state = await contract.state();
      const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = [
        "CREATED",
        "ONGOING",
        "ENDED",
      ];
      setElectionState(mapping[state]);
    } catch (err: any) {
      console.error(err);
      toast(`Error: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ml-60 mt-20 fixed p-2 bg-amber-400 sm:p-3">
      <div className="w-full max-w-sm space-y-3">
        <div className="text-center mb-3">
          <h1 className="text-lg sm:text-xl font-bold press-start-2p-regular mb-1">
            Election Control
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">Manage election state</p>
        </div>

        <div className="bg-white border border-black rounded-lg p-2 sm:p-3 shadow">
          <div className="text-center mb-2">
            <p className="text-xs sm:text-sm font-semibold mb-1">Current State:</p>
            <div
              className={`inline-block px-2 py-1 rounded ${electionState === "CREATED"
                  ? "bg-yellow-100 text-yellow-800"
                  : electionState === "ONGOING"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              <span className="font-bold text-sm">{electionState}</span>
            </div>
          </div>

          <Button
            onClick={handleToggle}
            disabled={loading}
            className={`w-full p-2 sm:p-3 text-sm sm:text-base ${electionState === "CREATED"
                ? "bg-green-600 hover:bg-green-700"
                : electionState === "ONGOING"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold rounded transition-colors`}
          >
            {loading
              ? "Processing..."
              : electionState === "CREATED"
                ? "▶️ Start"
                : electionState === "ONGOING"
                  ? "⏹️ End"
                  : "🔄 New Election"}
          </Button>
        </div>

        {winner && (
          <div className="mt-2 text-center p-2 sm:p-3 border border-black rounded-lg shadow bg-yellow-100">
            <h2 className="text-lg sm:text-xl font-bold mb-2">🏆 Winner</h2>
            <div className="space-y-1">
              <p className="text-sm sm:text-base">
                <span className="font-semibold">Name:</span> {winner.name}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold">Votes:</span> {winner.votes}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold">Status:</span> {winner.status}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminElectionToggle;