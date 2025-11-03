import { ethers } from 'ethers';

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../contractConfig';

export const getprovider = () => {
    if (!window.ethereum) throw new Error("No crypto wallet found.Please install it.");
    return new ethers.BrowserProvider(window.ethereum);
}

export const getSigner = async () => {
    const provider = getprovider();
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
}

export const getContractProvider = () => {
    const provider = getprovider();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export const getContractSigner = async () => {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

//Adding Candidate
export const addCandidate = async (name: string, meta: string) => {
    const contract = await getContractSigner();
    const tx = await contract.addCandidate(name, meta);
    await tx.wait();
    console.log("Candidate added successfully");
};

//voter register
export const registerVoter = async (voterAddress: string) => {
    const contract = await getContractSigner();
    const tx = await contract.registerVoter(voterAddress);
    await tx.wait();
    console.log("Voter registered successfully");
};


//startelection
export const startElection = async () => {
    const contract = await getContractSigner();
    const tx = await contract.startElection();
    await tx.wait();
    console.log("Election started!");
};

//ending election
export const endElection = async () => {
    const contract = await getContractSigner();
    const tx = await contract.endElection();
    await tx.wait();
    console.log("Election ended!");
};

export const voteCandidate = async (candidateId: number) => {
    const contract = await getContractSigner();
    const tx = await contract.vote(candidateId);
    await tx.wait();
    console.log("Vote cast successfully!");
};




export const getCandidate = async (id: number) => {
    const contract = getContractProvider();
    const [candidateId, name, meta, votes] = await contract.getCandidate(id);
    return { candidateId, name, meta, votes: votes.toString() };
};

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

export const getCandidatesCount = async () => {
    const contract = getContractProvider();
    const count = await contract.getCandidatesCount();
    return count.toString();
};

export const getWinner = async () => {
    const contract = getContractProvider();
    const [id, name, votes] = await contract.getWinner();
    return { id, name, votes: votes.toString() };
};
