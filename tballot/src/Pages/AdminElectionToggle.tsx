"use client";
import  { useEffect, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { toast } from "@/components/ui/8bit/toast";
import { getContractProvider, startElection, endElection, getWinner } from "../Contracts/etherContracts";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";

const AdminElectionToggle = () => {
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [electionState, setElectionState] = useState<"CREATED" | "ONGOING" | "ENDED">("CREATED");
  const [winner, setWinner] = useState<{ id: string; name: string; votes: string } | null>(null);

  // ✅ Fetch current election state from contract
 useEffect(() => {
  const fetchState = async () => {
    if (!isConnected) return;
    try {
      const contract = getContractProvider();
      const state = await contract.state(); // returns 0,1,2
      const mapping: ("CREATED" | "ONGOING" | "ENDED")[] = ["CREATED", "ONGOING", "ENDED"];
      setElectionState(mapping[state]);
    } catch (err) {
      console.error(err);
    }
  };
  fetchState();
}, [isConnected]);


  if (!isConnected) return <WalletConnect />;

  const handleToggle = async () => {
    try {
      setLoading(true);
      if (electionState === "CREATED") {
        await startElection();
        setElectionState("ONGOING");
        toast("✅ Election started!");
      } else if (electionState === "ONGOING") {
        await endElection();
        setElectionState("ENDED");
        toast("✅ Election ended!");

        // Fetch winner automatically
        const w = await getWinner();
        setWinner(w);
        toast(`🏆 Winner: ${w.name} with ${w.votes} votes!`);
      } else {
        toast("Election already ended!");
      }
    } catch (err: any) {
      console.error(err);
      toast(`Error: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-4">
      <Button
        onClick={handleToggle}
        disabled={loading || electionState === "ENDED"}
        className={`p-6 ${
          electionState === "CREATED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
        } text-white font-semibold rounded`}
      >
        {loading ? "Processing..." : electionState === "CREATED" ? "Start Election" : "End Election"}
      </Button>

      {winner && (
        <div className="mt-4 text-center p-4 border-2 border-black rounded shadow-lg bg-yellow-100">
          <h2 className="text-lg font-bold">🏆 Election Winner</h2>
          <p>Name: {winner.name}</p>
          <p>Votes: {winner.votes}</p>
        </div>
      )}
    </div>
  );
};

export default AdminElectionToggle;
