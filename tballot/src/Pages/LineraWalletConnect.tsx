/**
 * Linera Wallet Connection Component
 * 
 * Replaces WalletConnect.tsx for Linera Microchains
 * Uses Linera SDK for wallet connection
 */

import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { initializeLinera } from "../Contracts/lineraContracts";
import { useState } from "react";

const LineraWalletConnect = () => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      
      // Initialize Linera client
      await initializeLinera();
      
      // TODO: Add actual Linera wallet connection
      // This will be updated when Linera SDK is available
      
      console.log("Linera wallet connected");
    } catch (err: any) {
      console.error("Failed to connect Linera wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Connect to Linera
          </CardTitle>
          <CardDescription className="text-center">
            Connect your wallet to interact with TrustBallot on Linera Microchains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <Button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full"
            size="lg"
          >
            {connecting ? "Connecting..." : "Connect Linera Wallet"}
          </Button>
          
          <div className="text-sm text-gray-600 text-center space-y-2">
            <p>✨ Real-time updates</p>
            <p>⚡ High throughput</p>
            <p>💰 Low transaction costs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LineraWalletConnect;
