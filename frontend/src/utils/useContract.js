import { ethers } from "ethers";
import { getEthereum } from "../utils/ethereum";
import { LIT_NFT_CONTRACT_ADDRESS } from "./constants";
import litNftJson  from "./../contract/artifacts/contracts/LitNFT.sol/LitNft.json";

/**
 * create Contract Object
 */
const createContract = (
  contractAddress,
  abi,
) => {
  // getEthereum
  const ethereum = getEthereum();
  if (!ethereum) {
    console.log("Ethereum object doesn't exist!");
    return;
  }

  try {
    // @ts-ignore: ethereum as ethers.providers.ExternalProvider
    const provider = new ethers.providers.Web3Provider(ethereum);
    // get signer
    const signer = provider.getSigner(); 
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * mintLitNft method
 */
export const mintLitNft = async(
  name,
  imageUrl,
  encryptedDescriptionString,
  encryptedSymmetricKey
) => {
  // create Contract Object
  const litNftContract = createContract(LIT_NFT_CONTRACT_ADDRESS, litNftJson.abi);

  try {
    // call mintLitNft method
    let transaction = await litNftContract.mintLitNft(
      name,
      imageUrl,
      encryptedDescriptionString,
      encryptedSymmetricKey
    );
    await transaction.wait();
  } catch (err) {
    console.log("err ouccered while minting lit nft..", err)
  }
};

/**
 * connectWallet function
 * @returns 
 */
export const connectWallet = async() => {
  // getEthereum
  const ethereum = getEthereum();
  try {
    if (!ethereum) {
        alert("Get Wallet!");
        return;
    }
    const accounts = await ethereum.request({
        method: "eth_requestAccounts",
    });

    if (!Array.isArray(accounts)) return;
    console.log("Connected: ", accounts[0]);
    return accounts[0]
  } catch (error) {
    console.log(error);
    return null;
  }
};


/**
 * fetch NFTS
 */
export const fetchNfts = async() => {
  // create Contract Object
  const litNftContract = createContract(LIT_NFT_CONTRACT_ADDRESS, litNftJson.abi);
  const nfts = await litNftContract.fetchNfts();
  console.log("nfts:", nfts)
  return nfts;
};

