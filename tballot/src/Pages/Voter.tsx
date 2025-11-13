import { useEffect, useState } from "react";
import { getAllVoters } from "../Contracts/etherContracts";
import { useAccount } from "wagmi";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/8bit/toast";
import WalletConnect from "./WalletConnect";

// Helper to resolve IPFS CID or full URL
const resolveImageUrl = (cidOrUrl: string) =>
  cidOrUrl.startsWith("http")
    ? cidOrUrl
    : `https://gateway.pinata.cloud/ipfs/${cidOrUrl}`;

// Helper to shorten Ethereum address
const shortenAddress = (addr: string) =>
  addr.slice(0, 6) + "..." + addr.slice(-4);

const VoterList = () => {
  const { isConnected } = useAccount();
  const [voters, setVoters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

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
        console.error("Failed to fetch voters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVoters();
  }, [isConnected]);

  if (!isConnected) return <WalletConnect />;

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-10 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="text-base sm:text-lg font-semibold">Loading voters...</div>
      ) : voters.length === 0 ? (
        <div className="text-base sm:text-lg font-semibold">No registered voters yet!</div>
      ) : (
        voters
          .filter((voter) => voter && voter.address)
          .map((voter, index) => {
            const imageUrl = resolveImageUrl(voter.image || "");
            const imageFailed = failedImages.has(imageUrl);

            return (
              <div
                key={voter.address || index}
                className="w-full sm:w-56 md:w-64 h-64 rounded-lg border-2 border-black p-3 border-r-4 sm:border-r-8 border-b-4 sm:border-b-8 hover:-translate-y-1 duration-200 text-center shadow-md"
              >
                {!imageFailed && voter.image ? (
                  <img
                    src={imageUrl}
                    alt={voter.name || "Voter"}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 border-2 border-black object-cover"
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(imageUrl));
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 border-2 border-black bg-gray-200 flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-gray-500">No Image</span>
                  </div>
                )}

                <div className="border-2 border-black bg-violet-300 p-2 rounded-sm press-start-2p-regular mb-3 text-xs sm:text-sm">
                  {voter.name || "Unknown"}
                </div>

                <div className="text-xs text-gray-600 mb-2">{shortenAddress(voter.address)}</div>

                <div className="flex justify-center gap-2">
                  <div
                    onClick={() => handleCopy(voter.address)}
                    className="border-2 px-2 py-1 flex items-center gap-1 border-black rounded-sm press-start-2p-regular border-r-3 sm:border-r-5 border-b-3 sm:border-b-5 cursor-pointer active:bg-blue-400 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    <Copy size={12} className="sm:w-3.5 sm:h-3.5" /> copy
                  </div>
                  <div className="border-2 px-2 py-1 border-black rounded-sm press-start-2p-regular border-r-3 sm:border-r-5 border-b-3 sm:border-b-5 cursor-pointer active:bg-green-500 transition-colors duration-200 text-xs sm:text-sm">
                    verify
                  </div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default VoterList;