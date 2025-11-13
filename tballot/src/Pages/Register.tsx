import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/8bit/card";
import { toast } from "@/components/ui/8bit/toast";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";
import { selfRegister, getVoter, isVoterRegistered } from "../Contracts/etherContracts";
import { PinataSDK } from "pinata";

const Register = () => {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [voterData, setVoterData] = useState<any>(null);

  // Initialize Pinata SDK
  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_GATEWAY_URL,
  });

  // Load voter data on mount
  useEffect(() => {
    const fetchVoter = async () => {
      if (isConnected && address) {
        try {
          const voter = await getVoter(address);
          setVoterData(voter || null);
        } catch {
          setVoterData(null);
        }
      } else {
        setVoterData(null);
      }
    };
    fetchVoter();
  }, [isConnected, address]);

  // Handle form submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      toast("Please enter your name and select an image");
      return;
    }

    if (voterData?.isRegistered) {
      toast("You are already registered as a voter!");
      return;
    }

    try {
      setLoading(true);

      if (address) {
        const isRegistered = await isVoterRegistered(address);
        if (isRegistered) {
          toast("You are already registered as a voter!");
          const voter = await getVoter(address);
          setVoterData(voter);
          setLoading(false);
          return;
        }
      }

      toast("Uploading image to IPFS...");
      const upload = await pinata.upload.public.file(image);
      if (!upload.cid) {
        toast("Image upload failed!");
        setLoading(false);
        return;
      }

      const imageUrl = await pinata.gateways.public.convert(upload.cid);

      toast("Registering on blockchain...");
      await selfRegister(name, imageUrl);

      toast("Registered successfully!");
      const voter = await getVoter(address!);
      setVoterData(voter);
      setName("");
      setImage(null);
    } catch (error: any) {
      const errorMessage = error.reason || error.message || "Registration failed!";
      if (errorMessage.includes("already registered")) {
        toast("You are already registered as a voter!");
        const voter = await getVoter(address!);
        setVoterData(voter);
      } else {
        toast(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <WalletConnect />;

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-4 sm:mt-10 md:mt-20 p-4">
      <Card className="w-full max-w-[550px] shadow-lg-blue transition-all duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">🗳️ Voter Registration</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Register yourself securely on the blockchain
          </CardDescription>
        </CardHeader>

        <CardContent>
          {voterData?.isRegistered ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                <p className="text-green-700 font-semibold text-lg">✅ Already Registered!</p>
                <p className="text-sm text-gray-600 mt-2">Name: {voterData.name}</p>
                {voterData.image && (
                  <img
                    src={voterData.image}
                    alt={voterData.name}
                    className="w-24 h-24 rounded-full mx-auto mt-3 border-2 border-green-500 object-cover"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">You can only register once as a voter.</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-bold text-gray-700 sm:w-24">Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter your name"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-bold text-gray-700 sm:w-24">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="flex-1 text-sm sm:text-base"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  variant="default"
                  disabled={loading}
                  className="w-full sm:w-auto p-4 sm:p-6 bg-lime-600 text-white font-semibold rounded hover:bg-lime-700 transition duration-200 text-sm sm:text-base"
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;