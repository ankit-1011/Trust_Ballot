"use client";
import  { useEffect, useState } from "react";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";
import { SquareArrowOutUpRight } from "lucide-react";
import {  getAllCandidates, getContractSigner } from "../Contracts/etherContracts";
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
        console.log("Candidates fetched:", list);
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
      toast(` Successfully voted for candidate #${id}`);
    } catch (err: any) {
      console.error(err);
      toast(` Error: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <WalletConnect />;

  return (
    <div className="flex flex-col items-center mt-4 sm:mt-6 md:mt-10 p-2 sm:p-4">

      {/* Candidate Cards */}
      <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center w-full">
        {candidates.length === 0 ? (
          <p className="text-gray-600 text-sm sm:text-base">No candidates registered yet.</p>
        ) : (
          candidates.map((c) => (
            <div
              key={c.id}
              className="w-full sm:w-56 md:w-60 h-auto sm:h-52 border-3 border-black rounded-lg border-r-4 sm:border-r-8 border-b-4 sm:border-b-8 hover:-translate-y-1 duration-200"
            >
              <SquareArrowOutUpRight className='hover:translate-y-0.5 duration-100 cursor-pointer m-2' />
          
              <div className="w-full sm:w-50 h-40 sm:h-30 m-2 sm:ml-4 border-2 border-black rounded-lg">
                <img
                  src={c.meta || "https://8bitcn.com/images/pixelized-8bitcnorc.jpg"}
                  alt={c.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              
              <div
                onClick={() => handleVote(c.id)}
                className={`w-full sm:w-27 h-8 ml-2 sm:ml-3 mt-2 mb-2 sm:mb-0 text-center leading-8 border-3 border-black border-r-3 sm:border-r-5 border-b-3 sm:border-b-5 rounded-sm press-start-2p-regular text-xs sm:text-sm cursor-pointer ${
                  loading ? "bg-gray-400" : "active:bg-violet-400"
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
