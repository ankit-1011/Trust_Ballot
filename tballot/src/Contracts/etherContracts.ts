import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../contractConfig";

// ✅ Provider Setup
export const getprovider = () => {
  if (!window.ethereum)
    throw new Error("No crypto wallet found. Please install MetaMask.");
  return new ethers.BrowserProvider(window.ethereum);
};

// ✅ Signer (wallet user)
export const getSigner = async () => {
  const provider = getprovider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

// ✅ Contract (read-only)
export const getContractProvider = () => {
  const provider = getprovider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// ✅ Contract (write-enabled)
export const getContractSigner = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// ------------------------------------------------------------
// 🔹 Admin Functions
// ------------------------------------------------------------

// ✅ Add new candidate (Admin only)
export const addCandidate = async (name: string, meta: string) => {
  const contract = await getContractSigner();
  const tx = await contract.addCandidate(name, meta);
  await tx.wait();
  console.log("Candidate added successfully");
};

// ✅ Register voter manually (Admin only)
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


// ✅ Start election (Admin only)
export const startElection = async () => {
  const contract = await getContractSigner();
  const tx = await contract.startElection();
  await tx.wait();
  console.log(" Election started!");
};

// ✅ End election (Admin only)
export const endElection = async () => {
  const contract = await getContractSigner();
  const tx = await contract.endElection();
  await tx.wait();
  console.log("✅ Election ended!");
};

// ------------------------------------------------------------
// 🔹 Voter Functions
// ------------------------------------------------------------

// ✅ Self registration (voter using wallet)
export const selfRegister = async (name: string, image: string) => {
  const contract = await getContractSigner();
  const tx = await contract.selfRegister(name, image);
  await tx.wait();
  console.log("✅ Voter self-registered successfully!");
};

// ✅ Cast vote
export const voteCandidate = async (candidateId: number) => {
  const contract = await getContractSigner();
  const tx = await contract.vote(candidateId);
  await tx.wait();
  console.log("🗳️ Vote cast successfully!");
};

// ✅ Get all voters (for frontend)
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

// ✅ Get single candidate details
export const getCandidate = async (id: number) => {
  const contract = getContractProvider();
  const [candidateId, name, meta, votes] = await contract.getCandidate(id);
  return { candidateId, name, meta, votes: votes.toString() };
};

// ✅ Get all candidates
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

// ✅ Get number of candidates
export const getCandidatesCount = async () => {
  const contract = getContractProvider();
  const count = await contract.getCandidatesCount();
  return count.toString();
};

// ✅ Get winner (after election ended)
export const getWinner = async () => {
  const contract = getContractProvider();
  const [id, name, votes] = await contract.getWinner();
  return { id, name, votes: votes.toString() };
};

// ✅ Get voter details
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

// ✅ Check if voter is registered
export const isVoterRegistered = async (address: string) => {
  const contract = getContractProvider();
  return await contract.isVoterRegistered(address);
};

// ✅ Check if voter has voted
export const hasVoted = async (address: string) => {
  const contract = getContractProvider();
  return await contract.hasVoted(address);
};
