import { useEffect, useState } from "react";
import { getAllVoters } from "../Contracts/etherContracts";
import { useAccount } from "wagmi";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/8bit/toast";
import WalletConnect from "./WalletConnect";

const VoterList = () => {
  const { isConnected } = useAccount();
  const [voters, setVoters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast("Address copied!");
  };

  useEffect(() => {
    const fetchVoters = async () => {
      if (!isConnected) return;
      setLoading(true);
      try {
        const allVoters = await getAllVoters();
        setVoters(allVoters);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVoters();
  }, [isConnected]);

  // ✅ FIXED RETURN CONDITION
  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-10 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="text-base sm:text-lg font-semibold">Loading voters...</div>
      ) : voters.length === 0 ? (
        <div className="text-base sm:text-lg font-semibold">No registered voters yet!</div>
      ) : (
        voters
          .filter((voter) => voter && voter.address) // Filter out invalid voters
          .map((voter, index) => (
            <div
              key={voter.address || index}
              className="w-full sm:w-56 md:w-64 h-auto rounded-lg border-2 border-black p-3 border-r-4 sm:border-r-8 border-b-4 sm:border-b-8 hover:-translate-y-1 duration-200 bg-white text-center shadow-md"
            >
              <img
                src={voter.image || "https://via.placeholder.com/150"}
                alt={voter.name || "Voter"}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 border-2 border-black object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                }}
              />
              <div className="border-2 border-black p-2 rounded-sm press-start-2p-regular mb-3 text-xs sm:text-sm">
                {voter.name || "Unknown"}
              </div>
              <div className="flex justify-center gap-2">
                <div
                  onClick={() => voter.address && handleCopy(voter.address)}
                  className="border-2 px-2 py-1 flex items-center gap-1 border-black rounded-sm press-start-2p-regular border-r-3 sm:border-r-5 border-b-3 sm:border-b-5 cursor-pointer active:bg-blue-400 transition-colors duration-200 text-xs sm:text-sm"
                >
                  <Copy size={12} className="sm:w-3.5 sm:h-3.5" /> copy
                </div>
                <div className="border-2 px-2 py-1 border-black rounded-sm press-start-2p-regular border-r-3 sm:border-r-5 border-b-3 sm:border-b-5 cursor-pointer active:bg-green-500 transition-colors duration-200 text-xs sm:text-sm">
                  verify
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default VoterList;
