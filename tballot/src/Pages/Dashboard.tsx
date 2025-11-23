"use client";
import { useEffect, useState } from "react";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";
import { SquareArrowOutUpRight } from "lucide-react";
import { getAllCandidates, getContractSigner } from "../Contracts/etherContracts";
import { toast } from "@/components/ui/8bit/toast";

const Dashboard = () => {
  const { isConnected } = useAccount();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //  Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const list = await getAllCandidates();
        setCandidates(list);
      } catch (err) {
        console.error(err);
      }
    };
    if (isConnected) fetchCandidates();
  }, [isConnected]);

  //  Vote for a candidate
  const handleVote = async (id: string) => {
    try {
      setLoading(true);
      const contract = await getContractSigner();
      const tx = await contract.vote(id);
      await tx.wait();
      toast(`Successfully voted for candidate #${id}`);

      // Refresh candidates list to update vote counts
      const updatedList = await getAllCandidates();
      setCandidates(updatedList);
    } catch (err: any) {
      console.error(err);
      toast(` Error: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <WalletConnect />;

  return (
    <div className="flex flex-col items-center fixed mt-4 sm:mt-6 md:mt-10 p-2 sm:p-4">

      {/* Candidate Cards */}
      <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center w-full">
        {candidates.length === 0 ? (
          <p className="text-gray-600 text-sm sm:text-base">No candidates registered yet.</p>
        ) : (
          candidates.map((c) => (
            <div
              key={c.id}
              className="w-full sm:w-56 md:w-60 h-auto sm:h-auto border-3 border-black rounded-lg border-r-4 sm:border-r-8 border-b-4 sm:border-b-8 hover:-translate-y-1 duration-200 bg-white"
            >
              <SquareArrowOutUpRight className='hover:translate-y-0.5 duration-100 cursor-pointer m-2' />

              <div className="w-full sm:w-50 h-40 sm:h-30 m-2 sm:ml-4 border-2 border-black rounded-lg">
                <img
                  src={c.meta || "https://8bitcn.com/images/pixelized-8bitcnorc.jpg"}
                  alt={c.name}
                  className="w-full h-full  rounded"
                />
              </div>

              {/* Candidate Name */}
              <div className="px-2 sm:px-3 mt-2 mb-1">
                <p className="text-sm sm:text-base font-bold press-start-2p-regular text-center">{c.name}</p>
              </div>

              {/* Votes Count */}
              <div className="px-2 sm:px-3 mb-2">
                <div className="border-2 border-black rounded-sm p-1 sm:p-2 bg-blue-50">
                  <p className="text-xs sm:text-sm press-start-2p-regular text-center">
                    Votes: <span className="font-bold text-blue-600">{c.voteCount || "0"}</span>
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleVote(c.id)}
                className={`w-full sm:w-27 h-8 bg-amber-200  sm:ml-3 sm:mb-1 text-center leading-8 border-3 border-black border-r-3 sm:border-r-5 border-b-3 sm:border-b-5 rounded-sm press-start-2p-regular text-xs sm:text-sm cursor-pointer ${loading ? "bg-gray-400" : "active:bg-violet-400"
                  } transition-colors duration-200`}
              >
                {loading ? "Voting" : "Vote"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
