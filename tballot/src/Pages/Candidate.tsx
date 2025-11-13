"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/8bit/card";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/8bit/button";
import { toast } from "@/components/ui/8bit/toast";
import { getContractSigner, getAllCandidates } from "../Contracts/etherContracts";
import { PinataSDK } from "pinata";

const Candidate = () => {
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Upload image to Pinata 
  const pinata = new PinataSDK({
      pinataJwt: import.meta.env.VITE_PINATA_JWT,
      pinataGateway: import.meta.env.VITE_GATEWAY_URL,
    });


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast("Please enter candidate name");
      return;
    }
    if (!image) {
      toast("Please upload candidate image");
      return;
    }

    try {
      setLoading(true);
      
      // Check if candidate with same name already exists
      const existingCandidates = await getAllCandidates();
      const duplicateCandidate = existingCandidates.find(
        (c: any) => c.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      
      if (duplicateCandidate) {
        toast("A candidate with this name already exists!");
        setLoading(false);
        return;
      }

    toast("Uploading image to IPFS...");
      const upload = await pinata.upload.public.file(image);
      if (!upload.cid) {
        toast("Image upload failed!");
        setLoading(false);
        return;
      }

      const imageUrl = await pinata.gateways.public.convert(upload.cid);
     

      // Call smart contract
      toast("Registering candidate on blockchain...");
      const contract = await getContractSigner();
      const tx = await contract.addCandidate(name, imageUrl);
      await tx.wait();

      toast(" Candidate added successfully!");
      setName("");
      setImage(null);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.reason || err.message || "Registration failed!";
      if (errorMessage.includes("already exists") || errorMessage.includes("duplicate")) {
        toast(" A candidate with this name already exists!");
      } else {
        toast(` Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <WalletConnect />;

  return (
    <div className="w-full flex justify-center items-center mt-4 sm:mt-10 md:mt-20 p-4">
      <Card className="w-full max-w-[596px] shadow-lg-blue">
        <CardHeader className="text-center">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Candidate Registration</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-bold text-gray-700 sm:w-34">Full Name:</label>
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter candidate name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-bold text-gray-700 sm:w-34">Image:</label>
              <input
                type="file"
                accept="image/*"
                className="flex-1 p-2   text-sm sm:text-base w-25"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto p-4 sm:p-6 bg-lime-600 text-white font-semibold rounded hover:bg-lime-700 transition duration-200 text-sm sm:text-base ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
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

export default Candidate;
