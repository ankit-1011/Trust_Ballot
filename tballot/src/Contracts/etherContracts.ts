import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../contractConfig";

//  Provider Setup
export const getprovider = () => {
  if (!window.ethereum)
    throw new Error("No crypto wallet found. Please install MetaMask.");
  return new ethers.BrowserProvider(window.ethereum);
};

// Signer (wallet user)
export const getSigner = async () => {
  const provider = getprovider();
  const ethereum = (window as any).ethereum;
  
  // Since wagmi is already connected (verified by isConnected in component),
  // Try to get signer using selectedAddress if available, otherwise use default
  if (ethereum?.selectedAddress) {
    console.log("✅ Using selectedAddress for signer:", ethereum.selectedAddress);
    // Use the selected address directly - this ensures we use the connected account
    return provider.getSigner(ethereum.selectedAddress);
  }
  
  // If no selectedAddress, use default signer (should still work if wallet is connected)
  console.log("📝 Getting default signer (wallet should be connected via wagmi)...");
  const signer = provider.getSigner();
  console.log("✅ Signer obtained (wallet popup will appear when transaction is sent)");
  
  return signer;
};

//  Contract (read-only)
export const getContractProvider = () => {
  const provider = getprovider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

//  Contract (write-enabled)
export const getContractSigner = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// ------------------------------------------------------------
// 🔹 Admin Functions
// ------------------------------------------------------------

// Add new candidate (Admin only)
export const addCandidate = async (name: string, meta: string) => {
  const contract = await getContractSigner();
  const tx = await contract.addCandidate(name, meta);
  await tx.wait();
  console.log("Candidate added successfully");
};

// Register voter manually (Admin only)
export const registerVoter = async (
  voterAddress: string,
  name: string,
  image: string
) => {
  const contract = await getContractSigner();
  const tx = await contract.registerVoter(voterAddress, name, image);
  await tx.wait();
  console.log("Voter registered successfully (Admin)");
};


// Start election (Admin only)
export const startElection = async () => {
  try {
    console.log("🚀 startElection called");
    
    // Check wallet availability
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error("Please install MetaMask!");
    }
    
    console.log("✅ Wallet detected");
    const ethereum = (window as any).ethereum;
    if (ethereum?.selectedAddress) {
      console.log("✅ Connected address:", ethereum.selectedAddress);
    }
    
    // Use exact same pattern as Dashboard handleVote (which works)
    console.log("📝 Getting contract signer...");
    const contract = await getContractSigner();
    console.log("✅ Contract signer obtained");
    
    console.log("📝 Calling contract.startElection()...");
    console.log("📱 ⚠️ METAMASK POPUP SHOULD APPEAR NOW - PLEASE CONFIRM TRANSACTION! ⚠️");
    
    // Call the contract function - this WILL trigger wallet popup
    // This is the critical line that triggers MetaMask transaction popup
    const tx = await contract.startElection();
    
    console.log("✅ Transaction sent! Hash:", tx.hash);
    console.log("⏳ Waiting for blockchain confirmation...");
    
    // Wait for transaction confirmation (user should confirm in wallet first)
    await tx.wait();
    
    console.log("✅ Transaction confirmed! Election started!");
    return tx;
  } catch (error: any) {
    console.error("❌ Error in startElection:", error);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error code:", error?.code);
    throw error;
  }
};

// End election (Admin only)
export const endElection = async () => {
  try {
    console.log("🚀 endElection called");
    
    // First, ensure wallet is connected
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error("Please install MetaMask!");
    }

    console.log("✅ Wallet detected");
    
    // Use getContractSigner() which already handles connection properly
    console.log("📝 Getting contract signer...");
    const contract = await getContractSigner();
    console.log("✅ Contract signer obtained");
    
    console.log("📝 Calling contract.endElection()...");
    console.log("📱 ⚠️ WALLET POPUP SHOULD APPEAR NOW - PLEASE CONFIRM TRANSACTION! ⚠️");
    
    // Call the contract function - this will trigger wallet popup
    const tx = await contract.endElection();
    
    console.log("✅ Transaction sent! Hash:", tx.hash);
    console.log("⏳ Waiting for blockchain confirmation...");
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    console.log("✅ Transaction confirmed! Block:", receipt.blockNumber);
    console.log("✅ Election ended!");
    
    return receipt;
  } catch (error: any) {
    console.error("❌ Error in endElection:", error);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error code:", error?.code);
    // Re-throw to let caller handle
    throw error;
  }
};

// ------------------------------------------------------------
//  Voter Functions
// ------------------------------------------------------------

//  Self registration (voter using wallet)
export const selfRegister = async (name: string, image: string) => {
  const contract = await getContractSigner();
  const tx = await contract.selfRegister(name, image);
  await tx.wait();
  console.log(" Voter self-registered successfully!");
};

// Cast vote
export const voteCandidate = async (candidateId: number) => {
  const contract = await getContractSigner();
  const tx = await contract.vote(candidateId);
  await tx.wait();
  console.log(" Vote cast successfully!");
};

// Get all voters (for frontend)
export const getAllVoters = async () => {
  try {
    const contract = getContractProvider();
    // The contract returns [Voter[], address[]]
    const [voterDataArray, addresses]: [any[], string[]] = await contract.getAllVoters();

    // Merge the data so each voter has its address with null checks
    const voters = voterDataArray
      .map((v, i) => {
        // Check if voter data exists and is valid
        if (!v || !addresses[i]) return null;

        return {
          name: v.name || "Unknown",
          image: v.image || "",
          isRegistered: v.isRegistered || false,
          hasVoted: v.hasVoted || false,
          votedId: v.votedId ? v.votedId.toString() : "0",
          address: addresses[i] || "",
        };
      })
      .filter((voter) => voter !== null && voter.address); // Filter out null/invalid voters

    return voters;
  } catch (error) {
    console.error("Error fetching voters:", error);
    return [];
  }
};


// ------------------------------------------------------------
// 🔹 View / Read Functions
// ------------------------------------------------------------

// Get single candidate details
export const getCandidate = async (id: number) => {
  const contract = getContractProvider();
  const [candidateId, name, meta, votes] = await contract.getCandidate(id);
  return { candidateId, name, meta, votes: votes.toString() };
};

// Get all candidates
export const getAllCandidates = async () => {
  const contract = getContractProvider();
  const candidates = await contract.getAllCandidates();
  return candidates.map((c: any) => ({
    id: c.id.toString(),
    name: c.name,
    meta: c.meta,
    voteCount: c.voteCount.toString(),
  }));
};

// Get number of candidates
export const getCandidatesCount = async () => {
  const contract = getContractProvider();
  const count = await contract.getCandidatesCount();
  return count.toString();
};

//  Get winner (after election ended)
export const getWinner = async () => {
  const contract = getContractProvider();
  const [id, name, votes ,status] = await contract.getWinner();
  return { id, name, votes: votes.toString(),status };
};

//  Get voter details
export const getVoter = async (address: string) => {
  try {
    const contract = getContractProvider();
    const [name, image, isRegistered, hasVoted, votedId] =
      await contract.getVoter(address);
    return {
      name: name || "Unknown",
      image: image || "",
      isRegistered: isRegistered || false,
      hasVoted: hasVoted || false,
      votedId: votedId ? votedId.toString() : "0",
    };
  } catch (error) {
    console.error("Error fetching voter:", error);
    return null;
  }
};

// Check if voter is registered
export const isVoterRegistered = async (address: string) => {
  const contract = getContractProvider();
  return await contract.isVoterRegistered(address);
};

//  Check if voter has voted
export const hasVoted = async (address: string) => {
  const contract = getContractProvider();
  return await contract.hasVoted(address);
};
