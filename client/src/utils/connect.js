import { ethers } from "ethers";

/**
 * Connects the wallet using MetaMask
 * @returns {Promise<string>} - The connected account address
 */
const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
};

/**
 * Checks if the wallet is currently connected using MetaMask
 * @returns {Promise<string>} - The connected account address, or an empty string if not connected
 */
const checkWalletConnected = async () => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    return undefined;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log(`Connected: ${account}`);
      return account;
    }
    console.log("Not connected");
    return "";
  } catch (err) {
    console.log(err);
  }
};

const getEthereumContract = async (address, abi) => {
  if (!window.ethereum) {
    return undefined;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);

  console.log({
    provider,
    signer,
    contract,
  });

  return contract;
};

const changeNetwork = async (chainId) => {
  if (!window.ethereum) {
    return undefined;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    });
  } catch (err) {
    if (err.code === 4001) {
      console.log("User rejected request");
    } else if (err.code === 4902) {
      console.log("Network not in user's wallet");
    } else {
      console.log(`Error: ${err.code}: ${err.message}`);
    }
  }
};

export { connectWallet, checkWalletConnected, getEthereumContract, changeNetwork };
