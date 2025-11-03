"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/8bit/card";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/8bit/button";
import { toast } from "@/components/ui/8bit/toast";
import { getContractSigner } from "../Contracts/etherContracts"; 

const Candidate = () => {
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle register when click
  const handleRegister = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast("Please enter candidate name");
      return;
    }

    try {
      setLoading(true);
      const contract = await getContractSigner();
      const tx = await contract.addCandidate(name, meta);
      await tx.wait();

      toast("🎉 Candidate added successfully!");
      setName("");
      setMeta("");
    } catch (err: any) {
      console.error(err);
      toast(`❌ Error: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return <WalletConnect />;

  return (
    <div className="w-full flex justify-center items-center mt-20">
      <Card className="w-[596px] shadow-lg-blue">
        <CardHeader className="text-center">
          <CardTitle>Candidate Registration</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="flex flex-row items-center gap-4">
              <label className="text-sm font-bold text-gray-700 w-34">
                Full Name:
              </label>
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center gap-4">
              <label className="text-sm font-bold text-gray-700 w-34">
                Wallet Address:
              </label>
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Wallet Address"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center gap-4">
              <input
                type="file"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className={`p-6 bg-lime-600 text-white font-semibold rounded hover:bg-lime-700 transition duration-200 ${
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
