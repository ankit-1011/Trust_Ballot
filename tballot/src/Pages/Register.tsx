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
import { selfRegister, getVoter } from "../Contracts/etherContracts";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";



const Register = () => {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [voterData, setVoterData] = useState<any>(null);

  // ✅ Load voter data when component mounts
  useEffect(() => {
    const fetchVoter = async () => {
      if (isConnected && address) {
        try {
          const voter = await getVoter(address);
          if (voter && voter.name) {
            setVoterData(voter);
            console.log(voterData)
          }
        } catch (err) {
          console.log("Voter not found or not registered yet.");
        }
      }
    };
    fetchVoter();
  }, [isConnected, address]);

  // 🔹 Upload Image to Pinata
  const uploadToPinata = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

   const res = await axios.post(API_ENDPOINTS.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

    const ipfsHash = res.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  };

  //  Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      toast("Please enter your name and select an image");
      return;
    }

    try {
      setLoading(true);
      toast("Uploading image to IPFS...");
      const imageUrl = await uploadToPinata(image);

      toast("Registering on blockchain...");
      await selfRegister(name, imageUrl);

      toast("Registered successfully!");

      // Fetch voter details again after register
      const voter = await getVoter(address!);
      setVoterData(voter);

      setName("");
      setImage(null);
    } catch (error: any) {
      console.error(error);
      toast(" Registration failed!");
    } finally {
      setLoading(false);
    }
  };



  if(!isConnected)  <WalletConnect/>
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
                <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="text-sm font-bold text-gray-700 sm:w-24">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="text-sm font-bold text-gray-700 sm:w-24">
                      Image:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      className="flex-1 text-sm sm:text-base"
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
              </CardContent>
            </Card>
    </div>
  );
};

export default Register;
