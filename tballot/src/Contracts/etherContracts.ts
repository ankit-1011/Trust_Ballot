import {ethers} from 'ethers';

import {CONTRACT_ADDRESS , CONTRACT_ABI} from '../../contractConfig';

export const getprovider =()=>{
    if(!window.ethereum) throw new Error("No crypto wallet found.Please install it.");
    return new ethers.BrowserProvider(window.ethereum);
}

export const getSigner = async()=>{
const provider = getprovider();
await provider.send("eth_requestAccounts", []);
return provider.getSigner();
}

export const getContractProvider =()=>{
    const provider = getprovider();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export const getContractSigner = async()=>{
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}