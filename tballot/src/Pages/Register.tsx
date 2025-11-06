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

   const res = await axios.post("https://trust-ballot.onrender.com/api/upload", formData, {
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
    <div className="flex items-center justify-center bg-gray-100 mt-20">
      
            <Card className="w-[550px] shadow-lg-blue transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle>🗳️ Voter Registration</CardTitle>
                <CardDescription>
                  Register yourself securely on the blockchain
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="flex flex-row items-center gap-4">
                    <label className="text-sm font-bold text-gray-700 w-24">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="flex flex-row items-center gap-4">
                    <label className="text-sm font-bold text-gray-700 w-24">
                      Image:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      variant="default"
                      disabled={loading}
                      className="p-6 bg-lime-600 text-white font-semibold rounded hover:bg-lime-700 transition duration-200"
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
